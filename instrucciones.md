# Prompt para Claude Code — Constructor de Prompts Institucional

Copiá y pegá todo este documento como instrucción inicial en Claude Code.

---

## Contexto y objetivo

Necesito que construyas una **aplicación web** llamada "Constructor de Prompts", pensada para compañeros de trabajo que **no saben usar bien la inteligencia artificial**. El objetivo es que armen prompts efectivos para IA (tipo Claude/ChatGPT) completando componentes guiados, sin tener que saber nada de "prompt engineering".

- **Audiencia**: personal no técnico de la empresa. Primero se va a probar con un grupo piloto chico.
- **Idioma**: toda la interfaz y los textos en español (Argentina/neutro).
- **Hosting**: gratuito (Netlify o Vercel). Sin backend, sin base de datos, sin login.
- **Persistencia**: NO hace falta guardar historial ni cuentas de usuario. Sí quiero que use `localStorage` como red de seguridad para no perder lo que la persona esté escribiendo si recarga la página sin querer (esto no es una "cuenta", es solo un borrador local del navegador).
- **Estética**: profesional, institucional, neutra por ahora (todavía no tenemos logo ni colores de marca definidos). Usá variables CSS para colores/tipografía de forma que sea trivial reemplazar la paleta más adelante sin tocar la lógica.
- **Referencia**: tomar como punto de partida conceptual esta app (https://deft-buttercream-611ca3.netlify.app/) pero **superándola** en usabilidad, guía al usuario y contenido de ayuda.

## Stack técnico sugerido

- React + Vite (o Next.js si preferís, pero sin SSR/backend real — todo client-side).
- Sin dependencias de servidor. Todo el estado vive en el cliente.
- Deploy final a Netlify o Vercel (gratis), dejar instrucciones de deploy en el README.
- Responsive: debe verse bien en celular y en desktop.
- Soporte de modo claro/oscuro (toggle simple).

## Estructura general de la app

### 1. Selector inicial de "Tipo de tarea"

Antes (o en la parte superior, siempre visible/editable) de las dos secciones principales, un selector de **tipo de tarea**, que es el que determina las 3 sugerencias que se ofrecen por componente. Lista inicial de tipos (podés ajustar redacción pero mantené el criterio "tipo de tarea a resolver con IA"):

1. Redacción de textos (mails, comunicados, posteos)
2. Análisis de datos / informes
3. Atención al cliente / respuestas a consultas
4. Generación o revisión de código
5. Resumen de documentos
6. Traducción de textos
7. Brainstorming / generación de ideas
8. Revisión y corrección de textos

El selector debe poder cambiarse en cualquier momento sin perder lo ya escrito (las sugerencias por componente simplemente se recalculan).

### 2. Dos secciones principales (layout de dos columnas en desktop, apiladas en mobile)

**Columna/Sección A — Componentes**

Dividida en dos bloques claramente diferenciados visualmente:

- **Esenciales** (siempre destacados, con indicador de "recomendado completar"):
  1. Acción — qué querés que la IA haga concretamente.
  2. Rol — qué "personaje" o expertise debe asumir la IA (ej: "actuá como un abogado laboralista").
  3. Contexto — información de fondo necesaria para que la respuesta tenga sentido.
  4. Formato de salida — cómo tiene que estar estructurada la respuesta (lista, tabla, mail, párrafo corto, etc.).
  5. Tono — formal, informal, empático, técnico, etc.

- **Complementarios** (colapsables/opcionales, sección "Agregar más precisión"):
  1. Ejemplos — casos de ejemplo para guiar el estilo o formato esperado.
  2. Restricciones — qué NO debe hacer o incluir la IA (longitud máxima, temas a evitar, etc.).
  3. Frases obligatorias — texto literal que sí o sí debe aparecer en la respuesta (ej: un saludo institucional, "Sr. Pérez", una firma, un disclaimer legal).
  4. Razonamiento — pedirle a la IA que explique su lógica o el porqué de sus decisiones/respuestas antes o después del resultado.

**Cada componente (esencial o complementario) es una tarjeta con:**

- Título + ícono representativo.
- Un botón **💡 "¿Qué es esto?"** que al apretarlo muestra (tooltip o panel lateral) una definición corta y un ejemplo concreto de ese componente, en lenguaje simple, sin jerga técnica.
- Un botón/switch **"Incluir en el prompt" / "Ocultar"** — al desactivarlo, el componente se atenúa visualmente (opacidad reducida, tachado sutil) y **no se incluye** en el prompt final, aunque tenga contenido escrito (así el usuario puede desactivarlo temporalmente sin perder lo que escribió).
- Un campo de texto libre (textarea) para que la persona escriba su propio contenido.
- Un botón **"Sugerirme opciones"** que, según el tipo de tarea seleccionado, muestra **3 alternativas** de cómo redactar ese componente específico (ej: para "Tono" en tipo de tarea "Atención al cliente", ofrecer 3 variantes: "Cordial y cercano", "Formal y directo", "Empático y paciente", cada una con una redacción de ejemplo lista para usar). Al elegir una, se carga en el textarea y la persona puede editarla libremente.

> Nota para vos, Claude Code: generá contenido real (definiciones + las 3 sugerencias por componente y por tipo de tarea) para los 8 tipos de tarea x 9 componentes. No lo dejes como placeholder "Lorem ipsum". Si es mucho contenido, empezá por los tipos "Redacción de textos", "Atención al cliente" y "Análisis de datos" con contenido completo y de calidad, y para el resto generá contenido igual de cuidado siguiendo el mismo patrón — no reduzcas la calidad por volumen.

**Columna/Sección B — Prompt final**

- Vista previa en tiempo real del prompt ensamblado, actualizándose a medida que se completan los componentes.
- Formateado de forma prolija y legible (por ejemplo con encabezados tipo "Rol:", "Contexto:", "Tarea:", etc., o en prosa fluida — elegí el formato que genere mejores resultados con modelos de IA actuales, priorizando claridad).
- Solo se incluyen los componentes activos (no ocultos) y con contenido.
- Checklist/indicador de progreso: cuántos de los 5 esenciales están completos (ej: "3 de 5 esenciales completos"), sin bloquear el uso si falta alguno.
- Si falta un esencial al momento de copiar, mostrar un aviso amigable no bloqueante (ej: "Che, todavía no completaste el Formato de salida, ¿seguro querés copiar así?" con opción de continuar igual).
- Botón **"Copiar al portapapeles"** con confirmación visual (ej: "¡Copiado!").
- Botón **"Descargar como .txt"**.
- Contador de caracteres/palabras del prompt final.
- Botón **"Reiniciar todo"** con confirmación antes de borrar.
- Botón **"Ver un ejemplo completo"**: muestra un prompt de muestra ya armado para el tipo de tarea seleccionado, para que quien no sabe por dónde arrancar tenga una referencia concreta (no reemplaza lo que esté escribiendo, se ve aparte, ej. en un modal).

### 3. Onboarding / primera vez

Un tour corto (3 pasos, tipo tooltip guiado o modal simple) la primera vez que se abre la app, explicando: 1) elegí el tipo de tarea, 2) completá los componentes esenciales (usá las sugerencias si no sabés qué poner), 3) copiá el prompt final y pegalo en tu IA favorita. Debe poder cerrarse/saltarse y no volver a aparecer (guardado en localStorage).

