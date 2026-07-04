import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { calendarEvents } from '../data/mockData'
import { EconomicCalendarWidget } from '../components/TradingViewWidget'
import { IcoAlert, IcoInfo, IcoCheck } from '../components/Icons'
import ScrollableTabs from '../components/ScrollableTabs'

const FILTERS = ['today', 'tomorrow', 'thisWeek', 'usdOnly', 'highImpact']

function ImpactBadge({ impact }) {
  const dots = []
  const color = impact >= 4 ? 'var(--red)' : impact >= 3 ? 'var(--amber)' : 'var(--green)'
  for (let i = 0; i < 5; i++) {
    dots.push(
      <span key={i} style={{
        display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
        background: i < impact ? color : 'rgba(255,255,255,0.1)',
        boxShadow: i < impact ? `0 0 4px ${color}` : 'none',
      }} />
    )
  }
  return <span style={{ display: 'inline-flex', gap: 3 }}>{dots}</span>
}

function RecommendationBadge({ rec }) {
  if (rec === 'avoid') return <span className="badge badge-bear">⛔ Avoid Trading</span>
  if (rec === 'watchBreakout') return <span className="badge badge-warn">👀 Watch Breakout</span>
  return <span className="badge badge-neutral">✅ Normal</span>
}

export default function Calendar() {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('today')
  const [expandedId, setExpandedId] = useState(null)

  const filtered = calendarEvents.filter(ev => {
    if (activeFilter === 'today') return ev.date === 'today'
    if (activeFilter === 'tomorrow') return ev.date === 'tomorrow'
    if (activeFilter === 'thisWeek') return true
    if (activeFilter === 'usdOnly') return ev.currency === 'USD'
    if (activeFilter === 'highImpact') return ev.impact >= 4
    return true
  })

  const highImpactCount = calendarEvents.filter(e => e.date === 'today' && e.impact >= 4).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="page-title">{t('calendar.title')}</h1>
        <p className="page-subtitle">{t('calendar.subtitle')}</p>
      </div>

      {/* Warning Panel */}
      {highImpactCount > 0 && (
        <div className="alert-box alert-warn">
          <IcoAlert size={18} color="var(--amber)" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>⚠️ {highImpactCount} High Impact Events Today</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>
              High impact USD news in 2h 15m — be careful with open XAUUSD positions.
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <ScrollableTabs>
        {FILTERS.map(f => (
          <button key={f} className={`pill-tab ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
            {t(`calendar.filters.${f}`)}
          </button>
        ))}
      </ScrollableTabs>

      {/* Events Table */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('calendar.time')}</th>
              <th className="col-cal-hide">{t('calendar.currency')}</th>
              <th>{t('calendar.event')}</th>
              <th style={{ textAlign: 'center' }}>{t('calendar.impact')}</th>
              <th className="col-cal-hide" style={{ textAlign: 'right' }}>{t('calendar.actual')}</th>
              <th className="col-cal-hide" style={{ textAlign: 'right' }}>{t('calendar.forecast')}</th>
              <th className="col-cal-hide" style={{ textAlign: 'right' }}>{t('calendar.previous')}</th>
              <th className="col-cal-hide" style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ev => (
              <>
                <tr key={ev.id} onClick={() => setExpandedId(expandedId === ev.id ? null : ev.id)} style={{ cursor: 'pointer' }}>
                  <td>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 12, color: 'var(--gold)' }}>{ev.time}</span>
                  </td>
                  <td className="col-cal-hide">
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      padding: '2px 8px', borderRadius: 5,
                      background: ev.currency === 'USD' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)',
                      color: ev.currency === 'USD' ? 'var(--blue)' : 'var(--text-2)',
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                    }}>
                      {ev.currency}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    {ev.event}
                    <div className="col-cal-show" style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{ev.currency}</span>
                      <RecommendationBadge rec={ev.recommendation} />
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}><ImpactBadge impact={ev.impact} /></td>
                  <td className="col-cal-hide" style={{ textAlign: 'right', color: ev.actual ? 'var(--green)' : 'var(--text-3)', fontFamily: 'Orbitron, monospace', fontSize: 12 }}>
                    {ev.actual || '—'}
                  </td>
                  <td className="col-cal-hide" style={{ textAlign: 'right', color: 'var(--text-2)', fontFamily: 'Orbitron, monospace', fontSize: 12 }}>{ev.forecast || '—'}</td>
                  <td className="col-cal-hide" style={{ textAlign: 'right', color: 'var(--text-3)', fontFamily: 'Orbitron, monospace', fontSize: 12 }}>{ev.previous || '—'}</td>
                  <td className="col-cal-hide" style={{ textAlign: 'center' }}>
                    <RecommendationBadge rec={ev.recommendation} />
                  </td>
                </tr>
                {expandedId === ev.id && (
                  <tr key={`${ev.id}-detail`}>
                    <td colSpan={8} style={{ background: 'rgba(59,130,246,0.06)', padding: '14px 18px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          {[
                            { label: t('calendar.actual'), val: ev.actual || '—', color: ev.actual ? 'var(--green)' : 'var(--text-3)' },
                            { label: t('calendar.forecast'), val: ev.forecast || '—', color: 'var(--text-2)' },
                            { label: t('calendar.previous'), val: ev.previous || '—', color: 'var(--text-3)' },
                          ].map(({ label, val, color }) => (
                            <div key={label}>
                              <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{label}</div>
                              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 13, fontWeight: 700, color }}>{val}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <span style={{ fontSize: 18 }}>🤖</span>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue)', marginBottom: 4 }}>AI INTERPRETATION</div>
                            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{ev.aiNote}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-3)' }}>No events for this filter</div>
        )}
      </div>

      {/* TradingView Economic Calendar */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Economic Calendar — TradingView (Live)</div>
        </div>
        <EconomicCalendarWidget height={480} />
      </div>
    </div>
  )
}
