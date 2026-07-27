import { useEffect } from "react";
import { PromptProvider, usePromptContext } from "./context/PromptContext.jsx";
import { IntroSection } from "./components/IntroSection.jsx";
import { TaskTypeSelector } from "./components/TaskTypeSelector.jsx";
import { EssentialsSection } from "./components/EssentialsSection.jsx";
import { ComplementsSection } from "./components/ComplementsSection.jsx";
import { PromptPreview } from "./components/PromptPreview.jsx";
import { ThemeToggle } from "./components/ThemeToggle.jsx";
import { OnboardingTour } from "./components/OnboardingTour.jsx";
import { CornerDecoration } from "./components/CornerDecoration.jsx";
import "./App.css";

function AppShell() {
  const { state } = usePromptContext();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  return (
    <>
      <OnboardingTour />

      <main className="app-main">
        <div className="app-toolbar">
          <ThemeToggle />
        </div>
        <IntroSection />
        <TaskTypeSelector />
        <div className="app-columns">
          <EssentialsSection />
          <PromptPreview />
        </div>
        <ComplementsSection />
      </main>

      <footer className="app-footer">
        <CornerDecoration>
          <div className="app-footer__text-wrap">
            <p>
              Fue diseñada para que puedas crear prompts experimentando con
              distintas combinaciones y aplicar los ejemplos y ejercicios
              propuestos durante la capacitación. Podrás probar y perfeccionar
              tus prompts todas las veces que necesites a los fines de ir
              aplicando los diferentes ejemplos.
              Si querés hacer sugerencias sobre esta herramienta podés hacerlo
              en 
              <a
                href="https://forms.gle/Mi9g3pvtUZAoiyAf6"
                target="_blank"
                rel="noopener noreferrer"
                // style="text-decoration: none;"
              >
                <strong> este espacio</strong>
              </a>
              .
            </p>
          </div>
        </CornerDecoration>
      </footer>
    </>
  );
}

function App() {
  return (
    <PromptProvider>
      <AppShell />
    </PromptProvider>
  );
}

export default App;
