/**
 * Frenos a pedidos prohibidos por el curso: pedirle a la IA que decida o
 * recomiende quién gana, o que proponga sanciones. Los patrones se aplican
 * sobre el texto en minúsculas y sin tildes, así "decidí quién gana",
 * "Decidi quien gana" y "DECIDÍ QUIÉN GANA" dan lo mismo.
 *
 * El aviso no bloquea: explica por qué el pedido queda fuera de lo
 * permitido y cómo reformularlo.
 */
export const categoriasProhibidas = {
  adjudicacion: {
    titulo: 'Este pedido queda fuera de lo permitido por el curso',
    explicacion:
      'Estás pidiendo que la IA decida o recomiende quién gana, a quién adjudicar o qué oferta es la mejor. Esa decisión es un acto administrativo que corresponde al agente público y a la comisión evaluadora, con fundamento en el pliego y la normativa: la IA no puede sustituirla.',
    sugerencia:
      'Reformulá el pedido para que la IA organice, compare o verifique información (por ejemplo, "elaborá un cuadro comparativo de las ofertas según los criterios del pliego") sin emitir una conclusión.',
  },
  sanciones: {
    titulo: 'Este pedido queda fuera de lo permitido por el curso',
    explicacion:
      'Estás pidiendo que la IA recomiende o decida una sanción, multa, penalidad o intimación. Esa evaluación corresponde al agente público, con base en el contrato y la normativa vigente.',
    sugerencia:
      'Pedile que identifique los incumplimientos documentados y las cláusulas aplicables, sin proponer la medida a tomar.',
  },
}

const sujeto = '(?:oferente|oferentes|oferta|ofertas|empresa|empresas|proveedor|proveedores|propuesta|propuestas|firma|firmas|contratista)'
const verboPedido =
  '(?:decid\\w*|deci|decime|determin\\w*|defin\\w*|eleg\\w*|elij\\w*|elej\\w*|seleccion\\w*|indic\\w*|recomend\\w*|suger\\w*|propon\\w*|establec\\w*|identific\\w*)'
// Para sanciones no se incluyen "indicá"/"identificá": pedir que identifique
// la penalidad prevista en una cláusula es válido; pedir que la proponga no.
const verboSancion = '(?:decid\\w*|decime|determin\\w*|defin\\w*|eleg\\w*|recomend\\w*|suger\\w*|propon\\w*|aplic\\w*)'

