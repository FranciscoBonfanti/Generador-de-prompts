import { useState } from 'react'
import { Copy, Download, RotateCcw, Eye, Check, AlertTriangle, ShieldAlert } from 'lucide-react'
import { useContratacionesContext } from '../../context/ContratacionesContext.jsx'
import { contrataEssentialDefs } from '../../data/contrataciones/componentDefs.js'
import { piiTypes } from '../../utils/piiDetector.js'
import { countWords } from '../../utils/promptFormatter.js'
import {
  formatContrataPrompt,
  countContrataEssentials,
  getMissingContrataEssentials,
  getUnresolvedPii,
  getPedidosProhibidos,
  getSalvaguardas,
  isAntesDeUsarComplete,
} from '../../utils/contratacionesFormatter.js'
import { ProhibidoWarning } from './ProhibidoWarning.jsx'
import { ContrataExampleModal } from './ContrataExampleModal.jsx'
import '../PromptPreview.css'

export function ContrataPromptPreview() {
  const { state, metaprompt, resetAll } = useContratacionesContext()
  // idle | confirm-copy | confirm-download | copied | error
  const [status, setStatus] = useState('idle')
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [showExample, setShowExample] = useState(false)

  const prompt = formatContrataPrompt(state, metaprompt)
  const completed = countContrataEssentials(state)
  const missing = getMissingContrataEssentials(state)
  // Sin debounce: el chequeo de copiar/descargar mira el texto actual.
  const unresolvedPii = getUnresolvedPii(state, metaprompt)
  const prohibidos = getPedidosProhibidos(state)
  const antesDeUsarComplete = isAntesDeUsarComplete(state)
  const salvaguardas = getSalvaguardas(state, unresolvedPii.length)
  const activeSalvaguardas = salvaguardas.filter((salvaguarda) => salvaguarda.active).length

  const hasIssues =
    missing.length > 0 || unresolvedPii.length > 0 || prohibidos.length > 0 || !antesDeUsarComplete
  const confirming = status === 'confirm-copy' || status === 'confirm-download'

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(prompt)
      setStatus('copied')
      setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
    }
  }

  function download() {
    const blob = new Blob([prompt], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'prompt-contrataciones.txt'
    link.click()
    URL.revokeObjectURL(url)
    setStatus('idle')
  }

  // Mismo patrón que el modo genérico: si falta algo se avisa y la persona
  // decide; no se bloquea el botón.
  function handleAction(action) {
    const confirmStatus = action === 'copy' ? 'confirm-copy' : 'confirm-download'
    if (hasIssues && status !== confirmStatus) {
      setStatus(confirmStatus)
      return
    }
    if (action === 'copy') copyToClipboard()
    else download()
  }

  function handleResetConfirmed() {
    resetAll()
    setConfirmingReset(false)
    setStatus('idle')
  }

  const piiTypeLabels = [...new Set(unresolvedPii.map((finding) => piiTypes[finding.type].label))]

  return (
    <section className="prompt-preview" aria-labelledby="contrata-preview-title">
      <div className="gradient-bar">
        <h2 id="contrata-preview-title" className="gradient-bar__title">
          Prompt listo
        </h2>
        <span className="gradient-bar__badge">
          {completed} de {contrataEssentialDefs.length} esenciales completados
        </span>
        <span className="gradient-bar__badge">
          {activeSalvaguardas} de {salvaguardas.length} salvaguardas activas
        </span>
      </div>

      <div className="prompt-preview__body">
        <div className="prompt-preview__main">
          <div className="prompt-preview__box contrata-preview__box">
            <p className="prompt-preview__text">
              {prompt || 'Completá los componentes esenciales para ver acá el prompt armado.'}
            </p>
          </div>

          <p className="prompt-preview__count">
            {countWords(prompt)} palabras • {prompt.length} caracteres
            {state.anteponerMetaprompt ? ' • incluye el metaprompt' : ''}
          </p>
          <p className="contrata-preview__reminder">
            Antes de usar la respuesta de la IA: validala y reemplazá los marcadores [COMPLETAR],
            [VERIFICAR] y [DATO NO DISPONIBLE].
          </p>

          <ProhibidoWarning categorias={prohibidos} />

          {confirming && (
            <div
              className={`prompt-preview__warning${unresolvedPii.length > 0 ? ' contrata-preview__warning--danger' : ''}`}
              role="alert"
            >
              {unresolvedPii.length > 0 ? (
                <ShieldAlert size={18} aria-hidden="true" />
              ) : (
                <AlertTriangle size={18} aria-hidden="true" />
              )}
              <div>
                <p>Antes de {status === 'confirm-copy' ? 'copiar' : 'descargar'}, revisá:</p>
                <ul className="contrata-preview__issues">
                  {unresolvedPii.length > 0 && (
                    <li>
                      <strong>
                        {unresolvedPii.length === 1
                          ? 'Hay 1 posible dato sensible sin resolver'
                          : `Hay ${unresolvedPii.length} posibles datos sensibles sin resolver`}
                      </strong>{' '}
                      ({piiTypeLabels.join(', ')}). Reemplazalos por un marcador o confirmá que no
                      son datos identificables.
                    </li>
                  )}
                  {prohibidos.length > 0 && (
                    <li>El pedido incluye algo fuera de lo permitido por el curso (ver el aviso en rojo).</li>
                  )}
                  {missing.length > 0 && (
                    <li>Todavía no completaste: {missing.map((m) => m.title).join(', ')}.</li>
                  )}
                  {!antesDeUsarComplete && <li>El checklist «Antes de usar» no está completo.</li>}
                </ul>
                <div className="prompt-preview__warning-actions">
                  <button type="button" onClick={() => handleAction(status === 'confirm-copy' ? 'copy' : 'download')}>
                    {status === 'confirm-copy' ? 'Copiar igual' : 'Descargar igual'}
                  </button>
                  <button type="button" onClick={() => setStatus('idle')}>
                    Seguir revisando
                  </button>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <p className="prompt-preview__error" role="alert">
              No pudimos copiar automáticamente. Seleccioná el texto de arriba y copialo a mano
              (Ctrl+C).
            </p>
          )}
        </div>

        <div className="prompt-preview__actions">
          <button
            type="button"
            className="prompt-preview__button prompt-preview__button--primary"
            onClick={() => handleAction('copy')}
          >
            {status === 'copied' ? (
              <>
                <Check size={16} aria-hidden="true" /> ¡Copiado!
              </>
            ) : (
              <>
                <Copy size={16} aria-hidden="true" /> Copiar al portapapeles
              </>
            )}
          </button>

          <button type="button" className="prompt-preview__button" onClick={() => handleAction('download')}>
            <Download size={16} aria-hidden="true" /> Descargar como .txt
          </button>

          <button type="button" className="prompt-preview__button" onClick={() => setShowExample(true)}>
            <Eye size={16} aria-hidden="true" /> Ver un ejemplo completo
          </button>

          <button
            type="button"
            className="prompt-preview__button prompt-preview__button--danger"
            onClick={() => setConfirmingReset(true)}
          >
            <RotateCcw size={16} aria-hidden="true" /> Reiniciar todo
          </button>
        </div>
      </div>

      {confirmingReset && (
        <div className="prompt-preview__warning" role="alert">
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <p>
              Esto borra todo lo que escribiste en el modo Contrataciones (el metaprompt editado se
              conserva). ¿Confirmás?
            </p>
            <div className="prompt-preview__warning-actions">
              <button type="button" onClick={handleResetConfirmed}>
                Sí, borrar todo
              </button>
              <button type="button" onClick={() => setConfirmingReset(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showExample && <ContrataExampleModal state={state} onClose={() => setShowExample(false)} />}
    </section>
  )
}
