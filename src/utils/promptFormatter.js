import { componentDefs, essentialComponentDefs } from '../data/componentDefs.js'

/**
 * Arma el prompt final en texto plano a partir del estado de componentes.
 * Solo entran componentes activos (no ocultos) y con contenido no vacío,
 * en el orden fijo de componentDefs (esenciales primero).
 */
export function formatPrompt(componentState) {
  const lines = []

  for (const componentDef of componentDefs) {
    const entry = componentState[componentDef.id]
    if (!entry || !entry.active) continue

    const content = entry.content.trim()
    if (!content) continue

    lines.push(`${componentDef.promptLabel}: ${content}`)
  }

  return lines.join('\n\n')
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
