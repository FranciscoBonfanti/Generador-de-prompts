import { essentialComponentDefs } from '../data/componentDefs.js'

// Orden natural de lectura del párrafo final (distinto del orden de las
// tarjetas en la UI): Rol primero, ya que "Actuá como..." arma mejor la
// frase de apertura que empezar por la acción.
const paragraphOrder = [
  'rol',
  'accion',
  'contexto',
  'formato-salida',
  'tono',
  'ejemplos',
  'restricciones',
  'frases-obligatorias',
  'razonamiento',
]

// Etiquetas cortas para la marca entre paréntesis al final de cada frase
// (ej. "... (Rol)."). Independientes de componentDef.promptLabel, que se
// usa para otros encabezados de la UI.
const paragraphTags = {
  rol: 'Rol',
  accion: 'Tarea',
  contexto: 'Contexto',
  'formato-salida': 'Formato',
  tono: 'Tono',
  ejemplos: 'Ejemplos',
  restricciones: 'Restricciones',
  'frases-obligatorias': 'Frases obligatorias',
  razonamiento: 'Razonamiento',
}

/**
 * Arma el prompt final como un único párrafo en lenguaje natural: una frase
 * por componente activo y con contenido, cerrada con su etiqueta entre
 * paréntesis, ej. "Actuá como analista en gestión pública (Rol). Elaborá
 * un diagnóstico... (Tarea)." Componentes vacíos u ocultos no aparecen.
 */
export function formatPrompt(componentState) {
  const sentences = []

  for (const id of paragraphOrder) {
    const entry = componentState[id]
    if (!entry || !entry.active) continue

    const content = entry.content.trim().replace(/[.\s]+$/, '')
    if (!content) continue

    sentences.push(`${content} (${paragraphTags[id]}).`)
  }

  return sentences.join(' ')
}

/**
 * Cuántos de los 5 componentes esenciales están completos (activos y con
 * contenido). Un esencial ocultado no cuenta como completo, aunque tenga
 * texto escrito.
 */
export function countCompletedEssentials(componentState) {
  return essentialComponentDefs.filter((componentDef) => {
    const entry = componentState[componentDef.id]
    return entry?.active && entry.content.trim().length > 0
  }).length
}

export function getMissingEssentials(componentState) {
  return essentialComponentDefs.filter((componentDef) => {
    const entry = componentState[componentDef.id]
    return !entry?.active || entry.content.trim().length === 0
  })
}

export function countWords(text) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}
