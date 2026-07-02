# Constructor de Prompts Institucional — Diseño

Fecha: 2026-07-02
Fuente: `instrucciones.md` (spec original del usuario)

## Contexto y objetivo

Aplicación web para que personal no técnico de la empresa arme prompts efectivos para IA (Claude/ChatGPT) completando componentes guiados, sin saber nada de "prompt engineering". Interfaz 100% en español (Argentina/neutro), sin backend, sin login, sin base de datos. Piloto con grupo chico.

## Stack técnico

- **React + Vite**, client-only (sin SSR, no hace falta Next.js).
- **CSS plano con variables** (`src/styles/variables.css`) para colores/tipografía — así la paleta institucional se reemplaza después tocando un solo archivo, sin tocar lógica ni componentes.
- **Iconos**: `lucide-react`.
- **Estado**: React Context (`PromptContext`) + hook `useLocalStorage` para persistir el borrador (tipo de tarea elegido + contenido/estado de cada componente + flag de onboarding visto + tema claro/oscuro).
- **Sin librerías de estado externas** (Redux/Zustand) — el volumen de estado es chico y Context alcanza.
- **Deploy**: Netlify o Vercel (gratis), instrucciones en README.
- **Responsive**: layout de dos columnas en desktop, apiladas en mobile (CSS Grid/Flexbox + media queries, sin librería de UI).

## Estructura de carpetas

```
src/
  main.jsx
  App.jsx
  components/
    TaskTypeSelector.jsx     — selector de tipo de tarea (siempre visible/editable)
    ComponentCard.jsx        — tarjeta genérica reutilizable (título+ícono, "¿Qué es esto?",
                                switch incluir/ocultar, textarea, botón "Sugerirme opciones")
    EssentialsSection.jsx    — agrupa los 5 componentes esenciales
    ComplementsSection.jsx   — agrupa los 4 componentes complementarios (colapsable)
    PromptPreview.jsx        — vista previa, progreso, copiar, descargar, reiniciar, ver ejemplo
    OnboardingTour.jsx       — tour de 3 pasos, primera visita
    ExampleModal.jsx         — modal con prompt de ejemplo completo por tipo de tarea
    ThemeToggle.jsx          — toggle modo claro/oscuro
  context/
    PromptContext.jsx        — estado global: taskTypeId, valores por componente
                                (contenido + activo/oculto), tema, onboarding visto
  hooks/
    useLocalStorage.js       — persistencia genérica en localStorage
  data/
    taskTypes.js             — los 8 tipos de tarea
    componentDefs.js         — los 9 componentes: id, título, ícono, definición corta,
                                ejemplo concreto (para "¿Qué es esto?")
    suggestions.js           — taskTypeId → componentId → array de 3 sugerencias
                                {etiqueta, texto}
    fullExamples.js          — taskTypeId → prompt de ejemplo completo ya armado
  utils/
    promptFormatter.js       — arma el texto final del prompt a partir del estado
  styles/
    variables.css
    global.css
```

Cada tipo de tarjeta de componente usa el mismo `ComponentCard.jsx` parametrizado por su definición (`componentDefs.js`) — no hay un componente por cada uno de los 9, evita duplicación.

## Componentes de la app y su comportamiento

**TaskTypeSelector**: dropdown/selector de los 8 tipos de tarea. Cambiarlo solo recalcula qué sugerencias ofrece cada tarjeta — no borra contenido ya escrito.

**ComponentCard** (una por componente, esencial o complementario):
- Título + ícono.
- Botón "💡 ¿Qué es esto?" → tooltip/panel con definición + ejemplo, lenguaje simple.
- Switch "Incluir en el prompt" / "Ocultar" → si está ocultado: opacidad reducida + tachado sutil, y se excluye del prompt final aunque tenga texto.
- Textarea de contenido libre.
- Botón "Sugerirme opciones" → muestra 3 alternativas según tipo de tarea + componente; elegir una carga el texto en el textarea (editable después).

**EssentialsSection**: los 5 esenciales (Acción, Rol, Contexto, Formato de salida, Tono), siempre destacados visualmente, con indicador "recomendado completar".

**ComplementsSection**: los 4 complementarios (Ejemplos, Restricciones, Frases obligatorias, Razonamiento) en sección colapsable "Agregar más precisión" — visible y accesible, no escondida como si fuera de segunda clase.

