import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * En `npm run dev` no corren las funciones de Vercel: este plugin monta
 * /api/anonimizar sobre el mismo handler que se despliega (api/anonimizar.js),
 * así el anonimizador de archivos se puede probar localmente.
 */
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/anonimizar', async (req, res) => {
        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        const request = new Request(`http://localhost${req.originalUrl}`, {
          method: req.method,
          headers: req.headers,
          body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
        })
        const { handleAnonymize } = await server.ssrLoadModule('/api/anonimizar.js')
        const response = await handleAnonymize(request)
        res.statusCode = response.status
        response.headers.forEach((value, key) => res.setHeader(key, value))
        res.end(Buffer.from(await response.arrayBuffer()))
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localApi()],
})
