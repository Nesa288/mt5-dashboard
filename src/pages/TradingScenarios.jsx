import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { scenarios } from '../data/mockData'
import { IcoArrowUp, IcoArrowDown, IcoTarget, IcoShield } from '../components/Icons'
import { useLiveLevels } from '../hooks/useLiveLevels'

function ScenarioProbabilityArc({ value, color }) {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(id)
  }, [])

  const radius = 36
  const circ = 2 * Math.PI * radius
  const targetDash = (value / 100) * circ

  return (
    <svg width="88" height="88" viewBox="0 0 88 88" style={{ overflow: 'visible' }}>
      <circle cx="44" cy="44" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
      <circle cx="44" cy="44" r={radius} fill="none" stroke={color} strokeWidth="7"
        strokeDasharray={animated ? `${targetDash} ${circ - targetDash}` : `0.001 ${circ}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 8px ${color})`,
          transition: 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <text x="44" y="48" textAnchor="middle" fill={color} fontSize="16" fontWeight="800" fontFamily="Orbitron, monospace">{value}%</text>
    </svg>
  )
}

function ScenarioRow({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 14px', borderRadius: 8,
      background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
      marginBottom: 8,
    }}>
      <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: 'Orbitron, monospace' }}>{value}</span>
    </div>
  )
}

