import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { goldData, instruments, news, calendarEvents, sentiment, journalStats, journalTrades, botGroups } from '../data/mockData'
import { useLiveMarket } from '../context/LiveMarketContext'

const SUGGESTED = [
  { icon: '📈', text: 'Why is Gold going up?' },
  { icon: '🔍', text: "Explain today's trend" },
  { icon: '🎯', text: 'Show key levels' },
  { icon: '🚫', text: 'What should I avoid today?' },
  { icon: '📔', text: 'Analyze my journal' },
]

const RISK_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#34d399' }

// SNAPSHOT is now computed dynamically inside the component from live context

// ─── Data aggregator ─────────────────────────────────────────────────────────
function buildContext(livePrices) {
  const utcHour = new Date().getUTCHours()

  let activeSession = 'Off-hours'
  if (utcHour >= 23 || utcHour < 8) activeSession = 'Asian'
  else if (utcHour >= 13 && utcHour < 17) activeSession = 'London / NY Overlap'
  else if (utcHour >= 8 && utcHour < 17) activeSession = 'London'
  else if (utcHour >= 13 && utcHour < 22) activeSession = 'New York'

  const dxy = livePrices?.dxy ?? instruments.find(i => i.symbol === 'DXY')

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

  // Confidence reflects multi-TF alignment, news risk, smart money
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
    utcHour, activeSession, dxy,
    gold: livePrices?.gold ?? goldData,
    todayEvents, highImpactToday, avoidEvents,
    bullishNews, highImpactNews,
    journal: { stats: journalStats, trades: journalTrades, recentLosses, recentWins, mistakes },
    activeBots, botPnl,
    smartMoney: sentiment.smartMoney,
    retail: sentiment.retail,
    tfList, bullishTF, bearishTF,
    confidence,
  }
}

function toNewsItems(ctx, max = 2) {
  return ctx.highImpactToday.slice(0, max).map(e => ({
    name: e.event.split('(')[0].trim().split(' ').slice(0, 4).join(' '),
    time: e.time + ' UTC',
    risk: e.impact >= 5 ? 'High' : e.impact >= 4 ? 'Medium' : 'Low',
  }))
}

