import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { contrataComplementDefs } from '../../data/contrataciones/componentDefs.js'
import { ContrataComponentCard } from './ContrataComponentCard.jsx'
import { DocumentacionCard } from './DocumentacionCard.jsx'
import '../ComplementsSection.css'

export function ContrataComplements() {
  // Abierto de entrada: Frases obligatorias, Razonamiento y Tono vienen
  // precargados y conviene que se vean.
  const [expanded, setExpanded] = useState(true)

  return (
    <section className="complements-section" aria-labelledby="contrata-complements-title">
      <button
        type="button"
        className="complements-section__toggle gradient-bar"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <span id="contrata-complements-title" className="gradient-bar__title">
          Agregar más precisión
        </span>
        {expanded ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
      </button>

      {expanded && (
        <>
          <p className="complements-section__hint">
            Frases obligatorias, Razonamiento y Tono ya vienen precargados con lo que pide el curso:
            podés editarlos. Audiencia y Objetivo completan la técnica TAO (Tarea-Audiencia-Objetivo).
          </p>
          <div className="complements-section__grid">
            <DocumentacionCard />
            {contrataComplementDefs.map((componentDef) => (
              <ContrataComponentCard key={componentDef.id} componentDef={componentDef} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
