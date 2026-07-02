import { useEffect } from 'react'
import { PromptProvider, usePromptContext } from './context/PromptContext.jsx'
import { TaskTypeSelector } from './components/TaskTypeSelector.jsx'
import { EssentialsSection } from './components/EssentialsSection.jsx'
import { ComplementsSection } from './components/ComplementsSection.jsx'
import { PromptPreview } from './components/PromptPreview.jsx'
import { ThemeToggle } from './components/ThemeToggle.jsx'
import { OnboardingTour } from './components/OnboardingTour.jsx'
import './App.css'

function AppShell() {
  const { state } = usePromptContext()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
  }, [state.theme])

  return (
    <>
      <OnboardingTour />
      <header className="app-header">
        <div>
          <h1>Constructor de Prompts</h1>
          <p className="app-header__subtitle">
            Armá prompts efectivos para tu IA favorita completando estos pasos guiados.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <main className="app-main">
        <TaskTypeSelector />

        <div className="app-columns">
          <div className="app-columns__components">
            <EssentialsSection />
            <ComplementsSection />
          </div>
          <div className="app-columns__preview">
            <PromptPreview />
          </div>
        </div>
      </main>
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
