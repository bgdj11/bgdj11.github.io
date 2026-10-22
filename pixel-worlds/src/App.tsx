import { useEffect } from 'react'
import { chapters, education, experience, hobbies, profile } from './data/portfolio'
import { useActiveSection } from './hooks/useActiveSection'
import { WorldSection } from './components/WorldSection'
import { ProjectCollection } from './components/Projects'
import { DetailDialog, useDetails } from './components/DetailDialog'
import { SpaceScene } from './components/SpaceScene'
import { FramedImage } from './components/Media'
import { AcademicEntry, HobbyCard, ExperienceEntry } from './components/Entries'
import { SocialLink } from './components/Contact'
import { ResumePreview, ResumeProvider, ResumeModal } from './components/Resume'
import { DesktopProvider, DesktopShortcuts, DesktopTaskbar, PlanetExplorer, PortraitWindow, useDesktop } from './components/Desktop'

export function App() {
  usePressedCursor()
  return <ResumeProvider><DesktopProvider><PortfolioDesktop /></DesktopProvider></ResumeProvider>
}

function usePressedCursor() {
  useEffect(() => {
    const root = document.documentElement
    const press = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' && event.button === 0) root.classList.add('is-pointer-down')
    }
    const release = () => root.classList.remove('is-pointer-down')
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('blur', release)
    return () => {
      release()
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', release)
    }
  }, [])
}

function PortfolioDesktop() {
  const active = useActiveSection()
  const desktop = useDesktop()
  const detail = useDetails()
  const activeTheme = chapters.find(chapter => chapter.id === active)!.world
  return <div className={`portfolio desktop-portfolio${desktop.exploring ? ' is-exploring' : ''}`} data-theme={activeTheme}>
    <a className="skip-link" href="#main">Skip to content</a>
    <DesktopShortcuts />
    <SpaceScene />
    <main id="main" className="desktop-workspace" tabIndex={-1} inert={desktop.exploring} aria-hidden={desktop.exploring || undefined}>
      <WorldSection id="home" eyebrow={profile.greeting} description=""
        aside={<PortraitWindow><FramedImage media={profile.portrait} priority className="hero-portrait" /></PortraitWindow>}>
        <div className="home-intro-copy">
          <p>{profile.introduction}</p>
          <p className="home-description">{profile.description}</p>
        </div>
        <div className="intro-socials">{profile.socials.filter(social => social.kind === 'github' || social.kind === 'linkedin').map(social => <SocialLink key={social.kind} social={social} compact />)}</div>
      </WorldSection>
      <WorldSection id="education"><div className="academic-entries">{education.map(entry => <AcademicEntry key={entry.id} entry={entry} onSelect={detail.open} />)}</div></WorldSection>
      <WorldSection id="experience"><ol className="experience-list">{experience.map(entry => <ExperienceEntry key={entry.id} entry={entry} onSelect={detail.open} />)}</ol></WorldSection>
      <WorldSection id="projects"><ProjectCollection onSelect={detail.open} /></WorldSection>
      <WorldSection id="beyond-code"><div className="hobby-grid">{hobbies.map(hobby => <HobbyCard key={hobby.id} hobby={hobby} onSelect={detail.open} />)}</div></WorldSection>
      <WorldSection id="contact" footer={<footer className="site-footer"><a href="#home" className="footer-signature" onClick={event => { event.preventDefault(); desktop.open('home') }}>{profile.name}</a></footer>}>
        <div className="contact-layout"><div className="social-list">{profile.socials.map(social => <SocialLink key={social.kind} social={social} />)}</div><ResumePreview /></div>
      </WorldSection>
    </main>
    <PlanetExplorer />
    <DesktopTaskbar />
    <DetailDialog entry={detail.entry} onClose={detail.close} />
    <ResumeModal />
  </div>
}
