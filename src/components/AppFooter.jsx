import { CornerDecoration } from "./CornerDecoration.jsx";

export function AppFooter() {
  return (
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
            >
              <strong> este espacio</strong>
            </a>
            .
          </p>
        </div>
      </CornerDecoration>
    </footer>
  );
}
