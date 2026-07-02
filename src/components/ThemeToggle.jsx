import { Sun, Moon } from 'lucide-react'
import { usePromptContext } from '../context/PromptContext.jsx'
import './ThemeToggle.css'

export function ThemeToggle() {
  const { state, setTheme } = usePromptContext()
  const isDark = state.theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
      <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  )
}
