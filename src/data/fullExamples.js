/**
 * fullExamples[taskTypeId] = prompt de ejemplo completo, ya armado, para
 * mostrar en el modal "Ver un ejemplo completo". Usa los mismos
 * encabezados que promptFormatter.js (Rol, Tarea, Contexto, etc.) para
 * que la persona vea el mismo formato que va a generar la app.
 *
 * Contenido completo para: redaccion-textos, atencion-cliente, analisis-datos.
 */
export const fullExamples = {
  'redaccion-textos': `Rol: Actuá como un especialista en comunicación institucional, que sabe transmitir información sensible de forma clara y sin generar alarma innecesaria.

Tarea: Redactá un comunicado interno para todo el personal, anunciando que a partir del próximo lunes cambia el horario de atención al público de 9 a 18 hs, explicando el motivo (reorganización interna) y desde cuándo aplica.

Contexto: Somos una empresa de servicios con 80 empleados. El cambio de horario ya fue aprobado por dirección y se comunicó verbalmente a los jefes de área, pero todavía no llegó formalmente a todo el personal.

Formato de salida: Como un mail, con saludo inicial, cuerpo dividido en párrafos cortos y firma al final.

Tono: Tono formal e institucional, cuidando que se note que representa a la empresa.

Restricciones: No superar las 150 palabras en total.

Frases que deben aparecer sí o sí: Tiene que terminar con la firma "Equipo de Recursos Humanos".`,

  'atencion-cliente': `Rol: Actuá como un agente de atención al cliente con experiencia, que sabe calmar situaciones tensas sin sonar a libreto armado.

Tarea: Redactá una respuesta a un cliente que se queja porque su pedido llegó con 5 días de retraso, reconociendo el problema y explicando el próximo paso.

Contexto: El cliente compró un producto el 3 de junio, debía llegar el 10 de junio y todavía no llegó. Es la primera vez que este cliente escribe por el tema. Podemos ofrecer envío gratis en su próxima compra, pero no un reembolso total.

Formato de salida: Como una respuesta de mail o chat, con saludo breve, explicación clara y cierre con el próximo paso.

Tono: Tono empático y paciente, como para alguien que ya está frustrado y necesita sentirse escuchado antes que nada.

Frases que deben aparecer sí o sí: Tiene que incluir una disculpa clara por la demora, y cerrar con "Equipo de Atención al Cliente".`,

  'analisis-datos': `Rol: Actuá como un analista de datos que sabe explicar números complejos en lenguaje simple, sin perder precisión.

Tarea: Analizá estos datos de ventas mensuales y armá un informe breve con las conclusiones principales, listo para presentar a la gerencia.

Contexto: Los datos corresponden a las ventas de los últimos 3 meses por categoría de producto. El objetivo es entender por qué bajaron las ventas de la categoría "Indumentaria" para poder decidir si conviene lanzar una promoción.

Formato de salida: Como un informe corto con secciones: Resumen, Hallazgos principales, Recomendación.

Tono: Tono ejecutivo, directo, pensado para alguien que decide rápido y no quiere rodeos.

Frases que deben aparecer sí o sí: Tiene que cerrar con una recomendación concreta de próximo paso, no solo con la descripción de los datos.`,
}

export function getFullExampleFor(taskTypeId) {
  return fullExamples[taskTypeId] ?? null
}
