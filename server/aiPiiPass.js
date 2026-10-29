/**
 * Pasada con IA (Gemini API de Google AI Studio) para detectar datos
 * identificables que el regex no captura: nombres de personas, empresas
 * sin sufijo societario, cargos acompañados de nombre, etc.
 *
 * Devuelve fragmentos literales del texto; los anonimizadores los tapan con
 * el mismo mecanismo que los hallazgos del regex. Si la clave no está
 * configurada o la API falla, el anonimizador sigue funcionando solo con
 * regex e informa el estado en el resumen.
 *
 * La clave se lee de process.env.GOOGLE_API_KEY: nunca llega al cliente.
 */

// Modelos Flash en orden de preferencia, con versión fija (no el alias
// "gemini-flash-latest") para que el comportamiento no cambie solo cuando
// Google mueve el alias. Si el primero está saturado (503/429) o no
// responde a tiempo, se usa el siguiente: los picos de demanda de un modelo
// nuevo son frecuentes y no deberían dejar al anonimizador sin la pasada.
const MODELS = [
  { name: 'gemini-3.8-flash', timeoutMs: 20_000 },
  { name: 'gemini-3.5-flash', timeoutMs: 45_000 },
]
const RETRYABLE_STATUS = new Set([429, 500, 503, 504])
// Documentos largos se mandan en partes, cortando en saltos de línea. Topes
// para acotar el costo por archivo en la cuenta de Google: si el documento
// necesita más partes, la pasada con IA no se hace (status 'skipped': se
// anonimiza con regex y se informa).
const MAX_CHARS_PER_REQUEST = 60_000
const MAX_CHUNKS = 8
const MAX_CONCURRENT_REQUESTS = 3
const MAX_TERM_LENGTH = 120
const MAX_TERMS = 300

export const aiTermTypes = ['nombre', 'organizacion', 'cargo', 'otro']

const INSTRUCCIONES = `Sos un asistente de anonimización de documentos de contrataciones públicas de la Provincia de Santa Fe (Argentina).
Del texto que recibís, devolvé los fragmentos LITERALES que permitan identificar a una persona humana o jurídica y que no deban compartirse con terceros:
- "nombre": nombres y apellidos de personas (oferentes, apoderados, firmantes, agentes, testigos).
- "organizacion": nombres de empresas, estudios, comercios u organizaciones privadas (con o sin S.A., S.R.L., etc.).
- "cargo": un cargo solo cuando identifica a una persona concreta (ej. "el Director de Compras del Hospital X").
- "otro": cualquier otro dato identificable (matrículas, patentes, números de legajo, domicilios, firmas).
NO incluyas: organismos públicos (ministerios, secretarías, la Provincia, municipios), normativa (leyes, decretos), montos, fechas, objetos de la contratación, términos genéricos ("el oferente", "la empresa") ni texto entre corchetes como [CUIT/CUIL].
Copiá cada fragmento exactamente como aparece en el texto, sin corregirlo ni completarlo. Si no hay ninguno, devolvé una lista vacía.`

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    fragmentos: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          texto: { type: 'STRING' },
          tipo: { type: 'STRING', enum: aiTermTypes },
        },
        required: ['texto', 'tipo'],
      },
    },
  },
  required: ['fragmentos'],
}

function splitIntoChunks(text) {
  const chunks = []
  let current = ''
  for (const line of text.split('\n')) {
    if (current.length + line.length + 1 > MAX_CHARS_PER_REQUEST && current) {
      chunks.push(current)
      current = ''
    }
    current += (current ? '\n' : '') + line.slice(0, MAX_CHARS_PER_REQUEST)
  }
  if (current.trim()) chunks.push(current)
  return chunks
}

// Errores propios con mensajes sin contenido del documento (solo modelo y
// estado): son los únicos cuyo mensaje se loguea.
class AiPassError extends Error {}
class RetryableError extends AiPassError {}

async function requestTermsFrom(model, chunk, apiKey) {
  let response
  try {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model.name}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      signal: AbortSignal.timeout(model.timeoutMs),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: INSTRUCCIONES }] },
        contents: [{ role: 'user', parts: [{ text: chunk }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    })
  } catch (error) {
    if (error?.name === 'TimeoutError') throw new RetryableError(`${model.name}: sin respuesta a tiempo`)
    throw error
  }
  if (RETRYABLE_STATUS.has(response.status)) throw new RetryableError(`${model.name} respondió ${response.status}`)
  if (!response.ok) throw new AiPassError(`${model.name} respondió ${response.status}`)
  const data = await response.json()
  const raw = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? ''
  try {
    return { model: model.name, fragmentos: JSON.parse(raw).fragmentos ?? [] }
  } catch {
    // El mensaje de JSON.parse incluye un pedazo del texto: no se propaga
    // para que nunca llegue a los logs.
    throw new AiPassError(`${model.name}: la respuesta no es JSON válido`)
  }
}

/** Ejecuta `task` sobre cada elemento con a lo sumo `limit` en paralelo. */
async function mapWithConcurrency(items, limit, task) {
  const results = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await task(items[index])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

async function requestTerms(chunk, apiKey) {
  let lastError
  for (const model of MODELS) {
    try {
      return await requestTermsFrom(model, chunk, apiKey)
    } catch (error) {
      if (!(error instanceof RetryableError)) throw error
      console.warn('aiPiiPass:', error.message, '— se prueba el siguiente modelo')
      lastError = error
    }
  }
  throw lastError
}

/**
 * @param {string} text texto plano del documento
 * @returns {Promise<{ status: 'ok' | 'partial' | 'disabled' | 'skipped' | 'error', terms: { text: string, type: string }[], models?: string[] }>}
 */
export async function detectExtraPiiWithAI(text) {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) return { status: 'disabled', terms: [] }
  if (!text.trim()) return { status: 'ok', terms: [] }

  const chunks = splitIntoChunks(text)
  if (chunks.length > MAX_CHUNKS) {
    console.warn(`aiPiiPass: documento demasiado largo para la pasada con IA (${chunks.length} partes)`)
    return { status: 'skipped', terms: [] }
  }

  try {
    const results = await mapWithConcurrency(chunks, MAX_CONCURRENT_REQUESTS, (chunk) => requestTerms(chunk, apiKey))
    const lowerText = text.toLowerCase()
    const seen = new Set()
    const terms = []
    let truncated = false
    for (const fragmento of results.flatMap((result) => result.fragmentos)) {
      const value = String(fragmento?.texto ?? '').trim()
      const type = aiTermTypes.includes(fragmento?.tipo) ? fragmento.tipo : 'otro'
      const key = value.toLowerCase()
      // Solo se aceptan fragmentos que existan tal cual en el documento: la
      // IA no puede agregar texto, solo señalar qué tapar.
      if (value.length < 3 || value.length > MAX_TERM_LENGTH || /[[\]]/.test(value)) continue
      if (seen.has(key) || !lowerText.includes(key)) continue
      if (terms.length >= MAX_TERMS) {
        // Lo que no entra en el tope queda sin tapar: se informa como
        // 'partial' para que la UI pida revisión manual.
        truncated = true
        break
      }
      seen.add(key)
      terms.push({ text: value, type })
    }
    return { status: truncated ? 'partial' : 'ok', terms, models: [...new Set(results.map((result) => result.model))] }
  } catch (error) {
    // Nunca se loguea el contenido del documento, solo el tipo de falla.
    console.error('aiPiiPass: falló la pasada con IA:', error instanceof AiPassError ? error.message : error?.name)
    return { status: 'error', terms: [] }
  }
}
