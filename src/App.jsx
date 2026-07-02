import { PromptProvider } from './context/PromptContext.jsx'
import { TaskTypeSelector } from './components/TaskTypeSelector.jsx'
import { EssentialsSection } from './components/EssentialsSection.jsx'
import { ComplementsSection } from './components/ComplementsSection.jsx'

function App() {
  return (
    <PromptProvider>
      <main>
        <h1>Constructor de Prompts</h1>
        <TaskTypeSelector />
        <EssentialsSection />
        <ComplementsSection />
      </main>
    </PromptProvider>
  )
}

export default App
