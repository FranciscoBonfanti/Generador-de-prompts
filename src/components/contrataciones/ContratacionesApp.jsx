import { useEffect } from 'react'
import { ContratacionesProvider } from '../../context/ContratacionesContext.jsx'
import { ThemeToggle } from '../ThemeToggle.jsx'
import { ModeSwitch } from '../ModeSwitch.jsx'
import { AppFooter } from '../AppFooter.jsx'
import { ContrataIntro } from './ContrataIntro.jsx'
import { EtapaTareaSelector } from './EtapaTareaSelector.jsx'
import { MetapromptPanel } from './MetapromptPanel.jsx'
import { ContrataEssentials } from './ContrataEssentials.jsx'
import { ContrataComplements } from './ContrataComplements.jsx'
import { ContrataPromptPreview } from './ContrataPromptPreview.jsx'
import { AntesDeUsarPanel } from './AntesDeUsarPanel.jsx'
import { FileAnonymizer } from './FileAnonymizer.jsx'
import './Contrataciones.css'

export function ContratacionesApp() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Contrataciones Públicas — Constructor de Prompts'
    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <ContratacionesProvider>
      <div className="mode-contrataciones">
        <main className="app-main">
          <div className="app-toolbar">
            <ModeSwitch />
            <ThemeToggle />
          </div>
          <ContrataIntro />
          <EtapaTareaSelector />
          <MetapromptPanel />
          <div className="app-columns">
            <ContrataEssentials />
            <div className="contrata-side">
              <ContrataPromptPreview />
              <AntesDeUsarPanel />
            </div>
          </div>
          <ContrataComplements />
          <FileAnonymizer />
        </main>
        <AppFooter />
      </div>
    </ContratacionesProvider>
  )
}
