/**
 * Detección de datos personales / identificables (PII) por expresiones
 * regulares. Es JS puro, sin dependencias de React ni del navegador: lo usa
 * la UI (aviso en tiempo real) y también la función serverless
 * /api/anonimizar (archivos .docx / .pdf), así ambos detectan exactamente lo
 * mismo.
 *
 * Criterio: ante la duda, detectar de más. Un falso positivo se resuelve con
 * "No es un dato sensible"; un falso negativo filtra un dato real.
 */

export const piiTypes = {
  email: { label: 'Correo electrónico', placeholder: '[CORREO]' },
  expediente: { label: 'Número de expediente', placeholder: '[EXPEDIENTE]' },
  cbu: { label: 'CBU/CVU', placeholder: '[CBU/CVU]' },
  cuit: { label: 'CUIT/CUIL', placeholder: '[CUIT/CUIL]' },
  telefono: { label: 'Teléfono', placeholder: '[TELÉFONO]' },
  dni: { label: 'DNI', placeholder: '[DNI]' },
  razonSocial: { label: 'Razón social', placeholder: '[RAZÓN SOCIAL]' },
  domicilio: { label: 'Domicilio', placeholder: '[DOMICILIO]' },
  // Detectados por la pasada con IA del anonimizador de archivos
  // (server/aiPiiPass.js), no por regex.
  nombre: { label: 'Nombre de persona (IA)', placeholder: '[NOMBRE]' },
  organizacion: { label: 'Organización (IA)', placeholder: '[ORGANIZACIÓN]' },
  cargo: { label: 'Cargo (IA)', placeholder: '[CARGO]' },
  otro: { label: 'Otro dato identificable (IA)', placeholder: '[DATO IDENTIFICABLE]' },
}

/**
 * Formatos de número de expediente. Configurable: agregar acá otros
 * formatos que use el organismo. El primero corresponde al expediente
 * electrónico de Santa Fe, ej. EE-2026-00125594-APPSF-PE.
 */
export const expedientePatterns = [
  /\b[A-Z]{2,5}-\d{4}-\d{5,10}-[A-Z]{2,10}(?:-[A-Z]{1,10})*\b/dg,
  // "Expte. N° 00101-0123456-7", "Expediente 12345/2026", etc. Solo se
  // reemplaza el número (grupo 1), no la palabra "Expediente".
  /\b(?:expte|expediente)\.?\s*(?:n[°ºo]?\.?\s*)?:?\s*([A-Z0-9](?=[A-Z0-9./-]*\d)[A-Z0-9./-]{4,}[A-Z0-9])/dgi,
]

const L = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ'
const UPPER = 'A-ZÁÉÍÓÚÜÑ'
const LOWER = 'a-záéíóúüñ'

const companySuffix = [
  'S\\.\\s?A\\.\\s?S\\.?',
  'S\\.\\s?R\\.\\s?L\\.?',
  'S\\.\\s?A\\.\\s?U\\.?',
  'S\\.\\s?C\\.\\s?A\\.?',
  'S\\.\\s?A\\.?',
  'S\\.\\s?C\\.?',
  'S\\.\\s?H\\.?',
  'S\\.\\s?E\\.?',
  'SAS',
  'SRL',
  'SAU',
  'SCA',
  'SA',
  'Ltda\\.?',
  'Sociedad\\s+An[oó]nima',
  'Sociedad\\s+de\\s+Responsabilidad\\s+Limitada',
  'Sociedad\\s+por\\s+Acciones\\s+Simplificada',
].join('|')
const companySuffixEnd = '(?=$|[\\s,;:)\\].])'
// Una palabra del nombre nunca puede ser a su vez un sufijo societario: así
// "Servicios SRL y Tech SAS" son dos razones sociales y no una sola.
const companyWord = `(?!(?:${companySuffix})${companySuffixEnd})[${UPPER}0-9][${L}0-9&.'-]*`
const companyConnector = '(?:de|del|la|las|los|y|e|el)'
const companyName = `${companyWord}(?:\\s+(?:${companyConnector}\\s+)?${companyWord}){0,6}`

