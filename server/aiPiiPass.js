/**
 * Pasada opcional con IA para detectar datos identificables que el regex no
 * captura (nombres propios, cargos, etc.).
 *
 * PENDIENTE: no implementado a propósito. Falta confirmar qué API de Google
 * se usa (Gemini API / Vertex AI / otra), de qué proyecto sale la clave y el
 * alcance. Cuando esté confirmado:
 *   - leer la clave de process.env.GOOGLE_API_KEY (nunca exponerla al cliente),
 *   - devolver los fragmentos literales a tapar, y
 *   - sumarlos a los hallazgos del regex en server/anonymizeDocx.js y
 *     server/anonymizePdf.js antes de reemplazar.
 *
 * Mientras tanto devuelve siempre [] y el anonimizador funciona solo con regex.
 *
 * Interfaz prevista: recibe el texto plano del documento y devuelve los
 * fragmentos literales a anonimizar.
 *
 * @returns {Promise<string[]>}
 */
export async function detectExtraPiiWithAI() {
  return []
}
