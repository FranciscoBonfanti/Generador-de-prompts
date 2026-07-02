/**
 * Los 8 tipos de tarea. El id es la clave usada en suggestions.js y
 * fullExamples.js para buscar contenido específico de cada tipo.
 */
export const taskTypes = [
  {
    id: 'redaccion-textos',
    label: 'Redacción de textos',
    description: 'Mails, comunicados, posteos y otros textos para escribir de cero.',
  },
  {
    id: 'analisis-datos',
    label: 'Análisis de datos / informes',
    description: 'Interpretar datos, números o resultados y armar un informe o resumen.',
  },
  {
    id: 'atencion-cliente',
    label: 'Atención al cliente / respuestas a consultas',
    description: 'Responder mensajes, reclamos o consultas de clientes o compañeros.',
  },
  {
    id: 'generacion-codigo',
    label: 'Generación o revisión de código',
    description: 'Escribir, corregir o explicar código y scripts.',
  },
  {
    id: 'resumen-documentos',
    label: 'Resumen de documentos',
    description: 'Condensar un documento largo en los puntos más importantes.',
  },
  {
    id: 'traduccion-textos',
    label: 'Traducción de textos',
    description: 'Pasar un texto de un idioma a otro manteniendo el sentido y el tono.',
  },
  {
    id: 'brainstorming-ideas',
    label: 'Brainstorming / generación de ideas',
    description: 'Generar ideas nuevas para un problema, campaña o proyecto.',
  },
  {
    id: 'revision-correccion',
    label: 'Revisión y corrección de textos',
    description: 'Corregir errores, mejorar la redacción o el estilo de un texto ya escrito.',
  },
]

export function getTaskTypeById(taskTypeId) {
  return taskTypes.find((taskType) => taskType.id === taskTypeId)
}
