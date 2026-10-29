import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PromptProvider, usePromptContext } from "./context/PromptContext.jsx";
import { IntroSection } from "./components/IntroSection.jsx";
import { TaskTypeSelector } from "./components/TaskTypeSelector.jsx";
import { EssentialsSection } from "./components/EssentialsSection.jsx";
import { ComplementsSection } from "./components/ComplementsSection.jsx";
import { PromptPreview } from "./components/PromptPreview.jsx";
import { ThemeToggle } from "./components/ThemeToggle.jsx";
import { OnboardingTour } from "./components/OnboardingTour.jsx";
import { ModeSwitch } from "./components/ModeSwitch.jsx";
import { AppFooter } from "./components/AppFooter.jsx";
import { ContratacionesApp } from "./components/contrataciones/ContratacionesApp.jsx";
import "./App.css";

function GenericShell() {
  return (
    <>
      <OnboardingTour />

      <main className="app-main">
        <div className="app-toolbar">
          <ModeSwitch />
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

      <AppFooter />
    </>
  );
}

// El tema (claro/oscuro) vive en el estado del modo genérico y se comparte
// entre ambos modos; cada modo guarda su propio borrador por separado.
function ThemedRoutes() {
  const { state } = usePromptContext();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  return (
    <Routes>
      <Route path="/" element={<GenericShell />} />
      <Route path="/contrataciones" element={<ContratacionesApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <PromptProvider>
      <ThemedRoutes />
    </PromptProvider>
  );
}

export default App;
