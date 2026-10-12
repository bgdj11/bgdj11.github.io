import { useEffect, useState } from 'react'
import { chapters, profile } from '../data/portfolio'
import type { SectionId } from '../data/portfolio'
import { Icon } from './Icon'

export function useActiveSection() {
  const [active, setActive] = useState<SectionId>('home')
  useEffect(() => {
    // A band just below the fixed navbar works for both short chapters and
    // content-rich sections that extend over several viewport heights.
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(entry.target.id as SectionId)
      }
    }, { rootMargin: '-18% 0px -65% 0px', threshold: 0 })
    chapters.forEach(({ id }) => {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])
  return active
}

export function CvAction({ onMissing, className = 'button button-secondary', compact = false }: {
  onMissing: () => void; className?: string; compact?: boolean
}) {
  const content = <>{compact ? 'CV' : 'Download CV'}<Icon name="download" /></>
  return profile.cvUrl
    ? <a className={className} href={profile.cvUrl} download>{content}</a>
    : <button className={className} onClick={onMissing} aria-label={compact ? 'CV — not yet attached' : 'Download CV — not yet attached'}>{content}</button>
}

export function Navigation({ active, onCv }: { active: SectionId; onCv: () => void }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label={`${profile.name}, home`}>
        <span className="pixel-mark" aria-hidden="true"><i /><i /><i /><i /></span>
        <span>Bogdan Djukic<span className="brand-period">.</span></span>
      </a>
      <nav aria-label="Main navigation">
        {chapters.map(({ id, label }) => <a key={id} href={`#${id}`} className={active === id ? 'nav-link is-active' : 'nav-link'} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
        <CvAction onMissing={onCv} className="nav-cv" compact />
      </nav>
    </header>
  )
}

export function ChapterRail({ active }: { active: SectionId }) {
  return <nav className="chapter-rail" aria-label="Chapter navigation">{chapters.map(({ id, number, title }) => <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} aria-label={`${number}: ${title}`} aria-current={active === id ? 'location' : undefined}><span>{title}</span><i /></a>)}</nav>
}
