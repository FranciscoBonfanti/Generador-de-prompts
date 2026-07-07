import { useState } from 'react'
import { Copy, Download, RotateCcw, Eye, Check, AlertTriangle } from 'lucide-react'
import { usePromptContext } from '../context/PromptContext.jsx'
import {
  formatPrompt,
  countCompletedEssentials,
  getMissingEssentials,
  countWords,
} from '../utils/promptFormatter.js'
import { essentialComponentDefs } from '../data/componentDefs.js'
import { ExampleModal } from './ExampleModal.jsx'
import './PromptPreview.css'

export function PromptPreview() {
  const { state, resetAll } = usePromptContext()
  const [copyStatus, setCopyStatus] = useState('idle') // idle | confirm-missing | copied | error
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [showExample, setShowExample] = useState(false)

  const prompt = formatPrompt(state.componentState)
  const completed = countCompletedEssentials(state.componentState)
  const missing = getMissingEssentials(state.componentState)
  const wordCount = countWords(prompt)
  const charCount = prompt.length

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch {
      setCopyStatus('error')
    }
  }

  function handleCopyClick() {
    if (missing.length > 0 && copyStatus !== 'confirm-missing') {
      setCopyStatus('confirm-missing')
      return
    }
    copyToClipboard()
  }

  function handleDownload() {
    const blob = new Blob([prompt], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'prompt.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleResetConfirmed() {
    resetAll()
    setConfirmingReset(false)
    setCopyStatus('idle')
  }

  return (
    <section className="prompt-preview" aria-labelledby="prompt-preview-title">
      <div className="gradient-bar gradient-bar--full">
        <h2 id="prompt-preview-title" className="gradient-bar__title">
          Prompt listo
        </h2>
        <span className="gradient-bar__badge">
          {completed} de {essentialComponentDefs.length} esenciales completados
        </span>
      </div>

      <div className="prompt-preview__body">
        <div className="prompt-preview__main">
          <div className="prompt-preview__box">
            <p className="prompt-preview__text">
              {prompt || 'Completá los componentes esenciales para ver acá el prompt armado.'}
            </p>
          </div>

          <p className="prompt-preview__count">
            {wordCount} palabras • {charCount} caracteres
          </p>

          {copyStatus === 'confirm-missing' && (
            <div className="prompt-preview__warning" role="alert">
              <AlertTriangle size={18} aria-hidden="true" />
              <div>
                <p>
                  Che, todavía no completaste: {missing.map((m) => m.title).join(', ')}. ¿Seguro
                  querés copiar así?
                </p>
                <div className="prompt-preview__warning-actions">
                  <button type="button" onClick={copyToClipboard}>
                    Copiar igual
                  </button>
                  <button type="button" onClick={() => setCopyStatus('idle')}>
                    Seguir completando
                  </button>
                </div>
              </div>
            </div>
          )}

          {copyStatus === 'error' && (
            <p className="prompt-preview__error" role="alert">
              No pudimos copiar automáticamente. Seleccioná el texto de arriba y copialo a mano
              (Ctrl+C).
            </p>
          )}
        </div>

        <div className="prompt-preview__actions">
          <button type="button" className="prompt-preview__button prompt-preview__button--primary" onClick={handleCopyClick}>
            {copyStatus === 'copied' ? (
              <>
                <Check size={16} aria-hidden="true" /> ¡Copiado!
              </>
            ) : (
              <>
                <Copy size={16} aria-hidden="true" /> Copiar al portapapeles
              </>
            )}
          </button>

          <button type="button" className="prompt-preview__button" onClick={handleDownload}>
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
            <p>Esto borra todo lo que escribiste. ¿Confirmás?</p>
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

      {showExample && (
        <ExampleModal taskTypeId={state.taskTypeId} onClose={() => setShowExample(false)} />
      )}
    </section>
  )
}
