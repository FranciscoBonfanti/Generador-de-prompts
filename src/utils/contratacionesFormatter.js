import { contrataEssentialDefs } from '../data/contrataciones/componentDefs.js'
import { getEtapaById } from '../data/contrataciones/etapas.js'
import { getDocumentosFor } from '../data/contrataciones/documentos.js'
import { antesDeUsarItems } from '../data/contrataciones/antesDeUsar.js'
import { detectPedidosProhibidos } from '../data/contrataciones/pedidosProhibidos.js'
import { detectPii, piiKey } from './piiDetector.js'

/**
 * Armado del prompt del modo Contrataciones. A diferencia del modo genérico
 * (un párrafo), acá la salida va estructurada con una etiqueta por línea:
 *
 *   Rol: ...
 *   Tarea: ...
 *   Contexto: ...
 *
 * y termina siempre con AVISO_FINAL.
 */

export const contextoCampos = [
  { id: 'objeto', label: 'Objeto', placeholder: 'Ej.: servicio de limpieza de oficinas' },
  { id: 'organismo', label: 'Organismo', placeholder: 'Ej.: Ministerio de [COMPLETAR]' },
  { id: 'presupuesto', label: 'Rango presupuestario', placeholder: 'Ej.: entre $ 10 y $ 15 millones' },
  { id: 'modalidad', label: 'Modalidad', placeholder: 'Ej.: licitación pública' },
]

// El aviso va dirigido a la IA para que el recordatorio llegue a quien use
// la respuesta, que es donde hay que reemplazar los marcadores.
export const AVISO_FINAL =
  'Aviso final: cerrá tu respuesta recordando que el resultado debe ser validado por el agente público y que los marcadores [COMPLETAR], [VERIFICAR] y [DATO NO DISPONIBLE] deben reemplazarse por la información real antes de usarla.'

const METAPROMPT_SEPARATOR = '\n\n---\n\n'

const lineOrder = [
  ['rol', 'Rol'],
  ['accion', 'Tarea'],
  ['audiencia', 'Audiencia'],
  ['objetivo', 'Objetivo'],
  ['contexto', 'Contexto'],
  ['documentos', 'Documentación adjunta'],
  ['formato-salida', 'Formato de salida'],
  ['restricciones', 'Restricciones'],
  ['frases-obligatorias', 'Frases obligatorias'],
  ['razonamiento', 'Razonamiento'],
  ['tono', 'Tono'],
  ['ejemplos', 'Ejemplo de salida esperada'],
]

/** Una etiqueta por línea: los saltos de línea internos pasan a espacios. */
function singleLine(text) {
  return text.replace(/\s*\n+\s*/g, ' ').trim()
}

function withFinalPeriod(text) {
  return /[.:;!?…]$/.test(text) ? text : `${text}.`
}

function activeContent(state, componentId) {
  const entry = state.componentState[componentId]
  if (!entry?.active) return ''
  return entry.content.trim()
}

export function getRestriccionObligatoria(state) {
  return getEtapaById(state.etapaId).restriccionObligatoria
}

export function buildContexto(state) {
  const { objeto, organismo, presupuesto, modalidad } = state.contexto
  const parts = []
  if (objeto.trim() || organismo.trim()) {
    parts.push(
      `Contratación de ${objeto.trim() || '[OBJETO]'} tramitada por ${organismo.trim() || '[ORGANISMO]'}.`,
    )
  }
  if (presupuesto.trim()) parts.push(withFinalPeriod(`Rango presupuestario: ${presupuesto.trim()}`))
  if (modalidad.trim()) parts.push(withFinalPeriod(`Modalidad: ${modalidad.trim()}`))
  const libre = activeContent(state, 'contexto')
  if (libre) parts.push(withFinalPeriod(singleLine(libre)))
  return state.componentState.contexto.active ? parts.join(' ') : ''
}

export function buildRestricciones(state) {
  const obligatoria = getRestriccionObligatoria(state)
  const extra = obligatoria
    ? state.componentState.restricciones.content.trim()
    : activeContent(state, 'restricciones')
  return [obligatoria, extra && withFinalPeriod(singleLine(extra))].filter(Boolean).join(' ')
}

function buildDocumentos(state) {
  const checked = state.documentos[state.tareaId] ?? []
  return getDocumentosFor(state.tareaId)
    .filter((documento) => checked.includes(documento.id))
    .map((documento) => documento.label)
    .join('; ')
}

