import { useEffect, useRef, useState } from 'react'
import { chapters, profile } from '../data/portfolio'
import type { SectionId } from '../data/portfolio'
import { CvAction } from './Contact'

export function useActiveSection() {
  const [active, setActive] = useState<SectionId>('home')
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const marker = Math.max(140, innerHeight * .28)
      let current: SectionId = 'home'
      for (const { id } of chapters) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= marker) current = id
      }
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) current = 'contact'
      setActive(current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    const observer = new ResizeObserver(schedule)
    const main = document.querySelector('main')
    if (main) observer.observe(main)
    measure()
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])
  return active
}

export function Navigation({ active }: { active: SectionId }) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  useEffect(() => {
    const wide = matchMedia('(min-width: 1321px)')
    const close = () => setOpen(false)
    wide.addEventListener('change', close)
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) close() }
    document.addEventListener('pointerdown', outside)
    return () => { wide.removeEventListener('change', close); document.removeEventListener('pointerdown', outside) }
  }, [])
  return <header className="site-header" data-accent={active} ref={header} onKeyDown={event => {
    if (event.key === 'Escape' && open) { setOpen(false); toggle.current?.focus() }
  }}>
    <a className="brand" href="#home" onClick={() => setOpen(false)} aria-label={profile.name + ', home'}><span className="pixel-mark" aria-hidden="true"><i /><i /><i /><i /></span>{profile.name}<span className="brand-period">.</span></a>
    <div className="mobile-nav-actions"><CvAction compact className="nav-cv" /><button ref={toggle} className="button menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button></div>
    <nav id="main-navigation" className={open ? 'is-open' : ''} aria-label="Main navigation">
      {chapters.map(({ id, label }) => <a key={id} href={'#' + id} className={active === id ? 'nav-link is-active' : 'nav-link'} aria-current={active === id ? 'location' : undefined} onClick={() => { setOpen(false); if (matchMedia('(max-width: 1320px)').matches) toggle.current?.focus() }}>{label}</a>)}
      <CvAction className="nav-cv desktop-cv" compact />
    </nav>
  </header>
}

export function ChapterRail({ active }: { active: SectionId }) {
  return <nav className="chapter-rail" data-accent={active} aria-label="Chapter navigation">{chapters.map(({ id, number, label }) => <a key={id} href={'#' + id} className={active === id ? 'is-active' : ''} aria-label={number + ': ' + label} aria-current={active === id ? 'location' : undefined}><span>{label}</span><i /></a>)}</nav>
}
