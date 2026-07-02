import { PromptProvider } from './context/PromptContext.jsx'

function App() {
  return (
    <PromptProvider>
      <main>
        <h1>Constructor de Prompts</h1>
        <p>Estructura base en construcción.</p>
      </main>
    </PromptProvider>
  )
}

export default App