export default function TradingScenarios() {
  const { t } = useLanguage()
  const lvls = useLiveLevels()

  const entryLow  = Math.round((lvls.support + lvls.dayRange * 0.15) / 5) * 5
  const entryHigh = Math.round((lvls.support + lvls.dayRange * 0.35) / 5) * 5
  const bullEntry = `$${entryLow.toLocaleString()} – $${entryHigh.toLocaleString()}`
  const bullT1    = `$${lvls.resistance.toLocaleString()}`
  const bullT2    = `$${lvls.target.toLocaleString()}`
  const bullInv   = `$${lvls.invalidation.toLocaleString()}`

  const bearEntryLow  = Math.round((lvls.resistance - lvls.dayRange * 0.05) / 5) * 5
  const bearEntryHigh = Math.round((lvls.resistance + lvls.dayRange * 0.15) / 5) * 5
  const bearEntry = `$${bearEntryLow.toLocaleString()} – $${bearEntryHigh.toLocaleString()} (short from resistance)`
  const bearT1    = `$${Math.round((lvls.support + lvls.dayRange * 0.3) / 5) * 5}`
  const bearT2    = `$${Math.round((lvls.support - lvls.dayRange * 0.1) / 5) * 5}`
  const bearInv   = `$${lvls.target.toLocaleString()}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="page-title">{t('scenarios.title')}</h1>
        <p className="page-subtitle">{t('scenarios.subtitle')}</p>
      </div>

      {/* Chart Zone Mockup */}
      <div className="glass p-5" style={{ textAlign: 'center', minHeight: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12 }}>
          {/* Decorative chart lines */}
          <svg width="100%" height="100%" viewBox="0 0 800 240" preserveAspectRatio="none">
            <path d="M0 180 L100 160 L200 170 L300 140 L400 120 L500 100 L600 80 L700 60 L800 40" fill="none" stroke="var(--green)" strokeWidth="2.5"/>
            <line x1="0" y1="140" x2="800" y2="140" stroke="var(--green)" strokeWidth="1" strokeDasharray="6,4" opacity="0.5"/>
            <line x1="0" y1="60" x2="800" y2="60" stroke="var(--red)" strokeWidth="1" strokeDasharray="6,4" opacity="0.5"/>
            <line x1="0" y1="200" x2="800" y2="200" stroke="var(--green)" strokeWidth="1" strokeDasharray="6,4" opacity="0.4"/>
          </svg>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ padding: '6px 16px', background: 'rgba(0,212,160,0.15)', border: '1px solid rgba(0,212,160,0.4)', borderRadius: 8, fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>
              🟢 Target Zone: {bullT1} – {bullT2}
            </div>
            <div style={{ padding: '6px 16px', background: 'rgba(139,92,246,0.1)', border: '1px solid var(--gold-border)', borderRadius: 8, fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>
              🟡 Entry Zone: {bullEntry}
            </div>
            <div style={{ padding: '6px 16px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, fontSize: 12, fontWeight: 700, color: 'var(--red)' }}>
              🔴 Invalidation: {bullInv}
            </div>
          </div>
          <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-3)' }}>📊 Chart zones shown are DEMO — connect live backend for real analysis</div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="g-2" style={{ gap: 20 }}>
        {/* Bullish Scenario */}
        <div className="glass-green p-6">
          <div className="flex items-center gap-3 mb-4">
            <ScenarioProbabilityArc value={scenarios.bullish.probability} color="var(--green)" />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)' }}>🟢 {t('scenarios.bullish')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Active • Preferred setup</div>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(0,212,160,0.08)', borderRadius: 8, border: '1px solid rgba(0,212,160,0.2)' }}>
              <div style={{ fontSize: 9, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{t('scenarios.condition')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.5 }}>{scenarios.bullish.condition}</div>
            </div>
            <ScenarioRow label={t('scenarios.entryZone')} value={bullEntry} color="var(--gold)" />
            <ScenarioRow label={t('scenarios.target1')} value={bullT1} color="var(--green)" />
            <ScenarioRow label={t('scenarios.target2')} value={bullT2} color="var(--green)" />
            <ScenarioRow label={t('scenarios.invalidation')} value={bullInv} color="var(--red)" />
          </div>

          <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, border: '1px solid rgba(0,212,160,0.15)' }}>
            <div style={{ fontSize: 9, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>🤖 {t('scenarios.aiExplanation')}</div>
            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{scenarios.bullish.aiExplanation}</p>
          </div>
        </div>

        {/* Bearish Scenario */}
        <div className="glass-red p-6">
          <div className="flex items-center gap-3 mb-4">
            <ScenarioProbabilityArc value={scenarios.bearish.probability} color="var(--red)" />
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--red)' }}>🔴 {t('scenarios.bearish')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>Inactive • If {bullInv} breaks</div>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontSize: 9, color: 'var(--red)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{t('scenarios.condition')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.5 }}>{scenarios.bearish.condition}</div>
            </div>
            <ScenarioRow label={t('scenarios.entryZone')} value={bearEntry} color="var(--gold)" />
            <ScenarioRow label={t('scenarios.target1')} value={bearT1} color="var(--red)" />
            <ScenarioRow label={t('scenarios.target2')} value={bearT2} color="var(--red)" />
            <ScenarioRow label={t('scenarios.invalidation')} value={bearInv} color="var(--green)" />
          </div>

          <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.15)' }}>
            <div style={{ fontSize: 9, color: 'var(--red)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>🤖 {t('scenarios.aiExplanation')}</div>
            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{scenarios.bearish.aiExplanation}</p>
          </div>
        </div>
      </div>

      {/* Neutral / No Trade */}
      <div className="glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(148,163,184,0.15)', border: '1px solid rgba(148,163,184,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚪</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-2)' }}>{t('scenarios.neutral')}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Conditions when you should stay out</div>
          </div>
        </div>

        <div className="g-3" style={{ gap: 16 }}>
          <div>
            <div className="section-label mb-2">{t('scenarios.whenToAvoid')}</div>
            {scenarios.neutral.whenToAvoid.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ color: 'var(--red)', fontSize: 13, flexShrink: 0 }}>⛔</span>
                <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="section-label mb-2">{t('scenarios.newsToAvoid')}</div>
            {scenarios.neutral.newsToAvoid.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ color: 'var(--amber)', fontSize: 13, flexShrink: 0 }}>⚠️</span>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{item}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="section-label mb-2">{t('scenarios.zonesToWait')}</div>
            {scenarios.neutral.zonesToWait.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ color: 'var(--green)', fontSize: 13, flexShrink: 0 }}>✅</span>
                <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
