import { X } from 'lucide-react'
import { getFullExampleFor } from '../data/fullExamples.js'
import { getTaskTypeById } from '../data/taskTypes.js'
import './ExampleModal.css'

export function ExampleModal({ taskTypeId, onClose }) {
  const example = getFullExampleFor(taskTypeId)
  const taskType = getTaskTypeById(taskTypeId)

  return (
    <div className="example-modal__backdrop" role="presentation" onClick={onClose}>
      <div
        className="example-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="example-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="example-modal__header">
          <h2 id="example-modal-title">Ejemplo completo — {taskType?.label}</h2>
          <button
            type="button"
            className="example-modal__close"
            onClick={onClose}
            aria-label="Cerrar ejemplo"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {example ? (
          <pre className="example-modal__text">{example}</pre>
        ) : (
          <p className="example-modal__empty">
            Todavía no hay un ejemplo cargado para este tipo de tarea.
          </p>
        )}

        <p className="example-modal__hint">
          Esto es solo una referencia, no reemplaza lo que ya estés escribiendo.
        </p>
      </div>
    </div>
  )
}
