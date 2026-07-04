import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { botGroups } from '../data/mockData'
import { IcoPlay, IcoStop, IcoAlert, IcoBolt } from '../components/Icons'

export default function BotDashboard() {
  const { t } = useLanguage()
  const [botRunning, setBotRunning] = useState(false)
  const [groups, setGroups] = useState(botGroups)
  const [connected, setConnected] = useState(false)
  const [mt5Form, setMt5Form] = useState({ server: 'MetaQuotes-Demo', login: '', password: '' })
  const [risk, setRisk] = useState(1.0)
  const [maxLoss, setMaxLoss] = useState(5.0)
  const [maxTrades, setMaxTrades] = useState(5)

  const toggleGroup = (id) => {
    setGroups(prev => prev.map(g => g.id === id && g.status !== 'upcoming' ? { ...g, enabled: !g.enabled, status: !g.enabled ? 'running' : 'stopped' } : g))
  }

  const totalOpenTrades = groups.filter(g => g.enabled && g.status === 'running').length * 2
  const totalPnl = groups.filter(g => g.enabled && g.status === 'running').reduce((s, g) => s + parseFloat(g.pnl.replace(/[^-0-9.]/g, '') || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{t('botDashboard.title')}</h1>
          <p className="page-subtitle">{t('botDashboard.subtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px',
            borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: botRunning ? 'rgba(0,212,160,0.12)' : 'rgba(239,68,68,0.12)',
            border: `1px solid ${botRunning ? 'rgba(0,212,160,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: botRunning ? 'var(--green)' : 'var(--red)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: botRunning ? 'var(--green)' : 'var(--red)', animation: botRunning ? 'dotPulse 1.5s ease infinite' : 'none' }} />
            {botRunning ? t('botDashboard.online') : t('botDashboard.offline')}
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="alert-box alert-warn">
        <IcoAlert size={16} color="var(--amber)" style={{ flexShrink: 0 }} />
        <span>This is a <strong>DEMO frontend</strong>. No real trading occurs. MT5 connection and bot execution require backend integration.</span>
      </div>

      {/* Stats Row */}
      <div className="g-4">
        {[
          { label: t('botDashboard.openTrades'), value: totalOpenTrades, color: 'var(--blue)' },
          { label: t('botDashboard.dailyPnl'), value: `+$${totalPnl.toFixed(2)}`, color: 'var(--green)' },
          { label: 'Active Bots', value: groups.filter(g => g.enabled && g.status === 'running').length, color: 'var(--gold)' },
          { label: 'Risk Per Trade', value: `${risk}%`, color: 'var(--amber)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      <div className="g-2" style={{ gap: 20 }}>
        {/* MT5 Connection */}
        <div className="glass p-5">
          <div className="section-label mb-4">🔌 {t('botDashboard.connect')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">{t('botDashboard.server')}</label>
              <input className="form-input" value={mt5Form.server} onChange={e => setMt5Form(p => ({ ...p, server: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('botDashboard.loginId')}</label>
              <input className="form-input" placeholder="123456" value={mt5Form.login} onChange={e => setMt5Form(p => ({ ...p, login: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">{t('botDashboard.password')}</label>
              <input className="form-input" type="password" placeholder="••••••••" value={mt5Form.password} onChange={e => setMt5Form(p => ({ ...p, password: e.target.value }))} />
            </div>
            <button
              className={`btn ${connected ? 'btn-danger' : 'btn-gold'}`}
              onClick={() => setConnected(v => !v)}
            >
              {connected ? '⬤ Disconnect' : '🔌 ' + t('botDashboard.connectBtn')}
            </button>
          </div>
        </div>

        {/* Bot Settings */}
        <div className="glass p-5">
          <div className="section-label mb-4">⚙️ {t('botDashboard.settings')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: t('botDashboard.riskPerTrade'), value: risk, setter: setRisk, min: 0.1, max: 5, step: 0.1 },
              { label: t('botDashboard.maxDailyLoss'), value: maxLoss, setter: setMaxLoss, min: 1, max: 20, step: 0.5 },
              { label: t('botDashboard.maxTrades'), value: maxTrades, setter: setMaxTrades, min: 1, max: 20, step: 1 },
            ].map(({ label, value, setter, min, max, step }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <label className="form-label" style={{ marginBottom: 0 }}>{label}</label>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gold)', fontFamily: 'Orbitron, monospace' }}>{value}</span>
                </div>
                <input
                  type="range" min={min} max={max} step={step} value={value}
                  onChange={e => setter(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold)' }}
                />
                <div className="flex items-center justify-between" style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
                  <span>{min}</span><span>{max}</span>
                </div>
              </div>
            ))}

            {/* Sessions */}
            <div>
              <label className="form-label">{t('botDashboard.allowedSessions')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Asian', 'London', 'New York'].map(s => (
                  <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--gold)' }} />
                    <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bot Groups */}
      <div className="glass p-5">
        <div className="section-label mb-4">🤖 {t('botDashboard.botGroups')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {groups.map(g => (
            <div key={g.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
              background: 'rgba(255,255,255,0.03)', borderRadius: 10,
              border: `1px solid ${g.enabled ? `${g.color}30` : 'var(--border)'}`,
              opacity: g.status === 'upcoming' ? 0.5 : 1,
            }}>
              {/* Status dot */}
              <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: g.status === 'running' ? g.color : g.status === 'upcoming' ? 'var(--text-4)' : 'rgba(255,255,255,0.15)',
                boxShadow: g.status === 'running' ? `0 0 8px ${g.color}` : 'none',
                animation: g.status === 'running' ? 'dotPulse 1.5s ease infinite' : 'none',
              }} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {g.name}
                  {g.status === 'upcoming' && <span className="badge badge-demo" style={{ marginLeft: 6, fontSize: 9 }}>COMING SOON</span>}
                </div>
              </div>

              {/* Risk */}
              {g.status !== 'upcoming' && (
                <>
                  <div style={{ textAlign: 'center', flexShrink: 0, width: 38 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{t('botDashboard.riskPct')}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--amber)' }}>{g.risk}%</div>
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0, width: 38 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{t('botDashboard.maxTradesLabel')}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>{g.maxTrades}</div>
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0, width: 44 }}>
                    <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>PnL</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: g.pnl.startsWith('+') ? 'var(--green)' : g.pnl === '$0' ? 'var(--text-3)' : 'var(--red)' }}>{g.pnl}</div>
                  </div>
                </>
              )}

              {/* Toggle */}
              {g.status !== 'upcoming' && (
                <label className="toggle">
                  <input type="checkbox" checked={g.enabled} onChange={() => toggleGroup(g.id)} />
                  <span className="toggle-slider" />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          className={`btn ${botRunning ? 'btn-danger' : 'btn-gold'} flex-1`}
          onClick={() => setBotRunning(v => !v)}
          style={{ justifyContent: 'center' }}
        >
          {botRunning ? <IcoStop size={16} /> : <IcoPlay size={16} />}
          {botRunning ? t('botDashboard.stopBot') : t('botDashboard.startBot')}
        </button>
        <button className="btn btn-danger" style={{ padding: '9px 24px' }}>
          <IcoAlert size={16} />
          {t('botDashboard.emergency')}
        </button>
      </div>
    </div>
  )
}
