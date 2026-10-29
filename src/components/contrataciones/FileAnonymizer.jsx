import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, FileDown, FileLock2, Loader2, AlertTriangle } from 'lucide-react'
import { piiTypes } from '../../utils/piiDetector.js'
import '../ComplementsSection.css'

// Vercel limita el cuerpo de cada función a 4,5 MB.
const MAX_BYTES = 4 * 1024 * 1024
const ACCEPTED = /\.(docx|pdf)$/i

/**
 * Sube un .docx o .pdf a /api/anonimizar y ofrece descargar la versión
 * anonimizada, en el mismo formato.
 */
export function FileAnonymizer() {
  const [expanded, setExpanded] = useState(false)
  const [file, setFile] = useState(null)
  // idle | processing | done | error
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  // Libera la URL del archivo anterior al reemplazarlo o al salir.
  useEffect(() => () => result && URL.revokeObjectURL(result.url), [result])

  function handleFileChange(event) {
    const selected = event.target.files?.[0] ?? null
    setResult(null)
    setError('')
    setStatus('idle')
    if (!selected) {
      setFile(null)
      return
    }
    if (!ACCEPTED.test(selected.name)) {
      setFile(null)
      setStatus('error')
      setError('Solo se aceptan archivos .docx o .pdf.')
      return
    }
    if (selected.size > MAX_BYTES) {
      setFile(null)
      setStatus('error')
      setError('El archivo supera el máximo de 4 MB.')
      return
    }
    setFile(selected)
  }

  async function handleAnonymize() {
    if (!file) return
    setStatus('processing')
    setError('')
    setResult(null)
    try {
      const response = await fetch('/api/anonimizar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-File-Name': encodeURIComponent(file.name),
        },
        body: file,
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? `El servidor respondió con un error (${response.status}).`)
      }
      const summary = JSON.parse(decodeURIComponent(response.headers.get('X-Anonimizacion') ?? '%7B%7D'))
      const fileName = decodeURIComponent(response.headers.get('X-File-Name') ?? 'documento-anonimizado')
      const blob = await response.blob()
      setResult({ url: URL.createObjectURL(blob), fileName, summary })
      setStatus('done')
    } catch (caught) {
      setStatus('error')
      setError(
        caught instanceof TypeError
          ? 'No se pudo conectar con el servidor. Probá de nuevo en unos minutos.'
          : caught.message,
      )
    }
  }

  const byType = result ? Object.entries(result.summary.byType ?? {}) : []

  return (
    <section className="complements-section file-anonymizer" aria-labelledby="file-anonymizer-title">
      <button
        type="button"
        className="complements-section__toggle gradient-bar"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <span id="file-anonymizer-title" className="gradient-bar__title">
          Anonimizador de archivos
        </span>
        {expanded ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
      </button>

      {expanded && (
        <div className="file-anonymizer__body">
          <p className="complements-section__hint">
            Subí un .docx o .pdf (hasta 4 MB) y descargá una copia en el mismo formato con los datos
            sensibles reemplazados: CUIT/CUIL, DNI, correos, teléfonos, CBU/CVU, razones sociales,
            números de expediente y domicilios. Además, una pasada con IA (Gemini, de Google) busca
            nombres de personas y empresas que los patrones no reconocen: para eso el texto del
            archivo se envía a la API de Google. El archivo no se guarda.
          </p>

          <div className="file-anonymizer__controls">
            <label htmlFor="file-anonymizer-input" className="sr-only">
              Archivo a anonimizar
            </label>
            <input
              id="file-anonymizer-input"
              type="file"
              accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="prompt-preview__button prompt-preview__button--primary"
              onClick={handleAnonymize}
              disabled={!file || status === 'processing'}
            >
              {status === 'processing' ? (
                <>
                  <Loader2 size={16} aria-hidden="true" className="file-anonymizer__spinner" /> Procesando...
                </>
              ) : (
                <>
                  <FileLock2 size={16} aria-hidden="true" /> Anonimizar
                </>
              )}
            </button>
          </div>

          {status === 'error' && (
            <p className="prompt-preview__error" role="alert">
              {error}
            </p>
          )}

          {status === 'done' && result && (
            <div className="file-anonymizer__result" role="status">
              <p>
                {result.summary.total > 0
                  ? `Se reemplazaron ${result.summary.total} datos:`
                  : 'No se detectaron datos sensibles con los patrones automáticos.'}
              </p>
              {byType.length > 0 && (
                <ul>
                  {byType.map(([type, count]) => (
                    <li key={type}>
                      {piiTypes[type]?.label ?? type}: {count}
                    </li>
                  ))}
                </ul>
              )}
              {result.summary.aiStatus === 'ok' && (
                <p className="file-anonymizer__note">
                  Incluye la pasada con IA (Gemini) para nombres de personas y organizaciones.
                </p>
              )}
              {result.summary.aiStatus === 'error' && (
                <p className="file-anonymizer__note file-anonymizer__note--warning">
                  <AlertTriangle size={16} aria-hidden="true" /> La pasada con IA no estuvo disponible:
                  el archivo se anonimizó solo con patrones automáticos. Revisá a mano los nombres de
                  personas y empresas.
                </p>
              )}
              {result.summary.aiStatus === 'partial' && (
                <p className="file-anonymizer__note file-anonymizer__note--warning">
                  <AlertTriangle size={16} aria-hidden="true" /> La IA encontró más datos de los que se
                  pueden procesar por archivo: algunos nombres pueden haber quedado sin tapar. Revisá el
                  archivo a mano antes de compartirlo.
                </p>
              )}
              {result.summary.aiStatus === 'skipped' && (
                <p className="file-anonymizer__note file-anonymizer__note--warning">
                  <AlertTriangle size={16} aria-hidden="true" /> El documento es demasiado largo para la
                  pasada con IA: se anonimizó solo con patrones automáticos. Revisá a mano los nombres de
                  personas y empresas.
                </p>
              )}
              {result.summary.format === 'pdf' && (
                <p className="file-anonymizer__note">
                  En el PDF los datos se tapan en negro y cada página se convierte en imagen, para que el
                  texto original no quede oculto dentro del archivo. Por eso el texto del PDF anonimizado
                  no se puede seleccionar.
                </p>
              )}
              {result.summary.pagesWithoutText?.length > 0 && (
                <p className="file-anonymizer__note file-anonymizer__note--warning">
                  <AlertTriangle size={16} aria-hidden="true" /> Páginas sin texto legible (posiblemente
                  escaneadas): {result.summary.pagesWithoutText.join(', ')}. En esas páginas no se pudo
                  detectar nada: revisalas a mano.
                </p>
              )}
              {result.summary.pagesWithAnnotations?.length > 0 && (
                <p className="file-anonymizer__note file-anonymizer__note--warning">
                  <AlertTriangle size={16} aria-hidden="true" /> Páginas con comentarios o campos de
                  formulario: {result.summary.pagesWithAnnotations.join(', ')}. Por seguridad no se
                  incluyeron en el PDF anonimizado: si los necesitás, completalos a mano.
                </p>
              )}
              <a className="prompt-preview__button file-anonymizer__download" href={result.url} download={result.fileName}>
                <FileDown size={16} aria-hidden="true" /> Descargar {result.fileName}
              </a>
              <p className="file-anonymizer__note">
                Revisá siempre el archivo antes de compartirlo: la detección automática puede no
                encontrar todo.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
