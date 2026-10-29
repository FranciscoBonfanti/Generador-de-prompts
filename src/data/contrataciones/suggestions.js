/**
 * Sugerencias del modo Contrataciones: contrataSuggestions[tareaId][componentId]
 * = [{ etiqueta, texto }], mismo formato que src/data/suggestions.js.
 *
 * TODO: revisar con el cliente. Las sugerencias de Tarea deberían salir de
 * los prompts del curso; estas son una versión borrador redactada a partir
 * del documento base (incluye textual el ejemplo de "Checklist de
 * admisibilidad").
 *
 * Todo el contenido usa marcadores ([OBJETO], [OFERENTE 1], etc.): ningún
 * texto precargado debe disparar el aviso de datos sensibles.
 */

const rolAnalistaControl = {
  etiqueta: 'Analista de control y auditoría',
  texto:
    'Actuá como analista de control y auditoría en contrataciones públicas de la Provincia de Santa Fe.',
}

const rolAsistenteDocumental = {
  etiqueta: 'Asistente de control documental',
  texto:
    'Actuá como asistente de organización y control documental en materia de contrataciones públicas.',
}

// Las tres opciones de formato son siempre las mismas (tabla, informe
// numerado, planilla de verificación); cambia el contenido según la tarea.
function formatos(tabla, informe, planilla) {
  return [
    { etiqueta: 'Tabla con columnas definidas', texto: tabla },
    { etiqueta: 'Informe numerado', texto: informe },
    { etiqueta: 'Planilla de verificación', texto: planilla },
  ]
}

