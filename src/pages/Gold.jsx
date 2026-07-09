import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  goldData, instruments, news, calendarEvents,
  scenarios, sentiment, sessions, journalTrades,
} from '../data/mockData'
import { GoldChart } from '../components/TradingViewWidget'
import { useLiveMarket } from '../context/LiveMarketContext'

const TABS = [
  { id: 'trend',       icon: '📈', label: 'Trend' },
  { id: 'bias',        icon: '🎯', label: 'Bias' },
  { id: 'levels',      icon: '📏', label: 'Levels' },
  { id: 'news',        icon: '📰', label: 'News' },
  { id: 'scenarios',   icon: '⚡', label: 'Scenarios' },
  { id: 'liquidity',   icon: '💧', label: 'Liquidity' },
  { id: 'sessions',    icon: '🕐', label: 'Sessions' },
  { id: 'alerts',      icon: '🔔', label: 'Alerts' },
  { id: 'ai',          icon: '🤖', label: 'AI' },
  { id: 'history',     icon: '📔', label: 'History' },
  { id: 'correlation', icon: '🔗', label: 'Correlation' },
  { id: 'sentiment',   icon: '💡', label: 'Sentiment' },
]

const TC = (t) => t === 'Bullish' ? '#34d399' : t === 'Bearish' ? '#ef4444' : '#94a3b8'
const IMPACT_COLOR = { 5: '#ef4444', 4: '#f59e0b', 3: '#94a3b8' }
const SENT_COLOR = { bullish: '#34d399', bearish: '#ef4444', neutral: '#94a3b8' }

