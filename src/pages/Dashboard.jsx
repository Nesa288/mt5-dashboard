import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { goldData, news, calendarEvents, scenarios, sentiment, instruments } from '../data/mockData'
import { GoldMiniChart } from '../components/TradingViewWidget'
import { IcoArrowUp, IcoArrowDown, IcoAlert, IcoInfo, IcoChevronRight, IcoTarget, IcoShield } from '../components/Icons'

function TrendBadge({ trend }) {
  const cls = trend === 'Bullish' ? 'badge-bull' : trend === 'Bearish' ? 'badge-bear' : 'badge-neutral'
  const Icon = trend === 'Bullish' ? IcoArrowUp : trend === 'Bearish' ? IcoArrowDown : null
  return (
    <span className={`badge ${cls}`}>
      {Icon && <Icon size={10} />}
      {trend}
    </span>
  )
}

function ImpactDots({ impact }) {
  return (
    <span style={{ display: 'flex', gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: i <= impact
            ? impact >= 4 ? 'var(--red)' : impact === 3 ? 'var(--amber)' : 'var(--green)'
            : 'rgba(255,255,255,0.1)',
        }} />
      ))}
    </span>
  )
}

function SessionBlock({ name, color, isActive, label }) {
  return (
    <div style={{
      flex: 1,
      padding: '14px 12px',
      borderRadius: 10,
      background: isActive ? `rgba(${color},0.1)` : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isActive ? `rgba(${color},0.35)` : 'var(--border)'}`,
      transition: 'all 0.3s ease',
      textAlign: 'center',
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: isActive ? `rgb(${color})` : 'rgba(255,255,255,0.2)',
        margin: '0 auto 6px',
        boxShadow: isActive ? `0 0 10px rgb(${color})` : 'none',
        animation: isActive ? 'dotPulse 1.5s ease infinite' : 'none',
      }} />
      <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? `rgb(${color})` : 'var(--text-3)', marginBottom: 2 }}>{name}</div>
      <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const todayNews = news.slice(0, 3)
  const todayEvents = calendarEvents.filter(e => e.date === 'today').slice(0, 4)

  const nowH = new Date().getUTCHours()
  const sessions = {
    london: nowH >= 8 && nowH < 17,
    newYork: nowH >= 13 && nowH < 22,
    asia: nowH >= 23 || nowH < 8,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-subtitle">{t('dashboard.subtitle')}</p>
        </div>
        <span className="badge badge-demo">
          <IcoInfo size={10} />
          AI zones: DEMO
        </span>
      </div>

      {/* Row 1: Hero + Sessions + Sentiment */}
      <div className="g-aside">
        {/* XAUUSD Hero Panel */}
        <div className="glass-gold p-5" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="card-heading" style={{ color: 'var(--gold)', marginBottom: 4 }}>XAUUSD — Gold / US Dollar</div>
              <div className="price-lg">${goldData.price.toFixed(2)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end',
                color: goldData.change > 0 ? 'var(--green)' : 'var(--red)',
                fontSize: 16, fontWeight: 700, fontFamily: 'Orbitron, monospace',
              }}>
                {goldData.change > 0 ? <IcoArrowUp size={16} /> : <IcoArrowDown size={16} />}
                +${goldData.change.toFixed(2)} ({goldData.changePercent}%)
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                H: ${goldData.high.toFixed(2)} &nbsp; L: ${goldData.low.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div style={{ height: 160, marginBottom: 14, borderRadius: 10, overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
            <GoldMiniChart height={160} />
          </div>

          {/* AI Stats Row */}
          <div className="g-4" style={{ gap: 10 }}>
            {[
              { label: t('dashboard.hero.aiOutlook'), value: goldData.aiOutlook, color: 'var(--gold)' },
              { label: t('dashboard.hero.trend'), value: goldData.trendStatus, color: 'var(--green)' },
              { label: t('dashboard.hero.targetZone'), value: `$${goldData.targetZone}`, color: 'var(--green)' },
              { label: t('dashboard.hero.invalidation'), value: `$${goldData.invalidation}`, color: 'var(--red)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Sessions + Sentiment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Session Tracker */}
          <div className="glass p-4">
            <div className="section-label mb-3">{t('dashboard.sessions.title')}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SessionBlock name={t('dashboard.sessions.london')} color="255,215,0" isActive={sessions.london} label={sessions.london ? t('dashboard.sessions.active') : '08:00–17:00'} />
              <SessionBlock name={t('dashboard.sessions.newYork')} color="59,130,246" isActive={sessions.newYork} label={sessions.newYork ? t('dashboard.sessions.active') : '13:00–22:00'} />
              <SessionBlock name={t('dashboard.sessions.asia')} color="0,212,160" isActive={sessions.asia} label={sessions.asia ? t('dashboard.sessions.active') : '23:00–08:00'} />
            </div>
          </div>

          {/* Sentiment */}
          <div className="glass p-4" style={{ flex: 1 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="section-label" style={{ marginBottom: 0 }}>{t('dashboard.sentiment.title')}</div>
              <span className="badge badge-demo" style={{ fontSize: 9 }}>{t('common.demo')}</span>
            </div>

            {/* Retail */}
            <div style={{ marginBottom: 14 }}>
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600 }}>{t('dashboard.sentiment.retail')}</span>
                <div style={{ fontSize: 11 }}>
                  <span style={{ color: 'var(--green)', fontWeight: 700 }}>{sentiment.retail.long}% {t('dashboard.sentiment.long')}</span>
                  <span style={{ color: 'var(--text-3)' }}> / </span>
                  <span style={{ color: 'var(--red)', fontWeight: 700 }}>{sentiment.retail.short}% {t('dashboard.sentiment.short')}</span>
                </div>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${sentiment.retail.long}%`, background: 'linear-gradient(90deg, var(--green), var(--green-2))' }} />
              </div>
            </div>

            {/* Smart Money */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600 }}>{t('dashboard.sentiment.smartMoney')}</span>
                <div style={{ fontSize: 11 }}>
                  <span style={{ color: 'var(--green)', fontWeight: 700 }}>{sentiment.smartMoney.long}% {t('dashboard.sentiment.long')}</span>
                  <span style={{ color: 'var(--text-3)' }}> / </span>
                  <span style={{ color: 'var(--red)', fontWeight: 700 }}>{sentiment.smartMoney.short}% {t('dashboard.sentiment.short')}</span>
                </div>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${sentiment.smartMoney.long}%`, background: 'linear-gradient(90deg, var(--gold-2), var(--gold))' }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 6 }}>Smart money positions diverge from retail — institutions accumulating longs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Trend + Key Levels */}
      <div className="g-2">
        {/* Trend Overview */}
        <div className="glass p-4">
          <div className="section-label">{t('dashboard.trend.title')}</div>
          <div className="g-3" style={{ gap: 10 }}>
            {[
              { tf: t('dashboard.trend.daily'), trend: goldData.dailyTrend, sub: 'Price above all MAs' },
              { tf: t('dashboard.trend.h4'), trend: goldData.h4Trend, sub: 'Strong bullish momentum' },
              { tf: t('dashboard.trend.h1'), trend: goldData.h1Trend, sub: 'Consolidating at $3,248' },
            ].map(({ tf, trend, sub }) => (
              <div key={tf} style={{
                padding: '14px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 10,
                border: `1px solid ${trend === 'Bullish' ? 'rgba(0,212,160,0.2)' : trend === 'Bearish' ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8 }}>{tf}</div>
                <TrendBadge trend={trend} />
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 8, lineHeight: 1.4 }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Levels */}
        <div className="glass p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="section-label" style={{ marginBottom: 0 }}>{t('dashboard.keyLevels.title')}</div>
            <span className="badge badge-demo" style={{ fontSize: 9 }}>{t('common.demo')}</span>
          </div>
          <div className="g-2" style={{ gap: 10 }}>
            {[
              { label: t('dashboard.keyLevels.support'), value: `$${goldData.support.toLocaleString()}`, color: 'var(--green)', Icon: IcoShield },
              { label: t('dashboard.keyLevels.resistance'), value: `$${goldData.resistance.toLocaleString()}`, color: 'var(--red)', Icon: IcoTarget },
              { label: t('dashboard.keyLevels.liquidity'), value: `$${goldData.liquidityZone.toLocaleString()}`, color: 'var(--amber)', Icon: IcoInfo },
              { label: t('dashboard.keyLevels.asianHigh'), value: `$${goldData.asianHigh.toLocaleString()}`, color: 'var(--blue)', Icon: IcoArrowUp },
              { label: t('dashboard.keyLevels.asianLow'), value: `$${goldData.asianLow.toLocaleString()}`, color: 'var(--purple)', Icon: IcoArrowDown },
            ].map(({ label, value, color, Icon }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 8, border: '1px solid var(--border)',
              }}>
                <Icon size={14} color={color} />
                <div>
                  <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: 'Orbitron, monospace' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: News + Calendar */}
      <div className="g-2">
        {/* Today's News */}
        <div className="glass p-4">
          <div className="section-label">{t('dashboard.news.title')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayNews.map(item => (
              <div key={item.id} style={{
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 10,
                border: `1px solid var(--border)`,
                borderLeft: `3px solid ${item.sentiment === 'bullish' ? 'var(--green)' : item.sentiment === 'bearish' ? 'var(--red)' : 'var(--amber)'}`,
              }}>
                <div className="flex items-center justify-between mb-1" style={{ gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.3 }}>{item.title}</div>
                  <ImpactDots impact={item.impact === 'high' ? 5 : item.impact === 'medium' ? 3 : 1} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--gold)', marginTop: 6, lineHeight: 1.4 }}>
                  🤖 {item.aiSummary.substring(0, 80)}...
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>{item.time} · {item.source}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Economic Calendar Preview */}
        <div className="glass p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="section-label" style={{ marginBottom: 0 }}>{t('dashboard.calendar.title')}</div>
            <button className="btn btn-ghost btn-xs" onClick={() => navigate('/calendar')}>
              {t('dashboard.calendar.viewFull')} <IcoChevronRight size={11} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {todayEvents.map(ev => (
              <div key={ev.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 8, border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 11, color: 'var(--text-2)', fontFamily: 'Orbitron, monospace', minWidth: 40 }}>{ev.time}</span>
                <span style={{
                  width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: ev.currency === 'USD' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.08)',
                  fontSize: 10, fontWeight: 700,
                  color: ev.currency === 'USD' ? 'var(--blue)' : 'var(--text-2)',
                  flexShrink: 0,
                }}>
                  {ev.currency}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-1)', flex: 1 }}>{ev.event}</span>
                <ImpactDots impact={ev.impact} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Trading Scenarios */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="section-label" style={{ marginBottom: 0 }}>{t('dashboard.scenarios.title')}</div>
          <span className="badge badge-demo" style={{ fontSize: 9 }}>{t('common.demo')}</span>
        </div>
        <div className="g-2">
          {/* Bullish */}
          <div className="glass-green p-5">
            <div className="flex items-center justify-between mb-3">
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>🟢 {t('dashboard.scenarios.bullish')}</div>
              <div style={{
                padding: '4px 12px', borderRadius: 20,
                background: 'rgba(0,212,160,0.2)',
                fontSize: 13, fontWeight: 700, color: 'var(--green)',
              }}>
                {scenarios.bullish.probability}%
              </div>
            </div>
            <div className="g-2" style={{ gap: 8 }}>
              {[
                { l: t('dashboard.scenarios.entry'), v: scenarios.bullish.entry },
                { l: t('dashboard.scenarios.target1'), v: scenarios.bullish.target1 },
                { l: t('dashboard.scenarios.target2'), v: scenarios.bullish.target2 },
                { l: t('dashboard.scenarios.invalidation'), v: scenarios.bullish.invalidation },
              ].map(({ l, v }) => (
                <div key={l}>
                  <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5, borderTop: '1px solid rgba(0,212,160,0.15)', paddingTop: 10 }}>
              {t('dashboard.scenarios.condition')}: <span style={{ color: 'var(--green)' }}>{scenarios.bullish.condition.substring(0, 70)}...</span>
            </div>
          </div>

          {/* Bearish */}
          <div className="glass-red p-5">
            <div className="flex items-center justify-between mb-3">
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--red)' }}>🔴 {t('dashboard.scenarios.bearish')}</div>
              <div style={{
                padding: '4px 12px', borderRadius: 20,
                background: 'rgba(239,68,68,0.2)',
                fontSize: 13, fontWeight: 700, color: 'var(--red)',
              }}>
                {scenarios.bearish.probability}%
              </div>
            </div>
            <div className="g-2" style={{ gap: 8 }}>
              {[
                { l: t('dashboard.scenarios.entry'), v: scenarios.bearish.entry },
                { l: t('dashboard.scenarios.target1'), v: scenarios.bearish.target1 },
                { l: t('dashboard.scenarios.target2'), v: scenarios.bearish.target2 },
                { l: t('dashboard.scenarios.invalidation'), v: scenarios.bearish.invalidation },
              ].map(({ l, v }) => (
                <div key={l}>
                  <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5, borderTop: '1px solid rgba(239,68,68,0.15)', paddingTop: 10 }}>
              {t('dashboard.scenarios.condition')}: <span style={{ color: 'var(--red)' }}>{scenarios.bearish.condition.substring(0, 70)}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
