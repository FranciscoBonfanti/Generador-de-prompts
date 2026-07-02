/**
 * Los 9 componentes de un prompt. `icon` es el nombre del ícono en
 * lucide-react (se resuelve a componente en la UI, no acá, para
 * mantener este archivo libre de JSX/dependencias de React).
 *
 * `promptLabel` es el encabezado que usa promptFormatter.js al armar
 * el prompt final (ej. "Rol:", "Tarea:").
 */
export const componentCategories = {
  essential: 'essential',
  complement: 'complement',
}

export const componentDefs = [
  // --- Esenciales ---
  {
    id: 'accion',
    category: componentCategories.essential,
    title: 'Acción',
    icon: 'Target',
    promptLabel: 'Tarea',
    definition:
      'Qué querés que la IA haga, concretamente. Es la instrucción principal: el verbo y el resultado que esperás.',
    example:
      'Ejemplo: "Escribí un mail para avisarle a un cliente que su pedido se retrasó 3 días."',
  },
  {
    id: 'rol',
    category: componentCategories.essential,
    title: 'Rol',
    icon: 'Drama',
    promptLabel: 'Rol',
    definition:
      'Qué "perfil" o expertise tiene que asumir la IA para responder. Ayuda a que use el vocabulario y el criterio correctos.',
    example:
      'Ejemplo: "Actuá como un abogado laboralista con 10 años de experiencia en Argentina."',
  },
  {
    id: 'contexto',
    category: componentCategories.essential,
    title: 'Contexto',
    icon: 'BookOpen',
    promptLabel: 'Contexto',
    definition:
      'La información de fondo que la IA necesita para que la respuesta tenga sentido: quién sos, para quién es, qué pasó antes.',
    example:
      'Ejemplo: "Somos una empresa de logística, el cliente ya se quejó una vez antes por el mismo motivo."',
  },
  {
    id: 'formato-salida',
    category: componentCategories.essential,
    title: 'Formato de salida',
    icon: 'LayoutTemplate',
    promptLabel: 'Formato de salida',
    definition:
      'Cómo tiene que estar estructurada la respuesta: mail, lista, tabla, párrafo corto, etc.',
    example: 'Ejemplo: "Como un mail corto, con saludo inicial y firma al final."',
  },
  {
    id: 'tono',
    category: componentCategories.essential,
    title: 'Tono',
    icon: 'MessageCircleHeart',
    promptLabel: 'Tono',
    definition:
      'Con qué actitud tiene que "sonar" la respuesta: formal, informal, empático, técnico, etc.',
    example: 'Ejemplo: "Tono cordial pero profesional, sin ser demasiado formal."',
  },

  // --- Complementarios ---
  {
    id: 'ejemplos',
    category: componentCategories.complement,
    title: 'Ejemplos',
    icon: 'ListChecks',
    promptLabel: 'Ejemplos de referencia',
    definition:
      'Casos de ejemplo que le muestran a la IA el estilo o formato que esperás, para que copie ese patrón.',
    example:
      'Ejemplo: "Así empezamos siempre los mails a clientes: \'Estimado/a [nombre], nos comunicamos para informarle...\'"',
  },
  {
    id: 'restricciones',
    category: componentCategories.complement,
    title: 'Restricciones',
    icon: 'Ban',
    promptLabel: 'Restricciones',
    definition:
      'Qué NO tiene que hacer o incluir la IA: longitud máxima, temas a evitar, cosas prohibidas.',
    example:
      'Ejemplo: "No mencionar plazos de reembolso todavía, no superar las 100 palabras."',
  },
  {
    id: 'frases-obligatorias',
    category: componentCategories.complement,
    title: 'Frases obligatorias',
    icon: 'Quote',
    promptLabel: 'Frases que deben aparecer sí o sí',
    definition:
      'Texto literal que tiene que aparecer en la respuesta, tal cual: un saludo institucional, un nombre, una firma, un disclaimer legal.',
    example: 'Ejemplo: "Tiene que incluir la firma: \'Equipo de Atención al Cliente\'."',
  },
  {
    id: 'razonamiento',
    category: componentCategories.complement,
    title: 'Razonamiento',
    icon: 'Brain',
    promptLabel: 'Razonamiento pedido',
    definition:
      'Pedirle a la IA que explique su lógica o el porqué de sus decisiones, antes o después de darte el resultado.',
    example:
      'Ejemplo: "Antes de la respuesta final, explicá brevemente qué opciones consideraste y por qué elegiste esa."',
  },
]

export const essentialComponentDefs = componentDefs.filter(
  (componentDef) => componentDef.category === componentCategories.essential,
)

export const complementComponentDefs = componentDefs.filter(
  (componentDef) => componentDef.category === componentCategories.complement,
)

export function getComponentDefById(componentId) {
  return componentDefs.find((componentDef) => componentDef.id === componentId)
}
