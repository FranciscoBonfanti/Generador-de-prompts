import { createContext, useCallback, useContext, useMemo } from 'react'
import { contrataComponentDefs } from '../data/contrataciones/componentDefs.js'
import { etapas, getTareasForEtapa } from '../data/contrataciones/etapas.js'
import { METAPROMPT_CURSO } from '../data/metaprompt.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

// Claves propias del modo Contrataciones: el borrador del modo genérico
// ('constructor-de-prompts:v1') no se toca. El metaprompt editado va en una
// clave separada del resto del borrador.
const STORAGE_KEY = 'constructor-de-prompts:contrataciones:v1'
const METAPROMPT_STORAGE_KEY = 'constructor-de-prompts:contrataciones:metaprompt:v1'

function buildInitialComponentState() {
  const componentState = {}
  for (const componentDef of contrataComponentDefs) {
    componentState[componentDef.id] = { content: componentDef.preset ?? '', active: true }
  }
  return componentState
}

function buildInitialState() {
  const etapaId = etapas[0].id
  return {
    etapaId,
    tareaId: getTareasForEtapa(etapaId)[0].id,
    componentState: buildInitialComponentState(),
    contexto: { objeto: '', organismo: '', presupuesto: '', modalidad: '' },
    documentos: {},
    anteponerMetaprompt: true,
    antesDeUsar: {},
    piiIgnorados: [],
  }
}

/**
 * Completa un estado guardado con los campos que falten (por ejemplo, si una
 * versión futura agrega un componente), sin pisar lo que ya escribió la
 * persona.
 */
function withDefaults(stored) {
  const initial = buildInitialState()
  return {
    ...initial,
    ...stored,
    componentState: { ...initial.componentState, ...stored.componentState },
    contexto: { ...initial.contexto, ...stored.contexto },
  }
}

const ContratacionesContext = createContext(null)

export function ContratacionesProvider({ children }) {
  const [storedState, setState] = useLocalStorage(STORAGE_KEY, buildInitialState())
  const [metaprompt, setMetaprompt] = useLocalStorage(METAPROMPT_STORAGE_KEY, METAPROMPT_CURSO)
  const state = useMemo(() => withDefaults(storedState), [storedState])

  const update = useCallback(
    (updater) => setState((prev) => updater(withDefaults(prev))),
    [setState],
  )

  // Cambiar de etapa o de tarea nunca borra lo escrito: solo cambian las
  // sugerencias. Si la tarea elegida no existe en la nueva etapa, se pasa a
  // la primera de esa etapa.
  const setEtapaId = useCallback(
    (etapaId) => {
      update((prev) => {
        const tareasEtapa = getTareasForEtapa(etapaId)
        const tareaId = tareasEtapa.some((tarea) => tarea.id === prev.tareaId)
          ? prev.tareaId
          : tareasEtapa[0].id
        return { ...prev, etapaId, tareaId }
      })
    },
    [update],
  )

  const setTareaId = useCallback((tareaId) => update((prev) => ({ ...prev, tareaId })), [update])

  const setComponentContent = useCallback(
    (componentId, content) => {
      update((prev) => ({
        ...prev,
        componentState: {
          ...prev.componentState,
          [componentId]: { ...prev.componentState[componentId], content },
        },
      }))
    },
    [update],
  )

  const toggleComponentActive = useCallback(
    (componentId) => {
      update((prev) => ({
        ...prev,
        componentState: {
          ...prev.componentState,
          [componentId]: {
            ...prev.componentState[componentId],
            active: !prev.componentState[componentId].active,
          },
        },
      }))
    },
    [update],
  )

  const setContextoField = useCallback(
    (fieldId, value) => update((prev) => ({ ...prev, contexto: { ...prev.contexto, [fieldId]: value } })),
    [update],
  )

  const toggleDocumento = useCallback(
    (tareaId, documentoId) => {
      update((prev) => {
        const current = prev.documentos[tareaId] ?? []
        const next = current.includes(documentoId)
          ? current.filter((id) => id !== documentoId)
          : [...current, documentoId]
        return { ...prev, documentos: { ...prev.documentos, [tareaId]: next } }
      })
    },
    [update],
  )

  const setAnteponerMetaprompt = useCallback(
    (anteponerMetaprompt) => update((prev) => ({ ...prev, anteponerMetaprompt })),
    [update],
  )

  const restoreMetaprompt = useCallback(() => setMetaprompt(METAPROMPT_CURSO), [setMetaprompt])

  const toggleAntesDeUsar = useCallback(
    (itemId) =>
      update((prev) => ({ ...prev, antesDeUsar: { ...prev.antesDeUsar, [itemId]: !prev.antesDeUsar[itemId] } })),
    [update],
  )

  const ignorePii = useCallback(
    (key) =>
      update((prev) =>
        prev.piiIgnorados.includes(key) ? prev : { ...prev, piiIgnorados: [...prev.piiIgnorados, key] },
      ),
    [update],
  )

  // El metaprompt editado no se reinicia acá: tiene su propio botón
  // "Restaurar versión del curso".
  const resetAll = useCallback(() => setState(buildInitialState()), [setState])

  const value = useMemo(
    () => ({
      state,
      metaprompt,
      setEtapaId,
      setTareaId,
      setComponentContent,
      toggleComponentActive,
      setContextoField,
      toggleDocumento,
      setAnteponerMetaprompt,
      setMetaprompt,
      restoreMetaprompt,
      toggleAntesDeUsar,
      ignorePii,
      resetAll,
    }),
    [
      state,
      metaprompt,
      setEtapaId,
      setTareaId,
      setComponentContent,
      toggleComponentActive,
      setContextoField,
      toggleDocumento,
      setAnteponerMetaprompt,
      setMetaprompt,
      restoreMetaprompt,
      toggleAntesDeUsar,
      ignorePii,
      resetAll,
    ],
  )

  return <ContratacionesContext.Provider value={value}>{children}</ContratacionesContext.Provider>
}

export function useContratacionesContext() {
  const context = useContext(ContratacionesContext)
  if (!context) {
    throw new Error('useContratacionesContext debe usarse dentro de un ContratacionesProvider')
  }
  return context
}
