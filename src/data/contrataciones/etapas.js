/**
 * Etapas y tareas del modo Contrataciones Públicas (selectores en cascada:
 * la etapa filtra qué tareas se ofrecen).
 *
 * `restriccionObligatoria`: texto que se precarga solo en Restricciones y
 * que la persona no puede ocultar ni borrar. null = la etapa no tiene
 * restricción obligatoria y Restricciones funciona como un componente
 * normal.
 */
export const etapas = [
  {
    id: 'planificacion',
    label: 'Planificación y detección de necesidades',
    restriccionObligatoria: 'No propongas la modalidad de contratación.',
  },
  {
    id: 'elaboracion',
    label: 'Elaboración del proceso licitatorio',
    restriccionObligatoria: null,
  },
  {
    id: 'seleccion',
    label: 'Selección y Adjudicación',
    restriccionObligatoria:
      'No determines qué oferente debe ser admitido, rechazado o adjudicado. No incluyas conclusiones sobre la mejor oferta.',
  },
  {
    id: 'seguimiento',
    label: 'Seguimiento y ejecución contractual',
    restriccionObligatoria: 'No recomiendes sanciones, penalidades ni intimaciones.',
  },
]

/**
 * `etapas`: en qué etapas se ofrece la tarea. Una misma tarea puede
 * aparecer en más de una (ej. la síntesis de un contrato anterior sirve
 * para planificar el nuevo y para el seguimiento del vigente).
 */
export const tareas = [
  { id: 'diagnostico-necesidad', label: 'Diagnóstico de necesidad', etapas: ['planificacion'] },
  { id: 'informe-justificativo', label: 'Informe justificativo de necesidad', etapas: ['planificacion'] },
  {
    id: 'sintesis-contrato-anterior',
    label: 'Síntesis de contrato anterior',
    etapas: ['planificacion', 'seguimiento'],
  },
  {
    id: 'revision-especificaciones',
    label: 'Revisión de especificaciones técnicas',
    etapas: ['elaboracion'],
  },
  { id: 'estructura-pbcp', label: 'Estructura inicial del PBCP', etapas: ['elaboracion'] },
  { id: 'checklist-admisibilidad', label: 'Checklist de admisibilidad', etapas: ['seleccion'] },
  { id: 'cuadro-comparativo', label: 'Cuadro comparativo', etapas: ['seleccion'] },
  {
    id: 'alertas-seguimiento',
    label: 'Alertas de seguimiento contractual',
    etapas: ['seguimiento'],
  },
  {
    id: 'otros',
    label: 'Otros',
    etapas: ['planificacion', 'elaboracion', 'seleccion', 'seguimiento'],
  },
]

export function getEtapaById(etapaId) {
  return etapas.find((etapa) => etapa.id === etapaId) ?? etapas[0]
}

export function getTareaById(tareaId) {
  return tareas.find((tarea) => tarea.id === tareaId) ?? tareas[tareas.length - 1]
}

export function getTareasForEtapa(etapaId) {
  return tareas.filter((tarea) => tarea.etapas.includes(etapaId))
}
