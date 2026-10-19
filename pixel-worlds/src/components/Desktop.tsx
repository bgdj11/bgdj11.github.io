import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { chapters, profile } from '../data/portfolio'
import type { SectionId } from '../data/portfolio'
import { publicAsset } from '../data/assets'
import { CvAction } from './Resume'

const apps: Record<SectionId, { file: string; icon: string }> = {
  home: { file: 'about.exe', icon: 'computer' },
  education: { file: 'education.exe', icon: 'books' },
  experience: { file: 'experience.exe', icon: 'terminal' },
  projects: { file: 'projects.exe', icon: 'folder' },
  'beyond-code': { file: 'hobbies.exe', icon: 'joystick' },
  contact: { file: 'contact.exe', icon: 'globe' },
}
type WindowState = 'open' | 'minimized' | 'closed'
const initialWindows = () => Object.fromEntries(chapters.map(({ id }) => [id, 'open'])) as Record<SectionId, WindowState>
const DesktopContext = createContext<ReturnType<typeof useWindowManager> | null>(null)

function useWindowManager() {
  const [windows, setWindows] = useState(initialWindows)
  const [active, setActive] = useState<SectionId>('home')
  const [maximized, setMaximized] = useState<SectionId | null>(null)
  const [arrangement, setArrangement] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const focus = useCallback((id: SectionId) => setActive(id), [])
  const open = useCallback((id: SectionId, navigate = true) => {
    setWindows(current => ({ ...current, [id]: 'open' }))
    setActive(id)
    if (navigate) {
      const url = new URL(location.href)
      url.hash = id
      if (location.hash !== url.hash) history.pushState(history.state, '', url)
      // Wait for a closed window to rejoin the document before measuring it.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const node = document.getElementById(id)
        node?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
        node?.focus({ preventScroll: true })
      }))
    }
  }, [])
  const hide = (id: SectionId, state: WindowState) => {
    setWindows(current => ({ ...current, [id]: state }))
    setMaximized(current => current === id ? null : current)
    setAnnouncement(`${apps[id].file} ${state}. Open it again from the desktop.`)
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-shortcut="${id}"]`)?.focus({ preventScroll: true }))
  }
  const arrange = () => { setArrangement(value => value + 1); setMaximized(null) }
  const restoreAll = () => { setWindows(initialWindows()); arrange(); open('home') }
  useEffect(() => {
    const followHash = (event?: HashChangeEvent) => {
      // Detail dialogs own project history and restore their exact scroll position.
      if (event && new URL(event.oldURL).searchParams.get('project') !== new URL(event.newURL).searchParams.get('project')) return
      const id = location.hash.slice(1) as SectionId
      if (id in apps) open(id)
    }
    followHash()
    window.addEventListener('hashchange', followHash)
    return () => window.removeEventListener('hashchange', followHash)
  }, [open])
  return { windows, active, focus, open, hide, maximized, setMaximized, arrangement, arrange, restoreAll, announcement }
}

export function DesktopProvider({ children }: { children: ReactNode }) {
  const desktop = useWindowManager()
  return <DesktopContext.Provider value={desktop}>{children}<span className="sr-only" role="status">{desktop.announcement}</span></DesktopContext.Provider>
}
export function useDesktop() {
  const value = useContext(DesktopContext)
  if (!value) throw new Error('DesktopProvider is required')
  return value
}
export function DesktopIcon({ name, className = '' }: { name: string; className?: string }) {
  return <img className={`desktop-icon ${className}`} src={publicAsset(`/media/desktop/${name}.png`)} alt="" draggable={false} />
}

export function DesktopShortcuts() {
  const { open, windows, active } = useDesktop()
  return <nav className="desktop-shortcuts" aria-label="Desktop shortcuts">{chapters.map(({ id, label }) =>
    <button key={id} data-shortcut={id} className={`desktop-shortcut${active === id && windows[id] === 'open' ? ' is-selected' : ''}`} onClick={() => open(id)} aria-label={`Open ${label}`}>
      <DesktopIcon name={apps[id].icon} /><span>{label}</span><i className={windows[id] === 'open' ? 'running' : ''} aria-hidden="true" />
    </button>)}
    <CvAction className="desktop-shortcut cv-shortcut" label="Open CV"><DesktopIcon name="document" /><span>CV</span></CvAction>
  </nav>
}

export function DesktopWindow({ id, children }: { id: SectionId; children: ReactNode }) {
  const desktop = useDesktop()
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ x: number; y: number; left: number; top: number; width: number; offsetX: number; offsetY: number } | null>(null)
  const expanded = desktop.maximized === id
  useEffect(() => { setPosition({ x: 0, y: 0 }) }, [desktop.arrangement, expanded])
  useEffect(() => {
    const reset = () => setPosition({ x: 0, y: 0 })
    window.addEventListener('resize', reset)
    return () => window.removeEventListener('resize', reset)
  }, [])
  const startDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button') || expanded || !matchMedia('(min-width: 901px) and (pointer: fine)').matches) return
    const box = ref.current!.getBoundingClientRect()
    drag.current = { x: event.clientX, y: event.clientY, left: box.left, top: box.top, width: box.width, offsetX: position.x, offsetY: position.y }
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }
  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!drag.current) return
    const d = drag.current
    const x = Math.max(8 - d.left, Math.min(innerWidth - d.width - d.left - 24, event.clientX - d.x))
    const y = Math.max(8 - d.top, Math.min(innerHeight - 100 - d.top, event.clientY - d.y))
    setPosition({ x: d.offsetX + x, y: d.offsetY + y })
  }
  const stopDrag = () => { drag.current = null; setDragging(false) }
  const maximize = () => { desktop.setMaximized(expanded ? null : id); desktop.open(id) }
  return <section ref={ref} id={id} tabIndex={-1} hidden={desktop.windows[id] !== 'open'}
    className={`desktop-window window-${id}${desktop.active === id ? ' is-active' : ''}${expanded ? ' is-maximized' : ''}${dragging ? ' is-dragging' : ''}`}
    style={{ '--window-x': `${position.x}px`, '--window-y': `${position.y}px` } as CSSProperties}
    data-accent={id} aria-labelledby={`${id}-heading`} onPointerDownCapture={() => desktop.focus(id)} onFocusCapture={() => desktop.focus(id)}>
    <header className="window-titlebar" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onLostPointerCapture={stopDrag} onDoubleClick={event => { if (!(event.target as HTMLElement).closest('button')) maximize() }}>
      <DesktopIcon name={apps[id].icon} /><span className="window-filename">{apps[id].file}</span>
      <div className="window-controls">
        <button onClick={() => desktop.hide(id, 'minimized')} aria-label={`Minimize ${apps[id].file}`} title="Minimize"><span className="control-minimize" /></button>
        <button onClick={maximize} aria-label={`${expanded ? 'Restore' : 'Maximize'} ${apps[id].file}`} title={expanded ? 'Restore size' : 'Maximize'}><span className={expanded ? 'control-restore' : 'control-maximize'} /></button>
        <button className="window-close" onClick={() => desktop.hide(id, 'closed')} aria-label={`Close ${apps[id].file}`} title="Close"><span className="control-close">×</span></button>
      </div>
    </header>
    <div className="window-content">{children}</div>
    <div className="window-statusbar" aria-hidden="true"><span>{id === 'home' ? 'A little about me' : id === 'contact' ? 'Let’s make something interesting.' : 'Click an item to explore'}</span><span className="resize-grip">◢</span></div>
  </section>
}

export function PortraitWindow({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true)
  return visible ? <div className="portrait-window"><div className="window-titlebar"><DesktopIcon name="image" /><span className="window-filename">bogdan.jpg</span><div className="window-controls"><button className="window-close" onClick={() => setVisible(false)} aria-label="Close portrait"><span className="control-close">×</span></button></div></div>{children}</div>
    : <button className="portrait-reopen" onClick={() => setVisible(true)}><DesktopIcon name="image" />Open bogdan.jpg</button>
}

export function DesktopTaskbar() {
  const desktop = useDesktop()
  const [menu, setMenu] = useState(false)
  const [time, setTime] = useState(() => new Date())
  const [showingDesktop, setShowingDesktop] = useState(false)
  const visibleBefore = useRef<SectionId[]>([])
  const start = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30_000)
    const outside = (event: PointerEvent) => { if (!menuRef.current?.contains(event.target as Node) && !start.current?.contains(event.target as Node)) setMenu(false) }
    document.addEventListener('pointerdown', outside)
    return () => { clearInterval(timer); document.removeEventListener('pointerdown', outside) }
  }, [])
  const showDesktop = () => {
    if (showingDesktop) visibleBefore.current.forEach(id => desktop.open(id, false))
    else {
      visibleBefore.current = chapters.filter(({ id }) => desktop.windows[id] === 'open').map(({ id }) => id)
      visibleBefore.current.forEach(id => desktop.hide(id, 'minimized'))
    }
    setShowingDesktop(!showingDesktop)
  }
  return <div className="desktop-taskbar" onKeyDown={event => { if (event.key === 'Escape') { setMenu(false); start.current?.focus() } }}>
    {menu && <div className="start-menu" ref={menuRef} id="start-menu"><div className="start-menu-heading"><DesktopIcon name="computer" /><span>{profile.name}<small>A personal universe</small></span></div>
      <nav aria-label="Start menu">{chapters.map(({ id, label }) => <button key={id} onClick={() => { desktop.open(id); setMenu(false) }}><DesktopIcon name={apps[id].icon} />{label}<span>↗</span></button>)}</nav>
      <div className="start-menu-actions"><button onClick={() => { desktop.restoreAll(); setMenu(false); setShowingDesktop(false) }}>Restore all windows</button><button onClick={() => { desktop.arrange(); setMenu(false) }}>Arrange windows</button></div>
    </div>}
    <button className={`start-button${menu ? ' is-pressed' : ''}`} ref={start} aria-expanded={menu} aria-controls="start-menu" onClick={() => setMenu(!menu)}><span className="start-symbol" aria-hidden="true"><i /><i /><i /><i /></span>Start</button>
    <div className="taskbar-windows" aria-label="Running applications">{chapters.filter(({ id }) => desktop.windows[id] !== 'closed').map(({ id }) =>
      <button key={id} className={`taskbar-app${desktop.active === id && desktop.windows[id] === 'open' ? ' is-active' : ''}${desktop.windows[id] === 'minimized' ? ' is-minimized' : ''}`} aria-label={`Show ${apps[id].file}`} onClick={() => { desktop.open(id); setShowingDesktop(false) }}><DesktopIcon name={apps[id].icon} /><span>{apps[id].file}</span></button>)}</div>
    <div className="taskbar-tray"><span className="online-dot" title="Welcome to my personal universe" /><time dateTime={time.toISOString()}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</time></div>
    <button className="show-desktop" title={showingDesktop ? 'Restore windows' : 'Show desktop'} aria-label={showingDesktop ? 'Restore windows' : 'Show desktop'} onClick={showDesktop} />
  </div>
}
