import { createRequire } from 'node:module'
import path from 'node:path'
import { PDFDocument } from 'pdf-lib'
import { createCanvas, GlobalFonts } from '@napi-rs/canvas'
import { detectPii } from '../src/utils/piiDetector.js'

/**
 * Anonimiza un .pdf de forma irreversible.
 *
 * Por qué no alcanza con dibujar rectángulos negros (pdf-lib): un recuadro
 * encima del texto solo lo tapa visualmente, el texto original sigue en el
 * archivo y se puede seleccionar, copiar o extraer. Acá cada página se
 * re-dibuja como imagen con los datos tapados y se arma un PDF nuevo con
 * esas imágenes, así el texto original no viaja en el archivo de salida.
 *
 * Costo: el PDF resultante no tiene texto seleccionable (es una "foto" de
 * cada página) y pesa más que el original.
 */

const RENDER_SCALE = 2 // ~144 ppp: legible al imprimir
const JPEG_QUALITY = 82
const BOX_PADDING = 2 // puntos PDF alrededor de cada dato tapado

const require = createRequire(import.meta.url)
const pdfjsRoot = path.dirname(require.resolve('pdfjs-dist/package.json'))
// pdfjs exige separador "/" final, también en Windows.
const standardFontDataUrl = `${path.join(pdfjsRoot, 'standard_fonts').split(path.sep).join('/')}/`

/**
 * Texto de la página concatenado + de qué ítem de texto sale cada
 * carácter, para poder ubicar en la página cada hallazgo.
 */
function buildPageText(items) {
  let text = ''
  const owner = []
  items.forEach((item, itemIndex) => {
    for (let i = 0; i < item.str.length; i++) owner.push({ itemIndex, offset: i })
    text += item.str
    // Separador entre ítems: salto si pdfjs marca fin de línea, si no espacio.
    text += item.hasEOL ? '\n' : ' '
    owner.push(null)
  })
  return { text, owner }
}

// pdfjs da el ancho exacto de cada ítem de texto, pero no el de cada
// carácter. Para ubicar un dato dentro de una línea se mide qué fracción del
// ítem ocupa el texto anterior con Liberation Sans (métricamente compatible
// con Arial/Helvetica, viene con pdfjs). Promediar por cantidad de
// caracteres dejaba dígitos sin tapar en fuentes proporcionales.
GlobalFonts.registerFromPath(path.join(pdfjsRoot, 'standard_fonts', 'LiberationSans-Regular.ttf'), 'PiiMeasure')
const measureContext = createCanvas(10, 10).getContext('2d')
measureContext.font = '100px PiiMeasure'

function measure(text) {
  return measureContext.measureText(text).width
}

/**
 * Rectángulos (en coordenadas PDF) que cubren los caracteres [start, end).
 * Se agregan ¾ de carácter de margen a cada lado: tapar de más es
 * preferible a dejar un dígito a la vista.
 */
function boxesFor(finding, items, owner, styles) {
  const spans = new Map() // itemIndex -> { from, to }
  for (let i = finding.start; i < finding.end; i++) {
    const ref = owner[i]
    if (!ref) continue
    const span = spans.get(ref.itemIndex) ?? { from: ref.offset, to: ref.offset }
    span.from = Math.min(span.from, ref.offset)
    span.to = Math.max(span.to, ref.offset)
    spans.set(ref.itemIndex, span)
  }

  const boxes = []
  for (const [itemIndex, span] of spans) {
    const item = items[itemIndex]
    const [a, b, c, d, x, y] = item.transform
    const fontHeight = Math.hypot(c, d) || item.height || 10
    const length = item.str.length || 1
    const itemWidth = item.width || fontHeight * 0.5 * length
    const charWidth = itemWidth / length
    const angle = Math.atan2(b, a)

    // En fuentes monoespaciadas el cálculo por índice es exacto.
    const isMonospace = styles[item.fontName]?.fontFamily === 'monospace'
    const measuredTotal = isMonospace ? 0 : measure(item.str)
    let startX
    let endX
    if (measuredTotal > 0) {
      const scale = itemWidth / measuredTotal
      startX = measure(item.str.slice(0, span.from)) * scale
      endX = measure(item.str.slice(0, span.to + 1)) * scale
    } else {
      startX = span.from * charWidth
      endX = (span.to + 1) * charWidth
    }
    startX -= charWidth * 0.75
    endX += charWidth * 0.75
    boxes.push({
      x,
      y,
      angle,
      left: startX - BOX_PADDING,
      right: endX + BOX_PADDING,
      bottom: -fontHeight * 0.3 - BOX_PADDING,
      top: fontHeight * 1.05 + BOX_PADDING,
    })
  }
  return boxes
}

function drawBoxes(context, viewport, boxes) {
  context.fillStyle = '#000000'
  for (const box of boxes) {
    const corners = [
      [box.left, box.bottom],
      [box.right, box.bottom],
      [box.right, box.top],
      [box.left, box.top],
    ].map(([u, v]) => {
      // Rota en el sistema del texto y convierte a coordenadas del canvas.
      const px = box.x + u * Math.cos(box.angle) - v * Math.sin(box.angle)
      const py = box.y + u * Math.sin(box.angle) + v * Math.cos(box.angle)
      return viewport.convertToViewportPoint(px, py)
    })
    context.beginPath()
    context.moveTo(corners[0][0], corners[0][1])
    for (const [cx, cy] of corners.slice(1)) context.lineTo(cx, cy)
    context.closePath()
    context.fill()
  }
}

/**
 * @param {Buffer|Uint8Array} input contenido del .pdf
 * @returns {Promise<{ output: Buffer, findings: object[], pagesWithoutText: number[] }>}
 */
export async function anonymizePdf(input) {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loadingTask = getDocument({
    data: new Uint8Array(input),
    standardFontDataUrl,
    useSystemFonts: false,
    isEvalSupported: false,
    verbosity: 0,
  })
  const source = await loadingTask.promise

  const output = await PDFDocument.create()
  const findings = []
  const pagesWithoutText = []

  try {
    for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber++) {
      const page = await source.getPage(pageNumber)
      const content = await page.getTextContent()
      const items = content.items.filter((item) => typeof item.str === 'string')
      if (!items.some((item) => item.str.trim())) pagesWithoutText.push(pageNumber)

      const { text, owner } = buildPageText(items)
      const pageFindings = detectPii(text)
      findings.push(...pageFindings)

      const viewport = page.getViewport({ scale: RENDER_SCALE })
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height))
      const context = canvas.getContext('2d')
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      await page.render({ canvas, canvasContext: context, viewport }).promise

      drawBoxes(
        context,
        viewport,
        pageFindings.flatMap((finding) => boxesFor(finding, items, owner, content.styles)),
      )

      const jpeg = await canvas.encode('jpeg', JPEG_QUALITY)
      const image = await output.embedJpg(jpeg)
      const { width, height } = page.getViewport({ scale: 1 })
      const outPage = output.addPage([width, height])
      outPage.drawImage(image, { x: 0, y: 0, width, height })
      page.cleanup()
    }
  } finally {
    await loadingTask.destroy()
  }

  output.setTitle('Documento anonimizado')
  output.setAuthor('')
  output.setCreator('Constructor de Prompts — Contrataciones Públicas')
  output.setProducer('')

  return { output: Buffer.from(await output.save()), findings, pagesWithoutText }
}
