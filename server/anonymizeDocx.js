import JSZip from 'jszip'
import { detectPii } from '../src/utils/piiDetector.js'
import { userError } from './userError.js'

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

/** Anonimiza el texto de una parte XML de Word. Devuelve { xml, findings }. */
export function anonymizeWordXml(xml) {
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

    const findings = detectPii(paragraphText)
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
function anonymizeAttributes(xml, attributePattern) {
  const findings = []
  const result = xml.replace(attributePattern, (whole, name, rawValue) => {
    const value = decodeXml(rawValue)
    const valueFindings = detectPii(value)
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
function anonymizeAllText(xml) {
  const findings = []
  const result = xml.replace(/>([^<]+)</g, (whole, rawText) => {
    const text = decodeXml(rawText)
    const textFindings = detectPii(text)
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
// gigas): se revisa el tamaño declarado de cada parte antes de leerla.
const MAX_ENTRIES = 2000
const MAX_UNCOMPRESSED_BYTES = 60 * 1024 * 1024

function checkZipLimits(zip) {
  const entries = Object.values(zip.files).filter((entry) => !entry.dir)
  if (entries.length > MAX_ENTRIES) {
    throw userError('El .docx tiene demasiadas partes internas.')
  }
  let total = 0
  for (const entry of entries) {
    // JSZip no expone el tamaño descomprimido de forma pública.
    total += entry._data?.uncompressedSize ?? 0
    if (total > MAX_UNCOMPRESSED_BYTES) {
      throw userError('El .docx descomprimido supera el tamaño máximo admitido.')
    }
  }
}

const WORD_XML = /^word\/.+\.xml$/
const METADATA_XML = /^(?:docProps\/.+|customXml\/.+)\.xml$/
const RELS_XML = /\.rels$/

/**
 * @param {Buffer|Uint8Array|ArrayBuffer} input contenido del .docx
 * @returns {Promise<{ output: Buffer, findings: object[] }>}
 */
export async function anonymizeDocx(input) {
  const zip = await JSZip.loadAsync(input)
  if (!zip.file('word/document.xml')) {
    throw userError('El archivo no parece un .docx válido (falta word/document.xml).')
  }
  checkZipLimits(zip)

  const findings = []
  for (const path of Object.keys(zip.files)) {
    const file = zip.file(path)
    if (!file) continue

    let xml
    if (WORD_XML.test(path)) {
      // Texto de todas las partes de Word (cuerpo, encabezados, pies,
      // notas, comentarios, glosario...) y los códigos de campo.
      const text = anonymizeWordXml(await file.async('string'))
      const fields = anonymizeAttributes(text.xml, /\b(w:instr)="([^"]*)"/g)
      findings.push(...text.findings, ...fields.findings)
      xml = clearPeopleMetadata(fields.xml)
    } else if (RELS_XML.test(path)) {
      const result = anonymizeAttributes(await file.async('string'), /\b(Target)="([^"]*)"/g)
      findings.push(...result.findings)
      xml = result.xml
    } else if (METADATA_XML.test(path)) {
      const result = anonymizeAllText(clearPeopleMetadata(await file.async('string')))
      findings.push(...result.findings)
      xml = result.xml
    } else {
      continue
    }
    zip.file(path, xml)
  }

  const output = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  return { output, findings }
}
