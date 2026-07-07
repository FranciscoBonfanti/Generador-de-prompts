import { useEffect } from 'react'
import { PromptProvider, usePromptContext } from './context/PromptContext.jsx'
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
      <header className="app-header">
        <CornerDecoration />
      </header>

      <main className="app-main">
        <div className="app-toolbar">
          <ThemeToggle />
        </div>
        <TaskTypeSelector />
        <EssentialsSection />
        <PromptPreview />
        <ComplementsSection />
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
