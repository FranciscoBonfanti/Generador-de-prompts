import JSZip from 'jszip'
import { detectPii } from '../src/utils/piiDetector.js'
import { userError } from './userError.js'
import { detectExtraPiiWithAI } from './aiPiiPass.js'

/**
 * Anonimiza un .docx manteniendo el formato: no reconstruye el documento,
 * edita solo el texto dentro de los nodos <w:t> (y <w:delText>/<w:instrText>,
 * que también guardan texto: cambios controlados y códigos de campo).
 *
 * Word suele partir una misma palabra en varios "runs" (<w:r>) por
 * corrector ortográfico o historial de edición, así que un CUIT puede quedar
 * repartido en 2 o 3 nodos. Por eso se detecta sobre el texto concatenado de
 * cada párrafo y después se mapea cada hallazgo de vuelta a sus nodos: el
 * marcador queda en el primer nodo (con su formato) y el resto del dato se
 * borra de los nodos siguientes.
 */

const TEXT_NODE = /(<w:(t|delText|instrText)(?:\s[^>]*)?>)([^<]*)(<\/w:\2>)/g
const PARAGRAPH_END = /<\/w:p>/g
// Elementos que Word muestra como espacio entre dos nodos de texto.
const VISUAL_BREAK = /<w:(?:tab|br|cr)\b[^>]*\/>/


function decodeXml(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
}

