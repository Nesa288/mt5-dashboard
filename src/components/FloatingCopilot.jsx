import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { goldData, instruments, news, calendarEvents, sentiment, journalStats, journalTrades, botGroups } from '../data/mockData'

const QUICK = [
  { icon: '📈', text: "Today's trend?" },
  { icon: '🎯', text: 'Key levels?' },
  { icon: '🚫', text: 'What to avoid?' },
]

const RISK_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#34d399' }

// ─── Data aggregator (mirrors AIMentor) ──────────────────────────────────────
function buildContext() {
  const utcHour = new Date().getUTCHours()
  let activeSession = 'Off-hours'
  if (utcHour >= 23 || utcHour < 8) activeSession = 'Asian'
  else if (utcHour >= 13 && utcHour < 17) activeSession = 'London / NY Overlap'
  else if (utcHour >= 8 && utcHour < 17) activeSession = 'London'
  else if (utcHour >= 13 && utcHour < 22) activeSession = 'New York'

  const dxy = instruments.find(i => i.symbol === 'DXY')
  const todayEvents = calendarEvents.filter(e => e.date === 'today')
  const highImpactToday = todayEvents.filter(e => e.impact >= 4).sort((a, b) => b.impact - a.impact)
  const avoidEvents = todayEvents.filter(e => e.recommendation === 'avoid')
  const highImpactNews = news.filter(n => n.impact === 'high')
  const bullishNews = highImpactNews.filter(n => n.sentiment === 'bullish')
  const recentLosses = journalTrades.filter(t => t.status === 'loss')
  const recentWins = journalTrades.filter(t => t.status === 'win')
  const mistakes = recentLosses.map(t => t.mistake).filter(Boolean)
  const activeBots = botGroups.filter(b => b.status === 'running' && b.enabled)
  const botPnl = activeBots.reduce((sum, b) => {
    const v = parseFloat(b.pnl.replace(/[+$]/g, ''))
    return sum + (isNaN(v) ? 0 : v)
  }, 0)
  const tfList = [goldData.dailyTrend, goldData.h4Trend, goldData.h1Trend, goldData.m15Trend]
  const bullishTF = tfList.filter(t => t === 'Bullish').length
  const bearishTF = tfList.filter(t => t === 'Bearish').length

  let confidence = 52
  if (goldData.aiOutlook === 'BULLISH') confidence += 18
  if (dxy?.trend === 'Bearish') confidence += 10
  if (bullishTF >= 3) confidence += 10
  if (bullishTF === 4) confidence += 7
  if (bearishTF >= 2) confidence -= 14
  if (highImpactToday.length > 0) confidence -= 10
  if (avoidEvents.length > 0) confidence -= 8
  if (goldData.volatility === 'High') confidence -= 5
  if (sentiment.smartMoney.long > 65) confidence += 7
  confidence = Math.min(Math.max(Math.round(confidence), 38), 95)

  return {
    utcHour, activeSession, dxy, gold: goldData,
    todayEvents, highImpactToday, avoidEvents,
    bullishNews, highImpactNews,
    journal: { stats: journalStats, trades: journalTrades, recentLosses, recentWins, mistakes },
    activeBots, botPnl,
    smartMoney: sentiment.smartMoney, retail: sentiment.retail,
    tfList, bullishTF, bearishTF, confidence,
  }
}

function toNewsItems(ctx, max = 2) {
  return ctx.highImpactToday.slice(0, max).map(e => ({
    name: e.event.split('(')[0].trim().split(' ').slice(0, 4).join(' '),
    time: e.time + ' UTC',
    risk: e.impact >= 5 ? 'High' : e.impact >= 4 ? 'Medium' : 'Low',
  }))
}

