import { CornerDecoration } from './CornerDecoration.jsx'
import './IntroSection.css'

export function IntroSection() {
  return (
    <section className="intro-section" aria-labelledby="intro-section-title">
      <CornerDecoration>
        <div className="intro-section__hero">
          <div className="intro-section__hero-inner">
            <h1 id="intro-section-title" className="intro-section__title">
              Construí tu propio <span className="gradient-text">Prompt</span>
            </h1>
            <svg
              className="intro-section__swoosh"
              viewBox="0 0 216 26"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="intro-swoosh-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="33%" stopColor="#EC4899" />
                  <stop offset="66%" stopColor="#9333EA" />
                  <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
              <path
                d="M5,20 C62,6 152,6 210,15"
                fill="none"
                stroke="url(#intro-swoosh-gradient)"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </CornerDecoration>
      <p className="intro-section__description">
        Esta herramienta didáctica complementa los contenidos del curso Puente al Futuro: Cómo
        crear prompts efectivos.*
      </p>
    </section>
  )
}
