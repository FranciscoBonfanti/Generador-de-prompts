import { contrataEssentialDefs } from '../../data/contrataciones/componentDefs.js'
import { useContratacionesContext } from '../../context/ContratacionesContext.jsx'
import { countContrataEssentials } from '../../utils/contratacionesFormatter.js'
import { ContrataComponentCard } from './ContrataComponentCard.jsx'
import '../EssentialsSection.css'

export function ContrataEssentials() {
  const { state } = useContratacionesContext()
  const completed = countContrataEssentials(state)

  return (
    <section className="essentials-section" aria-labelledby="contrata-essentials-title">
      <div className="gradient-bar">
        <h2 id="contrata-essentials-title" className="gradient-bar__title">
          Componentes más usados
        </h2>
        <span className="gradient-bar__badge">
          {completed} de {contrataEssentialDefs.length} esenciales completados
        </span>
      </div>
      <p className="essentials-section__hint">
        Recomendamos completar estos 5 para que la IA tenga lo mínimo necesario. Usá marcadores como
        [OBJETO] u [OFERENTE 1] en lugar de datos reales.
      </p>
      <div className="essentials-section__grid">
        {contrataEssentialDefs.map((componentDef) => (
          <ContrataComponentCard key={componentDef.id} componentDef={componentDef} />
        ))}
      </div>
    </section>
  )
}
