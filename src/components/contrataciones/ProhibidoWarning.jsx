import { OctagonAlert } from 'lucide-react'
import { categoriasProhibidas } from '../../data/contrataciones/pedidosProhibidos.js'

/** Aviso visible (no bloqueante) para pedidos fuera de lo permitido. */
export function ProhibidoWarning({ categorias }) {
  if (categorias.length === 0) return null

  return (
    <div className="prohibido-warning" role="alert">
      <OctagonAlert size={20} aria-hidden="true" className="prohibido-warning__icon" />
      <div>
        <p className="prohibido-warning__title">{categoriasProhibidas[categorias[0]].titulo}</p>
        {categorias.map((categoria) => (
          <div key={categoria} className="prohibido-warning__body">
            <p>{categoriasProhibidas[categoria].explicacion}</p>
            <p className="prohibido-warning__hint">{categoriasProhibidas[categoria].sugerencia}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
