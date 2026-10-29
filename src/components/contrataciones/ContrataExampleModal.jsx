import { X } from 'lucide-react'
import { getTareaById } from '../../data/contrataciones/etapas.js'
import { getContrataSuggestions } from '../../data/contrataciones/suggestions.js'
import { getContrataComponentDef } from '../../data/contrataciones/componentDefs.js'
import { formatContrataLines } from '../../utils/contratacionesFormatter.js'
import '../ExampleModal.css'

// Componentes que se muestran en el ejemplo (mismos que el ejemplo de
// referencia del documento base para "Checklist de admisibilidad").
const exampleComponents = ['rol', 'accion', 'contexto', 'formato-salida', 'restricciones']

/**
 * Ejemplo completo para la etapa y tarea elegidas, armado con la primera
 * sugerencia de cada componente: así el ejemplo usa exactamente el mismo
 * formato que genera la app.
 */
function buildExampleState(state) {
  const componentState = {}
  for (const id of Object.keys(state.componentState)) componentState[id] = { content: '', active: true }
  for (const id of exampleComponents) {
    componentState[id].content = getContrataSuggestions(state.tareaId, id)[0]?.texto ?? ''
  }
  componentState['frases-obligatorias'].content = getContrataComponentDef('frases-obligatorias').preset
  return {
    ...state,
    componentState,
    contexto: { objeto: '', organismo: '', presupuesto: '', modalidad: '' },
    documentos: {},
  }
}

export function ContrataExampleModal({ state, onClose }) {
  const tarea = getTareaById(state.tareaId)
  const example = formatContrataLines(buildExampleState(state))

  return (
    <div className="example-modal__backdrop" role="presentation" onClick={onClose}>
      <div
        className="example-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contrata-example-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="example-modal__header">
          <h2 id="contrata-example-title">Ejemplo completo — {tarea.label}</h2>
          <button type="button" className="example-modal__close" onClick={onClose} aria-label="Cerrar ejemplo">
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <pre className="example-modal__text">{example}</pre>
        <p className="example-modal__hint">
          Esto es solo una referencia, no reemplaza lo que ya estés escribiendo.
        </p>
      </div>
    </div>
  )
}
