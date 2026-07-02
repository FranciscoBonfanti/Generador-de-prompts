/**
 * suggestions[taskTypeId][componentId] = array de exactamente 3 sugerencias
 * { etiqueta, texto }. `etiqueta` es el nombre corto que se muestra en el
 * botón/chip de cada alternativa; `texto` es lo que se carga en el textarea
 * al elegirla (editable después por la persona).
 *
 * Contenido completo para: redaccion-textos, atencion-cliente, analisis-datos.
 * El resto de los tipos de tarea se suma en un paso posterior con el mismo
 * nivel de detalle.
 */
export const suggestions = {
  'redaccion-textos': {
    accion: [
      {
        etiqueta: 'Redactar un mail',
        texto:
          'Redactá un mail claro y breve para comunicar [tema], dejando en claro la acción que tiene que tomar quien lo recibe.',
      },
      {
        etiqueta: 'Redactar un comunicado interno',
        texto:
          'Redactá un comunicado interno para todo el personal, anunciando [novedad], explicando el motivo y desde cuándo aplica.',
      },
      {
        etiqueta: 'Redactar un posteo para redes',
        texto:
          'Redactá un posteo breve para redes sociales sobre [tema], pensado para captar la atención en los primeros dos renglones.',
      },
    ],
    rol: [
      {
        etiqueta: 'Comunicador institucional',
        texto:
          'Actuá como un especialista en comunicación institucional, que sabe transmitir información sensible de forma clara y sin generar alarma innecesaria.',
      },
      {
        etiqueta: 'Redactor publicitario',
        texto:
          'Actuá como un redactor publicitario (copywriter) con experiencia en textos breves y persuasivos para redes sociales.',
      },
      {
        etiqueta: 'Asistente de escritura formal',
        texto:
          'Actuá como un asistente de escritura que ayuda a redactar mails y comunicados de oficina, cuidando la ortografía, la claridad y el tono profesional.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Historia previa',
        texto:
          'Este mensaje es una continuación de una conversación anterior donde ya se explicó [resumen breve de lo hablado antes].',
      },
      {
        etiqueta: 'Público destinatario',
        texto:
          'Quien va a leer esto es [describir destinatario: un cliente, todo el personal, un proveedor, etc.], que no tiene por qué conocer detalles técnicos del tema.',
      },
      {
        etiqueta: 'Motivo del mensaje',
        texto:
          'Este texto surge porque [explicar la situación que originó la necesidad de escribir, ej: un cambio de horario, un problema detectado, una novedad para anunciar].',
      },
    ],
    'formato-salida': [
      {
        etiqueta: 'Mail formal',
        texto:
          'Como un mail, con saludo inicial, cuerpo dividido en párrafos cortos y firma al final.',
      },
      {
        etiqueta: 'Lista de puntos',
        texto:
          'Como una lista con viñetas, para que se pueda leer rápido y no se pierda ningún punto importante.',
      },
      {
        etiqueta: 'Texto corto para redes',
        texto:
          'Como un texto de no más de 3 o 4 líneas, sin viñetas ni encabezados, listo para pegar en un posteo.',
      },
    ],
    tono: [
      {
        etiqueta: 'Formal institucional',
        texto: 'Tono formal e institucional, cuidando que se note que representa a la empresa.',
      },
      {
        etiqueta: 'Cercano y cordial',
        texto:
          'Tono cordial y cercano, como si lo escribiera una persona real, sin sonar robótico ni excesivamente formal.',
      },
      {
        etiqueta: 'Directo y breve',
        texto: 'Tono directo, yendo al punto rápido, sin rodeos ni frases de relleno.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Estilo de saludo institucional',
        texto:
          "Los mails de la empresa siempre arrancan con 'Estimados/as' y terminan con 'Saludos cordiales, Equipo de [Área]'.",
      },
      {
        etiqueta: 'Frase de referencia',
        texto:
          "Un comunicado anterior decía: 'Les recordamos que a partir del lunes...' — seguí ese estilo directo y con fecha concreta.",
      },
      {
        etiqueta: 'Posteo de referencia',
        texto:
          "Un posteo que funcionó bien empezaba con una pregunta: '¿Sabías que...?' — se puede usar un recurso similar.",
      },
    ],
    restricciones: [
      {
        etiqueta: 'Límite de extensión',
        texto: 'No superar las 150 palabras en total.',
      },
      {
        etiqueta: 'Temas a evitar',
        texto:
          'No mencionar todavía [dato sensible, ej: cifras internas, nombres de personas involucradas, fecha exacta de un cambio no confirmado].',
      },
      {
        etiqueta: 'Sin jerga técnica',
        texto:
          'No usar términos técnicos ni abreviaturas internas que alguien de afuera no entendería.',
      },
    ],
    'frases-obligatorias': [
      {
        etiqueta: 'Firma institucional',
        texto: "Tiene que terminar con la firma: 'Equipo de [Área/Empresa]'.",
      },
      {
        etiqueta: 'Aclaración legal',
        texto:
          "Tiene que incluir la frase: 'Esta comunicación es de carácter informativo y no reemplaza asesoramiento profesional'.",
      },
      {
        etiqueta: 'Dato de contacto',
        texto: "Tiene que incluir al final: 'Ante cualquier duda, escribinos a [mail/teléfono de contacto]'.",
      },
    ],
    razonamiento: [
      {
        etiqueta: 'Explicar elección de tono',
        texto: 'Antes del texto final, explicá en una línea por qué elegiste ese tono para este destinatario.',
      },
      {
        etiqueta: 'Justificar estructura',
        texto: 'Después del texto, indicá brevemente por qué organizaste la información en ese orden.',
      },
      {
        etiqueta: 'Alternativas consideradas',
        texto: 'Antes de la versión final, mencioná una alternativa de enfoque que descartaste y por qué.',
      },
    ],
  },

  'atencion-cliente': {
    accion: [
      {
        etiqueta: 'Responder un reclamo',
        texto:
          'Redactá una respuesta a un cliente que se queja por [motivo del reclamo], reconociendo el problema y explicando el próximo paso.',
      },
      {
        etiqueta: 'Responder una consulta',
        texto:
          'Redactá una respuesta clara a la consulta del cliente sobre [tema], dando la información exacta que necesita.',
      },
      {
        etiqueta: 'Explicar un proceso',
        texto:
          'Explicale al cliente, paso a paso, cómo hacer [trámite o proceso], de forma que lo entienda sin ayuda adicional.',
      },
    ],
    rol: [
      {
        etiqueta: 'Agente de atención al cliente',
        texto:
          'Actuá como un agente de atención al cliente con experiencia, que sabe calmar situaciones tensas sin sonar a libreto armado.',
      },
      {
        etiqueta: 'Especialista del área',
        texto:
          'Actuá como especialista de [área correspondiente, ej: facturación, logística, soporte técnico], que conoce el proceso interno y puede explicarlo con precisión.',
      },
      {
        etiqueta: 'Responsable de posventa',
        texto:
          'Actuá como responsable de posventa, enfocado en que el cliente se vaya conforme aunque el problema no se resuelva al instante.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Historial del cliente',
        texto:
          'Es la segunda vez que este cliente escribe por el mismo tema, la primera vez no quedó conforme con la respuesta.',
      },
      {
        etiqueta: 'Situación del reclamo',
        texto:
          'El cliente compró [producto/servicio] el [fecha aproximada] y todavía no recibió solución al problema de [detalle].',
      },
      {
        etiqueta: 'Límite de lo que se puede ofrecer',
        texto:
          'Podemos ofrecer [reembolso parcial / cambio / nueva fecha], pero no podemos garantizar [lo que no está permitido prometer].',
      },
    ],
    'formato-salida': [
      {
        etiqueta: 'Respuesta de mail/chat',
        texto:
          'Como una respuesta de mail o chat, con saludo breve, explicación clara y cierre con el próximo paso.',
      },
      {
        etiqueta: 'Pasos numerados',
        texto: 'Como una lista numerada de pasos, fácil de seguir sin dudas.',
      },
      {
        etiqueta: 'Respuesta corta para chat en vivo',
        texto: 'Como 2 o 3 mensajes cortos, tipo chat, sin párrafos largos.',
      },
    ],
    tono: [
      {
        etiqueta: 'Cordial y cercano',
        texto: 'Tono cordial y cercano, mostrando que entendemos la molestia del cliente.',
      },
      {
        etiqueta: 'Formal y directo',
        texto:
          'Tono formal y directo, priorizando la información concreta por sobre las formalidades largas.',
      },
      {
        etiqueta: 'Empático y paciente',
        texto:
          'Tono empático y paciente, como para alguien que ya está frustrado y necesita sentirse escuchado antes que nada.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Apertura estándar',
        texto:
          "Las respuestas suelen empezar con: 'Hola [nombre], gracias por escribirnos' — mantené ese estilo.",
      },
      {
        etiqueta: 'Cierre habitual',
        texto:
          "Cerramos siempre con algo como: 'Quedamos atentos a cualquier consulta adicional' — usá un cierre similar.",
      },
      {
        etiqueta: 'Caso resuelto anterior',
        texto:
          "Una respuesta anterior que funcionó bien decía: 'Entendemos la demora y ya estamos gestionando...' — podés inspirarte en ese enfoque.",
      },
    ],
    restricciones: [
      {
        etiqueta: 'No prometer lo que no se puede cumplir',
        texto: 'No prometer plazos ni reembolsos que todavía no están confirmados.',
      },
      {
        etiqueta: 'Extensión máxima',
        texto: 'No superar las 120 palabras, el cliente quiere una respuesta rápida de leer.',
      },
      {
        etiqueta: 'Evitar tecnicismos internos',
        texto:
          "No usar nombres de sistemas internos ni códigos que el cliente no va a entender (ej: 'ticket #', nombres de plataformas internas).",
      },
    ],
    'frases-obligatorias': [
      {
        etiqueta: 'Disculpa institucional',
        texto: 'Tiene que incluir una disculpa clara por la demora o el inconveniente.',
      },
      {
        etiqueta: 'Dato de seguimiento',
        texto: 'Tiene que incluir el número de caso o la forma de hacer seguimiento del reclamo.',
      },
      {
        etiqueta: 'Firma del equipo',
        texto: "Tiene que cerrar con: 'Equipo de Atención al Cliente'.",
      },
    ],
    razonamiento: [
      {
        etiqueta: 'Explicar el enfoque elegido',
        texto:
          'Antes de la respuesta, explicá brevemente qué enfoque elegiste para bajar la tensión del reclamo.',
      },
      {
        etiqueta: 'Alternativas de solución',
        texto:
          'Mencioná qué otras soluciones se podrían haber ofrecido y por qué elegiste la que estás proponiendo.',
      },
      {
        etiqueta: 'Riesgos de la respuesta',
        texto: 'Después de la respuesta, indicá si hay algún riesgo de que el cliente se moleste más y por qué.',
      },
    ],
  },

  'analisis-datos': {
    accion: [
      {
        etiqueta: 'Analizar resultados',
        texto: 'Analizá estos datos/resultados y contame qué tendencias o patrones más importantes ves.',
      },
      {
        etiqueta: 'Armar un informe',
        texto:
          'Armá un informe breve con las conclusiones principales de estos datos, listo para presentar a [destinatario].',
      },
      {
        etiqueta: 'Comparar períodos',
        texto:
          'Comparás estos datos con el período anterior y explicame qué cambió y por qué podría haber pasado eso.',
      },
    ],
    rol: [
      {
        etiqueta: 'Analista de datos',
        texto:
          'Actuá como un analista de datos que sabe explicar números complejos en lenguaje simple, sin perder precisión.',
      },
      {
        etiqueta: 'Consultor de negocio',
        texto:
          'Actuá como consultor de negocio, enfocado en qué decisiones se podrían tomar a partir de estos datos, no solo en describirlos.',
      },
      {
        etiqueta: 'Asistente de reporting',
        texto:
          'Actuá como un asistente que arma reportes internos, priorizando que sean fáciles de leer para alguien sin formación en análisis de datos.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Origen de los datos',
        texto:
          'Estos datos vienen de [fuente: ventas del mes, encuesta a clientes, sistema interno de X], correspondientes al período [fecha].',
      },
      {
        etiqueta: 'Para quién es el informe',
        texto:
          'Este informe es para [destinatario, ej: la gerencia, el equipo comercial], que no tiene tiempo de leer datos crudos y necesita las conclusiones.',
      },
      {
        etiqueta: 'Objetivo del análisis',
        texto:
          'El objetivo de este análisis es entender por qué [pregunta de negocio, ej: bajaron las ventas, subieron los reclamos] para poder decidir [qué acción se busca definir].',
      },
    ],
    'formato-salida': [
      {
        etiqueta: 'Informe con secciones',
        texto: 'Como un informe corto con secciones: Resumen, Hallazgos principales, Recomendación.',
      },
      {
        etiqueta: 'Tabla comparativa',
        texto: 'Como una tabla que compare los valores más importantes entre períodos o categorías.',
      },
      {
        etiqueta: 'Lista de conclusiones',
        texto: 'Como una lista de 3 a 5 conclusiones clave, cada una en una oración, sin vueltas.',
      },
    ],
    tono: [
      {
        etiqueta: 'Técnico y preciso',
        texto:
          'Tono técnico y preciso, cuidando la exactitud de los números y evitando generalizaciones.',
      },
      {
        etiqueta: 'Ejecutivo y directo',
        texto: 'Tono ejecutivo, directo, pensado para alguien que decide rápido y no quiere rodeos.',
      },
      {
        etiqueta: 'Didáctico',
        texto:
          'Tono didáctico, explicando los términos y números como para alguien que no maneja el tema en profundidad.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Formato de informe anterior',
        texto:
          'Los informes anteriores empezaban con un resumen de 2 líneas antes de entrar en el detalle — mantené esa estructura.',
      },
      {
        etiqueta: 'Nivel de detalle esperado',
        texto:
          "Un informe de referencia decía: 'Las ventas bajaron 12% respecto al mes anterior, principalmente por la categoría X' — ese nivel de precisión y brevedad es el esperado.",
      },
      {
        etiqueta: 'Forma de presentar comparaciones',
        texto:
          "Para comparar períodos usamos frases como: 'en comparación con [período], [métrica] mostró un [aumento/baja] de [%]' — seguí ese patrón.",
      },
    ],
    restricciones: [
      {
        etiqueta: 'No inventar datos',
        texto:
          'No inventar ni asumir datos que no estén en la información provista; si falta un dato, aclararlo en vez de suponerlo.',
      },
      {
        etiqueta: 'Extensión máxima',
        texto: 'No superar una página / 300 palabras en el informe final.',
      },
      {
        etiqueta: 'Evitar jerga estadística',
        texto:
          'No usar términos estadísticos avanzados (ej: desviación estándar, p-valor) salvo que se expliquen en una línea simple.',
      },
    ],
    'frases-obligatorias': [
      {
        etiqueta: 'Aclaración de fuente',
        texto: 'Tiene que aclarar al inicio de qué período y fuente son los datos analizados.',
      },
      {
        etiqueta: 'Nota de limitación',
        texto:
          "Tiene que incluir la frase: 'Este análisis se basa en los datos disponibles al momento y puede no reflejar variaciones posteriores'.",
      },
      {
        etiqueta: 'Recomendación final',
        texto:
          'Tiene que cerrar con una recomendación concreta de próximo paso, no solo con la descripción de los datos.',
      },
    ],
    razonamiento: [
      {
        etiqueta: 'Explicar el criterio de análisis',
        texto:
          'Antes de las conclusiones, explicá qué criterio usaste para identificar qué datos eran relevantes.',
      },
      {
        etiqueta: 'Mostrar el cálculo',
        texto: 'Para cada conclusión numérica, mostrá brevemente cómo se llegó a ese número.',
      },
      {
        etiqueta: 'Alternativas de interpretación',
        texto:
          'Mencioná si hay alguna otra forma de interpretar los mismos datos y por qué elegiste la interpretación que estás presentando.',
      },
    ],
  },
}

export function getSuggestionsFor(taskTypeId, componentId) {
  return suggestions[taskTypeId]?.[componentId] ?? []
}
