import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import type { ProjectDocument } from '../data/portfolio'

/** Static exports of the author's decks, rendered one original page at a time. */
export default function PresentationViewer({ document: resource, mode = 'slides' }: { document: ProjectDocument; mode?: 'slides' | 'document' | 'preview' }) {
  const pageLabel = mode === 'slides' ? 'slide' : 'page'
  const container = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [width, setWidth] = useState(800)
  const [viewportHeight, setViewportHeight] = useState(innerHeight)
  const [error, setError] = useState('')
  const [rendering, setRendering] = useState(true)
  useEffect(() => {
    let disposed = false
    let task: ReturnType<typeof import('pdfjs-dist')['getDocument']> | undefined
    setPdf(null); setPage(1); setError('')
    void import('pdfjs-dist').then(async engine => {
      engine.GlobalWorkerOptions.workerSrc = workerUrl
      if (disposed) return
      task = engine.getDocument({ url: resource.url })
      const result = await task.promise
      if (!disposed) setPdf(result)
    }).catch(() => { if (!disposed) { setError('The PDF could not load.'); setRendering(false) } })
    return () => { disposed = true; void task?.destroy() }
  }, [resource.url])
  useEffect(() => {
    const node = container.current
    if (!node) return
    const observer = new ResizeObserver(() => setWidth(node.clientWidth))
    observer.observe(node)
    const resize = () => setViewportHeight(innerHeight)
    window.addEventListener('resize', resize)
    return () => { observer.disconnect(); window.removeEventListener('resize', resize) }
  }, [])
  useEffect(() => {
    if (!pdf || !canvas.current) return
    let disposed = false
    let task: ReturnType<Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']> | undefined
    setRendering(true)
    void pdf.getPage(page).then(async slide => {
      if (disposed || !canvas.current) return
      const base = slide.getViewport({ scale: 1 })
      const fitWidth = Math.max(1, width - (mode === 'preview' ? 0 : 24)) / base.width
      const scale = mode === 'document' ? fitWidth * zoom : mode === 'preview' ? fitWidth : Math.min(fitWidth, Math.max(220, viewportHeight - 220) / base.height)
      const viewport = slide.getViewport({ scale })
      const node = canvas.current
      const ratio = Math.min(devicePixelRatio || 1, 2)
      node.width = Math.ceil(viewport.width * ratio); node.height = Math.ceil(viewport.height * ratio)
      node.style.width = `${viewport.width}px`; node.style.height = `${viewport.height}px`
      task = slide.render({ canvas: node, viewport, transform: [ratio, 0, 0, ratio, 0, 0] })
      await task.promise
      if (!disposed) setRendering(false)
    }).catch(reason => { if (!disposed && reason.name !== 'RenderingCancelledException') { setError('Unable to render this page.'); setRendering(false) } })
    return () => { disposed = true; task?.cancel() }
  }, [pdf, page, width, viewportHeight, mode, zoom])
  const next = (offset: number) => setPage(value => Math.max(1, Math.min(pdf?.numPages ?? 1, value + offset)))
  return <div className={`presentation-viewer${mode === 'document' ? ' document-viewer' : mode === 'preview' ? ' pdf-preview' : ''}`} ref={container} role="region" aria-label={resource.title} tabIndex={mode === 'preview' ? undefined : 0} onKeyDown={event => {
    if (mode === 'preview') return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); event.stopPropagation(); next(event.key === 'ArrowLeft' ? -1 : 1) }
  }}>
    {mode === 'document' && <div className="document-controls" aria-label="PDF zoom">
      <button type="button" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .25))} aria-label="Zoom out">−</button>
      <span aria-live="polite">{Math.round(zoom * 100)}%</span>
      <button type="button" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .25))} aria-label="Zoom in">+</button>
      <button type="button" onClick={() => setZoom(1)}>Fit width</button>
    </div>}
    <div className="slide-canvas" aria-busy={rendering}>
      {error ? <p role="alert">{error}</p> : <canvas ref={canvas} aria-label={`${resource.title}, ${pageLabel} ${page}`} role="img" />}
      {!pdf && !error && <p role="status">Loading PDF…</p>}
      {mode !== 'preview' && <><button className="gallery-arrow gallery-previous" disabled={!pdf || page === 1} onClick={() => next(-1)} aria-label={`Previous ${pageLabel}`}>‹</button>
      <span className="gallery-count" role="status" aria-live="polite">{page} / {pdf?.numPages ?? '…'}</span>
      <button className="gallery-arrow gallery-next" disabled={!pdf || page === pdf.numPages} onClick={() => next(1)} aria-label={`Next ${pageLabel}`}>›</button></>}
    </div>
    {mode === 'slides' && <div className="presentation-links"><a href={resource.url} target="_blank" rel="noopener noreferrer">Open PDF ↗</a>{resource.original && <a href={resource.original} download>Original PPTX ↓</a>}</div>}
  </div>
}