const streetPrefix =
  '(?:calle|av\\.|avda\\.?|avenida|bv\\.|bvd\\.?|bulevar|boulevard|pje\\.|pasaje|diagonal|diag\\.|camino|ruta(?:\\s+(?:nacional|provincial))?)'
const addressCue =
  '(?:domicilio(?:\\s+(?:legal|real|fiscal|constituido|especial|comercial|electr[oó]nico))?(?:\\s+(?:en|sito\\s+en))?|domiciliad[oa]\\s+en|sit[oa]\\s+en|con\\s+sede\\s+en|ubicad[oa]\\s+en|direcci[oó]n)'
const addressTail = '(?:\\s*,?\\s*(?:piso\\s*\\d+|dpto\\.?\\s*\\w+|depto\\.?\\s*\\w+|of(?:icina)?\\.?\\s*\\d+))*'

// Palabras que, seguidas de un número, NO son un domicilio (referencias
// normativas, partes de un documento, fechas, cantidades).
const notAddressWords = new Set(
  [
    'ley', 'leyes', 'decreto', 'resolucion', 'res', 'disposicion', 'circular', 'ordenanza',
    'articulo', 'articulos', 'art', 'inciso', 'inc', 'anexo', 'apartado', 'punto', 'puntos',
    'capitulo', 'titulo', 'seccion', 'clausula', 'item', 'items', 'renglon', 'renglones',
    'lote', 'lotes', 'pagina', 'paginas', 'pag', 'tabla', 'figura', 'cuadro', 'grafico',
    'expediente', 'expte', 'nota', 'pliego', 'licitacion', 'concurso', 'contratacion',
    'contrato', 'orden', 'oferta', 'ofertas', 'oferente', 'oferentes', 'etapa', 'fase',
    'paso', 'version', 'formulario', 'modelo', 'norma', 'grupo', 'nivel', 'categoria',
    'tipo', 'clase', 'total', 'monto', 'importe', 'precio', 'fecha', 'dia', 'dias', 'mes',
    'meses', 'ano', 'anos', 'semana', 'semanas', 'hora', 'horas', 'plazo', 'numero',
    'codigo', 'cantidad', 'unidades', 'proceso', 'procedimiento', 'periodo', 'ejercicio',
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre',
    'setiembre', 'octubre', 'noviembre', 'diciembre', 'provincia', 'region', 'zona',
  ],
)
const unitAfterNumber =
  /^\s*(?:%|°|gb|mb|tb|kb|kg|g|km|m|m2|m3|cm|mm|hs|h|horas|dias|días|meses|años|anos|unidades|u\.|lts?|litros|w|kw|watts|v|hz|ghz|mhz|pulgadas|"|pesos|millones|mil)\b/i

const moneyCue = /(?:\$|ars|usd|u\$s|pesos|monto|importe|presupuesto|precio|valor|total|costo|suma|cotizaci[oó]n)[^\d\n]{0,20}$/i
const documentCue = /(?:dni|d\.n\.i\.?|documento|doc\.)[^\d\n]{0,12}$/i

function stripAccents(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function wordsOf(text) {
  return stripAccents(text)
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean)
}

/**
 * Detectores en orden de prioridad: si dos matches se superponen gana el
 * que aparece antes en esta lista (ej. los 8 dígitos dentro de un CUIT no
 * se reportan además como DNI).
 *
 * `group`: si está, el rango reportado es el de ese grupo de captura (para
 * patrones con una palabra "pista" que no forma parte del dato).
 * `validate(text, start, end)`: descarte opcional de falsos positivos.
 */
const detectors = [
  { type: 'email', regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/dg },

  ...expedientePatterns.map((regex) => ({
    type: 'expediente',
    regex,
    group: regex.source.includes('(?:expte|expediente)') ? 1 : undefined,
  })),

  { type: 'cbu', regex: /(?<!\d)(?:\d{22}|\d{8}[\s-]\d{14})(?!\d)/dg },

  // 11 dígitos, con o sin guiones/espacios/puntos: 20-12345678-9, 20123456789,
  // 20-12.345.678-9.
  {
    type: 'cuit',
    regex: /(?<![\d-])\d{2}[-\s.]?(?:\d{8}|\d{2}\.\d{3}\.\d{3})[-\s.]?\d(?![\d-])/dg,
  },

  // Teléfonos argentinos: con +54, con código de área con 0, con 15, con una
  // palabra pista (Tel., Cel., WhatsApp...) o 10 dígitos corridos.
  {
    type: 'telefono',
    regex: /(?<![\d+])\+54[\s-]?(?:9[\s-]?)?\(?\d{2,4}\)?[\s-]?(?:15[\s-]?)?\d{3,4}[\s-]?\d{3,4}(?!\d)/dg,
  },
  {
    type: 'telefono',
    regex: /(?<![\d])\(?0\d{2,4}\)?[\s-]?(?:15[\s-]?)?\d{3,4}[\s-]?\d{3,4}(?!\d)/dg,
  },
  { type: 'telefono', regex: /(?<![\d])15[\s-]?\d{4}[\s-]?\d{4}(?!\d)/dg },
  {
    type: 'telefono',
    regex: /(?<![A-Za-zÁÉÍÓÚáéíóú])(?:tel[eé]fonos?|tel\.?|cel(?:ular)?\.?|m[oó]vil|whats?app|wsp|fax)\s*(?:n[°º]\.?\s*)?:?\s*(\+?[\d(][\d\s().-]{5,18}\d)/dgi,
    group: 1,
  },
  { type: 'telefono', regex: /(?<![\d.,])[123]\d{9}(?![\d.,])/dg },

  // DNI: 7 u 8 dígitos, con o sin puntos. Se descartan montos ($, "pesos",
  // "presupuesto de...") salvo que haya una pista explícita de documento.
  {
    type: 'dni',
    regex: /(?<![\d.,$-])(?:\d{1,2}\.\d{3}\.\d{3}|\d{7,8})(?![\d]|[.,]\d|-\d)/dg,
    validate(text, start, end) {
      const before = text.slice(Math.max(0, start - 30), start)
      if (documentCue.test(before)) return true
      if (moneyCue.test(before)) return false
      if (unitAfterNumber.test(text.slice(end, end + 12))) return false
      return true
    },
  },

  {
    type: 'razonSocial',
    regex: new RegExp(`(?<![${L}0-9])${companyName}\\s+(?:${companySuffix})${companySuffixEnd}`, 'dg'),
  },

  // Domicilio: calle seguida de número. Los corchetes se excluyen para no
  // matchear dentro de marcadores ya reemplazados, ej. "[DOMICILIO]".
  {
    type: 'domicilio',
    regex: new RegExp(
      `(?<![${L}[])${streetPrefix}\\s+[^\\s,;\\n\\d[\\]][^,;\\n\\d[\\]]{0,40}?\\s+(?:n[°º]\\.?\\s*)?\\d{1,5}(?!\\d)${addressTail}`,
      'dgi',
    ),
  },
  {
    type: 'domicilio',
    regex: new RegExp(
      `(?<![${L}[])${addressCue}\\s*:?\\s*([${L}][^,;\\n\\d[\\]]{1,39}?\\s+(?:n[°º]\\.?\\s*)?\\d{1,5}(?!\\d)${addressTail})`,
      'dgi',
    ),
    group: 1,
  },
  {
    // "San Martín 1234", "Bv. Oroño 150" sin palabra pista. Se descartan
    // referencias normativas/documentales ("Ley 12510", "Anexo 12") y
    // cantidades con unidad ("Memoria 16 GB").
    type: 'domicilio',
    regex: new RegExp(
      `(?<![${L}])[${UPPER}][${LOWER}]+\\.?(?:\\s+(?:(?:de|del|la|los)\\s+)?[${UPPER}][${LOWER}]+\\.?){0,3}\\s+(?:N[°º]\\.?\\s*)?\\d{2,5}(?![\\d.,/-])`,
      'dg',
    ),
    validate(text, start, end) {
      const previousWord = wordsOf(text.slice(Math.max(0, start - 20), start)).pop()
      if (previousWord && notAddressWords.has(previousWord)) return false
      if (wordsOf(text.slice(start, end)).some((word) => notAddressWords.has(word))) return false
      if (unitAfterNumber.test(text.slice(end, end + 12))) return false
      return true
    },
  },
]

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Términos literales extra (ej. nombres que señaló la IA) como detectores de
 * menor prioridad que el regex. No matchean dentro de otra palabra.
 */
function termDetectors(extraTerms) {
  return extraTerms.map((term) => ({
    type: term.type,
    regex: new RegExp(`(?<![${L}0-9])${escapeRegExp(term.text).replace(/\s+/g, '\\s+')}(?![${L}0-9])`, 'dgi'),
  }))
}

/**
 * Devuelve los hallazgos de `text`, sin superposiciones y ordenados por
 * posición: [{ type, label, placeholder, value, start, end }].
 *
 * `extraTerms`: [{ text, type }] fragmentos literales adicionales a tapar.
 */
export function detectPii(text, extraTerms = []) {
  if (!text) return []

  const candidates = []
  ;[...detectors, ...termDetectors(extraTerms)].forEach((detector, priority) => {
    detector.regex.lastIndex = 0
    for (const match of text.matchAll(detector.regex)) {
      const [start, end] = detector.group ? match.indices[detector.group] : match.indices[0]
      if (start === end) continue
      if (detector.validate && !detector.validate(text, start, end)) continue
      candidates.push({ type: detector.type, start, end, priority })
    }
  })

  candidates.sort((a, b) => a.priority - b.priority || b.end - b.start - (a.end - a.start))

  const accepted = []
  for (const candidate of candidates) {
    const overlaps = accepted.some((other) => candidate.start < other.end && other.start < candidate.end)
    if (!overlaps) accepted.push(candidate)
  }

  return accepted
    .sort((a, b) => a.start - b.start)
    .map(({ type, start, end }) => {
      // Recorta espacios/puntuación que algunos patrones pueden arrastrar.
      let trimmedEnd = end
      while (trimmedEnd > start && /[\s,;:]/.test(text[trimmedEnd - 1])) trimmedEnd--
      return {
        type,
        label: piiTypes[type].label,
        placeholder: piiTypes[type].placeholder,
        value: text.slice(start, trimmedEnd),
        start,
        end: trimmedEnd,
      }
    })
}

/** Clave estable para recordar que una persona confirmó "no es sensible". */
export function piiKey(finding) {
  return `${finding.type}:${finding.value.trim().toLowerCase()}`
}

/** Reemplaza los hallazgos indicados (por defecto, todos) por su marcador. */
export function replacePii(text, findings = detectPii(text)) {
  let result = text
  for (const finding of [...findings].sort((a, b) => b.start - a.start)) {
    result = result.slice(0, finding.start) + finding.placeholder + result.slice(finding.end)
  }
  return result
}

/**
 * Reemplaza en `text` todas las apariciones del dato identificado por `key`
 * (ver piiKey). Se re-detecta sobre el texto actual para no depender de
 * posiciones calculadas antes de que la persona siguiera escribiendo.
 */
export function replacePiiByKey(text, key) {
  return replacePii(
    text,
    detectPii(text).filter((finding) => piiKey(finding) === key),
  )
}

/** Conteo de hallazgos por tipo: { cuit: 2, email: 1, ... }. */
export function summarizePii(findings) {
  const summary = {}
  for (const finding of findings) summary[finding.type] = (summary[finding.type] ?? 0) + 1
  return summary
}
