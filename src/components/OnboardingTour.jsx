import { useState } from 'react'
import { usePromptContext } from '../context/PromptContext.jsx'
import './OnboardingTour.css'

const steps = [
  {
    title: '1. Elegí el tipo de tarea',
    text: 'Arriba de todo elegí qué querés hacer (redactar un mail, analizar datos, etc.). Podés cambiarlo cuando quieras.',
  },
  {
    title: '2. Completá los esenciales',
    text: 'Escribí en cada tarjeta esencial o usá "Sugerirme opciones" si no sabés qué poner — vas a poder editar lo que elijas.',
  },
  {
    title: '3. Copiá y pegá',
    text: 'Cuando el prompt de la derecha te cierre, copialo y pegalo en tu IA favorita (Claude, ChatGPT, etc.).',
  },
]

export function OnboardingTour() {
  const { state, markOnboardingSeen } = usePromptContext()
  const [stepIndex, setStepIndex] = useState(0)

  if (state.onboardingSeen) return null

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  return (
    <div className="onboarding-tour__backdrop" role="presentation">
      <div className="onboarding-tour" role="dialog" aria-modal="true" aria-labelledby="onboarding-tour-title">
        <h2 id="onboarding-tour-title">{step.title}</h2>
        <p>{step.text}</p>

        <div className="onboarding-tour__dots" aria-hidden="true">
          {steps.map((s, index) => (
            <span
              key={s.title}
              className={`onboarding-tour__dot${index === stepIndex ? ' onboarding-tour__dot--active' : ''}`}
            />
          ))}
        </div>

        <div className="onboarding-tour__actions">
          <button type="button" className="onboarding-tour__skip" onClick={markOnboardingSeen}>
            Saltear
          </button>
          <button
            type="button"
            className="onboarding-tour__next"
            onClick={() => (isLastStep ? markOnboardingSeen() : setStepIndex((i) => i + 1))}
          >
            {isLastStep ? 'Entendido' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}