function generateResponse(question, ctx) {
  const q = question.toLowerCase()
  const ni = toNewsItems(ctx)
  const isJournal = /journal|my trade|analyz|performance|mistake|history/.test(q)
  const isAvoid = /avoid|what.*(not|don't)|warning|danger/.test(q) || (/news/.test(q) && /today/.test(q))
  const isCpiEvent = /cpi|fomc|fed|inflation|central bank/.test(q)
  const isLevels = /level|zone|support|resist|target|key|price/.test(q)
  const isTrend = /trend|outlook|explain.*today|today.*trend|market|overview/.test(q)
  const isWhyUp = /why.*gold|gold.*why|going up|bullish.*gold|gold.*rise|why up|why is/.test(q)
  const isSession = /session|london|new york|asian/.test(q)
  const isBot = /bot|automat|signal/.test(q)
  const isDxy = /dxy|dollar index/.test(q)

  if (isJournal) {
    const st = ctx.journal.stats
    const topMistake = ctx.journal.mistakes[0] || 'entering too early'
    const lastLoss = ctx.journal.recentLosses[0]
    return {
      trend: st.winRate >= 60 ? 'Bullish' : 'Neutral',
      confidence: Math.round(st.winRate * 0.88),
      keyLevels: [ctx.gold.resistance, ctx.gold.support],
      news: ni.slice(0, 1),
      conclusion: `Win rate ${st.winRate}% across ${st.totalTrades} trades. Profit factor: ${st.profitFactor} | Net: ${st.netProfit}. ${lastLoss ? `Last loss — ${lastLoss.instrument}: "${lastLoss.mistake || lastLoss.reason}".` : ''} Recurring mistake: "${topMistake}".`,
    }
  }
  if (isAvoid || isCpiEvent) {
    const avoidList = ctx.avoidEvents.map(e => `${e.event.split('(')[0].trim()} at ${e.time} UTC`).join(' and ')
    const allEventItems = ctx.highImpactToday.map(e => ({
      name: e.event.split('(')[0].trim().split(' ').slice(0, 4).join(' '),
      time: e.time + ' UTC',
      risk: e.impact >= 5 ? 'High' : 'Medium',
    }))
    return {
      trend: 'Neutral',
      confidence: Math.max(ctx.confidence - 22, 38),
      keyLevels: [ctx.gold.support, ctx.gold.invalidation],
      news: allEventItems.length > 0 ? allEventItems : ni,
      conclusion: ctx.avoidEvents.length > 0
        ? `Avoid: ${avoidList}. Cut size to 50% before these windows. ${ctx.gold.tradingWarning || ''}`
        : `No critical avoidance events. Vol: ${ctx.gold.volatility}. Stay ${ctx.gold.support}–${ctx.gold.resistance}.`,
    }
  }
  if (isLevels) {
    const mz = ctx.gold.manipulationZone
    return {
      trend: ctx.gold.price > ctx.gold.support ? 'Bullish' : 'Bearish',
      confidence: 91,
      keyLevels: [ctx.gold.resistance, ctx.gold.liquidityZone, mz.high, mz.low, ctx.gold.support, ctx.gold.invalidation],
      news: ni,
      conclusion: `XAUUSD $${ctx.gold.price.toFixed(2)} · Resistance ${ctx.gold.resistance} · Liquidity ${ctx.gold.liquidityZone} · Band ${mz.low}–${mz.high} · Support ${ctx.gold.support} · Invalidation ${ctx.gold.invalidation}. Asian range: ${ctx.gold.asianLow}–${ctx.gold.asianHigh}.`,
    }
  }
  if (isTrend) {
    const alignment = ctx.bullishTF >= 3
      ? 'aligned bullish across higher timeframes'
      : ctx.bearishTF >= 3 ? 'showing bearish divergence' : 'mixed — wait for H4 close'
    return {
      trend: ctx.gold.dailyTrend,
      confidence: ctx.confidence,
      keyLevels: [ctx.gold.asianHigh, ctx.gold.resistance, ctx.gold.support, ctx.gold.invalidation],
      news: ni,
      conclusion: `Daily: ${ctx.gold.dailyTrend} · H4: ${ctx.gold.h4Trend} · H1: ${ctx.gold.h1Trend} · M15: ${ctx.gold.m15Trend} — ${alignment}. ${ctx.gold.aiSummaryText}`,
    }
  }
  if (isWhyUp || isDxy) {
    const dxyDesc = ctx.dxy?.trend === 'Bearish'
      ? `DXY weakening (${ctx.dxy.price}, ${ctx.dxy.changePct > 0 ? '+' : ''}${ctx.dxy.changePct}%)`
      : `DXY at ${ctx.dxy?.price ?? '--'} (${ctx.dxy?.trend ?? 'Neutral'})`
    const drivers = []
    if (ctx.dxy?.trend === 'Bearish') drivers.push('dollar weakness')
    if (ctx.bullishNews.length > 0) drivers.push(`${ctx.bullishNews.length} bullish catalysts`)
    if (ctx.gold.dailyTrend === 'Bullish') drivers.push('intact daily uptrend')
    if (ctx.smartMoney.long > 65) drivers.push(`institutional buying (${ctx.smartMoney.long}% long)`)
    return {
      trend: ctx.gold.aiOutlook === 'BULLISH' ? 'Bullish' : 'Bearish',
      confidence: ctx.confidence,
      keyLevels: [ctx.gold.resistance, ctx.gold.liquidityZone, ctx.gold.support],
      news: ni,
      conclusion: `Gold ${ctx.gold.change >= 0 ? '+' : ''}$${ctx.gold.change.toFixed(2)} today @ $${ctx.gold.price.toFixed(2)}. ${dxyDesc}. Drivers: ${drivers.join(', ')}. Target: ${ctx.gold.targetZone}.`,
    }
  }
  if (isSession) {
    const bigEvent = ctx.highImpactToday[0]
    return {
      trend: ctx.gold.dailyTrend,
      confidence: ctx.confidence,
      keyLevels: [ctx.gold.asianHigh, ctx.gold.asianLow, ctx.gold.resistance, ctx.gold.support],
      news: ni,
      conclusion: `Active: ${ctx.activeSession}. Asian range: ${ctx.gold.asianLow}–${ctx.gold.asianHigh}. ${
        ctx.activeSession.includes('London')
          ? `Expect a sweep of Asian high (${ctx.gold.asianHigh}) before the directional move.`
          : ctx.activeSession === 'New York'
          ? `NY often reverses or extends London.${bigEvent ? ` Risk: ${bigEvent.event.split('(')[0].trim()} @ ${bigEvent.time} UTC.` : ''}`
          : 'Range-bound. Wait for London open (08:00 UTC).'
      }`,
    }
  }
  if (isBot) {
    const names = ctx.activeBots.map(b => b.name).join(', ')
    const sign = ctx.botPnl >= 0 ? '+' : ''
    const warn = ctx.avoidEvents[0]
    return {
      trend: ctx.gold.dailyTrend,
      confidence: ctx.confidence,
      keyLevels: [ctx.gold.resistance, ctx.gold.support],
      news: ni,
      conclusion: `${ctx.activeBots.length} bots active: ${names || 'none'}. P&L: ${sign}$${ctx.botPnl.toFixed(2)}. ${warn ? `Pause before ${warn.event.split('(')[0].trim()} @ ${warn.time} UTC.` : 'No critical events — bots can run.'}`,
    }
  }
  return {
    trend: ctx.gold.aiOutlook === 'BULLISH' ? 'Bullish' : 'Bearish',
    confidence: ctx.confidence,
    keyLevels: [ctx.gold.resistance, ctx.gold.liquidityZone, ctx.gold.support],
    news: ni,
    conclusion: ctx.gold.aiDailyPlan,
  }
}

const _ctx0 = buildContext()
const INITIAL_DATA = {
  trend: _ctx0.gold.dailyTrend,
  confidence: _ctx0.confidence,
  keyLevels: [_ctx0.gold.resistance, _ctx0.gold.liquidityZone, _ctx0.gold.support],
  news: toNewsItems(_ctx0, 2),
  conclusion: _ctx0.gold.aiSummaryText + ' Ask me anything about markets, levels, or your journal.',
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function CopilotCard({ data }) {
  const trendColor = data.trend === 'Bullish' ? '#34d399' : data.trend === 'Bearish' ? '#ef4444' : '#94a3b8'
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.18)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '8px 12px', background: 'rgba(139,92,246,0.07)', borderBottom: '1px solid rgba(139,92,246,0.12)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', animation: 'dotPulse 1.5s ease infinite', flexShrink: 0 }} />
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>Market Context</span>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--text-3)' }}>SEVORA AI</span>
      </div>
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: '1 1 50%', background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '7px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 5 }}>Trend</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, background: `${trendColor}14`, border: `1px solid ${trendColor}30`, color: trendColor, fontSize: 11, fontWeight: 700 }}>
              {data.trend === 'Bullish' ? '↑' : data.trend === 'Bearish' ? '↓' : '→'} {data.trend}
            </div>
          </div>
          <div style={{ flex: '1 1 50%', background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '7px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 5 }}>Confidence</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${data.confidence}%`, background: `linear-gradient(to right, ${trendColor}80, ${trendColor})`, transition: 'width 0.8s ease' }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: trendColor, fontFamily: 'Orbitron, monospace', minWidth: 28 }}>{data.confidence}%</span>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '7px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>Key Levels</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {data.keyLevels.map((lvl, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Orbitron, monospace', padding: '2px 8px', borderRadius: 5, background: i === 0 ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${i === 0 ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`, color: i === 0 ? 'var(--gold)' : 'var(--text-2)' }}>
                {typeof lvl === 'number' ? lvl.toLocaleString() : lvl}
              </span>
            ))}
          </div>
        </div>

        {data.news && data.news.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 7, padding: '7px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>Events</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {data.news.map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-1)', flex: 1, minWidth: 0 }}>{n.name}</span>
                  <span style={{ fontSize: 10, fontFamily: 'Orbitron, monospace', color: 'var(--text-3)', flexShrink: 0 }}>{n.time}</span>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '1px 5px', borderRadius: 3, flexShrink: 0, background: `${RISK_COLORS[n.risk]}18`, color: RISK_COLORS[n.risk], border: `1px solid ${RISK_COLORS[n.risk]}30` }}>{n.risk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ background: 'rgba(139,92,246,0.05)', borderRadius: 7, padding: '8px 10px', borderLeft: '3px solid rgba(139,92,246,0.4)' }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 5 }}>Conclusion</div>
          <p style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>{data.conclusion}</p>
        </div>
      </div>
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'flex-end', marginBottom: 12 }}>
      <div style={{ maxWidth: '75%', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px 3px 12px 12px', padding: '8px 12px', fontSize: 12, color: 'var(--text-1)', lineHeight: 1.55 }}>{text}</div>
      <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>👤</div>
    </div>
  )
}

