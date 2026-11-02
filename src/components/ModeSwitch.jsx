import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './ModeSwitch.css'

/**
 * Link para volver del modo Contrataciones al constructor genérico. En el
 * sentido inverso el acceso es la sección ContratacionesPromo de la página
 * principal (un solo acceso por sentido).
 */
export function ModeSwitch() {
  return (
    <Link to="/" className="mode-switch mode-switch--back">
      <ArrowLeft size={18} aria-hidden="true" />
      <span>Constructor genérico</span>
    </Link>
  )
}
