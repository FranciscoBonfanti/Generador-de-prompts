import { taskTypes } from '../data/taskTypes.js'
import { usePromptContext } from '../context/PromptContext.jsx'
import './TaskTypeSelector.css'

export function TaskTypeSelector() {
  const { state, setTaskTypeId } = usePromptContext()

  return (
    <section className="task-type-selector" aria-labelledby="task-type-selector-label">
      <label
        id="task-type-selector-label"
        htmlFor="task-type-select"
        className="task-type-selector__label gradient-bar"
      >
        Tipo de tarea
      </label>
      <select
        id="task-type-select"
        className="task-type-selector__select"
        value={state.taskTypeId}
        onChange={(event) => setTaskTypeId(event.target.value)}
      >
        {taskTypes.map((taskType) => (
          <option key={taskType.id} value={taskType.id}>
            {taskType.label}
          </option>
        ))}
      </select>
      <p className="task-type-selector__hint">
        Podés cambiarlo cuando quieras: no se pierde lo que ya escribiste, solo se
        actualizan las sugerencias.
      </p>
    </section>
  )
}
