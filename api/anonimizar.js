import { anonymizeDocx } from '../server/anonymizeDocx.js'
import { anonymizePdf } from '../server/anonymizePdf.js'
import { summarizePii } from '../src/utils/piiDetector.js'

/**
 * POST /api/anonimizar
 *
 * Cuerpo: el archivo crudo (.docx o .pdf), sin multipart. Encabezado
 * opcional `X-File-Name` (URI-encoded) para nombrar la descarga.
 * Respuesta: el archivo anonimizado, en el mismo formato, y un resumen en el
 * encabezado `X-Anonimizacion` (JSON URI-encoded).
 *
 * El contenido nunca se guarda ni se loguea: se procesa en memoria y se
 * devuelve.
 */

// Vercel limita el cuerpo de una función a 4,5 MB (pedido y respuesta).
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

function detectFormat(bytes) {
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return 'pdf' // %PDF
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) return 'docx' // PK.. (zip)
  return null
}

function errorResponse(status, message) {
  return Response.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } })
}

function outputName(rawName, format) {
  let name = 'documento'
  try {
    name = decodeURIComponent(rawName ?? '') || name
  } catch {
    // Nombre mal codificado: se usa el genérico.
  }
  const base = name.replace(/\.(docx|pdf)$/i, '').replace(/[^\w\-. áéíóúñÁÉÍÓÚÑ]/g, '_') || 'documento'
  return `${base}-anonimizado.${format}`
}

export async function handleAnonymize(request) {
  if (request.method !== 'POST') return errorResponse(405, 'Usá POST con el archivo en el cuerpo.')

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_UPLOAD_BYTES) {
    return errorResponse(413, 'El archivo supera el máximo de 4 MB.')
  }

  const bytes = new Uint8Array(await request.arrayBuffer())
  if (bytes.length === 0) return errorResponse(400, 'No llegó ningún archivo.')
  if (bytes.length > MAX_UPLOAD_BYTES) return errorResponse(413, 'El archivo supera el máximo de 4 MB.')

  const format = detectFormat(bytes)
  if (!format) return errorResponse(415, 'Formato no soportado: subí un archivo .docx o .pdf.')

  try {
    const result = format === 'docx' ? await anonymizeDocx(bytes) : await anonymizePdf(bytes)
    const summary = {
      format,
      total: result.findings.length,
      byType: summarizePii(result.findings),
      pagesWithoutText: result.pagesWithoutText ?? [],
      pagesWithAnnotations: result.pagesWithAnnotations ?? [],
    }
    const fileName = outputName(request.headers.get('x-file-name'), format)

    return new Response(result.output, {
      status: 200,
      headers: {
        'Content-Type': format === 'docx' ? DOCX_TYPE : 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        'X-Anonimizacion': encodeURIComponent(JSON.stringify(summary)),
        'X-File-Name': encodeURIComponent(fileName),
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('anonimizar: error procesando archivo', format, error?.message)
    return errorResponse(
      422,
      error?.expose
        ? error.message
        : 'No se pudo procesar el archivo. Verificá que no esté dañado ni protegido con contraseña.',
    )
  }
}

export default {
  fetch: handleAnonymize,
}
