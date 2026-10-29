import { Link } from 'react-router-dom'
import { ArrowRight, Landmark, Lock, ShieldAlert, FileLock2 } from 'lucide-react'
import './ContratacionesPromo.css'

const features = [
  { icon: Lock, text: 'Restricciones obligatorias del curso según la etapa' },
  { icon: ShieldAlert, text: 'Aviso de datos sensibles y de pedidos no permitidos' },
  { icon: FileLock2, text: 'Anonimizador de archivos .docx y .pdf' },
]

/**
 * Sección propia en la página principal para entrar al modo Contrataciones
 * Públicas. Usa .mode-contrataciones para tomar la paleta de marca Santa Fe
 * (styles/variables.css).
 */
export function ContratacionesPromo() {
  return (
    <section className="contrataciones-promo mode-contrataciones" aria-labelledby="contrataciones-promo-title">
      <div className="contrataciones-promo__stripe" aria-hidden="true" />
      <div className="contrataciones-promo__body">
        <div className="contrataciones-promo__icon" aria-hidden="true">
          <Landmark size={32} />
        </div>
        <div className="contrataciones-promo__content">
          <p className="contrataciones-promo__eyebrow">Modo específico · Provincia de Santa Fe</p>
          <h2 id="contrataciones-promo-title" className="contrataciones-promo__title">
            Contrataciones <span className="gradient-text">Públicas</span>
          </h2>
          <p className="contrataciones-promo__text">
            Armá prompts para cada etapa de una contratación pública, con las salvaguardas del curso: la
            IA asiste, la decisión queda a cargo del agente público.
          </p>
          <ul className="contrataciones-promo__features">
            {features.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon size={16} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <Link to="/contrataciones" className="contrataciones-promo__cta">
          Entrar al modo Contrataciones
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
