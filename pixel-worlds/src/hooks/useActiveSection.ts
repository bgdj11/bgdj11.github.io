import { useEffect, useState } from 'react'
import { chapters } from '../data/portfolio'
import type { SectionId } from '../data/portfolio'

export function useActiveSection() {
  const [active, setActive] = useState<SectionId>('home')
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const marker = Math.max(140, innerHeight * .28)
      let current: SectionId = 'home'
      let nearest = -Infinity
      for (const { id } of chapters) {
        const node = document.getElementById(id)
        if (!node || node.hidden) continue
        const top = node.getBoundingClientRect().top
        if (top <= marker && top > nearest) { current = id; nearest = top }
      }
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
