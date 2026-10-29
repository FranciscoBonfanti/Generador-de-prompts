import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useContratacionesContext } from '../../context/ContratacionesContext.jsx'
import { antesDeUsarItems } from '../../data/contrataciones/antesDeUsar.js'
import { getSalvaguardas, getUnresolvedPii } from '../../utils/contratacionesFormatter.js'

/**
 * Checklist de auto-verificación "Antes de usar" + detalle de las
 * salvaguardas que cuenta el badge de "Prompt listo". No bloquea nada.
 */
export function AntesDeUsarPanel() {
  const { state, metaprompt, toggleAntesDeUsar } = useContratacionesContext()
  const checkedCount = antesDeUsarItems.filter((item) => state.antesDeUsar[item.id]).length
  const salvaguardas = getSalvaguardas(state, getUnresolvedPii(state, metaprompt).length)

  return (
    <section className="antes-de-usar" aria-labelledby="antes-de-usar-title">
      <div className="gradient-bar">
        <h2 id="antes-de-usar-title" className="gradient-bar__title">
          Antes de usar
        </h2>
        <span className="gradient-bar__badge">
          {checkedCount} de {antesDeUsarItems.length}
        </span>
      </div>
      <p className="antes-de-usar__hint">
        Tildá cada punto a medida que lo revisás. Es una auto-verificación: no bloquea el botón de copiar.
      </p>
      <ul className="contrata-checklist">
        {antesDeUsarItems.map((item) => {
          const inputId = `antes-de-usar-${item.id}`
          return (
            <li key={item.id}>
              <input
                id={inputId}
                type="checkbox"
                checked={Boolean(state.antesDeUsar[item.id])}
                onChange={() => toggleAntesDeUsar(item.id)}
              />
              <label htmlFor={inputId}>{item.label}</label>
            </li>
          )
        })}
      </ul>

      <h3 className="antes-de-usar__subtitle">Salvaguardas</h3>
      <ul className="salvaguardas">
        {salvaguardas.map((salvaguarda) => (
          <li
            key={salvaguarda.id}
            className={`salvaguardas__item salvaguardas__item--${salvaguarda.active ? 'on' : 'off'}`}
          >
            {salvaguarda.active ? (
              <ShieldCheck size={16} aria-hidden="true" />
            ) : (
              <ShieldAlert size={16} aria-hidden="true" />
            )}
            <span>
              <span className="sr-only">{salvaguarda.active ? 'Activa: ' : 'Pendiente: '}</span>
              {salvaguarda.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