// ─── Brain: turns question + site context → structured card data ─────────────
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

  // ── Journal analysis ──────────────────────────────────────────────────────
  if (isJournal) {
    const st = ctx.journal.stats
    const topMistake = ctx.journal.mistakes[0] || 'entering too early'
    const lastLoss = ctx.journal.recentLosses[0]
    return {
      trend: st.winRate >= 60 ? 'Bullish' : 'Neutral',
      confidence: Math.round(st.winRate * 0.88),
      keyLevels: [ctx.gold.resistance, ctx.gold.support],
      news: ni.slice(0, 1),
      conclusion: `Your journal shows ${st.winRate}% win rate across ${st.totalTrades} trades. Profit factor: ${st.profitFactor} | Net P&L: ${st.netProfit} | Avg R: ${st.avgR}. ${lastLoss ? `Last loss — ${lastLoss.instrument}: "${lastLoss.mistake || lastLoss.reason}".` : ''} Recurring mistake: "${topMistake}". Best single trade: ${st.bestTrade}. Recommendation: wait for H4 confirmation and avoid entries within 30 min of high-impact events.`,
    }
  }

  // ── What to avoid / CPI / FOMC ────────────────────────────────────────────
  if (isAvoid || isCpiEvent) {
    const avoidList = ctx.avoidEvents
      .map(e => `${e.event.split('(')[0].trim()} at ${e.time} UTC`)
      .join(' and ')
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
        ? `${ctx.avoidEvents.length} event${ctx.avoidEvents.length > 1 ? 's' : ''} to avoid: ${avoidList}. ${ctx.gold.tradingWarning || ''} Cut position size to 50% before these windows. Do not enter shorts unless price breaks and holds below ${ctx.gold.invalidation}.`
        : `No critical avoidance events today. Volatility: ${ctx.gold.volatility}. Stay within ${ctx.gold.support}–${ctx.gold.resistance}. ${ctx.gold.aiDailyPlan}`,
    }
  }

  // ── Key levels ────────────────────────────────────────────────────────────
  if (isLevels) {
    const mz = ctx.gold.manipulationZone
    return {
      trend: ctx.gold.price > ctx.gold.support ? 'Bullish' : 'Bearish',
      confidence: 91,
      keyLevels: [ctx.gold.resistance, ctx.gold.liquidityZone, mz.high, mz.low, ctx.gold.support, ctx.gold.invalidation],
      news: ni,
      conclusion: `XAUUSD @ $${ctx.gold.price.toFixed(2)} · Resistance ${ctx.gold.resistance} · Liquidity zone ${ctx.gold.liquidityZone} · Manipulation band ${mz.low}–${mz.high} · Support ${ctx.gold.support} · Invalidation ${ctx.gold.invalidation}. Asian range: ${ctx.gold.asianLow}–${ctx.gold.asianHigh}. A confirmed close above ${ctx.gold.resistance} opens the path to ${ctx.gold.targetZone}.`,
    }
  }

  // ── Trend / daily overview ────────────────────────────────────────────────
  if (isTrend) {
    const diverge = ctx.gold.h1Trend !== ctx.gold.dailyTrend || ctx.gold.m15Trend !== ctx.gold.dailyTrend
    const alignment = ctx.bullishTF >= 3
      ? 'aligned bullish across higher timeframes'
      : ctx.bearishTF >= 3 ? 'showing bearish divergence'
      : 'mixed — wait for H4 close to confirm'
    return {
      trend: ctx.gold.dailyTrend,
      confidence: ctx.confidence,
      keyLevels: [ctx.gold.asianHigh, ctx.gold.resistance, ctx.gold.support, ctx.gold.invalidation],
      news: ni,
      conclusion: `Daily: ${ctx.gold.dailyTrend} · H4: ${ctx.gold.h4Trend} · H1: ${ctx.gold.h1Trend} · M15: ${ctx.gold.m15Trend} — ${alignment}. ${diverge ? `Short-term divergence on H1/M15 suggests a pullback to ${ctx.gold.support} before the next leg.` : 'Clean alignment across all timeframes.'} ${ctx.gold.aiSummaryText}`,
    }
  }

  // ── Why is Gold going up / DXY ────────────────────────────────────────────
  if (isWhyUp || isDxy) {
    const dxyDesc = ctx.dxy?.trend === 'Bearish'
      ? `DXY weakening (${ctx.dxy.price}, ${ctx.dxy.changePct > 0 ? '+' : ''}${ctx.dxy.changePct}%)`
      : `DXY at ${ctx.dxy?.price ?? '--'} (${ctx.dxy?.trend ?? 'Neutral'})`
    const drivers = []
    if (ctx.dxy?.trend === 'Bearish') drivers.push('dollar weakness')
    if (ctx.bullishNews.length > 0) drivers.push(`${ctx.bullishNews.length} bullish macro catalysts`)
    if (ctx.gold.dailyTrend === 'Bullish') drivers.push('intact daily uptrend')
    if (ctx.smartMoney.long > 65) drivers.push(`institutional buying (${ctx.smartMoney.long}% long)`)
    if (ctx.gold.change > 0) drivers.push(`positive momentum (+$${ctx.gold.change.toFixed(2)} today)`)
    return {
      trend: ctx.gold.aiOutlook === 'BULLISH' ? 'Bullish' : 'Bearish',
      confidence: ctx.confidence,
      keyLevels: [ctx.gold.resistance, ctx.gold.liquidityZone, ctx.gold.support],
      news: ni,
      conclusion: `Gold ${ctx.gold.change >= 0 ? '+' : ''}$${ctx.gold.change.toFixed(2)} (${ctx.gold.changePercent}%) today — current price $${ctx.gold.price.toFixed(2)}. ${dxyDesc}. Smart money ${ctx.smartMoney.long}% long vs retail ${ctx.retail.long}% long. Key drivers: ${drivers.length > 0 ? drivers.join(', ') : ctx.gold.aiSummaryText}. Target: ${ctx.gold.targetZone} | Invalidation: ${ctx.gold.invalidation}.`,
    }
  }

  // ── Session ───────────────────────────────────────────────────────────────
  if (isSession) {
    const bigEvent = ctx.highImpactToday[0]
    return {
      trend: ctx.gold.dailyTrend,
      confidence: ctx.confidence,
      keyLevels: [ctx.gold.asianHigh, ctx.gold.asianLow, ctx.gold.resistance, ctx.gold.support],
      news: ni,
      conclusion: `Active session: ${ctx.activeSession}. Asian range: ${ctx.gold.asianLow}–${ctx.gold.asianHigh}. ${
        ctx.activeSession.includes('London')
          ? `Expect a sweep of the Asian high (${ctx.gold.asianHigh}) before the directional move. London favors breakout strategies.`
          : ctx.activeSession === 'New York'
          ? `NY often reverses or extends the London move.${bigEvent ? ` Key risk: ${bigEvent.event.split('(')[0].trim()} at ${bigEvent.time} UTC.` : ''}`
          : 'Asian session is range-bound. Wait for London open (08:00 UTC) to trade the breakout.'
      }`,
    }
  }

  // ── Bot dashboard ─────────────────────────────────────────────────────────
  if (isBot) {
    const names = ctx.activeBots.map(b => b.name).join(', ')
    const sign = ctx.botPnl >= 0 ? '+' : ''
    const warn = ctx.avoidEvents[0]
    return {
      trend: ctx.gold.dailyTrend,
      confidence: ctx.confidence,
      keyLevels: [ctx.gold.resistance, ctx.gold.support],
      news: ni,
      conclusion: `${ctx.activeBots.length} bot${ctx.activeBots.length !== 1 ? 's' : ''} active: ${names || 'none'}. Combined P&L today: ${sign}$${ctx.botPnl.toFixed(2)}. ${warn ? `Pause bots before ${warn.event.split('(')[0].trim()} at ${warn.time} UTC — high volatility expected.` : 'No critical events — bots can run normally.'}`,
    }
  }

  // ── Generic fallback — still reads real data ──────────────────────────────
  return {
    trend: ctx.gold.aiOutlook === 'BULLISH' ? 'Bullish' : 'Bearish',
    confidence: ctx.confidence,
    keyLevels: [ctx.gold.resistance, ctx.gold.liquidityZone, ctx.gold.support],
    news: ni,
    conclusion: ctx.gold.aiDailyPlan,
  }
}

