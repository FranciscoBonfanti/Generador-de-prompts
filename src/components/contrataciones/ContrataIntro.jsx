import { CornerDecoration } from '../CornerDecoration.jsx'
import '../IntroSection.css'

export function ContrataIntro() {
  return (
    <section className="intro-section contrata-intro" aria-labelledby="contrata-intro-title">
      <div className="contrata-intro__stripe" aria-hidden="true" />
      <CornerDecoration>
        <div className="intro-section__hero">
          <div className="intro-section__hero-inner">
            <h1 id="contrata-intro-title" className="intro-section__title contrata-intro__title">
              Prompts para <span className="gradient-text">Contrataciones Públicas</span>
            </h1>
          </div>
        </div>
      </CornerDecoration>
      <p className="intro-section__description">
        Modo específico para las etapas de una contratación pública en la Provincia de Santa Fe. La IA
        asiste: organiza, verifica y redacta borradores. Las decisiones administrativas siempre quedan a
        cargo del agente público.
      </p>
    </section>
  )
}
