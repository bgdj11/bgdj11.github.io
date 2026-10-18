import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites from /<repository>/ rather than from the
// domain root. Local development keeps the shorter root-relative URL.
const environment = (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
const repository = environment.GITHUB_REPOSITORY?.split('/')[1]
const repositoryBase = repository && !repository.endsWith('.github.io') ? `/${repository}/` : '/'
const base = environment.PAGES_BASE_PATH !== undefined
  ? `${environment.PAGES_BASE_PATH.replace(/\/$/, '')}/`
  : environment.GITHUB_ACTIONS ? repositoryBase : '/'

export default defineConfig({ base, plugins: [react()] })
