import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { complementComponentDefs } from '../data/componentDefs.js'
import { ComponentCard } from './ComponentCard.jsx'
import './ComplementsSection.css'

export function ComplementsSection() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="complements-section" aria-labelledby="complements-section-title">
      <button
        type="button"
        className="complements-section__toggle gradient-bar"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <span id="complements-section-title" className="gradient-bar__title">
          Agregar más precisión (opcional)
        </span>
        {expanded ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
      </button>

      {expanded && (
        <>
          <p className="complements-section__hint">
            No hace falta completarlos para tener un buen prompt, pero suman precisión
            si querés afinar el resultado.
          </p>
          <div className="complements-section__grid">
            {complementComponentDefs.map((componentDef) => (
              <ComponentCard key={componentDef.id} componentDef={componentDef} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
