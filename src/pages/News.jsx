import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { news } from '../data/mockData'
import { NewsTimelineWidget } from '../components/TradingViewWidget'
import { IcoArrowUp, IcoArrowDown, IcoInfo } from '../components/Icons'
import ScrollableTabs from '../components/ScrollableTabs'

const CATEGORIES = ['all', 'gold', 'forex', 'crypto', 'economy', 'world']
const AI_FILTERS = ['goldOnly', 'highImpact', 'bullish', 'bearish']

function NewsCard({ item, large }) {
  const sentimentColor = item.sentiment === 'bullish' ? 'var(--green)' : item.sentiment === 'bearish' ? 'var(--red)' : 'var(--amber)'
  const SentimentIcon = item.sentiment === 'bullish' ? IcoArrowUp : item.sentiment === 'bearish' ? IcoArrowDown : IcoInfo

  return (
    <div
      className="glass"
      style={{
        padding: large ? '20px 22px' : '14px 16px',
        borderLeft: `3px solid ${sentimentColor}`,
        transition: 'all 0.25s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div className="flex items-center justify-between mb-2" style={{ gap: 10 }}>
        <span style={{
          padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          background: 'rgba(255,255,255,0.06)', color: 'var(--text-3)',
        }}>
          {item.category}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={`badge ${item.impact === 'high' ? 'badge-bear' : item.impact === 'medium' ? 'badge-warn' : 'badge-neutral'}`} style={{ fontSize: 9 }}>
            {item.impact.toUpperCase()}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.time}</span>
        </div>
      </div>

      <h3 style={{ fontSize: large ? 16 : 13, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6, lineHeight: 1.4 }}>
        {item.title}
      </h3>

      {large && (
        <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10, lineHeight: 1.6 }}>{item.description}</p>
      )}

      {/* AI Summary */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'flex-start',
        padding: '8px 10px', borderRadius: 8,
        background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.12)',
        marginTop: 8,
      }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>🤖</span>
        <div>
          <span style={{ fontSize: 9, color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3, display: 'block' }}>AI Summary</span>
          <p style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>{item.aiSummary}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <SentimentIcon size={12} color={sentimentColor} />
          <span style={{ fontSize: 11, fontWeight: 600, color: sentimentColor, textTransform: 'capitalize' }}>{item.sentiment}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>· {item.source}</span>
        </div>
        <a href={`https://news.google.com/search?q=${encodeURIComponent(item.title)}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-xs" style={{ textDecoration: 'none' }}>Read more</a>
      </div>
    </div>
  )
}

export default function News() {
  const { t } = useLanguage()
  const [category, setCategory] = useState('all')
  const [aiFilter, setAiFilter] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  let filtered = news.filter(n => category === 'all' || n.category === category)
  if (aiFilter === 'bullish') filtered = filtered.filter(n => n.sentiment === 'bullish')
  if (aiFilter === 'bearish') filtered = filtered.filter(n => n.sentiment === 'bearish')
  if (aiFilter === 'highImpact') filtered = filtered.filter(n => n.impact === 'high')
  if (aiFilter === 'goldOnly') filtered = filtered.filter(n => n.category === 'gold' || n.category === 'economy')

  const topStories = news.filter(n => n.impact === 'high').slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="page-title">{t('news.title')}</h1>
        <p className="page-subtitle">{t('news.subtitle')}</p>
      </div>

      {/* Main layout */}
      <div className="g-aside" style={{ alignItems: 'start' }}>
        {/* Main feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <ScrollableTabs>
              {CATEGORIES.map(c => (
                <button key={c} className={`pill-tab ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
                  {t(`news.categories.${c}`)}
                </button>
              ))}
            </ScrollableTabs>

            {/* AI Filters */}
            <ScrollableTabs btnRow>
              {AI_FILTERS.map(f => (
                <button
                  key={f}
                  className={`btn btn-xs ${aiFilter === f ? 'btn-gold' : 'btn-ghost'}`}
                  onClick={() => setAiFilter(aiFilter === f ? null : f)}
                >
                  🤖 {t(`news.aiFilters.${f}`)}
                </button>
              ))}
            </ScrollableTabs>
          </div>

          {/* Featured news */}
          {filtered[0] && <NewsCard item={filtered[0]} large />}

          {/* Rest of news */}
          <div className="g-2" style={{ gap: 12 }}>
            {filtered.slice(1).map(item => <NewsCard key={item.id} item={item} />)}
          </div>

          {/* TradingView News — desktop only, moved to drawer on mobile */}
          <div className="news-tv-main glass" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Live News Feed — TradingView</div>
            </div>
            <NewsTimelineWidget height={400} />
          </div>
        </div>

        {/* Top Stories Sidebar — desktop only */}
        <div className="news-sidebar-desktop" style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 20 }}>
          <div className="glass p-4">
            <div className="section-label mb-3">📌 {t('news.topStories')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topStories.map((item, i) => (
                <div key={item.id} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '10px 0', borderBottom: i < topStories.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: 'rgba(255,215,0,0.15)', border: '1px solid var(--gold-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'var(--gold)',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.4, marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{item.time} · {item.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-4">
            <div className="section-label mb-3">Impact Guide</div>
            {[
              { color: 'var(--red)', label: 'High Impact', desc: 'Major market mover' },
              { color: 'var(--amber)', label: 'Medium Impact', desc: 'Moderate volatility' },
              { color: 'var(--green)', label: 'Low Impact', desc: 'Minor market reaction' },
            ].map(({ color, label, desc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color }}>{label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: backdrop */}
      {sidebarOpen && <div className="news-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* Mobile: slide-out panel */}
      <div className={`news-sidebar-panel${sidebarOpen ? ' open' : ''}`}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '16px 14px' }}>
          <div className="glass p-4">
            <div className="section-label mb-3">📌 {t('news.topStories')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {topStories.map((item, i) => (
                <div key={item.id} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '10px 0', borderBottom: i < topStories.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: 'rgba(255,215,0,0.15)', border: '1px solid var(--gold-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'var(--gold)',
                    flexShrink: 0,
                  }}>{i + 1}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.4, marginBottom: 3 }}>{item.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{item.time} · {item.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass p-4">
            <div className="section-label mb-3">Impact Guide</div>
            {[
              { color: 'var(--red)', label: 'High Impact', desc: 'Major market mover' },
              { color: 'var(--amber)', label: 'Medium Impact', desc: 'Moderate volatility' },
              { color: 'var(--green)', label: 'Low Impact', desc: 'Minor market reaction' },
            ].map(({ color, label, desc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color }}>{label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="glass" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
              <div className="section-label" style={{ marginBottom: 0 }}>Live News Feed — TradingView</div>
            </div>
            <NewsTimelineWidget height={360} />
          </div>
        </div>
      </div>

      {/* Mobile: toggle tab on right edge */}
      <button
        className={`news-sidebar-toggle${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(v => !v)}
        aria-label="Toggle sidebar"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {sidebarOpen
            ? <path d="M9 18l6-6-6-6" />
            : <path d="M15 18l-6-6 6-6" />}
        </svg>
      </button>
    </div>
  )
}