function encodeXml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function encodeXmlAttribute(text) {
  return encodeXml(text).replace(/"/g, '&quot;')
}

/**
 * Anonimiza el texto de una parte XML de Word. `terms`: fragmentos extra
 * señalados por la IA. Devuelve { xml, findings }.
 */
export function anonymizeWordXml(xml, terms = []) {
  const nodes = []
  for (const match of xml.matchAll(TEXT_NODE)) {
    nodes.push({
      start: match.index,
      end: match.index + match[0].length,
      openTag: match[1],
      closeTag: match[4],
      text: decodeXml(match[3]),
    })
  }
  if (nodes.length === 0) return { xml, findings: [] }

  const paragraphEnds = [...xml.matchAll(PARAGRAPH_END)].map((match) => match.index)

  // Agrupa los nodos por párrafo (todos los que quedan antes del mismo </w:p>).
  const groups = []
  let current = []
  let paragraphIndex = 0
  for (const node of nodes) {
    while (paragraphIndex < paragraphEnds.length && paragraphEnds[paragraphIndex] < node.start) {
      if (current.length) groups.push(current)
      current = []
      paragraphIndex++
    }
    current.push(node)
  }
  if (current.length) groups.push(current)

  const allFindings = []

  for (const group of groups) {
    // Texto concatenado del párrafo + de qué nodo sale cada carácter
    // (-1 = separador visual que no pertenece a ningún nodo).
    let paragraphText = ''
    const owner = []
    const offsetInNode = []
    group.forEach((node, nodeIndex) => {
      if (nodeIndex > 0) {
        const gap = xml.slice(group[nodeIndex - 1].end, node.start)
        if (VISUAL_BREAK.test(gap)) {
          paragraphText += ' '
          owner.push(-1)
          offsetInNode.push(-1)
        }
      }
      for (let i = 0; i < node.text.length; i++) {
        owner.push(nodeIndex)
        offsetInNode.push(i)
      }
      paragraphText += node.text
    })

    const findings = detectPii(paragraphText, terms)
    if (findings.length === 0) continue
    allFindings.push(...findings)

    // Por nodo: qué caracteres se borran y dónde se inserta cada marcador.
    const removals = group.map(() => new Set())
    const insertions = group.map(() => new Map())
    for (const finding of findings) {
      let placed = false
      for (let i = finding.start; i < finding.end; i++) {
        const nodeIndex = owner[i]
        if (nodeIndex === -1) continue
        removals[nodeIndex].add(offsetInNode[i])
        if (!placed) {
          insertions[nodeIndex].set(offsetInNode[i], finding.placeholder)
          placed = true
        }
      }
    }

    group.forEach((node, nodeIndex) => {
      if (removals[nodeIndex].size === 0) return
      let text = ''
      for (let i = 0; i < node.text.length; i++) {
        if (insertions[nodeIndex].has(i)) text += insertions[nodeIndex].get(i)
        if (!removals[nodeIndex].has(i)) text += node.text[i]
      }
      node.newText = text
    })
  }

  // Reescribe de atrás hacia adelante para no correr los índices.
  let result = xml
  for (const node of [...nodes].reverse()) {
    if (node.newText === undefined) continue
    let openTag = node.openTag
    // Sin xml:space="preserve" Word recorta espacios al inicio/fin del nodo.
    if (/^\s|\s$/.test(node.newText) && !/xml:space=/.test(openTag)) {
      openTag = openTag.replace(/>$/, ' xml:space="preserve">')
    }
    result =
      result.slice(0, node.start) +
      openTag +
      encodeXml(node.newText) +
      node.closeTag +
      result.slice(node.end)
  }

  return { xml: result, findings: allFindings }
}

function replaceFindings(text, findings) {
  let result = text
  for (const finding of [...findings].sort((a, b) => b.start - a.start)) {
    result = result.slice(0, finding.start) + finding.placeholder + result.slice(finding.end)
  }
  return result
}

/**
 * Anonimiza el valor de los atributos indicados. Cubre datos que viven
 * fuera del texto visible: destinos de hipervínculos
 * (Target="mailto:persona@dominio.com" en los .rels) y códigos de campo
 * (w:instr="HYPERLINK mailto:...").
 */
function anonymizeAttributes(xml, attributePattern, terms = []) {
  const findings = []
  const result = xml.replace(attributePattern, (whole, name, rawValue) => {
    const value = decodeXml(rawValue)
    const valueFindings = detectPii(value, terms)
    if (valueFindings.length === 0) return whole
    findings.push(...valueFindings)
    return `${name}="${encodeXmlAttribute(replaceFindings(value, valueFindings))}"`
  })
  return { xml: result, findings }
}

/**
 * Para partes de metadatos (propiedades del archivo, customXml): aplica la
 * detección a todo el texto entre etiquetas.
 */
function anonymizeAllText(xml, terms = []) {
  const findings = []
  const result = xml.replace(/>([^<]+)</g, (whole, rawText) => {
    const text = decodeXml(rawText)
    const textFindings = detectPii(text, terms)
    if (textFindings.length === 0) return whole
    findings.push(...textFindings)
    return `>${encodeXml(replaceFindings(text, textFindings))}<`
  })
  return { xml: result, findings }
}

/**
 * Nombres de personas guardados como metadatos: autor del archivo, autores
 * de comentarios y de cambios controlados (w:author, w:initials, también en
 * word/people.xml), empresa y responsable. El regex no reconoce nombres
 * propios, así que se vacían siempre.
 */
const AUTHOR_ATTRIBUTE = /\b((?:w\d*):(?:author|initials|userId|providerId))="[^"]*"/g
function clearPeopleMetadata(xml) {
  return xml
    .replace(AUTHOR_ATTRIBUTE, '$1=""')
    .replace(/(<dc:creator>)[^<]*(<\/dc:creator>)/, '$1$2')
    .replace(/(<cp:lastModifiedBy>)[^<]*(<\/cp:lastModifiedBy>)/, '$1$2')
    .replace(/(<Company>)[^<]*(<\/Company>)/, '$1$2')
    .replace(/(<Manager>)[^<]*(<\/Manager>)/, '$1$2')
}

// Límites contra archivos "bomba" (un zip chico que al descomprimirse ocupa
// gigas). El tamaño que declara el zip lo escribe quien arma el archivo y
// puede ser falso, así que se cuentan los bytes reales al descomprimir.
const MAX_ENTRIES = 2000
const MAX_UNCOMPRESSED_BYTES = 60 * 1024 * 1024

function tooLargeError() {
  return userError('El .docx descomprimido supera el tamaño máximo admitido.')
}

