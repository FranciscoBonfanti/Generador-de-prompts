/**
 * Panel "Antes de usar": checklist de auto-verificación. No bloquea nada,
 * es para que la persona se audite antes de copiar el prompt.
 */
// TODO: revisar con el cliente la lista completa del Anexo del curso
// (esta es una versión borrador, no el Anexo oficial).
export const antesDeUsarItems = [
  { id: 'anonimice', label: 'Anonimicé los datos sensibles (CUIT, DNI, correos, teléfonos, domicilios, razones sociales).' },
  { id: 'formato', label: 'Definí el formato de salida.' },
  { id: 'restricciones', label: 'Incluí las restricciones de la etapa.' },
  {
    id: 'sin-decisiones',
    label: 'Revisé que el pedido no le delegue a la IA una decisión (admitir, rechazar, adjudicar o sancionar).',
  },
  { id: 'documentos', label: 'Tengo a mano la documentación que voy a adjuntar.' },
  { id: 'validar', label: 'Voy a validar la respuesta y reemplazar los marcadores antes de usarla.' },
]
