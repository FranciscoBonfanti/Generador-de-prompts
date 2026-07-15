import { useEffect } from 'react'
import { PromptProvider, usePromptContext } from './context/PromptContext.jsx'
import { IntroSection } from './components/IntroSection.jsx'
import { TaskTypeSelector } from './components/TaskTypeSelector.jsx'
import { EssentialsSection } from './components/EssentialsSection.jsx'
import { ComplementsSection } from './components/ComplementsSection.jsx'
import { PromptPreview } from './components/PromptPreview.jsx'
import { ThemeToggle } from './components/ThemeToggle.jsx'
import { OnboardingTour } from './components/OnboardingTour.jsx'
import { CornerDecoration } from './components/CornerDecoration.jsx'
import './App.css'

function AppShell() {
  const { state } = usePromptContext()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  return (
    <>
      <OnboardingTour />

      <main className="app-main">
        <div className="app-toolbar">
          <ThemeToggle />
        </div>
        <IntroSection />
        <TaskTypeSelector />
        <PromptPreview />
        <EssentialsSection />
        <ComplementsSection />
      </main>

      <footer className="app-footer">
        <CornerDecoration>
          <div className="app-footer__text-wrap">
            <p className="app-footer__text">
              Fue diseñada para que puedas crear prompts experimentando con distintas
              combinaciones y aplicar los ejemplos y ejercicios propuestos durante la
              capacitación. Podrás probar y perfeccionar tus prompts todas las veces que
              necesites a los fines de ir aplicando los diferentes ejemplos. Experimentá con
              distintas combinaciones, comprendé cómo influye cada componente del prompt y
              descubrí cómo pequeños cambios pueden generar mejores resultados.
            </p>
          </div>
        </CornerDecoration>
      </footer>
    </>
  )
}

function App() {
  return (
    <PromptProvider>
      <AppShell />
    </PromptProvider>
  )
}

export default App
