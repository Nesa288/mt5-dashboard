import { useRef, useState, useEffect } from 'react'

const ChevronLeft = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
)
const ChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
)

export default function ScrollableTabs({ children, btnRow }) {
  const ref = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => {
      setShowLeft(el.scrollLeft > 4)
      setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
    }
    check()
    const t = setTimeout(check, 150)
    el.addEventListener('scroll', check, { passive: true })
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', check); ro.disconnect(); clearTimeout(t) }
  }, [])

  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 150, behavior: 'smooth' })

  return (
    <div className={`scroll-tabs-wrap${btnRow ? ' scroll-tabs-wrap--btn' : ''}`}>
      <div className={`tab-fade tab-fade-left${showLeft ? ' visible' : ''}`}>
        <button className="tab-arrow-btn" onClick={() => scroll(-1)}><ChevronLeft /></button>
      </div>
      <div ref={ref} className={btnRow ? 'btn-scroll-row' : 'pill-tabs'}>{children}</div>
      <div className={`tab-fade tab-fade-right${showRight ? ' visible' : ''}`}>
        <button className="tab-arrow-btn" onClick={() => scroll(1)}><ChevronRight /></button>
      </div>
    </div>
  )
}
