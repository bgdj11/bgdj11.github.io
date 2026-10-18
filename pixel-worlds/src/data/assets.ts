/** Resolves a public file for local Vite and repository-hosted GitHub Pages. */
export const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
