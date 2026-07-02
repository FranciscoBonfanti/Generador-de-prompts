import { essentialComponentDefs } from '../data/componentDefs.js'
import { usePromptContext } from '../context/PromptContext.jsx'
import { countCompletedEssentials } from '../utils/promptFormatter.js'
import { ComponentCard } from './ComponentCard.jsx'
import './EssentialsSection.css'

export function EssentialsSection() {
  const { state } = usePromptContext()
  const completed = countCompletedEssentials(state.componentState)

  return (
    <section className="essentials-section" aria-labelledby="essentials-section-title">
      <div className="essentials-section__header">
        <h2 id="essentials-section-title">Esenciales</h2>
        <span className="essentials-section__badge">
          {completed} de {essentialComponentDefs.length} esenciales completos
        </span>
      </div>
      <p className="essentials-section__hint">
        Recomendamos completar estos 5 para que la IA tenga lo mínimo necesario.
      </p>
      <div className="essentials-section__grid">
        {essentialComponentDefs.map((componentDef) => (
          <ComponentCard key={componentDef.id} componentDef={componentDef} />
        ))}
      </div>
    </section>
  )
}
