import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'

interface TocItem {
  id: string
  label: string
  number: string
}

interface SidebarProps {
  sections: TocItem[]
}

export default function Sidebar({ sections }: SidebarProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [location] = useLocation()

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id)
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [sections])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMobileOpen(false)
  }

  const activeLabel = sections.find((s) => s.id === activeId)?.label || 'Contents'

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <nav className="sidebar" aria-label="Proposal navigation">

        {/* Logo — clickable, scrolls to top */}
        <div className="sidebar-logo-wrap">
          <button
            className="sidebar-logo-btn"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <div className="sidebar-logo-text">
              Below the<br />Board<span className="sidebar-logo-dot">.</span>
            </div>
          </button>
        </div>

        {/* TOC */}
        <ul className="sidebar-toc">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                className={`sidebar-toc-item${activeId === s.id ? ' sidebar-toc-item--active' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                <span className="sidebar-toc-number">{s.number}</span>
                <span className="sidebar-toc-text">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Footer — contact only, no legal links */}
        <div className="sidebar-footer">
          <div className="sidebar-contact-label">Contact</div>

          <div className="sidebar-contact-email">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px', verticalAlign: 'middle', flexShrink: 0 }}>
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <polyline points="2,4 12,13 22,4"/>
            </svg>
            <a href="mailto:zach@belowtheboard.com">zach@belowtheboard.com</a>
          </div>


        </div>
      </nav>

      {/* ── Mobile TOC Dropdown ── */}
      <div className="mobile-toc">
        <button
          className="mobile-toc-trigger"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
        >
          <span className="mobile-toc-label">{activeLabel}</span>
          <svg
            className={`mobile-toc-chevron${mobileOpen ? ' open' : ''}`}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        {mobileOpen && (
          <ul className="mobile-toc-menu">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  className={`mobile-toc-menu-item${activeId === s.id ? ' active' : ''}`}
                  onClick={() => scrollTo(s.id)}
                >
                  <span className="mobile-toc-menu-num">{s.number}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