function lineValue(state, id) {
  if (id === 'contexto') return buildContexto(state)
  if (id === 'restricciones') return buildRestricciones(state)
  if (id === 'documentos') {
    const documentos = buildDocumentos(state)
    return documentos && `${documentos}.`
  }
  const content = activeContent(state, id)
  if (!content) return ''
  // El ejemplo suele ser una tabla: conserva sus saltos de línea, en un
  // bloque debajo de la etiqueta.
  if (id === 'ejemplos') return `\n${content}`
  return withFinalPeriod(singleLine(content))
}

/** Solo la parte estructurada (sin metaprompt ni aviso final). */
export function formatContrataLines(state) {
  return lineOrder
    .map(([id, label]) => {
      const value = lineValue(state, id)
      return value ? `${label}: ${value}`.replace(': \n', ':\n') : ''
    })
    .filter(Boolean)
    .join('\n')
}

export function formatContrataPrompt(state, metaprompt) {
  const lines = formatContrataLines(state)
  if (!lines) return ''
  const body = `${lines}\n\n${AVISO_FINAL}`
  const meta = state.anteponerMetaprompt ? metaprompt.trim() : ''
  return meta ? `${meta}${METAPROMPT_SEPARATOR}${body}` : body
}

function isEssentialComplete(state, componentDef) {
  if (componentDef.id === 'contexto') return buildContexto(state).length > 0
  if (componentDef.id === 'restricciones') return buildRestricciones(state).length > 0
  return activeContent(state, componentDef.id).length > 0
}

export function countContrataEssentials(state) {
  return contrataEssentialDefs.filter((componentDef) => isEssentialComplete(state, componentDef)).length
}

export function getMissingContrataEssentials(state) {
  return contrataEssentialDefs.filter((componentDef) => !isEssentialComplete(state, componentDef))
}

/**
 * Todos los textos que escribe la persona y que terminan en el prompt, para
 * buscar datos sensibles. El metaprompt solo cuenta si se antepone.
 */
export function getTextFields(state, metaprompt) {
  // Con restricción obligatoria, el texto extra de Restricciones siempre va
  // al prompt (ese componente no se puede ocultar).
  const restriccionesForzadas = Boolean(getRestriccionObligatoria(state))
  const fields = Object.entries(state.componentState).map(([id, entry]) => ({
    id,
    text: entry.active || (id === 'restricciones' && restriccionesForzadas) ? entry.content : '',
  }))
  for (const campo of contextoCampos) {
    fields.push({ id: `contexto.${campo.id}`, text: state.contexto[campo.id] })
  }
  if (state.anteponerMetaprompt) fields.push({ id: 'metaprompt', text: metaprompt })
  return fields
}

/** Hallazgos de datos sensibles que la persona todavía no resolvió. */
export function getUnresolvedPii(state, metaprompt) {
  const ignored = new Set(state.piiIgnorados)
  return getTextFields(state, metaprompt).flatMap((field) =>
    detectPii(field.text)
      .filter((finding) => !ignored.has(piiKey(finding)))
      .map((finding) => ({ ...finding, fieldId: field.id })),
  )
}

/** Categorías de pedidos prohibidos presentes en Tarea, Contexto u Objetivo. */
export function getPedidosProhibidos(state) {
  const texts = [
    state.componentState.accion.content,
    state.componentState.contexto.content,
    state.componentState.objetivo.content,
    ...contextoCampos.map((campo) => state.contexto[campo.id]),
  ]
  return [...new Set(texts.flatMap((text) => detectPedidosProhibidos(text)))]
}

export function isAntesDeUsarComplete(state) {
  return antesDeUsarItems.every((item) => state.antesDeUsar[item.id])
}

/** Salvaguardas del contador "X de Y salvaguardas activas". */
export function getSalvaguardas(state, unresolvedPiiCount) {
  const obligatoria = getRestriccionObligatoria(state)
  return [
    {
      id: 'restricciones',
      label: obligatoria
        ? 'Restricciones obligatorias de la etapa incluidas'
        : 'Restricciones incluidas (esta etapa no tiene obligatorias)',
      active: buildRestricciones(state).length > 0,
    },
    {
      id: 'frases',
      label: 'Frases obligatorias presentes',
      active: activeContent(state, 'frases-obligatorias').length > 0,
    },
    {
      id: 'anonimizacion',
      label:
        unresolvedPiiCount > 0
          ? `Datos sensibles sin resolver: ${unresolvedPiiCount}`
          : 'Sin datos sensibles pendientes',
      active: unresolvedPiiCount === 0,
    },
    {
      id: 'antes-de-usar',
      label: 'Checklist "Antes de usar" completo',
      active: isAntesDeUsarComplete(state),
    },
  ]
}