/**
 * Descomprime todas las partes en streaming contando bytes reales y corta
 * apenas el total pasa el máximo. Devuelve Map<path, Uint8Array>.
 */
async function readAllEntriesLimited(zip) {
  const entries = Object.values(zip.files).filter((entry) => !entry.dir)
  if (entries.length > MAX_ENTRIES) {
    throw userError('El .docx tiene demasiadas partes internas.')
  }

  const contents = new Map()
  let total = 0
  for (const entry of entries) {
    const chunks = []
    await new Promise((resolve, reject) => {
      const stream = entry.internalStream('uint8array')
      stream
        .on('data', (chunk) => {
          total += chunk.length
          if (total > MAX_UNCOMPRESSED_BYTES) {
            stream.pause()
            reject(tooLargeError())
            return
          }
          chunks.push(chunk)
        })
        .on('error', reject)
        .on('end', resolve)
        .resume()
    })
    contents.set(entry.name, Buffer.concat(chunks))
  }
  return contents
}

const WORD_XML = /^word\/.+\.xml$/
const METADATA_XML = /^(?:docProps\/.+|customXml\/.+)\.xml$/
const RELS_XML = /\.rels$/

/** Texto plano del documento (un párrafo por línea) para la pasada con IA. */
function plainText(contents) {
  const lines = []
  for (const [path, bytes] of contents) {
    if (WORD_XML.test(path)) {
      for (const paragraph of bytes.toString('utf8').split(PARAGRAPH_END)) {
        const line = [...paragraph.matchAll(TEXT_NODE)].map((match) => decodeXml(match[3])).join('')
        if (line.trim()) lines.push(line)
      }
    } else if (METADATA_XML.test(path)) {
      for (const match of bytes.toString('utf8').matchAll(/>([^<]+)</g)) {
        if (match[1].trim()) lines.push(decodeXml(match[1]))
      }
    }
  }
  return lines.join('\n')
}

/**
 * @param {Buffer|Uint8Array|ArrayBuffer} input contenido del .docx
 * @param {{ findExtraTerms?: (text: string) => Promise<{ status: string, terms: object[] }> }} [options]
 * @returns {Promise<{ output: Buffer, findings: object[], aiStatus: string }>}
 */
export async function anonymizeDocx(input, { findExtraTerms = detectExtraPiiWithAI } = {}) {
  const zip = await JSZip.loadAsync(input)
  if (!zip.file('word/document.xml')) {
    throw userError('El archivo no parece un .docx válido (falta word/document.xml).')
  }
  // Todo se lee una sola vez con el límite aplicado; el archivo de salida se
  // arma desde cero con estos contenidos ya verificados.
  const contents = await readAllEntriesLimited(zip)
  const ai = await findExtraTerms(plainText(contents))

  const findings = []
  const output = new JSZip()
  for (const [path, bytes] of contents) {
    let xml
    if (WORD_XML.test(path)) {
      // Texto de todas las partes de Word (cuerpo, encabezados, pies,
      // notas, comentarios, glosario...) y los códigos de campo.
      const text = anonymizeWordXml(bytes.toString('utf8'), ai.terms)
      const fields = anonymizeAttributes(text.xml, /\b(w:instr)="([^"]*)"/g, ai.terms)
      findings.push(...text.findings, ...fields.findings)
      xml = clearPeopleMetadata(fields.xml)
    } else if (RELS_XML.test(path)) {
      const result = anonymizeAttributes(bytes.toString('utf8'), /\b(Target)="([^"]*)"/g, ai.terms)
      findings.push(...result.findings)
      xml = result.xml
    } else if (METADATA_XML.test(path)) {
      const result = anonymizeAllText(clearPeopleMetadata(bytes.toString('utf8')), ai.terms)
      findings.push(...result.findings)
      xml = result.xml
    }
    output.file(path, xml ?? bytes)
  }

  const outputBytes = await output.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  return { output: outputBytes, findings, aiStatus: ai.status }
}
