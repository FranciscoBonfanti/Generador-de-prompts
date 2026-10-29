import { componentCategories } from '../componentDefs.js'

/**
 * Componentes del prompt en el modo Contrataciones. Mismos ids que el modo
 * genérico donde el concepto es el mismo, más `audiencia` y `objetivo`
 * (técnica TAO: Tarea-Audiencia-Objetivo).
 *
 * `preset`: contenido con el que arranca el componente (y al que vuelve con
 * "Reiniciar todo"). `presets`: opciones predefinidas siempre visibles como
 * botones (en vez de quedar ocultas detrás de "Sugerirme opciones").
 */
export const contrataComponentDefs = [
  // --- Esenciales ---
  {
    id: 'rol',
    category: componentCategories.essential,
    title: 'Rol',
    icon: 'Drama',
    definition:
      'Qué perfil tiene que asumir la IA. En contrataciones conviene un rol de asistencia o control, nunca uno que decida.',
    example:
      'Ejemplo: "Actuá como analista de control y auditoría en contrataciones públicas de la Provincia de Santa Fe."',
  },
  {
    id: 'accion',
    category: componentCategories.essential,
    title: 'Tarea / Acción',
    icon: 'Target',
    definition:
      'Qué querés que la IA haga concretamente: organizar, verificar, comparar o redactar. La decisión siempre queda a cargo del agente público.',
    example:
      'Ejemplo: "Elaborá una matriz de verificación de los requisitos formales del pliego para cada oferente."',
  },
  {
    id: 'contexto',
    category: componentCategories.essential,
    title: 'Contexto',
    icon: 'BookOpen',
    guided: true,
    definition:
      'Los datos de la contratación que la IA necesita: objeto, organismo, rango presupuestario y modalidad. Usá marcadores en lugar de datos identificables.',
    example:
      'Ejemplo: "Contratación de [OBJETO] tramitada por [ORGANISMO]. Oferentes identificados como [OFERENTE 1], [OFERENTE 2]."',
  },
  {
    id: 'formato-salida',
    category: componentCategories.essential,
    title: 'Formato de salida',
    icon: 'LayoutTemplate',
    presets: true,
    definition:
      'Cómo tiene que estar estructurada la respuesta. Elegí una de las opciones predefinidas y ajustala si hace falta.',
    example:
      'Ejemplo: "Tabla con requisito, oferente y estado (CUMPLE / NO SE ACREDITA / A VERIFICAR)."',
  },
  {
    id: 'restricciones',
    category: componentCategories.essential,
    title: 'Restricciones',
    icon: 'Ban',
    definition:
      'Qué NO tiene que hacer la IA. Según la etapa, hay restricciones obligatorias del curso que no se pueden quitar; podés sumar otras.',
    example:
      'Ejemplo: "Para cada observación, indicá el requisito del pliego y el documento en que se basa."',
  },

  // --- Complementarios ---
  {
    id: 'frases-obligatorias',
    category: componentCategories.complement,
    title: 'Frases obligatorias',
    icon: 'Quote',
    preset:
      'Usá [COMPLETAR], [VERIFICAR] y [DATO NO DISPONIBLE] cuando corresponda. Identificá las preguntas críticas sin responder.',
    definition:
      'Marcadores y expresiones que la respuesta tiene que usar sí o sí, para que se vea qué falta completar o verificar.',
    example: 'Ejemplo: "Usá [VERIFICAR] cuando un dato no surja de la documentación."',
  },
  {
    id: 'razonamiento',
    category: componentCategories.complement,
    title: 'Razonamiento',
    icon: 'Brain',
    preset:
      'Antes de redactar, verificá si la información es suficiente; si falta algo, formulá preguntas priorizadas. Diferenciá hechos de inferencias.',
    definition:
      'Cómo tiene que razonar la IA antes de responder: chequear si la información alcanza y separar lo que surge de los documentos de lo que interpreta.',
    example: 'Ejemplo: "Indicá qué surge de los documentos y qué es una inferencia tuya."',
  },
  {
    id: 'tono',
    category: componentCategories.complement,
    title: 'Tono',
    icon: 'MessageCircleHeart',
    preset: 'Formal, técnico-administrativo, impersonal.',
    definition: 'Con qué registro tiene que sonar la respuesta.',
    example: 'Ejemplo: "Formal, técnico-administrativo, impersonal."',
  },
  {
    id: 'ejemplos',
    category: componentCategories.complement,
    title: 'Ejemplos',
    icon: 'ListChecks',
    multiline: true,
    definition:
      'Un ejemplo de la salida que esperás, para que la IA copie la estructura. Usá marcadores, no datos reales.',
    example: 'Usá "Sugerirme opciones" para cargar un ejemplo de salida para la tarea elegida.',
  },
  {
    id: 'audiencia',
    category: componentCategories.complement,
    title: 'Audiencia',
    icon: 'Users',
    definition:
      'Para quién es el resultado (técnica TAO: Tarea-Audiencia-Objetivo). Ayuda a ajustar el nivel de detalle y el vocabulario.',
    example: 'Ejemplo: "El resultado lo va a leer la comisión evaluadora."',
  },
  {
    id: 'objetivo',
    category: componentCategories.complement,
    title: 'Objetivo',
    icon: 'Flag',
    definition:
      'Para qué se va a usar el resultado (técnica TAO). No es lo mismo un borrador interno que un insumo para un dictamen.',
    example: 'Ejemplo: "El objetivo es contar con un insumo ordenado para el dictamen de evaluación."',
  },
]

export const contrataEssentialDefs = contrataComponentDefs.filter(
  (componentDef) => componentDef.category === componentCategories.essential,
)

export const contrataComplementDefs = contrataComponentDefs.filter(
  (componentDef) => componentDef.category === componentCategories.complement,
)

export function getContrataComponentDef(componentId) {
  return contrataComponentDefs.find((componentDef) => componentDef.id === componentId)
}
