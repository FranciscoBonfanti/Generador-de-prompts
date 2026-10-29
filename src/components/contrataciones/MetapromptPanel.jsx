import { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { useContratacionesContext } from '../../context/ContratacionesContext.jsx'
import { METAPROMPT_CURSO } from '../../data/metaprompt.js'
import { detectPii, piiKey, replacePiiByKey } from '../../utils/piiDetector.js'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import { PiiWarning } from './PiiWarning.jsx'

export function MetapromptPanel() {
  const { state, metaprompt, setMetaprompt, restoreMetaprompt, setAnteponerMetaprompt, ignorePii } =
    useContratacionesContext()
  const [expanded, setExpanded] = useState(false)
  const isCourseVersion = metaprompt === METAPROMPT_CURSO

  const debounced = useDebouncedValue(metaprompt, 500)
  const piiItems = useMemo(() => {
    if (!state.anteponerMetaprompt) return []
    const ignored = new Set(state.piiIgnorados)
    return detectPii(debounced)
      .filter((finding) => !ignored.has(piiKey(finding)))
      .map((finding) => ({ finding, field: { id: 'metaprompt', label: 'Metaprompt', text: debounced } }))
  }, [debounced, state.anteponerMetaprompt, state.piiIgnorados])

  return (
    <section className="metaprompt-panel" aria-labelledby="metaprompt-title">
      <h2 id="metaprompt-title" className="gradient-bar gradient-bar__title">
        Metaprompt del curso
      </h2>

      <div className="metaprompt-panel__row">
        <label className="metaprompt-panel__checkbox">
          <input
            type="checkbox"
            checked={state.anteponerMetaprompt}
            onChange={(event) => setAnteponerMetaprompt(event.target.checked)}
          />
          <span>
            Anteponer metaprompt
            <span className="metaprompt-panel__checkbox-hint">
              Agrega al principio del prompt el «Metaprompt Asistente para Contrataciones Públicas»
              {isCourseVersion ? ' (versión del curso).' : ' (versión editada).'}
            </span>
          </span>
        </label>

        <button
          type="button"
          className="metaprompt-panel__toggle"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls="metaprompt-editor"
        >
          {expanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
          {expanded ? 'Ocultar texto' : 'Ver o editar texto'}
        </button>
      </div>

      {expanded && (
        <div id="metaprompt-editor" className="metaprompt-panel__editor">
          <label htmlFor="metaprompt-textarea" className="sr-only">
            Texto del metaprompt
          </label>
          <textarea
            id="metaprompt-textarea"
            className="component-card__textarea metaprompt-panel__textarea"
            rows={14}
            value={metaprompt}
            onChange={(event) => setMetaprompt(event.target.value)}
          />
          <div className="metaprompt-panel__actions">
            <span className="metaprompt-panel__status">
              {isCourseVersion ? 'Versión del curso, sin cambios.' : 'Editado: se usa tu versión.'}
            </span>
            <button
              type="button"
              className="prompt-preview__button"
              onClick={restoreMetaprompt}
              disabled={isCourseVersion}
            >
              <RotateCcw size={16} aria-hidden="true" /> Restaurar versión del curso
            </button>
          </div>
        </div>
      )}

      <PiiWarning
        items={piiItems}
        onReplace={(_, finding) => setMetaprompt(replacePiiByKey(metaprompt, piiKey(finding)))}
        onReplaceAll={() => {
          let text = metaprompt
          for (const item of piiItems) text = replacePiiByKey(text, piiKey(item.finding))
          setMetaprompt(text)
        }}
        onIgnore={(finding) => ignorePii(piiKey(finding))}
      />
    </section>
  )
}
