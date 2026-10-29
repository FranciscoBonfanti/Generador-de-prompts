import { useContratacionesContext } from '../../context/ContratacionesContext.jsx'
import { etapas, getTareasForEtapa } from '../../data/contrataciones/etapas.js'
import '../TaskTypeSelector.css'

export function EtapaTareaSelector() {
  const { state, setEtapaId, setTareaId } = useContratacionesContext()
  const tareasEtapa = getTareasForEtapa(state.etapaId)

  return (
    <section className="task-type-selector" aria-labelledby="etapa-tarea-title">
      <h2 id="etapa-tarea-title" className="gradient-bar gradient-bar__title task-type-selector__label">
        Etapa y tarea
      </h2>
      <div className="etapa-tarea__grid">
        <div className="etapa-tarea__field">
          <label htmlFor="etapa-select" className="etapa-tarea__label">
            Etapa
          </label>
          <select
            id="etapa-select"
            className="task-type-selector__select"
            value={state.etapaId}
            onChange={(event) => setEtapaId(event.target.value)}
          >
            {etapas.map((etapa) => (
              <option key={etapa.id} value={etapa.id}>
                {etapa.label}
              </option>
            ))}
          </select>
        </div>
        <div className="etapa-tarea__field">
          <label htmlFor="tarea-select" className="etapa-tarea__label">
            Tarea
          </label>
          <select
            id="tarea-select"
            className="task-type-selector__select"
            value={state.tareaId}
            onChange={(event) => setTareaId(event.target.value)}
          >
            {tareasEtapa.map((tarea) => (
              <option key={tarea.id} value={tarea.id}>
                {tarea.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="task-type-selector__hint">
        Podés cambiarlas cuando quieras: no se pierde lo que ya escribiste, solo se actualizan las
        sugerencias y las restricciones obligatorias de la etapa.
      </p>
    </section>
  )
}