function BotMessage({ msg }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🤖</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {msg.data ? <CopilotCard data={msg.data} /> : (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '3px 12px 12px 12px', padding: '8px 12px', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.55 }}>{msg.text}</div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🤖</div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '3px 12px 12px 12px', padding: '10px 14px', display: 'flex', gap: 4, alignItems: 'center' }}>
        {[0, 150, 300].map(d => (
          <div key={d} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-3)', animation: 'dotPulse 1.2s ease infinite', animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function FloatingCopilot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ id: 1, type: 'bot', data: INITIAL_DATA }])
  const [isTyping, setIsTyping] = useState(false)
  const navigate = useNavigate()
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && open) setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  async function send(text) {
    if (!text.trim() || isTyping) return
    setMessages(p => [...p, { id: Date.now(), type: 'user', text }])
    setInput('')
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1100 + Math.random() * 600))
    const ctx = buildContext()
    const data = generateResponse(text, ctx)
    setIsTyping(false)
    setMessages(p => [...p, { id: Date.now() + 1, type: 'bot', data }])
  }

  return (
    <>
      <style>{`
        @keyframes fp-in {
          from { opacity: 0; transform: translateY(18px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fp-btn-pulse {
          0%, 100% { box-shadow: 0 4px 24px rgba(109,40,217,0.45), 0 0 0 0 rgba(139,92,246,0.35); }
          50%       { box-shadow: 0 6px 36px rgba(109,40,217,0.65), 0 0 0 12px rgba(139,92,246,0); }
        }
        .fc-quick-btn:hover {
          background: rgba(139,92,246,0.1) !important;
          border-color: rgba(139,92,246,0.3) !important;
          color: var(--text-1) !important;
        }
        .fc-input:focus {
          outline: none;
          border-color: rgba(139,92,246,0.4) !important;
          box-shadow: 0 0 0 2px rgba(139,92,246,0.1);
        }
        .fc-send:hover:not(:disabled) {
          filter: brightness(1.15);
          transform: scale(1.06);
        }
        .fc-msg-area::-webkit-scrollbar { width: 3px; }
        .fc-msg-area::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.25); border-radius: 4px; }
      `}</style>

      {/* ── Panel ── */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          right: 24,
          width: 'clamp(300px, calc(100vw - 48px), 370px)',
          height: 530,
          background: 'linear-gradient(180deg, #0e0e1f 0%, #0a0a18 100%)',
          border: '1px solid rgba(139,92,246,0.22)',
          borderRadius: 18,
          boxShadow: '0 28px 90px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.07), inset 0 1px 0 rgba(255,255,255,0.04)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9000,
          overflow: 'hidden',
          animation: 'fp-in 0.24s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>

          {/* Header */}
          <div style={{
            padding: '11px 14px',
            background: 'linear-gradient(135deg, rgba(109,40,217,0.18), rgba(139,92,246,0.07))',
            borderBottom: '1px solid rgba(139,92,246,0.14)',
            display: 'flex', alignItems: 'center', gap: 10,
            flexShrink: 0,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 2px 12px rgba(109,40,217,0.4)' }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '0.01em' }}>SEVORA Copilot</div>
              <div style={{ fontSize: 10, color: '#34d399', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399', animation: 'dotPulse 1.5s ease infinite', flexShrink: 0 }} />
                Online · Live data
              </div>
            </div>
            <button
              onClick={() => { setOpen(false); navigate('/ai-mentor') }}
              title="Open full AI Mentor"
              style={{ fontSize: 10, color: 'rgba(139,92,246,0.75)', background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'inherit', marginRight: 4, whiteSpace: 'nowrap' }}
            >
              ↗ Full
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-3)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--text-1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-3)' }}
            >✕</button>
          </div>

          {/* Messages */}
          <div className="fc-msg-area" style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 4px' }}>
            {messages.map(msg =>
              msg.type === 'user'
                ? <UserBubble key={msg.id} text={msg.text} />
                : <BotMessage key={msg.id} msg={msg} />
            )}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Quick question chips */}
          <div style={{ padding: '6px 12px', display: 'flex', gap: 5, flexShrink: 0 }}>
            {QUICK.map((q, i) => (
              <button
                key={i}
                className="fc-quick-btn"
                onClick={() => send(q.text)}
                disabled={isTyping}
                style={{
                  flex: 1, padding: '5px 4px', borderRadius: 7,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-3)', fontSize: 10, cursor: isTyping ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden',
                  textOverflow: 'ellipsis', transition: 'all 0.15s',
                  opacity: isTyping ? 0.5 : 1,
                }}
              >
                {q.icon} {q.text}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div style={{ padding: '5px 12px 12px', display: 'flex', gap: 8, flexShrink: 0 }}>
            <input
              ref={inputRef}
              className="fc-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask about Gold, levels, journal..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '9px 13px', color: 'var(--text-1)',
                fontSize: 12, fontFamily: 'inherit', transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
            />
            <button
              className="fc-send"
              onClick={() => send(input)}
              disabled={!input.trim() || isTyping}
              style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0, border: 'none',
                cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                background: input.trim() && !isTyping
                  ? 'linear-gradient(135deg, #6D28D9, #8B5CF6)'
                  : 'rgba(255,255,255,0.05)',
                color: input.trim() && !isTyping ? '#fff' : 'var(--text-3)',
                fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >↑</button>
          </div>
        </div>
      )}

      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen(p => !p)}
        title="SEVORA AI Copilot"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          width: 58,
          height: 58,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9001,
          background: open
            ? 'linear-gradient(135deg, #5B21B6, #7C3AED)'
            : 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
          color: '#fff',
          fontSize: open ? 20 : 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: open
            ? '0 4px 28px rgba(109,40,217,0.55), 0 0 0 5px rgba(139,92,246,0.18)'
            : undefined,
          animation: open ? 'none' : 'fp-btn-pulse 3s ease-in-out infinite',
          transition: 'background 0.2s, box-shadow 0.2s, font-size 0.15s',
        }}
      >
        {open ? '✕' : '🤖'}
      </button>
    </>
  )
}
