import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { journalStats, journalTrades } from '../data/mockData'
import { IcoArrowUp, IcoArrowDown, IcoCheck, IcoX, IcoInfo } from '../components/Icons'
import ScrollableTabs from '../components/ScrollableTabs'

function WinRateArc({ value }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(id)
  }, [])
  const r = 48, circ = 2 * Math.PI * r
  const targetDash = (value / 100) * circ
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ overflow: 'visible' }}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--green)" strokeWidth="10"
        strokeDasharray={animated ? `${targetDash} ${circ - targetDash}` : `0.001 ${circ}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 8px var(--green))', transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <text x="60" y="55" textAnchor="middle" fill="var(--green)" fontSize="22" fontWeight="800" fontFamily="Orbitron, monospace">{value}%</text>
      <text x="60" y="74" textAnchor="middle" fill="var(--text-3)" fontSize="10">Win Rate</text>
    </svg>
  )
}

export default function Journal() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')
  const [showForm, setShowForm] = useState(false)
  const [calYear, setCalYear] = useState(2026)
  const [calMonth, setCalMonth] = useState(6) // 0-indexed, 6 = July
  const [form, setForm] = useState({
    instrument: 'XAUUSD', direction: 'buy', entry: '', sl: '', tp: '', result: '', reason: '', emotions: '', mistake: '',
  })

  const tabs = ['overview', 'trades', 'statistics', 'calendar']

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const stats = [
    { key: 'totalTrades', value: journalStats.totalTrades, color: 'var(--gold)', unit: '' },
    { key: 'winRate', value: `${journalStats.winRate}%`, color: 'var(--green)', unit: '' },
    { key: 'profitFactor', value: journalStats.profitFactor, color: 'var(--blue)', unit: '' },
    { key: 'netProfit', value: journalStats.netProfit, color: 'var(--green)', unit: '' },
    { key: 'bestTrade', value: journalStats.bestTrade, color: 'var(--green)', unit: '' },
    { key: 'worstTrade', value: journalStats.worstTrade, color: 'var(--red)', unit: '' },
    { key: 'avgR', value: journalStats.avgR, color: 'var(--gold)', unit: '' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{t('journal.title')}</h1>
          <p className="page-subtitle">{t('journal.subtitle')}</p>
        </div>
        <button className="btn btn-gold" onClick={() => setShowForm(v => !v)}>
          + {t('journal.addTrade')}
        </button>
      </div>

      {/* Add Trade Form */}
      {showForm && (
        <div className="glass p-5">
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, color: 'var(--gold)' }}>
            + {t('journal.addTrade')}
          </div>
          <div className="g-3" style={{ gap: 14 }}>
            <div className="form-group">
              <label className="form-label">{t('journal.instrument')}</label>
              <select className="form-select" value={form.instrument} onChange={e => handleChange('instrument', e.target.value)}>
                {['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('journal.direction')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['buy', 'sell'].map(d => (
                  <button key={d} onClick={() => handleChange('direction', d)} className={`btn flex-1 ${d === 'buy' ? 'btn-green' : 'btn-danger'} ${form.direction === d ? '' : 'btn-ghost'}`} style={{ opacity: form.direction === d ? 1 : 0.5 }}>
                    {d === 'buy' ? <IcoArrowUp size={14} /> : <IcoArrowDown size={14} />}
                    {d === 'buy' ? t('journal.buy') : t('journal.sell')}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">{t('journal.entry')}</label>
              <input className="form-input" value={form.entry} onChange={e => handleChange('entry', e.target.value)} placeholder="3248.65" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('journal.sl')}</label>
              <input className="form-input" value={form.sl} onChange={e => handleChange('sl', e.target.value)} placeholder="3215.00" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('journal.tp')}</label>
              <input className="form-input" value={form.tp} onChange={e => handleChange('tp', e.target.value)} placeholder="3280.00" />
            </div>
            <div className="form-group">
              <label className="form-label">{t('journal.result')}</label>
              <input className="form-input" value={form.result} onChange={e => handleChange('result', e.target.value)} placeholder="+$285" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">{t('journal.reason')}</label>
              <textarea className="form-textarea" value={form.reason} onChange={e => handleChange('reason', e.target.value)} placeholder="Describe your entry reason..." />
            </div>
            <div className="form-group">
              <label className="form-label">{t('journal.emotions')}</label>
              <select className="form-select" value={form.emotions} onChange={e => handleChange('emotions', e.target.value)}>
                {['Confident', 'Calm', 'Patient', 'Anxious', 'FOMO', 'Greedy', 'Fearful'].map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '2 / -1' }}>
              <label className="form-label">{t('journal.mistake')}</label>
              <input className="form-input" value={form.mistake} onChange={e => handleChange('mistake', e.target.value)} placeholder="Any mistake? Leave empty if none." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button className="btn btn-gold" onClick={() => setShowForm(false)}>{t('journal.save')}</button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>{t('journal.cancel')}</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <ScrollableTabs>
        {tabs.map(tab => (
          <button key={tab} className={`pill-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {t(`journal.tabs.${tab}`)}
          </button>
        ))}
      </ScrollableTabs>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* AI Review */}
          <div className="glass-gold p-5">
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: 20 }}>🤖</span>
              <div className="section-label" style={{ marginBottom: 0 }}>{t('journal.aiReview')}</div>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.7 }}>
              "{journalStats.commonMistake.includes('news') ? `Your biggest mistake this month is ${journalStats.commonMistake}. This has cost you 2 losing trades and reduced your win rate by approximately 8%. Consider disabling your trading platform 30 minutes before major news releases.` : `Your performance this month is solid. Keep maintaining your ${journalStats.winRate}% win rate and ${journalStats.profitFactor} profit factor.`}"
            </p>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-3)' }}>Based on {journalStats.totalTrades} logged trades • AI analysis is DEMO</div>
          </div>

          {/* Stats Grid */}
          <div className="g-4" style={{ gap: 14 }}>
            {stats.map(({ key, value, color }) => (
              <div key={key} className="stat-card">
                <div className="stat-label">{t(`journal.stats.${key}`)}</div>
                <div className="stat-value" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Trades Tab */}
      {activeTab === 'trades' && (
        <div className="glass" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="data-table" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Instrument</th>
                <th>Dir</th>
                <th style={{ textAlign: 'right' }}>Entry</th>
                <th style={{ textAlign: 'right' }}>SL</th>
                <th style={{ textAlign: 'right' }}>TP</th>
                <th style={{ textAlign: 'right' }}>Result</th>
                <th style={{ textAlign: 'right' }}>R:R</th>
                <th>Reason</th>
                <th>Emotion</th>
              </tr>
            </thead>
            <tbody>
              {journalTrades.map(tr => (
                <tr key={tr.id}>
                  <td style={{ color: 'var(--text-3)', fontSize: 11 }}>{tr.date}</td>
                  <td><span style={{ fontFamily: 'Orbitron, monospace', fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>{tr.instrument}</span></td>
                  <td>
                    <span className={tr.direction === 'Buy' ? 'badge-bull badge' : 'badge-bear badge'} style={{ fontSize: 9 }}>
                      {tr.direction === 'Buy' ? <IcoArrowUp size={9} /> : <IcoArrowDown size={9} />}
                      {tr.direction}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'Orbitron, monospace', fontSize: 12 }}>{tr.entry.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', color: 'var(--red)', fontFamily: 'Orbitron, monospace', fontSize: 12 }}>{tr.sl.toLocaleString()}</td>
                  <td style={{ textAlign: 'right', color: 'var(--green)', fontFamily: 'Orbitron, monospace', fontSize: 12 }}>{tr.tp.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ color: tr.status === 'win' ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>{tr.result}</span>
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--text-2)', fontWeight: 600 }}>{tr.rr}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-2)', maxWidth: 160 }}>{tr.reason.substring(0, 40)}...</td>
                  <td>
                    <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--text-2)' }}>
                      {tr.emotions}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'statistics' && (
        <div className="g-2" style={{ gap: 20 }}>
          {/* Win Rate */}
          <div className="glass p-5">
            <div className="section-label mb-4">Performance Overview</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <WinRateArc value={journalStats.winRate} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Profit Factor', value: journalStats.profitFactor, color: 'var(--blue)' },
                  { label: 'Avg R:R', value: journalStats.avgR, color: 'var(--gold)' },
                  { label: 'Net Profit', value: journalStats.netProfit, color: 'var(--green)' },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'Orbitron, monospace' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trade Distribution */}
          <div className="glass p-5">
            <div className="section-label mb-4">Trade Distribution</div>
            {(() => {
              const wins = Math.round(journalStats.totalTrades * journalStats.winRate / 100)
              const losses = journalStats.totalTrades - wins
              const total = journalStats.totalTrades
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Losing</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--red)', fontFamily: 'Orbitron, monospace' }}>{losses}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Winning</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green)', fontFamily: 'Orbitron, monospace' }}>{wins}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', gap: 2 }}>
                    <div style={{ width: `${(losses / total) * 100}%`, background: 'var(--red)', boxShadow: '0 0 10px rgba(239,68,68,0.5)', borderRadius: '6px 0 0 6px' }} />
                    <div style={{ width: `${(wins / total) * 100}%`, background: 'var(--green)', boxShadow: '0 0 10px rgba(0,212,160,0.5)', borderRadius: '0 6px 6px 0' }} />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'Orbitron, monospace', fontWeight: 600, letterSpacing: '0.06em' }}>{total} trades</span>
                  </div>
                </div>
              )
            })()}
            <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(255,215,0,0.06)', border: '1px solid var(--gold-border)', borderRadius: 8 }}>
              <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700, marginBottom: 4 }}>MOST COMMON MISTAKE</div>
              <div style={{ fontSize: 13, color: 'var(--text-1)' }}>{journalStats.commonMistake}</div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (() => {
        const today = new Date(2026, 6, 4) // July 4 2026
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
        const firstDow = (new Date(calYear, calMonth, 1).getDay() + 6) % 7 // Mon=0
        const monthName = new Date(calYear, calMonth).toLocaleString('en', { month: 'long' })
        const prevMonth = () => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) } else setCalMonth(m => m - 1) }
        const nextMonth = () => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) } else setCalMonth(m => m + 1) }
        const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

        return (
          <div className="glass p-5">
            {/* Header with navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <button onClick={prevMonth} className="btn btn-ghost btn-xs">‹</button>
              <div className="section-label" style={{ marginBottom: 0 }}>{monthName} {calYear}</div>
              <button onClick={nextMonth} className="btn btn-ghost btn-xs">›</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-3)', fontWeight: 700, padding: '4px 0' }}>{d}</div>
              ))}
              {cells.map((day, i) => {
                if (!day) return <div key={`e${i}`} />
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const hasWin = journalTrades.some(t => t.date === dateStr && t.status === 'win')
                const hasLoss = journalTrades.some(t => t.date === dateStr && t.status === 'loss')
                const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate()
                return (
                  <div key={day} style={{
                    aspectRatio: '1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 8, fontSize: 12, fontWeight: isToday ? 700 : 500,
                    background: hasWin ? 'rgba(0,212,160,0.15)' : hasLoss ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isToday ? 'var(--gold-border)' : hasWin ? 'rgba(0,212,160,0.3)' : hasLoss ? 'rgba(239,68,68,0.25)' : 'var(--border)'}`,
                    color: hasWin ? 'var(--green)' : hasLoss ? 'var(--red)' : isToday ? 'var(--gold)' : 'var(--text-3)',
                    cursor: (hasWin || hasLoss) ? 'pointer' : 'default',
                  }}>
                    {day}
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 14, fontSize: 11, color: 'var(--text-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(0,212,160,0.4)' }} />Win day</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(239,68,68,0.35)' }} />Loss day</div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