// ─── TREND ───────────────────────────────────────────────────────────────────
function TrendPanel() {
  const tfs = [
    { tf: 'Daily', trend: goldData.dailyTrend,  detail: 'Strong bullish structure',  sub: 'Above 50MA & 200MA — dominant uptrend' },
    { tf: 'H4',    trend: goldData.h4Trend,     detail: 'Higher-highs / higher-lows', sub: 'Above key moving averages' },
    { tf: 'H1',    trend: goldData.h1Trend,     detail: 'Consolidating at resistance', sub: 'Near 50MA — watch for break' },
    { tf: 'M15',   trend: goldData.m15Trend,    detail: 'Short-term pullback',         sub: 'Below 50MA — minor bearish' },
  ]
  const bullCount = tfs.filter(t => t.trend === 'Bullish').length
  const bearCount = tfs.filter(t => t.trend === 'Bearish').length
  const signal = bullCount >= 3 ? 'BULLISH' : bearCount >= 3 ? 'BEARISH' : 'MIXED'
  const sc = signal === 'BULLISH' ? '#34d399' : signal === 'BEARISH' ? '#ef4444' : '#f59e0b'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top: alignment bars + overall signal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 14 }}>
        <div className="glass p-4">
          <div className="section-label mb-3">Timeframe Analysis</div>
          {tfs.map(row => {
            const c = TC(row.trend)
            return (
              <div key={row.tf} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', width: 40 }}>{row.tf}</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: `${c}14`, border: `1px solid ${c}28`, color: c, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {row.trend === 'Bullish' ? '↑' : row.trend === 'Bearish' ? '↓' : '→'} {row.trend}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-1)', fontWeight: 500 }}>{row.detail}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{row.sub}</div>
                </div>
              </div>
            )
          })}
          <div style={{ marginTop: 14, padding: '14px', background: `${sc}10`, border: `1px solid ${sc}25`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Alignment Signal</div>
              <span style={{ fontSize: 22, fontWeight: 900, color: sc, fontFamily: 'Orbitron, monospace' }}>{signal}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#34d399' }}>{bullCount} Bullish TF</div>
              <div style={{ fontSize: 11, color: '#ef4444', marginTop: 2 }}>{bearCount} Bearish TF</div>
            </div>
          </div>
        </div>

        {/* Right: visual arrows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="glass p-4" style={{ flex: 1 }}>
            <div className="section-label mb-3">Visual Alignment</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tfs.map(row => {
                const c = TC(row.trend)
                return (
                  <div key={row.tf} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-3)', width: 32 }}>{row.tf}</span>
                    <div style={{ flex: 1, height: 36, background: `${c}14`, border: `1px solid ${c}30`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: c, fontWeight: 900 }}>
                      {row.trend === 'Bullish' ? '▲' : row.trend === 'Bearish' ? '▼' : '▶'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="glass p-3">
            <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Today's Range</div>
            <div style={{ position: 'relative', height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 6 }}>
              <div style={{ position: 'absolute', left: `${((goldData.price - goldData.low) / (goldData.high - goldData.low) * 100).toFixed(1)}%`, top: -4, width: 13, height: 13, background: 'var(--gold)', borderRadius: '50%', transform: 'translateX(-50%)', boxShadow: '0 0 8px var(--gold)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 10, color: '#ef4444', fontFamily: 'Orbitron, monospace' }}>L {goldData.low}</span>
              <span style={{ fontSize: 10, color: '#34d399', fontFamily: 'Orbitron, monospace' }}>H {goldData.high}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: chart + stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14 }}>
        <div className="glass" style={{ overflow: 'hidden' }}>
          <GoldChart height={320} interval="H4" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 200 }}>
          {[
            { label: 'ATR (14)', value: goldData.atr, unit: 'pips', color: 'var(--amber)' },
            { label: 'Volatility', value: goldData.volatility, color: 'var(--amber)' },
            { label: 'Volume', value: goldData.volume, color: 'var(--text-1)' },
            { label: 'Spread', value: (goldData.ask - goldData.bid).toFixed(2), unit: 'pts', color: 'var(--text-2)' },
          ].map(s => (
            <div key={s.label} className="glass p-3" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: 'Orbitron, monospace' }}>{s.value}{s.unit ? <span style={{ fontSize: 10 }}> {s.unit}</span> : ''}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── BIAS ─────────────────────────────────────────────────────────────────────
function BiasPanel() {
  const biasColor = goldData.aiOutlook === 'BULLISH' ? '#34d399' : '#ef4444'
  const confidence = 74
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Big bias card */}
      <div className="glass p-5" style={{ background: `linear-gradient(135deg, ${biasColor}08, rgba(255,255,255,0.02))`, border: `1px solid ${biasColor}20` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>Today's Directional Bias</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: biasColor, fontFamily: 'Orbitron, monospace', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {goldData.aiOutlook === 'BULLISH' ? '↑' : '↓'} {goldData.aiOutlook}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8 }}>Confidence: <span style={{ color: biasColor, fontWeight: 700 }}>{confidence}%</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>AI Outlook</div>
            <div style={{ padding: '4px 14px', borderRadius: 20, background: `${biasColor}18`, border: `1px solid ${biasColor}35`, color: biasColor, fontSize: 12, fontWeight: 700, display: 'inline-block' }}>
              {goldData.trendStatus}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-3)' }}>Target: <span style={{ color: 'var(--gold)', fontFamily: 'Orbitron, monospace', fontWeight: 700 }}>${goldData.targetZone.toLocaleString()}</span></div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>Invalidation: <span style={{ color: '#ef4444', fontFamily: 'Orbitron, monospace', fontWeight: 700 }}>${goldData.invalidation.toLocaleString()}</span></div>
          </div>
        </div>
        {/* Confidence bar */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 10, color: 'var(--text-3)' }}>
            <span>0%</span><span>Bias Strength</span><span>100%</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${confidence}%`, background: `linear-gradient(to right, ${biasColor}80, ${biasColor})`, borderRadius: 4, transition: 'width 1s ease' }} />
          </div>
        </div>
      </div>

      {/* AI Daily Plan */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="glass-gold p-4">
          <div style={{ fontSize: 9, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, marginBottom: 10 }}>⚡ AI DAILY PLAN</div>
          <p style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.8, margin: 0 }}>{goldData.aiDailyPlan}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Bias factors */}
          {[
            { label: 'Daily Trend', value: goldData.dailyTrend, positive: goldData.dailyTrend === 'Bullish' },
            { label: 'H4 Trend', value: goldData.h4Trend, positive: goldData.h4Trend === 'Bullish' },
            { label: 'DXY', value: 'Bearish (↑ Gold)', positive: true },
            { label: 'Smart Money', value: `${sentiment.smartMoney.long}% Long`, positive: true },
            { label: 'Volatility', value: goldData.volatility, positive: false, neutral: true },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{f.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: f.neutral ? 'var(--amber)' : f.positive ? '#34d399' : '#ef4444' }}>{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      {goldData.tradingWarning && (
        <div style={{ padding: '14px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Trading Warning</div>
            <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6 }}>{goldData.tradingWarning}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── LEVELS ───────────────────────────────────────────────────────────────────
function LevelsPanel() {
  const MIN = 3200, MAX = 3295, RANGE = MAX - MIN
  const pos = (p) => `${((MAX - p) / RANGE * 100).toFixed(2)}%`

  const marks = [
    { price: goldData.targetZone,            label: 'Target Zone',       color: '#8B5CF6', dashed: true, weight: 600 },
    { price: goldData.resistance,            label: 'Resistance',        color: '#ef4444', weight: 700 },
    { price: goldData.manipulationZone.high, label: 'Manip High',        color: '#f59e0b', dashed: true, weight: 400 },
    { price: goldData.asianHigh,             label: 'Asian High',        color: '#f59e0b', weight: 500 },
    { price: goldData.liquidityZone,         label: 'Liquidity Zone',    color: '#3b82f6', dashed: true, weight: 500 },
    { price: goldData.price,                 label: '▶ XAUUSD',          color: '#ffffff', weight: 900, current: true },
    { price: goldData.manipulationZone.low,  label: 'Manip Low',         color: '#f59e0b', dashed: true, weight: 400 },
    { price: goldData.asianLow,              label: 'Asian Low',         color: '#f59e0b', weight: 500 },
    { price: goldData.support,               label: 'Support',           color: '#34d399', weight: 700 },
    { price: goldData.invalidation,          label: 'Invalidation',      color: '#ef4444', dashed: true, weight: 400 },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 14 }}>
      {/* Price Ladder */}
      <div className="glass p-4">
        <div className="section-label mb-4">Price Ladder — XAUUSD</div>
        <div style={{ position: 'relative', height: 420, marginTop: 8 }}>
          {/* Manipulation zone band */}
          <div style={{ position: 'absolute', left: 88, right: 8, top: pos(goldData.manipulationZone.high), bottom: `${(100 - parseFloat(pos(goldData.manipulationZone.low))).toFixed(2)}%`, background: 'rgba(245,158,11,0.06)', border: '1px dashed rgba(245,158,11,0.2)', borderRadius: 4, zIndex: 0 }}>
            <span style={{ position: 'absolute', right: 8, top: 2, fontSize: 8, color: 'rgba(245,158,11,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Manipulation Zone</span>
          </div>

          {marks.map((m, i) => (
            <div key={i} style={{ position: 'absolute', top: pos(m.price), left: 0, right: 0, display: 'flex', alignItems: 'center', gap: 8, zIndex: 1, transform: 'translateY(-50%)' }}>
              <span style={{ fontSize: 10, fontFamily: 'Orbitron, monospace', color: m.color, width: 82, textAlign: 'right', fontWeight: m.weight, flexShrink: 0 }}>{m.price.toFixed(2)}</span>
              <div style={{ flex: 1, height: 0, borderTop: `${m.current ? 2 : 1}px ${m.dashed ? 'dashed' : 'solid'} ${m.color}`, opacity: m.current ? 1 : 0.65 }} />
              <span style={{ fontSize: m.current ? 11 : 10, color: m.color, fontWeight: m.weight, flexShrink: 0 }}>{m.label}</span>
              {m.current && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ffffff', flexShrink: 0, boxShadow: '0 0 6px #fff' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: level cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="section-label">Key Zones</div>
        {[
          { label: 'Resistance', value: goldData.resistance, color: '#ef4444', icon: '🔴', desc: 'Strong sell zone' },
          { label: 'Target', value: goldData.targetZone, color: '#8B5CF6', icon: '🎯', desc: 'Bullish objective' },
          { label: 'Liquidity', value: goldData.liquidityZone, color: '#3b82f6', icon: '💧', desc: 'Buy-side liquidity' },
          { label: 'Support', value: goldData.support, color: '#34d399', icon: '🟢', desc: 'Buy zone' },
          { label: 'Invalidation', value: goldData.invalidation, color: '#ef4444', icon: '❌', desc: 'Short bias below' },
        ].map(z => (
          <div key={z.label} style={{ padding: '12px 14px', background: `${z.color}08`, border: `1px solid ${z.color}22`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{z.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600 }}>{z.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{z.desc}</div>
              </div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: z.color, fontFamily: 'Orbitron, monospace' }}>{z.value.toLocaleString()}</span>
          </div>
        ))}

        <div style={{ padding: '12px 14px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10 }}>
          <div style={{ fontSize: 9, color: 'var(--amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Asian Range</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>High</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)', fontFamily: 'Orbitron, monospace' }}>{goldData.asianHigh}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Low</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)', fontFamily: 'Orbitron, monospace' }}>{goldData.asianLow}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 5 }}>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Range Width</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)', fontFamily: 'Orbitron, monospace' }}>{(goldData.asianHigh - goldData.asianLow).toFixed(2)} pts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────
function NewsPanel() {
  const todayEvents = calendarEvents.filter(e => e.date === 'today').sort((a, b) => b.impact - a.impact)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Economic Calendar */}
      <div className="glass p-4">
        <div className="section-label mb-3">📅 Economic Calendar — Today</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {todayEvents.map(ev => {
            const ic = IMPACT_COLOR[ev.impact] || '#94a3b8'
            return (
              <div key={ev.id} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${ev.recommendation === 'avoid' ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`, borderRadius: 10 }}>
                <div style={{ flexShrink: 0, width: 56, textAlign: 'center', paddingTop: 2 }}>
                  <div style={{ fontSize: 12, fontFamily: 'Orbitron, monospace', color: 'var(--text-1)', fontWeight: 700 }}>{ev.time}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-3)', marginTop: 2 }}>UTC</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{ev.event}</span>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: `${ic}18`, color: ic, border: `1px solid ${ic}30`, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
                      {'★'.repeat(Math.min(ev.impact, 5))} Impact
                    </span>
                    {ev.recommendation === 'avoid' && (
                      <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', fontWeight: 700, textTransform: 'uppercase' }}>AVOID</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 4 }}>{ev.aiNote}</div>
                  {(ev.forecast || ev.previous) && (
                    <div style={{ display: 'flex', gap: 12 }}>
                      {ev.forecast && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Forecast: <b style={{ color: 'var(--text-2)' }}>{ev.forecast}</b></span>}
                      {ev.previous && <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Previous: <b style={{ color: 'var(--text-2)' }}>{ev.previous}</b></span>}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* News feed */}
      <div className="glass p-4">
        <div className="section-label mb-3">📰 Market News — Gold Impact</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {news.map(n => (
            <div key={n.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${SENT_COLOR[n.sentiment]}18`, color: SENT_COLOR[n.sentiment], border: `1px solid ${SENT_COLOR[n.sentiment]}30`, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{n.sentiment}</span>
                <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: n.impact === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(148,163,184,0.1)', color: n.impact === 'high' ? '#ef4444' : 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{n.impact}</span>
                <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 'auto' }}>{n.time}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.4, marginBottom: 6 }}>{n.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>{n.aiSummary}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 8 }}>Source: {n.source}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SCENARIOS ────────────────────────────────────────────────────────────────
function ScenariosPanel() {
  const bull = scenarios.bullish
  const bear = scenarios.bearish
  const neutral = scenarios.neutral
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Bullish */}
        <div style={{ padding: '20px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🐂</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#34d399' }}>BULLISH SCENARIO</span>
            </div>
            <div style={{ padding: '4px 12px', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#34d399', fontFamily: 'Orbitron, monospace' }}>{bull.probability}%</span>
            </div>
          </div>
          {/* Probability bar */}
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ width: `${bull.probability}%`, height: '100%', background: 'linear-gradient(to right, #34d39980, #34d399)', borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(52,211,153,0.8)', lineHeight: 1.5, marginBottom: 14 }}>{bull.condition}</div>
          {[
            { label: 'Entry Zone', value: bull.entry, color: '#34d399' },
            { label: 'Target 1', value: bull.target1, color: '#34d399' },
            { label: 'Target 2', value: bull.target2, color: '#8B5CF6' },
            { label: 'Stop Loss', value: bull.invalidation, color: '#ef4444' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(52,211,153,0.1)' }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: r.color, fontFamily: 'Orbitron, monospace' }}>{r.value}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: '10px', background: 'rgba(52,211,153,0.06)', borderRadius: 8 }}>
            <div style={{ fontSize: 9, color: 'rgba(52,211,153,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>AI Explanation</div>
            <p style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{bull.aiExplanation}</p>
          </div>
        </div>

        {/* Bearish */}
        <div style={{ padding: '20px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>🐻</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#ef4444' }}>BEARISH SCENARIO</span>
            </div>
            <div style={{ padding: '4px 12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', fontFamily: 'Orbitron, monospace' }}>{bear.probability}%</span>
            </div>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ width: `${bear.probability}%`, height: '100%', background: 'linear-gradient(to right, #ef444480, #ef4444)', borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(239,68,68,0.8)', lineHeight: 1.5, marginBottom: 14 }}>{bear.condition}</div>
          {[
            { label: 'Entry Zone', value: bear.entry, color: '#ef4444' },
            { label: 'Target 1', value: bear.target1, color: '#34d399' },
            { label: 'Target 2', value: bear.target2, color: '#8B5CF6' },
            { label: 'Stop Loss', value: bear.invalidation, color: '#ef4444' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{r.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: r.color, fontFamily: 'Orbitron, monospace' }}>{r.value}</span>
            </div>
          ))}
          <div style={{ marginTop: 14, padding: '10px', background: 'rgba(239,68,68,0.05)', borderRadius: 8 }}>
            <div style={{ fontSize: 9, color: 'rgba(239,68,68,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>AI Explanation</div>
            <p style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{bear.aiExplanation}</p>
          </div>
        </div>
      </div>

      {/* Neutral — What to avoid */}
      <div style={{ padding: '20px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--amber)', marginBottom: 14 }}>⚠️ WHAT TO AVOID TODAY</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Times to Avoid</div>
            {neutral.whenToAvoid.map((t, i) => (
              <div key={i} style={{ fontSize: 11, color: 'var(--text-2)', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', lineHeight: 1.4 }}>• {t}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>News to Avoid</div>
            {neutral.newsToAvoid.map((n, i) => (
              <div key={i} style={{ display: 'inline-block', margin: '0 4px 4px 0', padding: '3px 10px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 11, color: '#ef4444', fontWeight: 700 }}>{n}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Wait For</div>
            {neutral.zonesToWait.map((z, i) => (
              <div key={i} style={{ fontSize: 11, color: 'var(--text-2)', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', lineHeight: 1.4 }}>✓ {z}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── LIQUIDITY ────────────────────────────────────────────────────────────────
function LiquidityPanel() {
  const sm = sentiment.smartMoney
  const rt = sentiment.retail

  const buySide = [
    { level: goldData.asianHigh, label: 'Asian High (sweep target)', likely: 'High' },
    { level: 3265, label: 'Recent High / EQH', likely: 'Medium' },
    { level: goldData.targetZone, label: 'Equal Highs / Target Zone', likely: 'High' },
  ]
  const sellSide = [
    { level: goldData.asianLow, label: 'Asian Low (manipulation)', likely: 'Medium' },
    { level: goldData.support, label: 'Support / EQL', likely: 'High' },
    { level: goldData.invalidation, label: 'Invalidation Level', likely: 'Low' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Sentiment bars */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {[
          { label: 'Smart Money', long: sm.long, short: sm.short, color: '#8B5CF6', icon: '🏦' },
          { label: 'Retail Traders', long: rt.long, short: rt.short, color: '#94a3b8', icon: '👥' },
        ].map(s => (
          <div key={s.label} className="glass p-4">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)' }}>{s.label}</span>
            </div>
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 36, marginBottom: 10 }}>
              <div style={{ width: `${s.long}%`, background: 'linear-gradient(to right, #34d39960, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>{s.long}%</div>
              <div style={{ width: `${s.short}%`, background: 'linear-gradient(to right, #ef444460, #ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>{s.short}%</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>↑ Long {s.long}%</span>
              <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 700 }}>Short {s.short}% ↓</span>
            </div>
          </div>
        ))}
      </div>

      {/* Divergence signal */}
      <div style={{ padding: '18px 20px', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(52,211,153,0.06))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 28 }}>💡</span>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 3 }}>CONTRARIAN SIGNAL</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#34d399' }}>SMART MONEY vs RETAIL DIVERGENCE — BULLISH</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>Retail is {rt.short}% SHORT while Smart Money is {sm.long}% LONG. Historical accuracy of this setup: ~73%. Bias: BUY DIPS.</div>
          </div>
        </div>
      </div>

      {/* Buy-side & Sell-side liquidity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ padding: '18px', background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.18)', borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>💚 Buy-Side Liquidity (above price)</div>
          {buySide.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(52,211,153,0.1)' }}>
              <div>
                <div style={{ fontSize: 12, fontFamily: 'Orbitron, monospace', fontWeight: 700, color: '#34d399' }}>{b.level.toFixed(2)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{b.label}</div>
              </div>
              <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: b.likely === 'High' ? 'rgba(52,211,153,0.12)' : 'rgba(148,163,184,0.1)', color: b.likely === 'High' ? '#34d399' : 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase' }}>{b.likely}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '18px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>🔴 Sell-Side Liquidity (below price)</div>
          {sellSide.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
              <div>
                <div style={{ fontSize: 12, fontFamily: 'Orbitron, monospace', fontWeight: 700, color: '#ef4444' }}>{b.level.toFixed(2)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{b.label}</div>
              </div>
              <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: b.likely === 'High' ? 'rgba(239,68,68,0.12)' : 'rgba(148,163,184,0.1)', color: b.likely === 'High' ? '#ef4444' : 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase' }}>{b.likely}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SESSIONS ─────────────────────────────────────────────────────────────────
function SessionsPanel() {
  const now = new Date()
  const utcH = now.getUTCHours()
  const utcM = now.getUTCMinutes()
  const utcDecimal = utcH + utcM / 60
  const pct = (h) => `${(h / 24 * 100).toFixed(3)}%`
  const width = (s, e) => `${((e - s) / 24 * 100).toFixed(3)}%`

  const activeSession =
    (utcDecimal >= 23 || utcDecimal < 8) ? 'asian'
    : (utcDecimal >= 13 && utcDecimal < 17) ? 'overlap'
    : (utcDecimal >= 8 && utcDecimal < 17) ? 'london'
    : (utcDecimal >= 17 && utcDecimal < 22) ? 'newYork'
    : 'none'

  const sessRows = [
    { id: 'asian',   label: 'Asian',           open: 23, close: 8,  color: '#8B5CF6', desc: 'Range-bound. Gold establishes daily range. Low volatility. Sweep of London / NY levels common.', strat: 'Wait for range to form. Trade the breakout at London open.', best: 'Range scalp or avoid' },
    { id: 'london',  label: 'London',          open: 8,  close: 17, color: '#3b82f6', desc: 'Most active Gold session. Major moves begin. Asian range swept. Institutional orders filled.', strat: 'Look for Asian high/low sweep then follow the breakout direction.', best: 'Breakout & trend trades' },
    { id: 'overlap', label: 'London / NY Overlap', open: 13, close: 17, color: '#34d399', desc: 'Peak liquidity. Highest volatility window. CPI, NFP, FOMC all drop at 14:30–20:00 UTC.', strat: 'Beware of news spikes. Trade with confirmation only. Best for large moves.', best: 'News trades / strong trends' },
    { id: 'newYork', label: 'New York',        open: 17, close: 22, color: '#f59e0b', desc: 'Continues or reverses London move. Gold often makes final push or reversal here.', strat: 'Trade the London continuation or NY reversal from key levels.', best: 'Reversals & continuation' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 24h timeline */}
      <div className="glass p-4">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="section-label">24h Session Map — UTC</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Current UTC: <span style={{ color: 'var(--gold)', fontFamily: 'Orbitron, monospace', fontWeight: 700 }}>{String(utcH).padStart(2,'0')}:{String(utcM).padStart(2,'0')}</span></div>
        </div>
        {/* Hour labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          {[0,3,6,9,12,15,18,21,24].map(h => (
            <span key={h} style={{ fontSize: 9, color: 'var(--text-3)', width: 0, textAlign: 'center' }}>{h}</span>
          ))}
        </div>
        {/* Session bar */}
        <div style={{ position: 'relative', height: 44, background: 'rgba(255,255,255,0.03)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {/* Asian: 23-24 + 0-8 */}
          <div style={{ position: 'absolute', left: pct(0), width: width(0, 8), height: '100%', background: 'rgba(139,92,246,0.25)', borderRight: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, color: '#8B5CF6', fontWeight: 700 }}>ASIAN</span>
          </div>
          <div style={{ position: 'absolute', left: pct(23), width: width(23, 24), height: '100%', background: 'rgba(139,92,246,0.25)', borderLeft: '1px solid rgba(139,92,246,0.3)' }} />
          {/* London: 8-17 */}
          <div style={{ position: 'absolute', left: pct(8), width: width(8, 17), height: '100%', background: 'rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, color: '#3b82f6', fontWeight: 700 }}>LONDON</span>
          </div>
          {/* NY: 17-22 */}
          <div style={{ position: 'absolute', left: pct(17), width: width(17, 22), height: '100%', background: 'rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700 }}>NY</span>
          </div>
          {/* Overlap: 13-17 (on top) */}
          <div style={{ position: 'absolute', left: pct(13), width: width(13, 17), height: '100%', background: 'rgba(52,211,153,0.2)', borderLeft: '1px solid rgba(52,211,153,0.35)', borderRight: '1px solid rgba(52,211,153,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 8, color: '#34d399', fontWeight: 700 }}>OVERLAP</span>
          </div>
          {/* Current time marker */}
          <div style={{ position: 'absolute', left: pct(utcDecimal), top: 0, bottom: 0, width: 2, background: '#fff', boxShadow: '0 0 6px #fff', zIndex: 10 }} />
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 10, flexWrap: 'wrap' }}>
          {[
            { color: '#8B5CF6', label: 'Asian (23:00–08:00)' },
            { color: '#3b82f6', label: 'London (08:00–17:00)' },
            { color: '#34d399', label: 'Overlap (13:00–17:00)' },
            { color: '#f59e0b', label: 'New York (17:00–22:00)' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, opacity: 0.8 }} />
              <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Session cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {sessRows.map(s => {
          const isActive = activeSession === s.id || (s.id === 'london' && activeSession === 'overlap')
          return (
            <div key={s.id} style={{ padding: '16px', background: isActive ? `${s.color}10` : 'rgba(255,255,255,0.02)', border: `1px solid ${isActive ? s.color + '35' : 'var(--border)'}`, borderRadius: 12, position: 'relative' }}>
              {isActive && <div style={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}`, animation: 'dotPulse 1.5s ease infinite' }} />}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.label}</span>
                {isActive && <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 20, background: `${s.color}18`, color: s.color, fontWeight: 700, textTransform: 'uppercase' }}>ACTIVE</span>}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 8 }}>{s.open}:00 – {s.close}:00 UTC</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.55, marginBottom: 10 }}>{s.desc}</div>
              <div style={{ padding: '8px 10px', background: `${s.color}08`, borderRadius: 7, borderLeft: `2px solid ${s.color}50` }}>
                <div style={{ fontSize: 9, color: s.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Strategy</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>{s.strat}</div>
              </div>
              <div style={{ marginTop: 8, fontSize: 10, color: 'var(--text-3)' }}>Best for: <span style={{ color: s.color, fontWeight: 600 }}>{s.best}</span></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ALERTS ───────────────────────────────────────────────────────────────────
function AlertsPanel() {
  const [alerts, setAlerts] = useState([
    { id: 1, price: 3268, dir: 'above', label: 'Resistance break', active: true },
    { id: 2, price: 3218, dir: 'below', label: 'Support lost', active: true },
    { id: 3, price: 3280, dir: 'above', label: 'Target reached', active: false },
  ])
  const [price, setPrice] = useState('')
  const [dir, setDir] = useState('above')
  const [label, setLabel] = useState('')

  function addAlert() {
    if (!price) return
    setAlerts(p => [...p, { id: Date.now(), price: parseFloat(price), dir, label: label || `Price ${dir} ${price}`, active: true }])
    setPrice(''); setLabel('')
  }

  function removeAlert(id) { setAlerts(p => p.filter(a => a.id !== id)) }
  function toggleAlert(id) { setAlerts(p => p.map(a => a.id === id ? { ...a, active: !a.active } : a)) }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 14 }}>
      {/* Alert list */}
      <div className="glass p-4">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="section-label">Active Alerts — XAUUSD</div>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{alerts.filter(a => a.active).length} active</span>
        </div>
        {alerts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 13 }}>No alerts set. Add one →</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alerts.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px', background: a.active ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${a.active ? 'rgba(139,92,246,0.2)' : 'var(--border)'}`, borderRadius: 10, opacity: a.active ? 1 : 0.5 }}>
              <span style={{ fontSize: 20 }}>{a.dir === 'above' ? '🔼' : '🔽'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>{a.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                  Alert when price goes <span style={{ color: a.dir === 'above' ? '#34d399' : '#ef4444', fontWeight: 700 }}>{a.dir}</span> <span style={{ fontFamily: 'Orbitron, monospace', color: 'var(--gold)', fontWeight: 700 }}>${a.price.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => toggleAlert(a.id)} style={{ padding: '5px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-3)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {a.active ? 'Pause' : 'Enable'}
                </button>
                <button onClick={() => removeAlert(a.id)} style={{ padding: '5px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add alert */}
      <div className="glass p-4">
        <div className="section-label mb-4">+ New Alert</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Price Level</div>
            <input className="form-input" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 3268" style={{ width: '100%', fontSize: 14 }} />
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Trigger Direction</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['above', 'below'].map(d => (
                <button key={d} onClick={() => setDir(d)} style={{ flex: 1, padding: '9px', borderRadius: 8, border: `1px solid ${dir === d ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`, background: dir === d ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)', color: dir === d ? 'var(--gold)' : 'var(--text-3)', fontSize: 12, fontWeight: dir === d ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                  {d === 'above' ? '🔼' : '🔽'} {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Label (optional)</div>
            <input className="form-input" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Resistance break" style={{ width: '100%', fontSize: 13 }} />
          </div>
          <button onClick={addAlert} disabled={!price} className="btn btn-gold" style={{ width: '100%', padding: '12px', fontSize: 13 }}>
            🔔 Set Alert
          </button>
        </div>

        {/* Suggested levels */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Quick Set — Key Levels</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { price: goldData.resistance, label: 'Resistance break', dir: 'above' },
              { price: goldData.targetZone, label: 'Target reached', dir: 'above' },
              { price: goldData.support, label: 'Support lost', dir: 'below' },
              { price: goldData.invalidation, label: 'Invalidation hit', dir: 'below' },
            ].map(q => (
              <button key={q.price} onClick={() => { setPrice(q.price); setDir(q.dir); setLabel(q.label) }} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-2)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', justifyContent: 'space-between', textAlign: 'left' }}>
                <span>{q.label}</span>
                <span style={{ fontFamily: 'Orbitron, monospace', color: 'var(--gold)', fontWeight: 700 }}>${q.price}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AI ───────────────────────────────────────────────────────────────────────
function AIPanel({ navigate }) {
  const bull = scenarios.bullish
  const bear = scenarios.bearish
  const sm = sentiment.smartMoney

  const pillars = [
    { icon: '📈', title: 'Trend Alignment', value: `${goldData.dailyTrend} bias across Daily + H4`, color: '#34d399', pos: true },
    { icon: '🏦', title: 'Smart Money', value: `${sm.long}% institutional long positioning`, color: '#8B5CF6', pos: true },
    { icon: '📉', title: 'DXY Risk', value: 'DXY weakening → gold positive', color: '#34d399', pos: true },
    { icon: '⚠️', title: 'Event Risk', value: 'CPI + FOMC today — reduce size', color: '#f59e0b', pos: false },
    { icon: '🎯', title: 'Bullish Scenario', value: `${bull.probability}% — Target ${bull.target1} / ${bull.target2}`, color: '#34d399', pos: true },
    { icon: '🐻', title: 'Bear Trigger', value: `Break below ${goldData.invalidation} flips bias`, color: '#ef4444', pos: false },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* AI summary card */}
      <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(109,40,217,0.12), rgba(139,92,246,0.06))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>SEVORA AI — Gold Analysis</div>
            <div style={{ fontSize: 11, color: '#34d399', display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'dotPulse 1.5s ease infinite' }} />
              Online · Reading site data · {new Date().toUTCString().slice(0, 25)} UTC
            </div>
          </div>
          <div style={{ marginLeft: 'auto', padding: '4px 12px', background: goldData.aiOutlook === 'BULLISH' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${goldData.aiOutlook === 'BULLISH' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`, borderRadius: 20, fontSize: 13, fontWeight: 800, color: goldData.aiOutlook === 'BULLISH' ? '#34d399' : '#ef4444' }}>{goldData.aiOutlook}</div>
        </div>
        <div style={{ padding: '14px 16px', background: 'rgba(139,92,246,0.06)', borderLeft: '3px solid rgba(139,92,246,0.5)', borderRadius: '0 8px 8px 0', marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.8, margin: 0 }}>{goldData.aiDailyPlan}</p>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>{goldData.aiSummaryText}</p>
      </div>

      {/* AI pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {pillars.map((p, i) => (
          <div key={i} style={{ padding: '14px', background: `${p.color}08`, border: `1px solid ${p.color}22`, borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>{p.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.title}</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{p.value}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => navigate('/ai-mentor')} className="btn btn-gold" style={{ flex: 1, padding: '14px', fontSize: 14 }}>
          🤖 Open Full AI Mentor — Chat with AI about Gold
        </button>
      </div>
    </div>
  )
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryPanel() {
  const goldTrades = journalTrades.filter(t => t.instrument === 'XAUUSD')
  const wins = goldTrades.filter(t => t.status === 'win').length
  const losses = goldTrades.filter(t => t.status === 'loss').length
  const wr = goldTrades.length > 0 ? Math.round(wins / goldTrades.length * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Gold Trades', value: goldTrades.length, color: 'var(--text-1)' },
          { label: 'Win Rate', value: `${wr}%`, color: wr >= 60 ? '#34d399' : wr >= 50 ? '#f59e0b' : '#ef4444' },
          { label: 'Wins', value: wins, color: '#34d399' },
          { label: 'Losses', value: losses, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="glass p-4" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, fontFamily: 'Orbitron, monospace' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Trade list */}
      <div className="glass p-4">
        <div className="section-label mb-3">XAUUSD Trade History</div>
        {goldTrades.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>No Gold trades in journal yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {goldTrades.map(t => {
              const isWin = t.status === 'win'
              const c = isWin ? '#34d399' : '#ef4444'
              return (
                <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '90px 60px 70px 1fr 60px', alignItems: 'center', gap: 12, padding: '14px 16px', background: `${c}05`, border: `1px solid ${c}18`, borderRadius: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-2)' }}>{t.date}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>XAUUSD</div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, background: t.direction === 'Buy' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${t.direction === 'Buy' ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`, color: t.direction === 'Buy' ? '#34d399' : '#ef4444', fontSize: 10, fontWeight: 700 }}>
                    {t.direction === 'Buy' ? '↑' : '↓'} {t.direction}
                  </span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: c }}>{t.result}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{t.rr}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{t.reason}</div>
                    {t.mistake && <div style={{ fontSize: 10, color: '#f59e0b', marginTop: 2 }}>⚠ {t.mistake}</div>}
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: 20, background: `${c}12`, border: `1px solid ${c}28`, color: c, fontSize: 10, fontWeight: 700, textAlign: 'center', textTransform: 'uppercase' }}>{t.status}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── CORRELATION ──────────────────────────────────────────────────────────────
function CorrelationPanel() {
  const dxy = instruments.find(i => i.symbol === 'DXY')
  const btc = instruments.find(i => i.symbol === 'BTCUSD')
  const silver = instruments.find(i => i.symbol === 'XAGUSD')

  const pairs = [
    {
      symbol: 'DXY', name: 'US Dollar Index',
      price: dxy?.price.toFixed(2), change: `${dxy?.changePct > 0 ? '+' : ''}${dxy?.changePct?.toFixed(2)}%`,
      trend: dxy?.trend,
      corr: 'INVERSE', corrNum: -0.92,
      impact: 'DXY bearish = Gold bullish. This is the #1 driver of Gold.',
      signal: dxy?.trend === 'Bearish' ? '↑ Gold' : '↓ Gold',
      signalColor: dxy?.trend === 'Bearish' ? '#34d399' : '#ef4444',
      color: '#ef4444',
    },
    {
      symbol: 'US10Y', name: '10-Year Treasury',
      price: '4.82%', change: '+0.06%',
      trend: 'Rising',
      corr: 'INVERSE', corrNum: -0.78,
      impact: 'Higher yields increase opportunity cost of Gold. Current yield at 4.82% — mild headwind.',
      signal: '↓ Pressure',
      signalColor: '#f59e0b',
      color: '#f59e0b',
    },
    {
      symbol: 'BTCUSD', name: 'Bitcoin',
      price: `$${btc?.price.toLocaleString()}`, change: `+${btc?.changePct?.toFixed(2)}%`,
      trend: btc?.trend,
      corr: 'MODERATE', corrNum: 0.44,
      impact: 'BTC and Gold both rising together signals dollar weakness and inflation hedge demand.',
      signal: '↑ Neutral',
      signalColor: '#94a3b8',
      color: '#f59e0b',
    },
    {
      symbol: 'XAGUSD', name: 'Silver',
      price: `$${silver?.price.toFixed(2)}`, change: `+${silver?.changePct?.toFixed(2)}%`,
      trend: silver?.trend,
      corr: 'STRONG', corrNum: 0.87,
      impact: 'Silver moves with Gold but amplified. Silver is up +1.32% today — confirms Gold bulls.',
      signal: '↑ Confirms',
      signalColor: '#34d399',
      color: '#3b82f6',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {pairs.map(p => (
          <div key={p.symbol} className="glass p-4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', fontFamily: 'Orbitron, monospace' }}>{p.symbol}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{p.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: p.color, fontFamily: 'Orbitron, monospace' }}>{p.price}</div>
                <div style={{ fontSize: 11, color: p.change.startsWith('+') ? '#34d399' : '#ef4444' }}>{p.change}</div>
              </div>
            </div>
            {/* Correlation bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Correlation with Gold</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: p.corrNum < -0.5 ? '#ef4444' : p.corrNum > 0.5 ? '#34d399' : '#94a3b8', fontFamily: 'Orbitron, monospace' }}>{p.corrNum > 0 ? '+' : ''}{p.corrNum.toFixed(2)}</span>
              </div>
              {/* -1 to +1 bar */}
              <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3 }}>
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.2)' }} />
                <div style={{
                  position: 'absolute',
                  left: p.corrNum < 0 ? `${(50 + p.corrNum * 50).toFixed(1)}%` : '50%',
                  width: `${Math.abs(p.corrNum) * 50}%`,
                  height: '100%', borderRadius: 3,
                  background: p.corrNum < -0.5 ? '#ef4444' : p.corrNum > 0.5 ? '#34d399' : '#94a3b8',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                <span style={{ fontSize: 8, color: 'var(--text-3)' }}>-1.0 (Inverse)</span>
                <span style={{ fontSize: 8, color: 'var(--text-3)' }}>+1.0 (Positive)</span>
              </div>
            </div>
            <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 7, borderLeft: `2px solid ${p.color}50`, marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: p.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>{p.corr}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>{p.impact}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Gold Signal:</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: p.signalColor }}>{p.signal}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div style={{ padding: '16px 20px', background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>📊 Macro Correlation Summary</div>
        <div style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.7 }}>
          DXY is weakening (<b style={{ color: '#ef4444' }}>bearish</b> for USD → <b style={{ color: '#34d399' }}>bullish</b> for Gold).
          Silver is up confirming the metals rally.
          Treasury yields at 4.82% create mild headwinds but are secondary to the dollar direction.
          BTC rising with Gold signals broad dollar weakness.
          Net macro read: <b style={{ color: '#34d399' }}>BULLISH GOLD</b>.
        </div>
      </div>
    </div>
  )
}

// ─── SENTIMENT ────────────────────────────────────────────────────────────────
function SentimentPanel() {
  const sm = sentiment.smartMoney
  const rt = sentiment.retail

  function Ring({ pct, color, size = 100 }) {
    const r = size / 2 - 10
    const circ = 2 * Math.PI * r
    const dash = (pct / 100) * circ
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x={size/2} y={size/2 + 5} textAnchor="middle" fill={color} fontSize="16" fontWeight="900" fontFamily="Orbitron, monospace">{pct}%</text>
      </svg>
    )
  }

  const history = [
    { week: 'Wk-4', smLong: 65, rtLong: 38 },
    { week: 'Wk-3', smLong: 67, rtLong: 35 },
    { week: 'Wk-2', smLong: 69, rtLong: 34 },
    { week: 'Wk-1', smLong: 70, rtLong: 33 },
    { week: 'Now',   smLong: sm.long, rtLong: rt.long },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Big sentiment display */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Smart Money */}
        <div style={{ padding: '28px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏦</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Smart Money / Institutions</div>
          <Ring pct={sm.long} color="#8B5CF6" size={120} />
          <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>of positions are <span style={{ color: '#34d399' }}>LONG</span></div>
          <div style={{ marginTop: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)', fontSize: 12, fontWeight: 700, color: '#8B5CF6' }}>BULLISH POSITIONING</div>
        </div>
        {/* Retail */}
        <div style={{ padding: '28px', background: 'rgba(148,163,184,0.04)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Retail Traders</div>
          <Ring pct={rt.long} color="#94a3b8" size={120} />
          <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: 'var(--text-2)' }}>of positions are <span style={{ color: '#ef4444' }}>SHORT</span> biased</div>
          <div style={{ marginTop: 8, padding: '6px 16px', borderRadius: 20, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 12, fontWeight: 700, color: '#ef4444' }}>BEARISH RETAIL CROWD</div>
        </div>
      </div>

      {/* Divergence banner */}
      <div style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(52,211,153,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 36 }}>💡</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#34d399', marginBottom: 5 }}>CONTRARIAN BULLISH SIGNAL DETECTED</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
              When retail traders are {rt.short}% SHORT and Smart Money is {sm.long}% LONG,
              the market typically follows institutional positioning. This divergence historically
              resolves with a move <b style={{ color: '#34d399' }}>UP</b> as retail shorts get squeezed.
              Historical win rate of this setup: <b style={{ color: 'var(--gold)' }}>~73%</b>.
            </div>
          </div>
        </div>
      </div>

      {/* Historical trend */}
      <div className="glass p-4">
        <div className="section-label mb-4">Sentiment Trend — Last 5 Weeks</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 100 }}>
          {history.map(h => (
            <div key={h.week} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 80 }}>
                <div style={{ flex: 1, height: `${h.smLong}%`, background: 'rgba(139,92,246,0.5)', borderRadius: '3px 3px 0 0' }} />
                <div style={{ flex: 1, height: `${h.rtLong}%`, background: 'rgba(148,163,184,0.35)', borderRadius: '3px 3px 0 0' }} />
              </div>
              <span style={{ fontSize: 9, color: 'var(--text-3)' }}>{h.week}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(139,92,246,0.5)' }} /><span style={{ fontSize: 10, color: 'var(--text-3)' }}>Smart Money Long</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(148,163,184,0.35)' }} /><span style={{ fontSize: 10, color: 'var(--text-3)' }}>Retail Long</span></div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Gold() {
  const [tab, setTab] = useState('trend')
  const navigate = useNavigate()
  const tabRef = useRef(null)
  const { market, status, lastUpdate } = useLiveMarket()

  // Merge: live tick data over the static analysis/levels from mockData
  const liveG = market?.gold
  const price         = liveG?.price     ?? goldData.price
  const change        = liveG?.change    ?? goldData.change
  const changePct     = liveG?.changePct ?? goldData.changePercent
  const bid           = liveG?.bid       ?? goldData.bid
  const ask           = liveG?.ask       ?? goldData.ask
  const sessionHigh   = liveG?.high      ?? goldData.high
  const sessionLow    = liveG?.low       ?? goldData.low
  const isUp          = change >= 0

  const liveDXY = market?.dxy
  const liveBTC = market?.btc

  // Scroll active tab into view
  useEffect(() => {
    const el = tabRef.current?.querySelector('[data-active="true"]')
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [tab])

  const updatedStr = lastUpdate
    ? lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── HERO HEADER ── */}
      <div style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
          <div>
            {/* Symbol + LIVE badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.16em', textTransform: 'uppercase' }}>XAUUSD · Gold / US Dollar</div>
              {status === 'live' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 20, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', animation: 'dotPulse 1.2s ease infinite' }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#34d399', letterSpacing: '0.08em' }}>LIVE</span>
                </div>
              ) : status === 'loading' ? (
                <div style={{ fontSize: 9, color: 'var(--text-3)', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 20 }}>Connecting…</div>
              ) : (
                <div style={{ fontSize: 9, color: 'var(--amber)', padding: '2px 8px', background: 'rgba(245,158,11,0.1)', borderRadius: 20, border: '1px solid rgba(245,158,11,0.2)' }}>⚠ Offline — showing cached data</div>
              )}
              {updatedStr && <span style={{ fontSize: 9, color: 'var(--text-3)' }}>Updated {updatedStr}</span>}
            </div>

            {/* Price + change */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 42, fontWeight: 900, fontFamily: 'Orbitron, monospace', color: 'var(--gold)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: isUp ? '#34d399' : '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                {isUp ? '▲' : '▼'} {isUp ? '+' : ''}${Math.abs(change).toFixed(2)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ padding: '5px 14px', borderRadius: 20, background: isUp ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)', border: `1px solid ${isUp ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`, fontSize: 12, fontWeight: 800, color: isUp ? '#34d399' : '#ef4444' }}>
              {isUp ? '▲' : '▼'} {goldData.aiOutlook}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={() => setTab('alerts')}>🔔 Alert</button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/journal')}>📔 Journal</button>
            <button className="btn btn-gold btn-sm" onClick={() => setTab('ai')}>🤖 AI Plan</button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { label: 'BID',  value: bid.toFixed(2),         color: 'var(--text-2)' },
            { label: 'ASK',  value: ask.toFixed(2),         color: 'var(--text-2)' },
            { label: 'HIGH', value: sessionHigh.toFixed(2), color: '#34d399' },
            { label: 'LOW',  value: sessionLow.toFixed(2),  color: '#ef4444' },
            { label: 'OPEN', value: goldData.open.toFixed(2), color: 'var(--text-2)' },
            { label: 'VOL',  value: goldData.volume,          color: 'var(--text-2)' },
            { label: 'ATR',  value: `${goldData.atr} pts`,    color: 'var(--amber)' },
            { label: 'VOLA', value: goldData.volatility,      color: 'var(--amber)' },
            // Live correlated instruments
            { label: 'DXY',  value: (liveDXY?.price ?? 104.23).toFixed(2), color: (liveDXY?.changePct ?? -0.30) >= 0 ? '#ef4444' : '#34d399' },
            { label: 'BTC',  value: `$${((liveBTC?.price ?? 68420) / 1000).toFixed(1)}K`, color: (liveBTC?.changePct ?? 1.85) >= 0 ? '#34d399' : '#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 7 }}>
              <span style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 6 }}>{s.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: s.color, fontFamily: 'Orbitron, monospace' }}>{s.value}</span>
            </div>
          ))}
          {/* Multi-TF trend pills */}
          {[
            { tf: 'D1',  trend: goldData.dailyTrend },
            { tf: 'H4',  trend: goldData.h4Trend },
            { tf: 'H1',  trend: goldData.h1Trend },
            { tf: 'M15', trend: goldData.m15Trend },
          ].map(t => {
            const c = TC(t.trend)
            return (
              <div key={t.tf} style={{ padding: '5px 10px', background: `${c}10`, border: `1px solid ${c}28`, borderRadius: 7, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.tf}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: c }}>{t.trend === 'Bullish' ? '↑' : t.trend === 'Bearish' ? '↓' : '→'}</span>
              </div>
            )
          })}
        </div>

        {/* Warning */}
        {goldData.tradingWarning && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
            <span style={{ fontSize: 12, color: 'var(--amber)' }}>{goldData.tradingWarning}</span>
          </div>
        )}

        {/* Data source note */}
        <div style={{ marginTop: 8, fontSize: 9, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Live price: metals.live · BTC: CoinCap · DXY: Frankfurter (ECB) · Chart: TradingView · Refreshes every 30s</span>
        </div>
      </div>

      {/* ── TAB NAV ── */}
      <div ref={tabRef} style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 12, marginBottom: 16, scrollbarWidth: 'none' }}>
        {TABS.map(t => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              data-active={active}
              onClick={() => setTab(t.id)}
              style={{
                padding: '8px 14px', borderRadius: 10, border: `1px solid ${active ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`,
                background: active ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                color: active ? 'var(--gold)' : 'var(--text-3)', fontSize: 12, fontWeight: active ? 700 : 400,
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-2)' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--text-3)' } }}
            >
              <span style={{ fontSize: 13 }}>{t.icon}</span>
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ minHeight: 500 }}>
        {tab === 'trend'       && <TrendPanel />}
        {tab === 'bias'        && <BiasPanel />}
        {tab === 'levels'      && <LevelsPanel />}
        {tab === 'news'        && <NewsPanel />}
        {tab === 'scenarios'   && <ScenariosPanel />}
        {tab === 'liquidity'   && <LiquidityPanel />}
        {tab === 'sessions'    && <SessionsPanel />}
        {tab === 'alerts'      && <AlertsPanel />}
        {tab === 'ai'          && <AIPanel navigate={navigate} />}
        {tab === 'history'     && <HistoryPanel />}
        {tab === 'correlation' && <CorrelationPanel />}
        {tab === 'sentiment'   && <SentimentPanel />}
      </div>
    </div>
  )
}
