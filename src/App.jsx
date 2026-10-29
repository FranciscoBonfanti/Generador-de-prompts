import { Navigate, Route, Routes } from "react-router-dom";
import { PromptProvider } from "./context/PromptContext.jsx";
import { IntroSection } from "./components/IntroSection.jsx";
import { TaskTypeSelector } from "./components/TaskTypeSelector.jsx";
import { EssentialsSection } from "./components/EssentialsSection.jsx";
import { ComplementsSection } from "./components/ComplementsSection.jsx";
import { PromptPreview } from "./components/PromptPreview.jsx";
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

// Cada modo guarda su propio borrador por separado (claves distintas de
// localStorage).
function AppRoutes() {
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
      <AppRoutes />
    </PromptProvider>
  );
}

export default App;
