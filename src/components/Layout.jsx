import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import ParticleBackground from './ParticleBackground'
import CommandPalette from './CommandPalette'
import FloatingCopilot from './FloatingCopilot'

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  // Auto-hide topbar on scroll down, reveal on scroll up
  useEffect(() => {
    const pageArea = document.querySelector('.page-area')
    if (!pageArea) return
    let lastY = 0
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = pageArea.scrollTop
        const topbar = document.querySelector('.topbar')
        if (topbar) {
          if (y <= 4) topbar.classList.remove('topbar-hidden')
          else if (y > lastY + 8) topbar.classList.add('topbar-hidden')
          else if (y < lastY - 8) topbar.classList.remove('topbar-hidden')
        }
        lastY = y
        ticking = false
      })
    }
    pageArea.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      pageArea.removeEventListener('scroll', onScroll)
      document.querySelector('.topbar')?.classList.remove('topbar-hidden')
    }
  }, [location.pathname])

  // Pull-to-refresh
  useEffect(() => {
    const pageArea = document.querySelector('.page-area')
    if (!pageArea) return
    let startY = 0
    let pulling = false

    const onTouchStart = (e) => {
      if (pageArea.scrollTop === 0) {
        startY = e.touches[0].clientY
        pulling = true
      }
    }
    const onTouchMove = (e) => {
      if (!pulling) return
      if (e.touches[0].clientY - startY > 90) {
        pulling = false
        window.location.reload()
      }
    }
    const onTouchEnd = () => { pulling = false }

    pageArea.addEventListener('touchstart', onTouchStart, { passive: true })
    pageArea.addEventListener('touchmove', onTouchMove, { passive: true })
    pageArea.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      pageArea.removeEventListener('touchstart', onTouchStart)
      pageArea.removeEventListener('touchmove', onTouchMove)
      pageArea.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  // Scroll-reveal card animations
  useEffect(() => {
    let observer
    const timer = setTimeout(() => {
      const root = document.querySelector('.page-area') || null
      const rootEl = root || document.documentElement
      const rootH = rootEl.clientHeight
      const cards = document.querySelectorAll('.glass, .glass-gold, .glass-green, .glass-red, .glass-strong')

      observer = new IntersectionObserver(entries => {
        const updates = []
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const el = entry.target
          const siblings = el.parentNode ? Array.from(el.parentNode.children) : []
          const idx = siblings.indexOf(el)
          updates.push({ el, delay: idx > 0 ? `${Math.min(idx * 40, 160)}ms` : '0ms' })
          observer.unobserve(el)
        })
        requestAnimationFrame(() => {
          updates.forEach(({ el, delay }) => {
            el.style.transitionDelay = delay
            el.classList.add('in-view')
            setTimeout(() => {
              el.style.transitionDelay = ''
              el.classList.remove('will-reveal', 'will-reveal-fade')
            }, 480)
          })
        })
      }, { root, threshold: 0.04, rootMargin: '0px 0px -20px 0px' })

      cards.forEach(card => {
        card.classList.remove('in-view', 'will-reveal', 'will-reveal-fade')
        const rect = card.getBoundingClientRect()
        const inView = rect.top < rootH && rect.bottom > 0
        card.classList.add(inView ? 'will-reveal-fade' : 'will-reveal')
        observer.observe(card)
      })
    }, 80)

    return () => {
      clearTimeout(timer)
      observer?.disconnect()
    }
  }, [location.pathname])

  return (
    <div className="app-shell">
      <CommandPalette />
      <FloatingCopilot />
      <ParticleBackground />
      <div
        className={`sidebar-backdrop ${drawerOpen ? 'open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <Sidebar />
      <Sidebar mobile drawerOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <Topbar onMenuOpen={() => setDrawerOpen(true)} />
      <main className="page-area">
        <div className="page-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
