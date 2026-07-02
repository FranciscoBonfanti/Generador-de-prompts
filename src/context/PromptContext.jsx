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
    theme: 'light',
    onboardingSeen: false,
  }
}

const PromptContext = createContext(null)

export function PromptProvider({ children }) {
  const [state, setState] = useLocalStorage(STORAGE_KEY, buildInitialState())

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

  const setTheme = useCallback(
    (theme) => {
      setState((prev) => ({ ...prev, theme }))
    },
    [setState],
  )

  const markOnboardingSeen = useCallback(() => {
    setState((prev) => ({ ...prev, onboardingSeen: true }))
  }, [setState])

  const resetAll = useCallback(() => {
    setState(buildInitialState())
  }, [setState])

  const value = useMemo(
    () => ({
      state,
      setTaskTypeId,
      setComponentContent,
      toggleComponentActive,
      setTheme,
      markOnboardingSeen,
      resetAll,
    }),
    [
      state,
      setTaskTypeId,
      setComponentContent,
      toggleComponentActive,
      setTheme,
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
