/**
 * suggestions[taskTypeId][componentId] = array de exactamente 3 sugerencias
 * { etiqueta, texto }. `etiqueta` es el nombre corto que se muestra en el
 * botón/chip de cada alternativa; `texto` es lo que se carga en el textarea
 * al elegirla (editable después por la persona).
 *
 * Contenido completo (esenciales + complementarios) para: redaccion-textos,
 * atencion-cliente, analisis-datos.
 *
 * Contenido de esenciales (accion, rol, contexto, formato-salida,
 * restricciones) + tono para: generacion-codigo, resumen-documentos,
 * traduccion-textos, brainstorming-ideas, revision-correccion. Sus otros
 * complementarios (ejemplos, frases-obligatorias, razonamiento) quedan para
 * un paso posterior con el mismo nivel de detalle.
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
  'generacion-codigo': {
    accion: [
      {
        etiqueta: 'Escribir una función',
        texto:
          'Escribí una función en [lenguaje] que reciba [parámetros] y devuelva [resultado esperado].',
      },
      {
        etiqueta: 'Corregir un bug',
        texto:
          'Revisá este código y encontrá por qué [describir el error o comportamiento inesperado], corregilo y explicá qué cambiaste.',
      },
      {
        etiqueta: 'Explicar código existente',
        texto:
          'Explicame paso a paso qué hace este código, como si se lo tuvieras que enseñar a alguien que recién empieza a programar.',
      },
    ],
    rol: [
      {
        etiqueta: 'Desarrollador senior',
        texto:
          'Actuá como un desarrollador senior en [lenguaje/framework], que escribe código limpio, comentado solo donde hace falta y sigue buenas prácticas.',
      },
      {
        etiqueta: 'Revisor de código',
        texto:
          'Actuá como un revisor de código (code reviewer) exigente, que señala errores, riesgos de seguridad y oportunidades de simplificación.',
      },
      {
        etiqueta: 'Profesor de programación',
        texto:
          'Actuá como un profesor de programación que explica con paciencia, usando ejemplos simples antes de ir a los detalles técnicos.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Stack del proyecto',
        texto:
          'Este código forma parte de un proyecto hecho en [lenguaje/framework/versión], que sigue la convención [ej: nombres en inglés, arquitectura por capas].',
      },
      {
        etiqueta: 'Nivel de experiencia',
        texto:
          'Quien va a usar esto tiene un nivel [principiante/intermedio/avanzado] en programación, así que ajustá la explicación a ese nivel.',
      },
      {
        etiqueta: 'Restricciones técnicas',
        texto:
          'El código tiene que funcionar en [entorno, ej: Node 18, navegador sin librerías externas, versión anterior de Python].',
      },
    ],
    'formato-salida': [
      {
        etiqueta: 'Solo el código',
        texto: 'Como bloque de código, sin explicación adicional salvo que se pida.',
      },
      {
        etiqueta: 'Código + explicación',
        texto: 'Como bloque de código seguido de una explicación breve de la lógica, en viñetas.',
      },
      {
        etiqueta: 'Diff o cambios puntuales',
        texto:
          'Mostrando solo las líneas que cambian, indicando claramente qué se agregó y qué se sacó.',
      },
    ],
    tono: [
      {
        etiqueta: 'Técnico y directo',
        texto: 'Tono técnico y directo, sin explicaciones de más para quien ya sabe programar.',
      },
      {
        etiqueta: 'Didáctico',
        texto:
          'Tono didáctico, explicando el porqué de cada decisión como para alguien que está aprendiendo.',
      },
      {
        etiqueta: 'Conciso',
        texto: 'Tono conciso, priorizando la claridad del código por sobre comentarios largos.',
      },
    ],
    restricciones: [
      {
        etiqueta: 'Sin librerías externas',
        texto: 'No usar librerías externas, solo lo que viene en la instalación estándar de [lenguaje].',
      },
      {
        etiqueta: 'Compatibilidad de versión',
        texto:
          'El código tiene que ser compatible con [versión específica], sin usar funciones más nuevas que no estén soportadas.',
      },
      {
        etiqueta: 'Sin reescribir todo',
        texto: 'No reescribir funciones que no estén relacionadas con el problema, modificar solo lo necesario.',
      },
    ],
  },

  'resumen-documentos': {
    accion: [
      {
        etiqueta: 'Resumir un documento',
        texto: 'Resumí este documento en sus puntos más importantes, sin perder la información clave.',
      },
      {
        etiqueta: 'Extraer conclusiones',
        texto: 'Sacá las conclusiones principales de este texto y decime qué acción se desprende de cada una.',
      },
      {
        etiqueta: 'Simplificar un texto técnico',
        texto: 'Explicá este documento en términos simples, como para alguien que no conoce el tema.',
      },
    ],
    rol: [
      {
        etiqueta: 'Analista de contenido',
        texto:
          'Actuá como un analista que sabe separar lo importante de lo accesorio en documentos largos.',
      },
      {
        etiqueta: 'Editor de resúmenes ejecutivos',
        texto:
          'Actuá como un editor que arma resúmenes ejecutivos claros para gente que no tiene tiempo de leer el documento completo.',
      },
      {
        etiqueta: 'Asistente de estudio',
        texto:
          'Actuá como un asistente que ayuda a estudiar, resumiendo textos largos en ideas fáciles de recordar.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Tipo de documento',
        texto:
          'Este documento es [tipo: un informe, un contrato, un paper, un mail largo] de [tantas] páginas/palabras aproximadamente.',
      },
      {
        etiqueta: 'Para quién es el resumen',
        texto: 'El resumen es para [destinatario], que necesita entender lo esencial sin leer el documento completo.',
      },
      {
        etiqueta: 'Uso que se le va a dar',
        texto:
          'Este resumen se va a usar para [ej: tomar una decisión, presentar en una reunión, repasar para un examen].',
      },
    ],
    'formato-salida': [
      {
        etiqueta: 'Resumen en párrafo',
        texto: 'Como un párrafo único de no más de [X] líneas.',
      },
      {
        etiqueta: 'Lista de puntos clave',
        texto: 'Como una lista de viñetas con los puntos clave, cada uno en una oración.',
      },
      {
        etiqueta: 'Resumen + conclusión',
        texto: 'Como un resumen breve seguido de una conclusión o recomendación final.',
      },
    ],
    tono: [
      {
        etiqueta: 'Neutral y objetivo',
        texto: 'Tono neutral y objetivo, sin agregar opiniones que no estén en el documento original.',
      },
      {
        etiqueta: 'Claro y simple',
        texto: 'Tono claro y simple, evitando jerga o tecnicismos innecesarios.',
      },
      {
        etiqueta: 'Ejecutivo',
        texto: 'Tono ejecutivo, yendo directo a lo que importa para tomar una decisión.',
      },
    ],
    restricciones: [
      {
        etiqueta: 'Extensión máxima',
        texto: 'No superar las [X] palabras o líneas en el resumen.',
      },
      {
        etiqueta: 'No agregar interpretación propia',
        texto: 'No agregar opiniones ni conclusiones que no estén explícitas en el documento original.',
      },
      {
        etiqueta: 'Mantener términos clave',
        texto:
          'No traducir ni simplificar términos técnicos específicos que deban mantenerse tal cual.',
      },
    ],
  },

  'traduccion-textos': {
    accion: [
      {
        etiqueta: 'Traducir un texto',
        texto:
          'Traducí este texto de [idioma origen] a [idioma destino], manteniendo el sentido y el tono original.',
      },
      {
        etiqueta: 'Adaptar (localizar) un texto',
        texto:
          'Traducí y adaptá este texto para un público de [país/región], ajustando expresiones que no tengan sentido literal.',
      },
      {
        etiqueta: 'Revisar una traducción existente',
        texto:
          'Revisá esta traducción y corregí errores de sentido, gramática o naturalidad en el idioma destino.',
      },
    ],
    rol: [
      {
        etiqueta: 'Traductor profesional',
        texto:
          'Actuá como un traductor profesional especializado en [tipo de texto: legal, técnico, marketing, literario].',
      },
      {
        etiqueta: 'Editor bilingüe',
        texto:
          'Actuá como un editor bilingüe que cuida que la traducción suene natural, no como una traducción literal.',
      },
      {
        etiqueta: 'Especialista en localización',
        texto:
          'Actuá como especialista en localización, atento a modismos y diferencias culturales entre idiomas.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Público destinatario',
        texto: 'El texto traducido es para [describir destinatario], que habla [idioma destino] como lengua materna.',
      },
      {
        etiqueta: 'Registro del texto original',
        texto:
          'El texto original tiene un registro [formal/informal/técnico], que hay que conservar en la traducción.',
      },
      {
        etiqueta: 'Uso del texto',
        texto:
          'Esta traducción se va a usar para [ej: un sitio web, un contrato, un subtitulado], así que tiene que quedar lista para publicar.',
      },
    ],
    'formato-salida': [
      {
        etiqueta: 'Solo la traducción',
        texto: 'Como el texto traducido únicamente, sin notas ni comentarios adicionales.',
      },
      {
        etiqueta: 'Traducción + notas',
        texto: 'Como el texto traducido, seguido de notas breves sobre decisiones de traducción difíciles.',
      },
      {
        etiqueta: 'Formato espejo del original',
        texto: 'Respetando la misma estructura de párrafos y títulos que tiene el texto original.',
      },
    ],
    tono: [
      {
        etiqueta: 'Fiel al original',
        texto: 'Tono lo más fiel posible al original, conservando la formalidad o informalidad del texto de partida.',
      },
      {
        etiqueta: 'Natural en el idioma destino',
        texto:
          'Tono que suene natural para un hablante nativo del idioma destino, aunque haya que alejarse un poco de la traducción literal.',
      },
      {
        etiqueta: 'Técnico y preciso',
        texto: 'Tono técnico y preciso, priorizando la exactitud terminológica por sobre el estilo.',
      },
    ],
    restricciones: [
      {
        etiqueta: 'No traducir nombres propios',
        texto: 'No traducir nombres propios, marcas ni términos técnicos que deban quedar igual.',
      },
      {
        etiqueta: 'Extensión similar al original',
        texto: 'La traducción no debería quedar mucho más larga o más corta que el texto original.',
      },
      {
        etiqueta: 'Registro a mantener',
        texto: 'No cambiar el registro formal o informal del texto original al traducir.',
      },
    ],
  },

  'brainstorming-ideas': {
    accion: [
      {
        etiqueta: 'Generar ideas',
        texto: 'Generame [cantidad] ideas para [problema/campaña/proyecto], lo más variadas posible.',
      },
      {
        etiqueta: 'Proponer nombres o conceptos',
        texto:
          'Proponeme opciones de nombre/concepto para [producto/proyecto/campaña], con una breve explicación de cada una.',
      },
      {
        etiqueta: 'Desbloquear un problema',
        texto:
          'Ayudame a pensar distintos enfoques para resolver [problema concreto], incluso ideas poco convencionales.',
      },
    ],
    rol: [
      {
        etiqueta: 'Facilitador de brainstorming',
        texto:
          'Actuá como un facilitador de brainstorming, que propone ideas sin autocensurarse y las organiza después por potencial.',
      },
      {
        etiqueta: 'Estratega creativo',
        texto:
          'Actuá como un estratega creativo de agencia de publicidad, acostumbrado a pensar conceptos originales bajo presión de tiempo.',
      },
      {
        etiqueta: 'Compañero de equipo',
        texto:
          'Actuá como un compañero de equipo que piensa en voz alta, tirando ideas para después filtrarlas juntos.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Problema u objetivo',
        texto:
          'El objetivo es [describir problema u objetivo concreto], y hasta ahora se probó [qué se intentó, si aplica].',
      },
      {
        etiqueta: 'Restricciones del proyecto',
        texto: 'Las ideas tienen que poder ejecutarse con [presupuesto/tiempo/recursos disponibles].',
      },
      {
        etiqueta: 'Público o audiencia',
        texto:
          'Esto está pensado para [describir audiencia], así que las ideas tienen que resonarle a ese público en particular.',
      },
    ],
    'formato-salida': [
      {
        etiqueta: 'Lista numerada de ideas',
        texto: 'Como una lista numerada, cada idea en una o dos líneas.',
      },
      {
        etiqueta: 'Ideas agrupadas por enfoque',
        texto: 'Agrupando las ideas por tipo de enfoque (ej: bajo costo, alto impacto, innovador).',
      },
      {
        etiqueta: 'Idea + justificación breve',
        texto: 'Cada idea seguida de una justificación breve de por qué podría funcionar.',
      },
    ],
    tono: [
      {
        etiqueta: 'Creativo y sin filtro',
        texto:
          'Tono creativo y sin filtro, priorizando la cantidad y variedad de ideas por sobre lo prolijo de la redacción.',
      },
      {
        etiqueta: 'Entusiasta',
        texto: 'Tono entusiasta, que transmita ganas de probar cosas nuevas.',
      },
      {
        etiqueta: 'Pragmático',
        texto: 'Tono pragmático, enfocado en ideas que se puedan llevar a la práctica pronto.',
      },
    ],
    restricciones: [
      {
        etiqueta: 'Presupuesto o recursos',
        texto: 'Las ideas no pueden requerir un presupuesto mayor a [monto o recursos disponibles].',
      },
      {
        etiqueta: 'Temas a evitar',
        texto: 'No proponer ideas relacionadas con [tema a evitar], ya se descartó por [motivo].',
      },
      {
        etiqueta: 'Cantidad límite',
        texto: 'No dar más de [X] ideas, priorizando calidad por sobre cantidad.',
      },
    ],
  },

  'revision-correccion': {
    accion: [
      {
        etiqueta: 'Corregir errores',
        texto: 'Corregí los errores de ortografía, gramática y puntuación de este texto, sin cambiar el sentido.',
      },
      {
        etiqueta: 'Mejorar la redacción',
        texto:
          'Mejorá la redacción de este texto para que se lea más claro y fluido, conservando la idea original.',
      },
      {
        etiqueta: 'Adaptar el estilo',
        texto: 'Reescribí este texto para que tenga un estilo más [formal/informal/conciso], sin perder el contenido.',
      },
    ],
    rol: [
      {
        etiqueta: 'Corrector de estilo',
        texto: 'Actuá como un corrector de estilo profesional, que revisa gramática, claridad y consistencia.',
      },
      {
        etiqueta: 'Editor exigente',
        texto: 'Actuá como un editor exigente, que señala frases confusas o redundantes y las mejora.',
      },
      {
        etiqueta: 'Profesor de escritura',
        texto:
          'Actuá como un profesor de escritura, que corrige y además explica brevemente por qué hizo cada cambio.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Tipo de texto',
        texto: 'Este texto es [tipo: un mail, un ensayo, una publicación], escrito por alguien que no es especialista en redacción.',
      },
      {
        etiqueta: 'Nivel de cambios permitido',
        texto:
          'Se pueden hacer cambios de redacción, pero no modificar el sentido ni el orden de las ideas principales.',
      },
      {
        etiqueta: 'Público del texto final',
        texto:
          'El texto final va a ser leído por [describir destinatario], así que el nivel de formalidad tiene que ser acorde.',
      },
    ],
    'formato-salida': [
      {
        etiqueta: 'Texto corregido completo',
        texto: 'Como el texto completo ya corregido, listo para usar.',
      },
      {
        etiqueta: 'Texto + lista de cambios',
        texto: 'Como el texto corregido, seguido de una lista breve de los cambios más importantes que se hicieron.',
      },
      {
        etiqueta: 'Solo señalar errores',
        texto: 'Señalando los errores encontrados (sin reescribir), para que la persona los corrija ella misma.',
      },
    ],
    tono: [
      {
        etiqueta: 'Constructivo',
        texto: 'Tono constructivo, señalando los errores sin sonar duro ni desalentador.',
      },
      {
        etiqueta: 'Neutral y profesional',
        texto: 'Tono neutral y profesional, enfocado solo en la calidad del texto.',
      },
      {
        etiqueta: 'Claro y directo',
        texto: 'Tono claro y directo sobre qué cambiar y por qué, sin vueltas.',
      },
    ],
    restricciones: [
      {
        etiqueta: 'No cambiar el sentido',
        texto: 'No modificar el significado ni el orden de las ideas principales del texto.',
      },
      {
        etiqueta: 'Extensión similar',
        texto: 'El texto corregido no debería quedar mucho más largo que el original.',
      },
      {
        etiqueta: 'Mantener frases citadas',
        texto: 'No corregir frases que estén citadas textualmente entre comillas.',
      },
    ],
  },
}

export function getSuggestionsFor(taskTypeId, componentId) {
  return suggestions[taskTypeId]?.[componentId] ?? []
}
