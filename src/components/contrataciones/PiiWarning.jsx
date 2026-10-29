import { ShieldAlert } from 'lucide-react'
import { piiKey } from '../../utils/piiDetector.js'

const SNIPPET_CONTEXT = 24

function Snippet({ text, finding }) {
  const from = Math.max(0, finding.start - SNIPPET_CONTEXT)
  const to = Math.min(text.length, finding.end + SNIPPET_CONTEXT)
  return (
    <span className="pii-warning__snippet">
      {from > 0 && '…'}
      {text.slice(from, finding.start)}
      <mark>{finding.value}</mark>
      {text.slice(finding.end, to)}
      {to < text.length && '…'}
    </span>
  )
}

/**
 * Aviso inline de posibles datos sensibles. `items` = [{ finding, field }]
 * donde field = { id, label, text }. Cada dato se resuelve reemplazándolo
 * por su marcador o confirmando que no es sensible.
 */
export function PiiWarning({ items, showFieldLabel = false, onReplace, onReplaceAll, onIgnore }) {
  if (items.length === 0) return null

  // Un mismo dato repetido en un campo se muestra una sola vez.
  const unique = []
  const seen = new Set()
  for (const item of items) {
    const id = `${item.field.id}|${piiKey(item.finding)}`
    if (seen.has(id)) continue
    seen.add(id)
    unique.push({ ...item, id })
  }

  return (
    <div className="pii-warning" role="status">
      <div className="pii-warning__header">
        <ShieldAlert size={18} aria-hidden="true" />
        <p>
          <strong>
            {unique.length === 1
              ? 'Posible dato sensible'
              : `${unique.length} posibles datos sensibles`}
          </strong>{' '}
          Reemplazalo por un marcador o confirmá que no es un dato identificable antes de copiar el
          prompt.
        </p>
      </div>
      <ul className="pii-warning__list">
        {unique.map(({ id, finding, field }) => (
          <li key={id} className="pii-warning__item">
            <span className="pii-warning__type">
              {finding.label}
              {showFieldLabel && <span className="pii-warning__field"> · {field.label}</span>}
            </span>
            <Snippet text={field.text} finding={finding} />
            <div className="pii-warning__actions">
              <button type="button" onClick={() => onReplace(field, finding)}>
                Reemplazar por {finding.placeholder}
              </button>
              <button type="button" onClick={() => onIgnore(finding)}>
                No es un dato sensible
              </button>
            </div>
          </li>
        ))}
      </ul>
      {unique.length > 1 && (
        <button type="button" className="pii-warning__replace-all" onClick={onReplaceAll}>
          Reemplazar todos por marcadores
        </button>
      )}
    </div>
  )
}
