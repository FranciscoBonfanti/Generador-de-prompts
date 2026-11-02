import { createContext, useCallback, useContext, useMemo } from 'react'
import { taskTypes } from '../data/taskTypes.js'
import { componentDefs } from '../data/componentDefs.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const STORAGE_KEY = 'constructor-de-prompts:v1'

function buildInitialComponentState() {
  const componentState = {}
  for (const componentDef of componentDefs) {
    componentState[componentDef.id] = { content: '', active: true }
  }
  return componentState
}

function buildInitialState() {
  return {
    taskTypeId: taskTypes[0].id,
    componentState: buildInitialComponentState(),
    onboardingSeen: false,
  }
}

/**
 * Completa un estado guardado con lo que falte (un borrador de una versión
 * anterior, o un componente nuevo), sin pisar lo que escribió la persona.
 * Sin esto, un borrador con otra forma dejaba la página en blanco.
 */
function withDefaults(stored) {
  const initial = buildInitialState()
  if (!stored || typeof stored !== 'object') return initial
  const componentState = { ...initial.componentState }
  for (const [id, entry] of Object.entries(stored.componentState ?? {})) {
    if (!componentState[id]) continue
    componentState[id] = {
      content: typeof entry?.content === 'string' ? entry.content : '',
      active: entry?.active ?? true,
    }
  }
  const taskTypeId = taskTypes.some((taskType) => taskType.id === stored.taskTypeId)
    ? stored.taskTypeId
    : initial.taskTypeId
  return { ...initial, ...stored, taskTypeId, componentState }
}

const PromptContext = createContext(null)

export function PromptProvider({ children }) {
  const [storedState, setStoredState] = useLocalStorage(STORAGE_KEY, buildInitialState())
  const state = useMemo(() => withDefaults(storedState), [storedState])
  const setState = useCallback(
    (updater) => setStoredState((prev) => updater(withDefaults(prev))),
    [setStoredState],
  )

  const setTaskTypeId = useCallback(
    (taskTypeId) => {
      setState((prev) => ({ ...prev, taskTypeId }))
    },
    [setState],
  )

  const setComponentContent = useCallback(
    (componentId, content) => {
      setState((prev) => ({
        ...prev,
        componentState: {
          ...prev.componentState,
          [componentId]: { ...prev.componentState[componentId], content },
        },
      }))
    },
    [setState],
  )

  const toggleComponentActive = useCallback(
    (componentId) => {
      setState((prev) => ({
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
    [setState],
  )

  const markOnboardingSeen = useCallback(() => {
    setState((prev) => ({ ...prev, onboardingSeen: true }))
  }, [setState])

  // Reiniciar borra el borrador pero no vuelve a mostrar el tour.
  const resetAll = useCallback(() => {
    setState((prev) => ({ ...buildInitialState(), onboardingSeen: prev.onboardingSeen }))
  }, [setState])

  const value = useMemo(
    () => ({
      state,
      setTaskTypeId,
      setComponentContent,
      toggleComponentActive,
      markOnboardingSeen,
      resetAll,
    }),
    [
      state,
      setTaskTypeId,
      setComponentContent,
      toggleComponentActive,
      markOnboardingSeen,
      resetAll,
    ],
  )

  return <PromptContext.Provider value={value}>{children}</PromptContext.Provider>
}

export function usePromptContext() {
  const context = useContext(PromptContext)
  if (!context) {
    throw new Error('usePromptContext debe usarse dentro de un PromptProvider')
  }
  return context
}
