import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLiveLevels } from '../hooks/useLiveLevels'
import { useLanguage } from '../context/LanguageContext'

export default function AIDailyBrief() {
  const [expanded, setExpanded] = useState(true)
  const navigate = useNavigate()
  const lvls = useLiveLevels()
  const { t, lang } = useLanguage()

  const now = new Date()
  const dateLocale = lang === 'sr' ? 'sr-Latn-RS' : 'en-US'
  const dateStr = now.toLocaleDateString(dateLocale, { weekday: 'long', month: 'long', day: 'numeric' })
  const genTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short' })

  const dxyPrice = lvls.liveDXY?.price
  const dxyPct   = lvls.liveDXY?.changePct

  const sup = lvls.support    != null ? `$${lvls.support.toLocaleString()}`      : '—'
  const res = lvls.resistance != null ? `$${lvls.resistance.toLocaleString()}`   : '—'
  const liq = lvls.liquidityZone != null ? `$${lvls.liquidityZone.toLocaleString()}` : '—'
  const prc = lvls.price      != null ? `$${Math.round(lvls.price).toLocaleString()}` : '—'

  const bullets = [
    {
      label: 'Gold',
      color: '#f59e0b',
      text: lvls.bias === 'BULLISH'
        ? `${t('aiDailyBrief.bullishAbove')} ${sup}. ${t('aiDailyBrief.momentumToward')} ${liq} ${t('aiDailyBrief.liquidityZoneSuffix')}.`
        : lvls.bias === 'BEARISH'
        ? `${t('aiDailyBrief.bearishBelow')} ${res}. ${t('aiDailyBrief.watchingKey')} ${sup} ${t('aiDailyBrief.keyDefence')}`
        : `${t('aiDailyBrief.neutralNear')} ${prc}. ${t('aiDailyBrief.range')} ${sup}–${res}. ${t('aiDailyBrief.wait')}`,
    },
    {
      label: 'DXY',
      color: '#60a5fa',
      text: dxyPrice
        ? `${lvls.dxyFalling ? t('aiDailyBrief.weak') : t('aiDailyBrief.firm')} — ${t('aiDailyBrief.at')} ${dxyPrice.toFixed(3)} (${dxyPct >= 0 ? '+' : ''}${dxyPct?.toFixed(2)}%). ${lvls.dxyFalling ? t('aiDailyBrief.tailwind') : t('aiDailyBrief.headwind')}`
        : t('aiDailyBrief.dollarLoading'),
    },
    {
      label: 'US10Y',
      color: '#34d399',
      text: t('aiDailyBrief.yieldsDeclining'),
    },
    {
      label: 'Liquidity',
      color: '#a78bfa',
      text: `${t('aiDailyBrief.poolsAbove')} ${res} ${t('aiDailyBrief.andBelow')} ${sup}. ${t('aiDailyBrief.liquidityPools')}`,
    },
  ]

  const risk = { event: 'CPI', time: '14:30 UTC', level: 'High', note: t('aiDailyBrief.riskNote') }

  const sentiment = lvls.bias === 'BULLISH' ? 81 : lvls.bias === 'BEARISH' ? 34 : 54

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(109,40,217,0.08) 0%, rgba(17,17,32,0.9) 60%)',
      border: '1px solid rgba(139,92,246,0.2)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: expanded ? '1px solid rgba(139,92,246,0.12)' : 'none',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer',
        userSelect: 'none',
      }} onClick={() => setExpanded(e => !e)}>
        {/* AI pulse dot */}
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--gold)',
          boxShadow: '0 0 8px 2px rgba(139,92,246,0.5)',
          animation: 'dotPulse 1.5s ease infinite',
          flexShrink: 0,
        }} />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
              {t('aiDailyBrief.title')}
            </span>
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '2px 7px', borderRadius: 20,
              background: 'rgba(139,92,246,0.12)', color: 'var(--gold)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}>{t('aiDailyBrief.live')}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>
            {dateStr} · {t('aiDailyBrief.updated')} {genTime}
          </div>
        </div>

        {/* Sentiment pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '5px 12px', borderRadius: 20,
          background: lvls.bias === 'BULLISH' ? 'rgba(52,211,153,0.08)' : lvls.bias === 'BEARISH' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
          border: `1px solid ${lvls.bias === 'BULLISH' ? 'rgba(52,211,153,0.2)' : lvls.bias === 'BEARISH' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
        }}>
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 600 }}>{t('aiDailyBrief.sentiment')}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: lvls.biasColor, fontFamily: 'Orbitron, monospace' }}>{sentiment}%</span>
          <span style={{ fontSize: 10, color: lvls.biasColor }}>{lvls.trendStatus}</span>
        </div>

        <span style={{ fontSize: 14, color: 'var(--text-3)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
      </div>

      {/* Body */}
      {expanded && (
        <div style={{ padding: '16px 20px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {/* Market bullets */}
          <div style={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {bullets.map(b => (
              <div key={b.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
                  color: b.color,
                  background: `${b.color}14`,
                  border: `1px solid ${b.color}30`,
                  borderRadius: 5, padding: '2px 8px',
                  flexShrink: 0, minWidth: 58, textAlign: 'center', marginTop: 1,
                }}>
                  {b.label}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{b.text}</span>
              </div>
            ))}
          </div>

          {/* Risk + CTA */}
          <div style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Biggest risk box */}
            <div style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 8 }}>
                ⚡ {t('aiDailyBrief.biggestRisk')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)' }}>{risk.event}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, fontFamily: 'Orbitron, monospace',
                  color: 'var(--red)', background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)', borderRadius: 5, padding: '1px 7px',
                }}>{risk.time}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#fff', background: 'var(--red)', borderRadius: 4, padding: '2px 6px',
                }}>{risk.level}</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.55 }}>{risk.note}</p>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/ai-mentor')}
              style={{
                padding: '10px 16px', borderRadius: 9, cursor: 'pointer',
                background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                color: 'var(--gold)', fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.14)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)' }}
            >
              🤖 {t('aiDailyBrief.askCopilot')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
