import {
  Target,
  Drama,
  BookOpen,
  LayoutTemplate,
  MessageCircleHeart,
  ListChecks,
  Ban,
  Quote,
  Brain,
  CircleHelp,
} from 'lucide-react'

/**
 * Resuelve el nombre de ícono guardado en componentDefs.js (string, sin
 * dependencia de React) al componente real de lucide-react.
 */
const iconMap = {
  Target,
  Drama,
  BookOpen,
  LayoutTemplate,
  MessageCircleHeart,
  ListChecks,
  Ban,
  Quote,
  Brain,
}

export function resolveIcon(iconName) {
  return iconMap[iconName] ?? CircleHelp
}
