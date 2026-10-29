import { useEffect, useState } from 'react'

/** Devuelve `value` recién después de que deje de cambiar durante `delay` ms. */
export function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