const patrones = [
  // "decidí quién gana", "¿quién debería ganar?", "quién se adjudica"
  ['adjudicacion', /\bquien(?:es)?\s+(?:gana|ganan|ganaria|ganarian|deberia(?:n)?\s+ganar|tiene(?:n)?\s+que\s+ganar|merece(?:n)?\s+ganar|va\s+a\s+ganar|se\s+adjudica|se\s+lleva|resulta\s+adjudicatari|deberia(?:n)?\s+(?:ser\s+)?adjudicad|conviene\s+(?:adjudicar|contratar|elegir))/],
  // "qué oferente gana", "cuál oferta conviene", "qué empresa elijo"
  ['adjudicacion', new RegExp(`\\b(?:que|cual|cuales)\\s+(?:es\\s+(?:el|la)\\s+)?${sujeto}\\s+(?:gana|ganan|ganaria|deberia(?:n)?\\s+ganar|conviene|convendria|es\\s+(?:la|el)\\s+mejor|deberia(?:n)?\\s+(?:ser\\s+)?(?:adjudicad|elegid|seleccionad|contratad)|hay\\s+que\\s+(?:adjudicar|elegir|contratar)|(?:me\\s+)?(?:conviene|corresponde)\\s+(?:adjudicar|elegir|contratar)|elijo|elegimos|adjudico|adjudicamos|contrato|contratamos|admito|rechazo|desestimo)`)],
  // "elegí al ganador", "recomendá al mejor oferente", "definí el adjudicatario"
  ['adjudicacion', new RegExp(`\\b${verboPedido}\\s+(?:a\\s+|al\\s+|el\\s+|la\\s+|a\\s+la\\s+|cual\\s+es\\s+(?:el|la)\\s+)?(?:ganador|ganadora|ganadores|adjudicatari[oa]s?|mejor(?:es)?\\s+${sujeto}|${sujeto}\\s+(?:ganador|ganadora|mas\\s+conveniente|mejor))`)],
  // "recomendá a quién adjudicar", "a quién le adjudico"
  ['adjudicacion', /\ba\s+quien(?:es)?\s+(?:le\s+|les\s+)?(?:adjudic\w*|contrat\w*|elegir|elijo|elegimos|seleccion\w*|dar\s+la\s+adjudicacion)/],
  // "cuál es la mejor oferta", "la oferta más conveniente"
  ['adjudicacion', new RegExp(`\\b(?:cual|cuales)\\s+(?:es|son)\\s+(?:el|la|los|las)\\s+(?:mejor(?:es)?\\s+${sujeto}|${sujeto}\\s+(?:mas\\s+conveniente|ganadora?))`)],
  ['adjudicacion', new RegExp(`\\b${verboPedido}\\s+(?:cual\\s+es\\s+)?(?:la|el)\\s+${sujeto}\\s+mas\\s+conveniente`)],
  // "ordená las ofertas de mejor a peor", "rankeá a los oferentes"
  ['adjudicacion', new RegExp(`\\b(?:orden\\w*|rankea\\w*|clasific\\w*|puntua\\w*)\\s+(?:a\\s+)?(?:los|las)\\s+${sujeto}\\s+(?:de\\s+mejor\\s+a\\s+peor|por\\s+conveniencia|segun\\s+(?:cual|quien)\\s+(?:conviene|gana))`)],
  ['adjudicacion', new RegExp(`\\branking\\s+de\\s+(?:los\\s+|las\\s+)?${sujeto}`)],
  // "decidí qué ofertas rechazar", "qué oferentes admitir"
  ['adjudicacion', new RegExp(`\\b(?:que|cual|cuales)\\s+${sujeto}\\s+(?:admitir|rechazar|desestimar|descalificar|adjudicar|elegir|seleccionar|contratar)`)],
  // "adjudicale a...", "adjudicá el contrato a..."
  ['adjudicacion', /\badjudica(?:le|les)?\s+(?:el\s+(?:contrato|renglon|lote)\s+)?(?:a|al)\s/],

  // "recomendá una sanción", "qué multa aplico", "hay que intimar"
  ['sanciones', new RegExp(`\\b${verboSancion}\\s+(?:una?\\s+|la\\s+|el\\s+|que\\s+|cual\\s+|alguna?\\s+)?(?:sancion|sanciones|multa|multas|penalidad|penalidades|penalizacion|intimacion|intimaciones|apercibimiento|rescision)`)],
  [
    'sanciones',
    /\b(?:que|cual|cuales)\s+(?:sancion|sanciones|multa|multas|penalidad|penalidades|intimacion)\s+(?:aplico|aplicamos|aplicar|le\s+aplico|corresponde(?:\s+aplicar)?|deberia(?:mos)?\s+aplicar|conviene)/,
  ],
  ['sanciones', /\b(?:hay\s+que|debo|debemos|deberia(?:mos)?|corresponde|conviene)\s+(?:sancionar|multar|penalizar|intimar|rescindir|aplicar\s+(?:una?\s+)?(?:sancion|multa|penalidad))/],
]

export function normalizeForMatching(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:"“”()]/g, ' ')
    .replace(/\s+/g, ' ')
}

/** Devuelve las categorías prohibidas detectadas en `text` (sin repetir). */
export function detectPedidosProhibidos(text) {
  if (!text) return []
  const normalized = normalizeForMatching(text)
  const found = new Set()
  for (const [categoria, patron] of patrones) {
    if (patron.test(normalized)) found.add(categoria)
  }
  return [...found]
}
