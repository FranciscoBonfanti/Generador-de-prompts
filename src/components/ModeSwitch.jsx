import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft, Landmark } from 'lucide-react'
import './ModeSwitch.css'

/** Link para pasar del constructor genérico al modo Contrataciones y viceversa. */
export function ModeSwitch() {
  const { pathname } = useLocation()
  const inContrataciones = pathname.startsWith('/contrataciones')

  return inContrataciones ? (
    <Link to="/" className="mode-switch">
      <ArrowLeft size={18} aria-hidden="true" />
      <span>Constructor genérico</span>
    </Link>
  ) : (
    <Link to="/contrataciones" className="mode-switch">
      <Landmark size={18} aria-hidden="true" />
      <span>Modo Contrataciones Públicas</span>
    </Link>
  )
}
