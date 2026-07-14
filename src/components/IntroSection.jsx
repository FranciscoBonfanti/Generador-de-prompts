import { CornerDecoration } from './CornerDecoration.jsx'
import './IntroSection.css'

export function IntroSection() {
  return (
    <section className="intro-section" aria-labelledby="intro-section-title">
      <CornerDecoration>
        <h1 id="intro-section-title" className="intro-section__title">
          Construí tu propio Prompt
        </h1>
      </CornerDecoration>
      <p className="intro-section__description">
        Esta herramienta didáctica complementa los contenidos del curso Puente al Futuro: Cómo
        crear prompts efectivos. Fue diseñada para que puedas crear prompts experimentando con
        distintas combinaciones y aplicar los ejemplos y ejercicios propuestos durante la
        capacitación. Podrás probar y perfeccionar tus prompts todas las veces que necesites a
        los fines de ir aplicando los diferentes ejemplos y ejercicios para una mejor
        capacitación. Experimentá con distintas combinaciones, comprendé cómo influye cada
        componente del prompt y descubrí cómo pequeños cambios pueden generar mejores
        resultados.
      </p>
    </section>
  )
}