// ─── Initial overview card (real data, computed at module load) ───────────────
const _initCtx = buildContext()
const INITIAL_DATA = {
  trend: _initCtx.gold.dailyTrend,
  confidence: _initCtx.confidence,
  keyLevels: [_initCtx.gold.resistance, _initCtx.gold.liquidityZone, _initCtx.gold.support, _initCtx.gold.invalidation],
  news: toNewsItems(_initCtx, 3),
  conclusion: _initCtx.gold.aiDailyPlan,
}

// ─── UI components ────────────────────────────────────────────────────────────
function CopilotCard({ data }) {
  const trendColor = data.trend === 'Bullish' ? '#34d399' : data.trend === 'Bearish' ? '#ef4444' : '#94a3b8'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(139,92,246,0.18)',
      borderRadius: 12, overflow: 'hidden', minWidth: 0,
    }}>
      <div style={{
        padding: '10px 14px',
        background: 'rgba(139,92,246,0.06)',
        borderBottom: '1px solid rgba(139,92,246,0.12)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'dotPulse 1.5s ease infinite', flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
          Market Context
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--text-3)' }}>SEVORA AI</span>
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Trend + Confidence */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: '1 1 50%', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>Trend</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 20,
              background: `${trendColor}14`, border: `1px solid ${trendColor}30`,
              color: trendColor, fontSize: 12, fontWeight: 700,
            }}>
              {data.trend === 'Bullish' ? '↑' : data.trend === 'Bearish' ? '↓' : '→'} {data.trend}
            </div>
          </div>

          <div style={{ flex: '1 1 50%', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>Confidence</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${data.confidence}%`, background: `linear-gradient(to right, ${trendColor}80, ${trendColor})`, transition: 'width 0.8s ease' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: trendColor, fontFamily: 'Orbitron, monospace', minWidth: 32 }}>{data.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Key Levels */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>Key Levels</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.keyLevels.map((lvl, i) => (
              <span key={i} style={{
                fontSize: 12, fontWeight: 700, fontFamily: 'Orbitron, monospace',
                padding: '3px 10px', borderRadius: 6,
                background: i === 0 ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${i === 0 ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: i === 0 ? 'var(--gold)' : 'var(--text-2)',
              }}>
                {typeof lvl === 'number' ? lvl.toLocaleString() : lvl}
              </span>
            ))}
          </div>
        </div>

        {/* Important News */}
        {data.news && data.news.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>Important News</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {data.news.map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', flex: 1, minWidth: 0 }}>{n.name}</span>
                  <span style={{ fontSize: 11, fontFamily: 'Orbitron, monospace', color: 'var(--text-3)', flexShrink: 0 }}>{n.time}</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '2px 7px', borderRadius: 4, flexShrink: 0,
                    background: `${RISK_COLORS[n.risk]}18`,
                    color: RISK_COLORS[n.risk],
                    border: `1px solid ${RISK_COLORS[n.risk]}30`,
                  }}>
                    Risk: {n.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conclusion */}
        <div style={{ background: 'rgba(139,92,246,0.05)', borderRadius: 8, padding: '10px 12px', borderLeft: '3px solid rgba(139,92,246,0.4)' }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Conclusion</div>
          <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{data.conclusion}</p>
        </div>

      </div>
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end', marginBottom: 16 }}>
      <div style={{
        maxWidth: '70%',
        background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '14px 4px 14px 14px', padding: '10px 14px',
        fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6,
      }}>{text}</div>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
      }}>👤</div>
    </div>
  )
}

function BotMessage({ msg }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
      }}>🤖</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {msg.data ? <CopilotCard data={msg.data} /> : (
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            borderRadius: '4px 14px 14px 14px', padding: '10px 14px',
            fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6,
          }}>{msg.text}</div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
        {[0, 150, 300].map(d => (
          <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-3)', animation: 'dotPulse 1.2s ease infinite', animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AIMentor() {
  const { t } = useLanguage()
  const { instruments: liveInstr } = useLiveMarket()

  // Live market snapshot — updates every 5 s from TradingView
  const liveGold  = liveInstr?.XAUUSD
  const liveDxy   = liveInstr?.DXY
  const liveBtc   = liveInstr?.BTCUSD
  const liveUs10y = liveInstr?.US10Y
  const SNAPSHOT = [
    {
      label: 'Gold',
      value: liveGold ? `$${liveGold.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—',
      change: liveGold ? `${liveGold.changePct >= 0 ? '+' : ''}${liveGold.changePct.toFixed(2)}%` : '—',
      up: liveGold ? liveGold.changePct >= 0 : true,
    },
    {
      label: 'DXY',
      value: liveDxy ? liveDxy.price.toFixed(3) : '—',
      change: liveDxy ? `${liveDxy.changePct >= 0 ? '+' : ''}${liveDxy.changePct.toFixed(2)}%` : '—',
      up: liveDxy ? liveDxy.changePct >= 0 : true,
    },
    {
      label: 'US10Y',
      value: liveUs10y ? liveUs10y.price.toFixed(3) + '%' : '—',
      change: liveUs10y ? `${liveUs10y.changePct >= 0 ? '+' : ''}${liveUs10y.changePct.toFixed(2)}%` : '—',
      up: liveUs10y ? liveUs10y.changePct >= 0 : true,
    },
    {
      label: 'BTC',
      value: liveBtc ? `$${liveBtc.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '—',
      change: liveBtc ? `${liveBtc.changePct >= 0 ? '+' : ''}${liveBtc.changePct.toFixed(2)}%` : '—',
      up: liveBtc ? liveBtc.changePct >= 0 : true,
    },
  ]

  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', data: INITIAL_DATA },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function send(text) {
    if (!text.trim() || isTyping) return
    setMessages(p => [...p, { id: Date.now(), type: 'user', text }])
    setInput('')
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1100 + Math.random() * 600))
    const ctx = buildContext({
      gold: liveGold ? { ...goldData, price: liveGold.price, changePct: liveGold.changePct, changePercent: liveGold.changePct, high: liveGold.high, low: liveGold.low, open: liveGold.open } : null,
      dxy: liveDxy  ? { symbol: 'DXY', price: liveDxy.price, trend: liveDxy.changePct < 0 ? 'Bearish' : 'Bullish', changePct: liveDxy.changePct } : null,
    })
    const data = generateResponse(text, ctx)
    setIsTyping(false)
    setMessages(p => [...p, { id: Date.now() + 1, type: 'bot', data }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 className="page-title">Trading Copilot</h1>
          <p className="page-subtitle">AI analysis powered by live site data — trend, calendar, news, journal, bots.</p>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'start' }}>

        {/* LEFT: Chat */}
        <div className="glass" style={{ display: 'flex', flexDirection: 'column', height: 640 }}>
          <div style={{
            padding: '12px 18px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
              flexShrink: 0,
            }}>🤖</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>SEVORA Trading Copilot</div>
              <div style={{ fontSize: 10, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', animation: 'dotPulse 1.5s ease infinite' }} />
                Online · Reading site data
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 8px' }}>
            {messages.map(msg =>
              msg.type === 'user'
                ? <UserBubble key={msg.id} text={msg.text} />
                : <BotMessage key={msg.id} msg={msg} />
            )}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              className="form-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask about Gold, trend, levels, news, journal..."
              style={{ flex: 1, fontSize: 13 }}
            />
            <button
              className="btn btn-gold"
              onClick={() => send(input)}
              disabled={!input.trim() || isTyping}
              style={{ padding: '0 18px', fontSize: 13 }}
            >
              ↑
            </button>
          </div>
        </div>

        {/* RIGHT: Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 20 }}>

          {/* Suggested Questions */}
          <div className="glass p-4">
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
              Suggested Questions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SUGGESTED.map((q, i) => (
                <button
                  key={i}
                  onClick={() => send(q.text)}
                  disabled={isTyping}
                  style={{
                    padding: '9px 12px', borderRadius: 8, textAlign: 'left',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                    color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.18s', opacity: isTyping ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (!isTyping) { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; e.currentTarget.style.color = 'var(--text-1)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
                >
                  <span style={{ fontSize: 14 }}>{q.icon}</span>
                  {q.text}
                </button>
              ))}
            </div>
          </div>

          {/* Live Market Snapshot — reads from actual instruments / goldData */}
          <div className="glass p-4">
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
              Market Snapshot
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SNAPSHOT.map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Orbitron, monospace', color: 'var(--text-1)' }}>{row.value}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: row.up ? 'var(--green)' : 'var(--red)' }}>{row.change}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
