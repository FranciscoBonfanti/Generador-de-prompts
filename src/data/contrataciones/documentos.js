/**
 * "Documentación a adjuntar": lista orientativa de lo que conviene tener a
 * mano para cada tarea. No se sube nada desde acá; lo que la persona tilda se
 * menciona en el prompt ("Documentación adjunta: ...") para que la IA sepa
 * con qué fuentes cuenta.
 */
export const documentosPorTarea = {
  'diagnostico-necesidad': [
    { id: 'nota-pedido', label: 'Nota de pedido o relevamiento del área requirente' },
    { id: 'informes-gestion', label: 'Informes de gestión o estadísticas del servicio' },
    { id: 'inventario', label: 'Inventario o estado de los bienes o servicios actuales' },
    { id: 'contratos-vinculados', label: 'Contratos anteriores vinculados' },
    { id: 'partida', label: 'Constancia de partida presupuestaria disponible' },
  ],
  'informe-justificativo': [
    { id: 'nota-pedido', label: 'Nota de pedido del área requirente' },
    { id: 'diagnostico', label: 'Diagnóstico de necesidad' },
    { id: 'estudio-mercado', label: 'Estudio de mercado o presupuestos de referencia' },
    { id: 'antecedentes', label: 'Antecedentes de contrataciones similares' },
    { id: 'normativa', label: 'Normativa aplicable' },
  ],
  'sintesis-contrato-anterior': [
    { id: 'contrato', label: 'Contrato anterior y sus adendas' },
    { id: 'pliego', label: 'Pliego que rigió esa contratación' },
    { id: 'actas-recepcion', label: 'Actas de recepción y certificados' },
    { id: 'notas', label: 'Notas o registros de incumplimientos' },
    { id: 'ordenes-compra', label: 'Órdenes de compra y facturación' },
  ],
  'revision-especificaciones': [
    { id: 'pet', label: 'Pliego de especificaciones técnicas (borrador)' },
    { id: 'informe-tecnico', label: 'Informe técnico del área requirente' },
    { id: 'estudio-mercado', label: 'Estudio de mercado' },
    { id: 'normas-tecnicas', label: 'Normas técnicas aplicables (IRAM, ISO, etc.)' },
    { id: 'pliegos-similares', label: 'Pliegos de contrataciones similares' },
  ],
  'estructura-pbcp': [
    { id: 'pbcg', label: 'Pliego de Bases y Condiciones Generales' },
    { id: 'pet', label: 'Pliego de especificaciones técnicas' },
    { id: 'normativa', label: 'Normativa aplicable (ley y decreto reglamentario)' },
    { id: 'pbcp-anterior', label: 'PBCP anteriores del organismo como modelo' },
    { id: 'dictamen', label: 'Dictamen jurídico previo, si existe' },
  ],
  'checklist-admisibilidad': [
    { id: 'pbcp', label: 'Pliego de Bases y Condiciones Particulares' },
    { id: 'ofertas', label: 'Ofertas presentadas por cada oferente' },
    { id: 'acta-apertura', label: 'Acta de apertura' },
    { id: 'registro-proveedores', label: 'Constancias de inscripción en el Registro de Proveedores' },
    { id: 'garantias', label: 'Garantías de mantenimiento de oferta' },
  ],
  'cuadro-comparativo': [
    { id: 'pbcp', label: 'PBCP (criterios de evaluación)' },
    { id: 'ofertas', label: 'Ofertas y planillas de cotización' },
    { id: 'acta-apertura', label: 'Acta de apertura' },
    { id: 'informe-tecnico', label: 'Informe técnico de evaluación' },
    { id: 'checklist', label: 'Checklist de admisibilidad' },
  ],
  'alertas-seguimiento': [
    { id: 'contrato', label: 'Contrato y adendas' },
    { id: 'pliego', label: 'Pliego que rige la contratación' },
    { id: 'cronograma', label: 'Cronograma de entregas o de obra' },
    { id: 'garantias', label: 'Garantías y pólizas vigentes' },
    { id: 'actas', label: 'Actas, remitos o certificados de avance' },
  ],
  otros: [
    { id: 'expediente', label: 'Expediente de la contratación' },
    { id: 'pliegos', label: 'Pliegos aplicables' },
    { id: 'normativa', label: 'Normativa vigente' },
    { id: 'especifica', label: 'Documentación específica del caso' },
  ],
}

export function getDocumentosFor(tareaId) {
  return documentosPorTarea[tareaId] ?? documentosPorTarea.otros
}