export const contrataSuggestions = {
  'diagnostico-necesidad': {
    rol: [
      {
        etiqueta: 'Analista de planificación de compras',
        texto:
          'Actuá como analista de planificación de compras y contrataciones del sector público provincial.',
      },
      rolAnalistaControl,
      rolAsistenteDocumental,
    ],
    accion: [
      {
        etiqueta: 'Diagnosticar la necesidad',
        texto:
          'A partir de la información aportada por el área requirente, elaborá un diagnóstico de la necesidad que origina la contratación, describiendo el problema a resolver y la situación actual.',
      },
      {
        etiqueta: 'Detectar información faltante',
        texto:
          'Analizá la información disponible sobre la necesidad planteada e identificá qué datos faltan para poder fundamentarla.',
      },
      {
        etiqueta: 'Ordenar antecedentes',
        texto:
          'Ordená cronológicamente los antecedentes de la necesidad (pedidos, informes y contrataciones previas) y señalá qué surge de cada documento.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Pedido del área requirente',
        texto:
          'El área [ÁREA REQUIRENTE] solicitó la contratación de [OBJETO] por [MOTIVO DEL PEDIDO]. Se adjunta la nota de pedido y el relevamiento realizado.',
      },
      {
        etiqueta: 'Contrato vigente por vencer',
        texto:
          'El contrato vigente de [OBJETO] vence en [FECHA] y no admite nuevas prórrogas. Se necesita evaluar si la necesidad persiste y en qué condiciones.',
      },
      {
        etiqueta: 'Necesidad nueva',
        texto:
          'Es la primera vez que el organismo necesita [OBJETO]; no hay contrataciones anteriores que sirvan de referencia.',
      },
    ],
    'formato-salida': formatos(
      'Tabla con columnas: aspecto de la necesidad, información disponible, fuente documental y dato faltante.',
      'Informe numerado con: 1. Necesidad identificada, 2. Situación actual, 3. Áreas o población afectadas, 4. Consecuencias de no atenderla, 5. Información faltante y preguntas críticas.',
      'Planilla de verificación con los elementos mínimos de un diagnóstico de necesidad, marcando para cada uno PRESENTE / AUSENTE / A VERIFICAR.',
    ),
    restricciones: [
      {
        etiqueta: 'No estimar cantidades sin respaldo',
        texto: 'No estimes cantidades ni montos que no surjan de la documentación aportada.',
      },
      {
        etiqueta: 'Citar la fuente',
        texto: 'Para cada afirmación, indicá el documento del que surge.',
      },
      {
        etiqueta: 'No proponer proveedores',
        texto: 'No menciones ni sugieras proveedores, marcas o empresas.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Ejemplo: diagnóstico numerado',
        texto: `1. Necesidad identificada: [COMPLETAR descripción del problema a resolver].
2. Situación actual: según la información disponible, el servicio se presta con [COMPLETAR] [VERIFICAR en el relevamiento del área].
3. Áreas o población afectadas: [DATO NO DISPONIBLE].
4. Consecuencias de no atender la necesidad: [COMPLETAR].
5. Preguntas críticas sin responder: ¿Desde cuándo existe la necesidad? ¿Hay registros de reclamos o fallas? [VERIFICAR]`,
      },
    ],
  },

  'informe-justificativo': {
    rol: [
      {
        etiqueta: 'Redactor técnico-administrativo',
        texto:
          'Actuá como redactor técnico-administrativo con experiencia en informes de contrataciones públicas de la Provincia de Santa Fe.',
      },
      rolAnalistaControl,
      rolAsistenteDocumental,
    ],
    accion: [
      {
        etiqueta: 'Redactar el informe justificativo',
        texto:
          'Redactá un borrador de informe justificativo de la necesidad de contratar [OBJETO], con base exclusivamente en la documentación aportada.',
      },
      {
        etiqueta: 'Revisar un informe existente',
        texto:
          'Revisá el borrador de informe justificativo adjunto e identificá afirmaciones sin respaldo documental, omisiones e inconsistencias.',
      },
      {
        etiqueta: 'Estructurar los fundamentos',
        texto:
          'Organizá los fundamentos de la necesidad en una estructura de informe, sin agregar información que no esté en los documentos.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Con diagnóstico previo',
        texto:
          'Se cuenta con el diagnóstico de necesidad elaborado por [ÁREA REQUIRENTE] y con presupuestos de referencia. El informe se incorporará al expediente.',
      },
      {
        etiqueta: 'Renovación de servicio',
        texto:
          'Se trata de la renovación de un servicio de [OBJETO] que el organismo contrata desde hace [COMPLETAR] años.',
      },
      {
        etiqueta: 'Necesidad urgente',
        texto:
          'El área requirente plantea que la necesidad es urgente por [MOTIVO]. Hay que fundamentar la urgencia solo con lo que surja de la documentación.',
      },
    ],
    'formato-salida': formatos(
      'Tabla con columnas: fundamento, documento de respaldo y observación.',
      'Informe numerado con: I. Objeto, II. Antecedentes, III. Fundamentación de la necesidad, IV. Estimación de cantidades y plazos, V. Documentación de respaldo.',
      'Planilla de verificación de los apartados mínimos del informe justificativo, marcando COMPLETO / INCOMPLETO / A VERIFICAR.',
    ),
    restricciones: [
      {
        etiqueta: 'Sin fundamentos inventados',
        texto: 'No agregues fundamentos que no surjan de la documentación aportada.',
      },
      {
        etiqueta: 'Señalar faltantes',
        texto: 'Si un apartado no puede completarse con la información disponible, marcalo con [COMPLETAR].',
      },
      {
        etiqueta: 'Sin conclusiones jurídicas',
        texto: 'No emitas conclusiones sobre la procedencia jurídica de la contratación.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Ejemplo: informe justificativo',
        texto: `INFORME JUSTIFICATIVO DE NECESIDAD
I. Objeto: [OBJETO].
II. Antecedentes: según la nota del área requirente, [COMPLETAR].
III. Fundamentación de la necesidad: [COMPLETAR] (surge del diagnóstico adjunto, punto [VERIFICAR]).
IV. Estimación de cantidades y plazos: [DATO NO DISPONIBLE].
V. Documentación de respaldo: nota de pedido, diagnóstico de necesidad, presupuestos de referencia [VERIFICAR].`,
      },
    ],
  },

  'sintesis-contrato-anterior': {
    rol: [
      {
        etiqueta: 'Analista de ejecución contractual',
        texto:
          'Actuá como analista de ejecución contractual en el ámbito de las contrataciones públicas provinciales.',
      },
      rolAnalistaControl,
      rolAsistenteDocumental,
    ],
    accion: [
      {
        etiqueta: 'Sintetizar el contrato anterior',
        texto:
          'Elaborá una síntesis del contrato anterior de [OBJETO]: objeto, plazo, monto, prórrogas, modificaciones e incumplimientos registrados.',
      },
      {
        etiqueta: 'Extraer lecciones aprendidas',
        texto:
          'A partir del contrato anterior y su ejecución, identificá los problemas registrados que conviene tener en cuenta en la nueva contratación.',
      },
      {
        etiqueta: 'Comparar con el nuevo pedido',
        texto:
          'Compará las condiciones del contrato anterior con el nuevo pedido del área requirente y señalá las diferencias.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Contrato próximo a vencer',
        texto:
          'El contrato de [OBJETO] vence en [FECHA]. Se adjuntan el contrato, sus adendas y las actas de recepción.',
      },
      {
        etiqueta: 'Ejecución con problemas',
        texto:
          'Durante la ejecución del contrato anterior hubo [COMPLETAR: demoras, entregas parciales, reclamos]. Se adjuntan las notas intercambiadas.',
      },
      {
        etiqueta: 'Planificación del nuevo proceso',
        texto:
          'La síntesis se usará como insumo para planificar una nueva contratación de [OBJETO] para [ORGANISMO].',
      },
    ],
    'formato-salida': formatos(
      'Tabla con columnas: aspecto, contrato anterior, fuente documental y observación.',
      'Informe numerado con: 1. Datos generales del contrato, 2. Ejecución, 3. Modificaciones y prórrogas, 4. Incumplimientos registrados, 5. Aspectos a considerar en la nueva contratación.',
      'Planilla de verificación de la documentación del contrato anterior, marcando DISPONIBLE / FALTANTE / A VERIFICAR.',
    ),
    restricciones: [
      {
        etiqueta: 'No calificar el desempeño',
        texto: 'No califiques el desempeño del contratista; describí solo hechos documentados.',
      },
      {
        etiqueta: 'Citar cláusulas',
        texto: 'Indicá la cláusula o el documento del que surge cada dato.',
      },
      {
        etiqueta: 'No recomendar al proveedor',
        texto: 'No recomiendes volver a contratar ni excluir al proveedor anterior.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Ejemplo: síntesis en tabla',
        texto: `| Aspecto | Contrato anterior | Fuente | Observación |
| Objeto | [OBJETO] | Contrato, cláusula primera | — |
| Plazo de ejecución | [COMPLETAR] | Contrato, cláusula [COMPLETAR] | Se registró una prórroga [VERIFICAR] |
| Monto adjudicado | [DATO NO DISPONIBLE] | — | No surge de la documentación aportada |
| Incumplimientos registrados | Demoras en entregas [VERIFICAR] | Actas de recepción | [COMPLETAR] |
Aspectos a considerar en la nueva contratación: [COMPLETAR].`,
      },
    ],
  },

  'revision-especificaciones': {
    rol: [
      {
        etiqueta: 'Revisor de especificaciones técnicas',
        texto:
          'Actuá como revisor de especificaciones técnicas de pliegos de contrataciones públicas, con foco en la concurrencia y la igualdad entre oferentes.',
      },
      rolAnalistaControl,
      rolAsistenteDocumental,
    ],
    accion: [
      {
        etiqueta: 'Detectar direccionamiento técnico',
        texto:
          'Revisá las especificaciones técnicas adjuntas e identificá requisitos que puedan implicar direccionamiento hacia una marca, un producto o un proveedor.',
      },
      {
        etiqueta: 'Detectar ambigüedades',
        texto:
          'Revisá las especificaciones técnicas e identificá requisitos ambiguos, incompletos o que no puedan verificarse objetivamente.',
      },
      {
        etiqueta: 'Contrastar con la necesidad',
        texto:
          'Contrastá las especificaciones técnicas con el diagnóstico de necesidad y señalá requisitos que no tengan justificación en él.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Borrador de pliego técnico',
        texto:
          'Se adjunta el borrador del pliego de especificaciones técnicas para la contratación de [OBJETO], elaborado por [ÁREA TÉCNICA].',
      },
      {
        etiqueta: 'Observaciones previas',
        texto:
          'En un proceso anterior de [OBJETO] se recibieron observaciones por requisitos restrictivos. Se busca evitar que se repitan.',
      },
      {
        etiqueta: 'Mercado acotado',
        texto:
          'Según el área técnica, hay pocos proveedores en el mercado de [OBJETO]. Se necesita revisar que las especificaciones no reduzcan aún más la concurrencia.',
      },
    ],
    'formato-salida': formatos(
      'Tabla con columnas: especificación, riesgo detectado, fundamento y redacción alternativa sugerida.',
      'Informe numerado con: 1. Especificaciones revisadas, 2. Riesgos de direccionamiento, 3. Ambigüedades, 4. Propuestas de redacción alternativa, 5. Preguntas para el área técnica.',
      'Planilla de verificación por especificación, marcando ADECUADA / A REVISAR / A VERIFICAR CON EL ÁREA TÉCNICA.',
    ),
    restricciones: [
      {
        etiqueta: 'No mencionar marcas',
        texto: 'No propongas marcas, modelos ni proveedores en las redacciones alternativas.',
      },
      {
        etiqueta: 'Fundamentar cada riesgo',
        texto: 'Para cada riesgo, indicá la especificación textual en la que se basa.',
      },
      {
        etiqueta: 'No reescribir el pliego',
        texto: 'No reescribas el pliego completo; limitate a las especificaciones observadas.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Ejemplo: tabla de direccionamiento técnico',
        texto: `| Especificación | Riesgo detectado | Fundamento | Redacción alternativa sugerida |
| "Marca [MARCA], modelo [MODELO] o superior" | Posible direccionamiento: menciona una marca | Describe un producto en lugar de prestaciones [VERIFICAR normativa aplicable] | "Equipo con prestaciones equivalentes a: [COMPLETAR características]" |
| "Garantía mínima de 36 meses" | Requisito que podría limitar la concurrencia | [DATO NO DISPONIBLE]: no surge del expediente la justificación del plazo | Consignar la justificación técnica o revisar el plazo |`,
      },
    ],
  },

  'estructura-pbcp': {
    rol: [
      {
        etiqueta: 'Asistente de redacción de pliegos',
        texto:
          'Actuá como asistente de redacción de pliegos de bases y condiciones particulares para contrataciones públicas de la Provincia de Santa Fe.',
      },
      rolAnalistaControl,
      rolAsistenteDocumental,
    ],
    accion: [
      {
        etiqueta: 'Proponer la estructura del PBCP',
        texto:
          'Proponé la estructura inicial (índice comentado) de un Pliego de Bases y Condiciones Particulares para la contratación de [OBJETO].',
      },
      {
        etiqueta: 'Verificar apartados mínimos',
        texto:
          'Revisá el borrador de PBCP adjunto e indicá qué apartados mínimos faltan o están incompletos.',
      },
      {
        etiqueta: 'Armar lista de definiciones pendientes',
        texto:
          'A partir del borrador de PBCP, listá las definiciones que debe tomar el área responsable antes de completarlo.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Pliego general vigente',
        texto:
          'Rige el Pliego de Bases y Condiciones Generales vigente para el organismo. Se adjuntan el pliego de especificaciones técnicas y un PBCP anterior como modelo.',
      },
      {
        etiqueta: 'Primera contratación del objeto',
        texto:
          'Es la primera contratación de [OBJETO] en [ORGANISMO]; no hay pliegos anteriores del organismo para tomar como modelo.',
      },
      {
        etiqueta: 'Contratación con entregas parciales',
        texto:
          'La contratación de [OBJETO] prevé entregas parciales durante [COMPLETAR] meses.',
      },
    ],
    'formato-salida': formatos(
      'Tabla con columnas: apartado del PBCP, contenido mínimo, documento fuente y definición pendiente.',
      'Informe numerado con un índice comentado del PBCP: un apartado por punto, con su contenido mínimo y los datos a completar.',
      'Planilla de verificación de apartados del PBCP, marcando INCLUIDO / FALTANTE / A DEFINIR.',
    ),
    restricciones: [
      {
        etiqueta: 'Sin cláusulas nuevas',
        texto: 'No agregues requisitos ni cláusulas que no estén en la documentación aportada; marcá lo faltante con [COMPLETAR].',
      },
      {
        etiqueta: 'Respetar el pliego general',
        texto: 'No contradigas el Pliego de Bases y Condiciones Generales; si detectás una contradicción, señalala.',
      },
      {
        etiqueta: 'Sin criterios de evaluación propios',
        texto: 'No definas criterios de evaluación ni ponderaciones: indicá que deben ser definidos por el área responsable.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Ejemplo: índice comentado del PBCP',
        texto: `1. Objeto de la contratación: [OBJETO].
2. Normativa aplicable: [VERIFICAR normativa vigente].
3. Modalidad y tipo de procedimiento: [COMPLETAR].
4. Requisitos de admisibilidad de las ofertas: [COMPLETAR según pliego general].
5. Criterios de evaluación: [COMPLETAR, a definir por el área responsable].
6. Garantías: [VERIFICAR montos y formas admitidas].
7. Plazo y lugar de entrega: [COMPLETAR].
8. Forma de pago: [COMPLETAR].
9. Penalidades: [VERIFICAR régimen aplicable].`,
      },
    ],
  },

  'checklist-admisibilidad': {
    rol: [
      rolAsistenteDocumental,
      rolAnalistaControl,
      {
        etiqueta: 'Apoyo a la comisión evaluadora',
        texto:
          'Actuá como asistente técnico de apoyo a una comisión evaluadora de ofertas en contrataciones públicas.',
      },
    ],
    accion: [
      {
        etiqueta: 'Elaborar la matriz de verificación',
        texto:
          'A partir de los requisitos formales del Pliego y de la documentación presentada por cada oferente, elaborá una matriz de verificación.',
      },
      {
        etiqueta: 'Listar documentación faltante',
        texto:
          'Identificá, para cada oferente, la documentación exigida por el Pliego que no fue presentada o está incompleta.',
      },
      {
        etiqueta: 'Detectar inconsistencias',
        texto:
          'Detectá inconsistencias entre la documentación presentada por cada oferente y los requisitos formales del Pliego.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Oferentes identificados',
        texto:
          'Contratación de [OBJETO] tramitada por [ORGANISMO]. Oferentes identificados como [OFERENTE 1], [OFERENTE 2].',
      },
      {
        etiqueta: 'Acta de apertura disponible',
        texto:
          'Se adjunta el acta de apertura con el detalle de la documentación presentada por cada oferente.',
      },
      {
        etiqueta: 'Requisitos del pliego',
        texto:
          'Los requisitos formales de admisibilidad están en el artículo [COMPLETAR] del Pliego de Bases y Condiciones Particulares.',
      },
    ],
    'formato-salida': formatos(
      'Tabla con requisito, oferente y estado (CUMPLE / NO SE ACREDITA / A VERIFICAR), seguida de documentación faltante e inconsistencias.',
      'Informe numerado por oferente: 1. Requisitos acreditados, 2. Requisitos no acreditados, 3. Requisitos a verificar, 4. Inconsistencias detectadas.',
      'Planilla de verificación con una fila por requisito del pliego y una columna por oferente, con los estados CUMPLE / NO SE ACREDITA / A VERIFICAR.',
    ),
    restricciones: [
      {
        etiqueta: 'Indicar requisito y documento',
        texto: 'Para cada observación, indicá el requisito del pliego y el documento en que se basa.',
      },
      {
        etiqueta: 'No interpretar requisitos',
        texto: 'Si un requisito admite más de una interpretación, señalalo como A VERIFICAR en vez de resolverlo.',
      },
      {
        etiqueta: 'Sin juicios de valor',
        texto: 'No uses calificativos sobre los oferentes; describí solo el estado de cada requisito.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Ejemplo: matriz de verificación',
        texto: `| Requisito del pliego | [OFERENTE 1] | [OFERENTE 2] |
| Garantía de mantenimiento de oferta (art. [COMPLETAR]) | CUMPLE (folio [COMPLETAR]) | NO SE ACREDITA |
| Constancia de inscripción en el Registro de Proveedores | A VERIFICAR | CUMPLE |
Documentación faltante: [OFERENTE 2] — garantía de mantenimiento de oferta.
Inconsistencias: [VERIFICAR] vigencia del poder del firmante de [OFERENTE 1].`,
      },
    ],
  },

  'cuadro-comparativo': {
    rol: [
      {
        etiqueta: 'Asistente de evaluación de ofertas',
        texto:
          'Actuá como asistente técnico de evaluación de ofertas en contrataciones públicas, que organiza la información sin emitir conclusiones.',
      },
      rolAnalistaControl,
      rolAsistenteDocumental,
    ],
    accion: [
      {
        etiqueta: 'Armar el cuadro comparativo',
        texto:
          'Elaborá un cuadro comparativo de las ofertas presentadas según los criterios de evaluación definidos en el Pliego.',
      },
      {
        etiqueta: 'Normalizar cotizaciones',
        texto:
          'Ordená las cotizaciones de cada oferente por renglón, en la misma unidad de medida, señalando las que no sean comparables.',
      },
      {
        etiqueta: 'Señalar diferencias',
        texto:
          'Identificá las diferencias entre las ofertas respecto de cada criterio del Pliego, sin ordenarlas ni calificarlas.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Ofertas admitidas',
        texto:
          'Contratación de [OBJETO] tramitada por [ORGANISMO]. Se comparan las ofertas de [OFERENTE 1], [OFERENTE 2] y [OFERENTE 3].',
      },
      {
        etiqueta: 'Criterios del pliego',
        texto:
          'Los criterios de evaluación y su ponderación están en el artículo [COMPLETAR] del PBCP.',
      },
      {
        etiqueta: 'Cotización por renglones',
        texto:
          'La contratación tiene [COMPLETAR] renglones y los oferentes pueden cotizar en forma parcial.',
      },
    ],
    'formato-salida': formatos(
      'Tabla con una fila por criterio del pliego, una columna por oferente y una columna de fuente documental.',
      'Informe numerado con: 1. Criterios del pliego, 2. Datos de cada oferta por criterio, 3. Datos faltantes o no comparables, 4. Preguntas para la comisión evaluadora.',
      'Planilla de verificación de la información necesaria para comparar, marcando DISPONIBLE / FALTANTE / A VERIFICAR por oferente.',
    ),
    restricciones: [
      {
        etiqueta: 'No ordenar ofertas',
        texto: 'No ordenes las ofertas de mejor a peor ni asignes puntajes que no surjan del pliego.',
      },
      {
        etiqueta: 'Citar la oferta',
        texto: 'Para cada dato, indicá la parte de la oferta de la que surge.',
      },
      {
        etiqueta: 'Señalar lo no comparable',
        texto: 'Si dos datos no son comparables (unidades o condiciones distintas), señalalo en vez de convertirlos.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Ejemplo: cuadro comparativo',
        texto: `| Criterio del pliego | [OFERENTE 1] | [OFERENTE 2] | [OFERENTE 3] | Fuente |
| Precio total ofertado | [COMPLETAR] | [COMPLETAR] | [COMPLETAR] | Planilla de cotización |
| Plazo de entrega | 30 días | 45 días | [DATO NO DISPONIBLE] | Oferta, punto [COMPLETAR] |
| Cumplimiento de especificaciones | A VERIFICAR | CUMPLE | CUMPLE | Informe técnico |
Observaciones: diferencias de forma entre las ofertas, sin conclusión sobre cuál es la mejor.`,
      },
    ],
  },

  'alertas-seguimiento': {
    rol: [
      {
        etiqueta: 'Analista de seguimiento contractual',
        texto:
          'Actuá como analista de seguimiento de contratos en el sector público, con foco en plazos, entregas y garantías.',
      },
      rolAnalistaControl,
      rolAsistenteDocumental,
    ],
    accion: [
      {
        etiqueta: 'Armar tablero de alertas',
        texto:
          'A partir del contrato y su documentación de ejecución, identificá las obligaciones con plazo y generá alertas de seguimiento por vencimiento o incumplimiento.',
      },
      {
        etiqueta: 'Detectar incumplimientos',
        texto:
          'Contrastá las obligaciones del contrato con las actas, remitos y certificados adjuntos e identificá posibles incumplimientos.',
      },
      {
        etiqueta: 'Calendario de vencimientos',
        texto:
          'Elaborá un calendario de vencimientos del contrato: entregas, garantías, pólizas y certificaciones.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Contrato en ejecución',
        texto:
          'Contrato de [OBJETO] en ejecución desde [FECHA], con entregas parciales y una garantía de cumplimiento vigente hasta [FECHA].',
      },
      {
        etiqueta: 'Demoras reportadas',
        texto:
          'El área receptora informó demoras en las últimas entregas. Se adjuntan los remitos y las notas intercambiadas.',
      },
      {
        etiqueta: 'Contrato con adendas',
        texto:
          'El contrato tuvo [COMPLETAR] adendas que modificaron plazos y cantidades; se adjuntan todas.',
      },
    ],
    'formato-salida': formatos(
      'Tabla con columnas: obligación contractual, cláusula, fecha límite, estado y nivel de alerta (ALTA / MEDIA / A VERIFICAR).',
      'Informe numerado con: 1. Obligaciones vencidas, 2. Obligaciones próximas a vencer, 3. Posibles incumplimientos, 4. Información faltante.',
      'Planilla de verificación de obligaciones contractuales, marcando CUMPLIDA / PENDIENTE / VENCIDA / A VERIFICAR.',
    ),
    restricciones: [
      {
        etiqueta: 'Citar la cláusula',
        texto: 'Para cada alerta, indicá la cláusula del contrato y el documento de ejecución en que se basa.',
      },
      {
        etiqueta: 'No calificar incumplimientos',
        texto: 'No califiques la gravedad jurídica de los incumplimientos; describí solo los hechos documentados.',
      },
      {
        etiqueta: 'Fechas solo documentadas',
        texto: 'No calcules fechas que no puedan deducirse de la documentación; marcalas con [VERIFICAR].',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Ejemplo: tabla de alertas',
        texto: `| Obligación contractual | Cláusula | Fecha límite | Estado | Alerta |
| Presentación de póliza de seguro | [COMPLETAR] | [COMPLETAR] | Vencida [VERIFICAR] | ALTA |
| Entrega parcial N° 2 | [COMPLETAR] | [COMPLETAR] | Pendiente | MEDIA |
| Renovación de garantía de cumplimiento | [COMPLETAR] | [DATO NO DISPONIBLE] | Sin información | A VERIFICAR |`,
      },
    ],
  },

  otros: {
    rol: [rolAnalistaControl, rolAsistenteDocumental, {
      etiqueta: 'Redactor técnico-administrativo',
      texto: 'Actuá como redactor técnico-administrativo especializado en contrataciones públicas.',
    }],
    accion: [
      {
        etiqueta: 'Analizar documentación',
        texto:
          'Analizá la documentación adjunta de la contratación y separá hechos verificados, observaciones, riesgos o inconsistencias y recomendaciones.',
      },
      {
        etiqueta: 'Redactar un borrador',
        texto: 'Redactá un borrador de [TIPO DE DOCUMENTO: nota, circular, acta] sobre [TEMA], con base en la documentación aportada.',
      },
      {
        etiqueta: 'Resumir un expediente',
        texto: 'Resumí el estado del expediente adjunto: actuaciones realizadas, pendientes y plazos en curso.',
      },
    ],
    contexto: [
      {
        etiqueta: 'Datos de la contratación',
        texto: 'Contratación de [OBJETO] tramitada por [ORGANISMO], actualmente en la etapa de [ETAPA].',
      },
      {
        etiqueta: 'Documentación adjunta',
        texto: 'Se adjunta [COMPLETAR: documentos]. No hay otra información disponible.',
      },
      {
        etiqueta: 'Destino del resultado',
        texto: 'El resultado se incorporará como borrador al expediente, para revisión del área responsable.',
      },
    ],
    'formato-salida': formatos(
      'Tabla con columnas definidas: [COMPLETAR columnas], más una columna de fuente documental.',
      'Informe numerado con: 1. Hechos verificados, 2. Observaciones, 3. Riesgos o inconsistencias detectadas, 4. Recomendaciones.',
      'Planilla de verificación con los puntos a controlar, marcando CUMPLE / NO CUMPLE / A VERIFICAR.',
    ),
    restricciones: [
      {
        etiqueta: 'Sin información inventada',
        texto: 'No agregues información que no surja de la documentación aportada.',
      },
      {
        etiqueta: 'Citar la fuente',
        texto: 'Indicá el documento o apartado del que surge cada afirmación.',
      },
      {
        etiqueta: 'Sin decisiones',
        texto: 'No emitas decisiones administrativas ni conclusiones jurídicas.',
      },
    ],
    ejemplos: [
      {
        etiqueta: 'Ejemplo: informe en cuatro apartados',
        texto: `1. Hechos verificados: según el acta de [COMPLETAR], [COMPLETAR].
2. Observaciones: [COMPLETAR].
3. Riesgos o inconsistencias detectadas: el plazo indicado en [DOCUMENTO A] no coincide con el de [DOCUMENTO B] [VERIFICAR].
4. Recomendaciones (como propuestas de mejora): [COMPLETAR].`,
      },
    ],
  },
}