### 4. Detalles de UX a cuidar

- Todo el copy debe estar en lenguaje simple, evitando términos técnicos de IA ("prompt engineering", "tokens", etc.) salvo que se expliquen.
- Prioridad visual clara: los esenciales deben notarse más importantes que los complementarios, pero sin que los complementarios se sientan "escondidos" u opcionales de segunda clase.
- Feedback visual inmediato en cada acción (copiar, ocultar, elegir sugerencia).
- Accesibilidad básica: buen contraste, tamaños de fuente legibles, navegación por teclado en los botones principales.

## Entregables esperados

1. Aplicación funcional completa (todas las pantallas descriptas arriba).
2. README con instrucciones de instalación local y de deploy a Netlify/Vercel gratis.
3. Contenido real (no placeholder) para definiciones y sugerencias de todos los componentes, para al menos los 8 tipos de tarea listados.
4. Código organizado en componentes reutilizables (uno por tipo de tarjeta de componente, uno para el panel de prompt final, uno para el selector de tipo de tarea, etc.) para que después sea fácil sumar más tipos de tarea o ajustar textos sin tocar lógica.

## Preguntas que Claude Code puede/debe resolver por su cuenta (no hace falta volver a preguntarme salvo bloqueo real)

- Formato exacto del prompt final ensamblado (con encabezados vs. prosa) — elegí el que dé mejores resultados.
- Nombres de íconos/librería de íconos a usar (ej: lucide-react).
- Estructura de carpetas del proyecto.
- Redacción exacta de las definiciones y sugerencias (mientras sean claras, correctas y en español simple).

Si hay algo que sí bloquea el avance (por ejemplo, una decisión de arquitectura con trade-offs grandes), preguntámelo antes de asumir.
