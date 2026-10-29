import { Paperclip } from 'lucide-react'
import { useContratacionesContext } from '../../context/ContratacionesContext.jsx'
import { getDocumentosFor } from '../../data/contrataciones/documentos.js'
import { getTareaById } from '../../data/contrataciones/etapas.js'
import '../ComponentCard.css'

/** Checklist orientativo de documentos según la tarea elegida. */
export function DocumentacionCard() {
  const { state, toggleDocumento } = useContratacionesContext()
  const documentos = getDocumentosFor(state.tareaId)
  const checked = state.documentos[state.tareaId] ?? []

  return (
    <article className="component-card component-card--complement">
      <header className="component-card__header">
        <div className="component-card__title-group">
          <Paperclip className="component-card__icon" aria-hidden="true" size={20} />
          <h3 className="component-card__title">Documentación a adjuntar</h3>
        </div>
      </header>
      <p className="contrata-card__hint">
        Para «{getTareaById(state.tareaId).label}» conviene tener a mano lo siguiente. Lo que tildes se
        menciona en el prompt como documentación adjunta (acá no se sube nada).
      </p>
      <ul className="contrata-checklist">
        {documentos.map((documento) => {
          const inputId = `documento-${state.tareaId}-${documento.id}`
          return (
            <li key={documento.id}>
              <input
                id={inputId}
                type="checkbox"
                checked={checked.includes(documento.id)}
                onChange={() => toggleDocumento(state.tareaId, documento.id)}
              />
              <label htmlFor={inputId}>{documento.label}</label>
            </li>
          )
        })}
      </ul>
    </article>
  )
}
