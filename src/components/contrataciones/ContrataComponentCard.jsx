import { useMemo, useState } from 'react'
import { CircleHelp, Lock } from 'lucide-react'
import { useContratacionesContext } from '../../context/ContratacionesContext.jsx'
import { getContrataSuggestions } from '../../data/contrataciones/suggestions.js'
import { getEtapaById } from '../../data/contrataciones/etapas.js'
import { detectPedidosProhibidos } from '../../data/contrataciones/pedidosProhibidos.js'
import { contextoCampos, getRestriccionObligatoria } from '../../utils/contratacionesFormatter.js'
import { detectPii, piiKey, replacePiiByKey } from '../../utils/piiDetector.js'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import { resolveIcon } from '../../utils/icons.js'
import { PiiWarning } from './PiiWarning.jsx'
import { ProhibidoWarning } from './ProhibidoWarning.jsx'
import '../ComponentCard.css'

const DETECTION_DELAY_MS = 500
// Componentes donde se buscan pedidos prohibidos ("decidí quién gana").
const PROHIBIDO_FIELDS = new Set(['accion', 'contexto', 'objetivo'])
const FIELD_SEPARATOR = '\u0000'

const textareaPlaceholders = {
  contexto: 'Más contexto (opcional): oferentes, antecedentes, situación actual...',
  restricciones: 'Agregá otras restricciones (opcional)...',
}

