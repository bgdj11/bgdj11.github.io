import { chapters, education, experience, hobbies, profile } from './data/portfolio'
import { Navigation, useActiveSection } from './components/Navigation'
import { WorldSection } from './components/WorldSection'
import { Icon } from './components/Icon'
import { ProjectCollection } from './components/Projects'
import { DetailDialog, useDetails } from './components/DetailDialog'
import { SpaceScene } from './components/SpaceScene'
import { FramedImage } from './components/Media'
import { AcademicEntry, HobbyCard, ExperienceEntry } from './components/Entries'
import { CvAction, ResumePreview, ResumeProvider, SocialLink } from './components/Contact'
import { DesktopProvider, DesktopShortcuts, DesktopTaskbar, PortraitWindow, useDesktop } from './components/Desktop'

export function App() {
  return <ResumeProvider><DesktopProvider><PortfolioDesktop /></DesktopProvider></ResumeProvider>
}

function PortfolioDesktop() {
  const active = useActiveSection()
  const desktop = useDesktop()
  const detail = useDetails()
  const activeTheme = chapters.find(chapter => chapter.id === active)!.world
  return <div className="portfolio desktop-portfolio" data-theme={activeTheme}>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation active={active} />
    <DesktopShortcuts />
    <SpaceScene />
    <main id="main" className="desktop-workspace" tabIndex={-1}>
      <WorldSection id="home" eyebrow={profile.greeting} description=""
        aside={<PortraitWindow><FramedImage media={profile.portrait} priority className="hero-portrait" /></PortraitWindow>}>
        <div className="home-intro-copy">
          <p>{profile.introduction}</p>
          <p className="home-description">{profile.description}</p>
        </div>
        <div className="hero-actions"><a className="button button-primary" href="#projects" onClick={event => { event.preventDefault(); desktop.open('projects') }}>Explore Projects<Icon name="arrow" /></a><CvAction /></div>
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
    <DesktopTaskbar />
    <DetailDialog entry={detail.entry} onClose={detail.close} />
  </div>
}
