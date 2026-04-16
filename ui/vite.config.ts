import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import type { Connect, IncomingMessage, ServerResponse } from 'vite'

const HISTORY_DIR = join(homedir(), '.news-ui', 'history')
const DEFAULT_LIMIT = 7

function getFiles(): string[] {
  if (!existsSync(HISTORY_DIR)) return []
  return readdirSync(HISTORY_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse()
}

function newsApiPlugin() {
  return {
    name: 'news-api',
    configureServer(server: { middlewares: Connect.Server }) {

      // GET /api/digests — latest 7 digests (full data)
      server.middlewares.use('/api/digests', (_req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json')
        try {
          const files = getFiles().slice(0, DEFAULT_LIMIT)
          const digests = files.flatMap(f => {
            try { return [JSON.parse(readFileSync(join(HISTORY_DIR, f), 'utf-8'))] }
            catch { return [] }
          })
          res.end(JSON.stringify(digests))
        } catch {
          res.end(JSON.stringify([]))
        }
      })

      // GET /api/digest-list — all available entries (date + source only, no full content)
      server.middlewares.use('/api/digest-list', (_req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json')
        try {
          const files = getFiles()
          const list = files.map(f => {
            // filename: YYYY-MM-DD-source.json
            const name = f.replace('.json', '')
            const date = name.slice(0, 10)
            const source = name.slice(11)
            return { date, source, file: f }
          })
          res.end(JSON.stringify(list))
        } catch {
          res.end(JSON.stringify([]))
        }
      })

      // GET /api/digest?file=YYYY-MM-DD-source.json — single digest on demand
      server.middlewares.use('/api/digest', (req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json')
        try {
          const url = new URL(req.url!, 'http://localhost')
          const file = url.searchParams.get('file')
          if (!file || !file.endsWith('.json') || file.includes('/')) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Invalid file param' }))
            return
          }
          const content = readFileSync(join(HISTORY_DIR, file), 'utf-8')
          res.end(content)
        } catch {
          res.statusCode = 404
          res.end(JSON.stringify({ error: 'Not found' }))
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), newsApiPlugin()],
  server: {
    port: 3000,
    open: true
  }
})
