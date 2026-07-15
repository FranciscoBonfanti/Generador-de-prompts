import { useState } from 'react'
import { CircleHelp } from 'lucide-react'
import { usePromptContext } from '../context/PromptContext.jsx'
import { getSuggestionsFor } from '../data/suggestions.js'
import { resolveIcon } from '../utils/icons.js'
import './ComponentCard.css'

export function ComponentCard({ componentDef }) {
  const { state, setComponentContent, toggleComponentActive } = usePromptContext()
  const [showInfo, setShowInfo] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const entry = state.componentState[componentDef.id]
  const Icon = resolveIcon(componentDef.icon)
  const suggestions = getSuggestionsFor(state.taskTypeId, componentDef.id)
  const textareaId = `component-textarea-${componentDef.id}`

  function handleSuggestionClick(suggestionText) {
    setComponentContent(componentDef.id, suggestionText)
    setShowSuggestions(false)
  }

  return (
    <article
      className={`component-card component-card--${componentDef.category}${
        entry.active ? '' : ' component-card--inactive'
      }`}
    >
      <header className="component-card__header">
        <div className="component-card__title-group">
          <Icon className="component-card__icon" aria-hidden="true" size={20} />
          <h3 className="component-card__title">{componentDef.title}</h3>
        </div>

        <label className="component-card__toggle">
          <input
            type="checkbox"
            checked={entry.active}
            onChange={() => toggleComponentActive(componentDef.id)}
          />
          <span>
            Incluir<span className="sr-only"> en el prompt</span>
          </span>
        </label>
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

      <label htmlFor={textareaId} className="sr-only">
        {componentDef.title}
      </label>
      <textarea
        id={textareaId}
        className="component-card__textarea"
        rows={4}
        placeholder="Escribí acá tu contenido..."
        value={entry.content}
        onChange={(event) => setComponentContent(componentDef.id, event.target.value)}
      />

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
    </article>
  )
}

