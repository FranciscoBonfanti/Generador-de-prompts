/**
 * Error con un mensaje pensado para mostrarle a la persona usuaria (ej.
 * "El PDF tiene más de 60 páginas."). El resto de los errores se responden
 * con un mensaje genérico, sin detalles internos.
 */
export function userError(message) {
  return Object.assign(new Error(message), { expose: true })
}