**PromptPreview**:
- Texto ensamblado en tiempo real, formato con encabezados en español ("Rol:", "Tarea:", "Contexto:", "Formato de salida:", "Tono:", y los complementarios activos con su propio encabezado). Se eligió formato con encabezados sobre prosa libre porque es más fácil de parsear tanto para el usuario (revisar/editar) como para el modelo de IA destino.
- Solo entran componentes activos (no ocultos) y con contenido no vacío.
- Contador "X de 5 esenciales completos".
- Al copiar: si falta algún esencial, aviso no bloqueante ("Che, todavía no completaste...") con opción de continuar.
- Botones: Copiar al portapapeles (con confirmación visual), Descargar .txt, Reiniciar todo (con confirmación), Ver un ejemplo completo (modal).
- Contador de caracteres/palabras.

**OnboardingTour**: 3 pasos (elegí tipo de tarea → completá esenciales, usá sugerencias si hace falta → copiá y pegá en tu IA), tooltip guiado o modal simple. Se puede saltar/cerrar. Flag `onboardingSeen` en localStorage evita que vuelva a aparecer.

## Flujo de datos

1. Usuario elige `taskTypeId` en `TaskTypeSelector` → se guarda en `PromptContext` + localStorage.
2. Cada `ComponentCard` lee/escribe su propio slice de estado (`{ content, active }`) en `PromptContext`.
3. Botón "Sugerirme opciones" consulta `suggestions[taskTypeId][componentId]` (dato estático, sin llamada de red).
4. `PromptPreview` deriva el texto final vía `promptFormatter(state)` — función pura, sin side effects, recalculada en cada render por cambio de estado (sin necesidad de memoización agresiva dado el tamaño del estado).
5. Todo el estado relevante (taskTypeId, valores de componentes, tema, onboarding) persiste en localStorage vía `useLocalStorage`, se rehidrata al cargar la página.

## Manejo de errores / casos borde

- `localStorage` no disponible o lleno (modo incógnito estricto, cuota excedida): `useLocalStorage` debe capturar el error y degradar a estado en memoria sin romper la app (la persistencia es "red de seguridad", no requisito funcional).
- Copiar al portapapeles falla (API no disponible/permiso denegado): fallback visual con mensaje de error y opción de seleccionar el texto manualmente.
- Ningún componente completo al momento de ver el prompt: mostrar estado vacío amigable en `PromptPreview`, no un bloque en blanco confuso.
- Cambio de tipo de tarea con contenido ya escrito: nunca se borra contenido, solo cambian las sugerencias ofrecidas.

## Contenido (datos)

`componentDefs.js`: 9 definiciones fijas (no varían por tipo de tarea) — título, ícono, definición corta, ejemplo concreto de uso.

`suggestions.js` y `fullExamples.js`: contenido real y de calidad para los 8 tipos de tarea. Orden de implementación por prioridad de calidad/detalle:
1. Redacción de textos, Atención al cliente, Análisis de datos/informes — contenido completo primero.
2. Generación/revisión de código, Resumen de documentos, Traducción de textos, Brainstorming, Revisión y corrección de textos — mismo nivel de cuidado, sin placeholders "lorem ipsum" en ningún caso.

Cada componente × tipo de tarea tiene exactamente 3 sugerencias con etiqueta corta + texto redactado listo para usar y editar.

## Testing

No se agregan tests automatizados formales (fuera de alcance dado el tamaño y naturaleza 100% client-side/estática del proyecto) — verificación manual en navegador (desktop + mobile, modo claro/oscuro, flujo completo de los 8 tipos de tarea) antes de considerar el trabajo terminado.

## Entregables

1. App funcional completa según lo descripto arriba.
2. README con instrucciones de instalación local y deploy a Netlify/Vercel.
3. Contenido real (sin placeholders) para los 8 tipos de tarea × 9 componentes.
4. Código organizado en componentes reutilizables y datos separados de lógica, para poder sumar tipos de tarea o ajustar textos sin tocar componentes.

## Notas de repositorio

El `git` de nivel superior detectado en el entorno apunta a la carpeta de usuario completa (`C:/Users/Valee`), no al proyecto. Por decisión del usuario, no se hacen commits durante este trabajo — el control de versiones queda a su cargo.