export function ContrataComponentCard({ componentDef }) {
  const { state, setComponentContent, toggleComponentActive, setContextoField, ignorePii } =
    useContratacionesContext()
  const [showInfo, setShowInfo] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const entry = state.componentState[componentDef.id]
  const Icon = resolveIcon(componentDef.icon)
  const suggestions = getContrataSuggestions(state.tareaId, componentDef.id)
  const textareaId = `contrata-textarea-${componentDef.id}`

  // Restricciones obligatorias de la etapa: siempre incluidas, no se pueden
  // ocultar ni borrar (van fijas, fuera del textarea).
  const restriccionObligatoria =
    componentDef.id === 'restricciones' ? getRestriccionObligatoria(state) : null
  const locked = Boolean(restriccionObligatoria)
  const active = locked || entry.active

  // Campos de texto de esta tarjeta: el textarea y, en Contexto, los campos guiados.
  const fields = [
    {
      id: componentDef.id,
      label: componentDef.guided ? 'Más contexto' : componentDef.title,
      text: entry.content,
      setText: (value) => setComponentContent(componentDef.id, value),
    },
    ...(componentDef.guided
      ? contextoCampos.map((campo) => ({
          id: `contexto.${campo.id}`,
          label: campo.label,
          text: state.contexto[campo.id],
          setText: (value) => setContextoField(campo.id, value),
        }))
      : []),
  ]

  // La detección corre sobre el texto "quieto" (500 ms sin tipear) para no
  // parpadear mientras se escribe.
  const debouncedJoined = useDebouncedValue(
    fields.map((field) => field.text).join(FIELD_SEPARATOR),
    DETECTION_DELAY_MS,
  )

  const piiItems = useMemo(() => {
    if (!active) return []
    const ignored = new Set(state.piiIgnorados)
    const texts = debouncedJoined.split(FIELD_SEPARATOR)
    return fields.flatMap((field, index) => {
      const text = texts[index] ?? ''
      return detectPii(text)
        .filter((finding) => !ignored.has(piiKey(finding)))
        .map((finding) => ({ finding, field: { ...field, text } }))
    })
    // `fields` se recalcula en cada render; lo que importa es el texto debounced.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedJoined, active, state.piiIgnorados])

  const prohibidos = useMemo(
    () =>
      PROHIBIDO_FIELDS.has(componentDef.id) && active
        ? [...new Set(debouncedJoined.split(FIELD_SEPARATOR).flatMap(detectPedidosProhibidos))]
        : [],
    [componentDef.id, debouncedJoined, active],
  )

  function fieldById(fieldId) {
    return fields.find((field) => field.id === fieldId)
  }

  function handleReplace(field, finding) {
    const current = fieldById(field.id)
    current.setText(replacePiiByKey(current.text, piiKey(finding)))
  }

  function handleReplaceAll() {
    for (const field of fields) {
      const keys = new Set(
        piiItems.filter((item) => item.field.id === field.id).map((item) => piiKey(item.finding)),
      )
      let text = field.text
      for (const key of keys) text = replacePiiByKey(text, key)
      if (text !== field.text) field.setText(text)
    }
  }

  function handleSuggestionClick(suggestionText) {
    setComponentContent(componentDef.id, suggestionText)
    setShowSuggestions(false)
  }

  return (
    <article
      className={`component-card component-card--${componentDef.category}${
        active ? '' : ' component-card--inactive'
      }`}
    >
      <header className="component-card__header">
        <div className="component-card__title-group">
          <Icon className="component-card__icon" aria-hidden="true" size={20} />
          <h3 className="component-card__title">{componentDef.title}</h3>
        </div>

        {locked ? (
          <label
            className="component-card__toggle contrata-card__toggle--locked"
            title="En esta etapa las restricciones son obligatorias: no se pueden ocultar."
          >
            <input type="checkbox" checked disabled />
            <span>
              <Lock size={14} aria-hidden="true" /> Obligatorio
            </span>
          </label>
        ) : (
          <label className="component-card__toggle">
            <input
              type="checkbox"
              checked={entry.active}
              onChange={() => toggleComponentActive(componentDef.id)}
            />
            <span>
              Incluir<span className="sr-only"> {componentDef.title} en el prompt</span>
            </span>
          </label>
        )}
      </header>

      <button
        type="button"
        className="component-card__info-button"
        onClick={() => setShowInfo((prev) => !prev)}
        aria-expanded={showInfo}
      >
        <CircleHelp size={16} aria-hidden="true" />
        ¿Qué es esto?
      </button>

      {showInfo && (
        <div className="component-card__info-panel">
          <p>{componentDef.definition}</p>
          <p className="component-card__info-example">{componentDef.example}</p>
        </div>
      )}

      {locked && (
        <div className="contrata-card__locked">
          <Lock size={16} aria-hidden="true" />
          <div>
            <p className="contrata-card__locked-title">
              Obligatoria en la etapa «{getEtapaById(state.etapaId).label}»
            </p>
            <p className="contrata-card__locked-text">{restriccionObligatoria}</p>
          </div>
        </div>
      )}

      {componentDef.guided && (
        <div className="contrata-card__guided">
          {contextoCampos.map((campo) => {
            const inputId = `contexto-${campo.id}`
            return (
              <div key={campo.id} className="contrata-card__guided-field">
                <label htmlFor={inputId}>{campo.label}</label>
                <input
                  id={inputId}
                  type="text"
                  value={state.contexto[campo.id]}
                  placeholder={campo.placeholder}
                  list={campo.id === 'modalidad' ? 'modalidades-contratacion' : undefined}
                  onChange={(event) => setContextoField(campo.id, event.target.value)}
                />
              </div>
            )
          })}
          <datalist id="modalidades-contratacion">
            <option value="Licitación pública" />
            <option value="Licitación privada" />
            <option value="Contratación directa" />
            <option value="Subasta pública" />
            <option value="A definir" />
          </datalist>
        </div>
      )}

      {componentDef.presets && (
        <div className="contrata-card__presets" role="group" aria-label="Formatos predefinidos">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.etiqueta}
              type="button"
              className="contrata-card__preset"
              aria-pressed={entry.content === suggestion.texto}
              onClick={() => setComponentContent(componentDef.id, suggestion.texto)}
            >
              {suggestion.etiqueta}
            </button>
          ))}
        </div>
      )}

      <label htmlFor={textareaId} className="sr-only">
        {componentDef.title}
      </label>
      <textarea
        id={textareaId}
        className="component-card__textarea"
        rows={componentDef.multiline ? 7 : 4}
        placeholder={
          (locked || componentDef.guided ? textareaPlaceholders[componentDef.id] : null) ??
          'Escribí acá tu contenido...'
        }
        value={entry.content}
        onChange={(event) => setComponentContent(componentDef.id, event.target.value)}
      />

      {!componentDef.presets && suggestions.length > 0 && (
        <div className="component-card__suggestions-block">
          <button
            type="button"
            className="component-card__suggestions-button"
            onClick={() => setShowSuggestions((prev) => !prev)}
            aria-expanded={showSuggestions}
          >
            Sugerirme opciones
          </button>

          {showSuggestions && (
            <ul className="component-card__suggestions-list">
              {suggestions.map((suggestion) => (
                <li key={suggestion.etiqueta}>
                  <button
                    type="button"
                    className="component-card__suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion.texto)}
                  >
                    <span className="component-card__suggestion-label">{suggestion.etiqueta}</span>
                    <span className="component-card__suggestion-text">{suggestion.texto}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ProhibidoWarning categorias={prohibidos} />
      <PiiWarning
        items={piiItems}
        showFieldLabel={fields.length > 1}
        onReplace={handleReplace}
        onReplaceAll={handleReplaceAll}
        onIgnore={(finding) => ignorePii(piiKey(finding))}
      />
    </article>
  )
}
