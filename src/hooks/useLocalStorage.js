import { useEffect, useState } from 'react'

/**
 * Persiste un valor en localStorage. Si localStorage no está disponible
 * (incógnito estricto, cuota excedida, etc.) degrada a estado en memoria
 * sin romper la app — la persistencia es una red de seguridad, no un
 * requisito funcional.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage no disponible: se sigue usando el estado en memoria.
    }
  }, [key, value])

  return [value, setValue]
}