// Componentes con las mismas sugerencias para todas las tareas.
const sharedSuggestions = {
  audiencia: [
    { etiqueta: 'Comisión evaluadora', texto: 'El resultado lo va a leer la comisión evaluadora de ofertas.' },
    {
      etiqueta: 'Área jurídica',
      texto: 'El resultado es un insumo para el área de asuntos jurídicos, que va a revisarlo antes de dictaminar.',
    },
    {
      etiqueta: 'Área requirente',
      texto: 'El resultado lo va a leer el área requirente, que no necesariamente maneja términos técnicos de contrataciones.',
    },
  ],
  objetivo: [
    {
      etiqueta: 'Insumo para el expediente',
      texto: 'El objetivo es contar con un borrador ordenado para incorporar al expediente, previa revisión.',
    },
    {
      etiqueta: 'Detectar faltantes a tiempo',
      texto: 'El objetivo es detectar faltantes e inconsistencias antes de avanzar a la siguiente etapa del procedimiento.',
    },
    {
      etiqueta: 'Preparar una reunión',
      texto: 'El objetivo es preparar la reunión de trabajo del equipo con los puntos que requieren definición.',
    },
  ],
  tono: [
    { etiqueta: 'Técnico-administrativo', texto: 'Formal, técnico-administrativo, impersonal.' },
    {
      etiqueta: 'Claro para no especialistas',
      texto: 'Formal e impersonal, pero claro para personas que no son especialistas en contrataciones.',
    },
    { etiqueta: 'Sintético', texto: 'Formal, impersonal y sintético: frases cortas, sin redundancias.' },
  ],
  'frases-obligatorias': [
    {
      etiqueta: 'Marcadores del curso',
      texto:
        'Usá [COMPLETAR], [VERIFICAR] y [DATO NO DISPONIBLE] cuando corresponda. Identificá las preguntas críticas sin responder.',
    },
    {
      etiqueta: 'Expresiones de incertidumbre',
      texto:
        'Cuando no puedas confirmar un dato, usá "No es posible confirmarlo con la documentación aportada."',
    },
    {
      etiqueta: 'Cierre con preguntas',
      texto: 'Terminá con una sección "Preguntas críticas sin responder", ordenadas por prioridad.',
    },
  ],
  razonamiento: [
    {
      etiqueta: 'Verificar suficiencia',
      texto:
        'Antes de redactar, verificá si la información es suficiente; si falta algo, formulá preguntas priorizadas. Diferenciá hechos de inferencias.',
    },
    {
      etiqueta: 'Explicitar supuestos',
      texto: 'Si tenés que asumir algo para avanzar, explicitá el supuesto y marcalo con [VERIFICAR].',
    },
    {
      etiqueta: 'Señalar contradicciones',
      texto: 'Si dos documentos se contradicen, señalalo y no intentes conciliarlos.',
    },
  ],
}

export function getContrataSuggestions(tareaId, componentId) {
  return contrataSuggestions[tareaId]?.[componentId] ?? sharedSuggestions[componentId] ?? []
}
