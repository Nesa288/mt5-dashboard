import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const pulse = { animation: 'dotPulse 1.5s ease infinite' }
const fadeIn = (delay = 0) => ({ animation: `tabFadeIn 0.4s ease both`, animationDelay: `${delay}s` })

// ── Preview panels ─────────────────────────────────────────

function AnalysisPreview() {
  const bars = [42, 58, 35, 70, 52, 78, 45, 64, 71, 55, 83, 60, 76, 68, 92]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, ...fadeIn() }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 3 }}>XAUUSD · GOLD / 1H</div>
          <div style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Space Grotesk', monospace", color: 'var(--text-1)', lineHeight: 1 }}>$3,028.14</div>
          <div style={{ fontSize: 11, color: '#00D4A0', marginTop: 4 }}>▲ +$12.46 (0.41%)</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(0,212,160,0.12)', border: '1px solid rgba(0,212,160,0.3)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D4A0', ...pulse }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#00D4A0' }}>BULLISH</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 88, background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '8px 8px 0' }}>
        {bars.map((h, i) => (
          <div key={i} style={{
            flex: 1, borderRadius: '2px 2px 0 0',
            background: i >= 12 ? 'rgba(139,92,246,0.85)' : i % 4 === 0 ? 'rgba(0,212,160,0.55)' : 'rgba(139,92,246,0.32)',
            height: `${h}%`,
            transformOrigin: 'bottom',
            animation: `barGrow 0.5s ease both`,
            animationDelay: `${i * 0.035}s`,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text-3)', padding: '0 2px' }}>
        {['06:00','09:00','12:00','15:00','Now'].map(t => <span key={t}>{t}</span>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'Trend', value: 'Bullish', color: '#00D4A0' },
          { label: 'H4 Bias', value: 'Neutral', color: '#F59E0B' },
          { label: 'Key Level', value: '$3,015', color: 'var(--text-2)' },
          { label: 'Target', value: '$3,055', color: '#8B5CF6' },
        ].map(({ label, value, color }, i) => (
          <div key={label} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', ...fadeIn(0.25 + i * 0.06) }}>
            <div style={{ fontSize: 9, color: 'var(--text-3)', marginBottom: 3, letterSpacing: '0.06em' }}>{label.toUpperCase()}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function JournalPreview() {
  const { t } = useLanguage()
  const trades = [
    { pair: 'XAUUSD', dir: 'BUY',  entry: '3,015.00', rr: '4:1', status: 'WIN',  color: '#00D4A0' },
    { pair: 'EURUSD', dir: 'SELL', entry: '1.0860',   rr: '2:1', status: 'LOSS', color: '#F87171' },
    { pair: 'BTCUSD', dir: 'BUY',  entry: '67,200',   rr: '3:1', status: 'OPEN', color: '#8B5CF6' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, ...fadeIn() }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        {[
          { label: 'Win Rate', value: '68%', color: '#00D4A0' },
          { label: 'Avg R:R', value: '1:2.8', color: '#8B5CF6' },
          { label: 'This Month', value: '+$1,240', color: '#F59E0B' },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, padding: '10px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center', ...fadeIn(i * 0.08) }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', monospace" }}>{s.value}</div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {trades.map((t, i) => (
        <div key={t.pair} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', ...fadeIn(0.2 + i * 0.1) }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: t.dir === 'BUY' ? '#00D4A0' : '#F87171', width: 30, flexShrink: 0 }}>{t.dir}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{t.pair}</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)' }}>@ {t.entry}</div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', marginRight: 8 }}>R {t.rr}</div>
          <div style={{ padding: '3px 9px', borderRadius: 6, background: `${t.color}18`, border: `1px solid ${t.color}40`, fontSize: 10, fontWeight: 700, color: t.color }}>{t.status}</div>
        </div>
      ))}
      <div style={{ padding: '10px 13px', borderRadius: 10, background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)', fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5, ...fadeIn(0.5) }}>
        📊 <strong style={{ color: 'var(--text-1)' }}>{t('home.showcase.preview.aiInsightLabel')}</strong> {t('home.showcase.preview.aiInsightText')}
      </div>
    </div>
  )
}

function MentorPreview() {
  const msgs = [
    { role: 'user', text: 'Is now a good time to buy gold?' },
    { role: 'ai',   text: 'Gold is approaching key daily resistance at $3,032. Wait for an H1 close above before entering long.' },
    { role: 'user', text: 'What\'s my risk on a $3,025 entry?' },
    { role: 'ai',   text: 'With SL at $3,010, that\'s 15 pts. Target $3,055 gives you a clean 2:1 R. Size for 1% risk.' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, ...fadeIn() }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, padding: '10px 13px', borderRadius: 10, background: 'rgba(0,212,160,0.06)', border: '1px solid rgba(0,212,160,0.2)' }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,212,160,0.15)', border: '1px solid rgba(0,212,160,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>🤖</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>AI Mentor</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00D4A0', ...pulse }} />
            <span style={{ fontSize: 9, color: '#00D4A0' }}>Online · Tuned to live market</span>
          </div>
        </div>
      </div>
      {msgs.map((m, i) => (
        <div key={i} style={{
          alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
          maxWidth: '88%',
          padding: '9px 12px',
          borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
          background: m.role === 'user' ? 'rgba(139,92,246,0.22)' : 'rgba(255,255,255,0.06)',
          border: `1px solid ${m.role === 'user' ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.09)'}`,
          fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55,
          ...fadeIn(0.1 + i * 0.12),
        }}>
          {m.text}
        </div>
      ))}
    </div>
  )
}

function AlertsPreview() {
  const { t } = useLanguage()
  const alerts = [
    { pair: 'XAUUSD', level: '$3,055.00', label: 'Take Profit',  color: '#00D4A0', triggered: false },
    { pair: 'XAUUSD', level: '$3,032.00', label: 'Resistance',   color: '#F59E0B', triggered: true  },
    { pair: 'EURUSD', level: '1.0800',    label: 'Support',      color: '#8B5CF6', triggered: false },
    { pair: 'BTCUSD', level: '$68,500',   label: 'Target',       color: '#3B82F6', triggered: false },
    { pair: 'XAUUSD', level: '$3,005.00', label: 'Stop Loss',    color: '#F87171', triggered: false },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...fadeIn() }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{t('home.showcase.preview.activeAlerts')}</span>
        <span style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', fontSize: 10, fontWeight: 700, color: '#F59E0B' }}>1 {t('home.showcase.preview.triggeredLabel')}</span>
      </div>
      {alerts.map((a, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 10,
          background: a.triggered ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${a.triggered ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.07)'}`,
          ...fadeIn(0.05 + i * 0.08),
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0, ...(a.triggered ? pulse : {}) }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', fontFamily: "'Space Grotesk', monospace" }}>{a.level}</div>
            <div style={{ fontSize: 9, color: 'var(--text-3)', marginTop: 1 }}>{a.pair} · {a.label}</div>
          </div>
          {a.triggered
            ? <span style={{ fontSize: 10, fontWeight: 700, color: '#F59E0B' }}>🔔 {t('home.showcase.preview.triggeredLabel')}</span>
            : <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{t('home.showcase.preview.watchingLabel')}</span>
          }
        </div>
      ))}
    </div>
  )
}

// ── Static feature metadata (no text — text comes from t()) ────────────────
const FEATURE_META = [
  { id: 'analysis', color: '#8B5CF6', Preview: AnalysisPreview,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 7l-8.5 8.5-5-5L2 17M16 7h6v6"/></svg> },
  { id: 'journal',  color: '#3B82F6', Preview: JournalPreview,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> },
  { id: 'mentor',   color: '#00D4A0', Preview: MentorPreview,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg> },
  { id: 'alerts',   color: '#F59E0B', Preview: AlertsPreview,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg> },
]

export default function FeaturesShowcase() {
  const { t } = useLanguage()
  const [activeId, setActiveId] = useState('analysis')

  const FEATURES = FEATURE_META.map(f => ({
    ...f,
    title: t(`home.showcase.${f.id}.title`),
    desc:  t(`home.showcase.${f.id}.desc`),
  }))
  const active = FEATURES.find(f => f.id === activeId)
  const Preview = active.Preview

  return (
    <div className="features-showcase">
      {/* left: feature tabs */}
      <div className="features-tabs">
        {FEATURES.map(f => (
          <div
            key={f.id}
            className={`features-tab${activeId === f.id ? ' active' : ''}`}
            onClick={() => setActiveId(f.id)}
          >
            <div className="features-tab-icon" style={{ background: `${f.color}18`, border: `1px solid ${f.color}35`, color: f.color }}>
              {f.icon}
            </div>
            <div className="features-tab-body">
              <h3 style={{ color: activeId === f.id ? 'var(--text-1)' : 'var(--text-2)' }}>{f.title}</h3>
              {activeId === f.id && <p>{f.desc}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* right: animated preview */}
      <div className="features-preview-wrap">
        {/* mock topbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['#F87171','#F59E0B','#00D4A0'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', margin: '0 8px' }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: active.color, ...pulse }} />
        </div>
        <Preview key={activeId} />
      </div>
    </div>
  )
}
