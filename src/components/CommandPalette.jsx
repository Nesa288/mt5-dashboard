import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  instruments as mockInstruments, news as SITE_NEWS, calendarEvents,
  academyCourses, journalTrades,
} from '../data/mockData'
import { useLiveMarket } from '../context/LiveMarketContext'

// ── Pages ─────────────────────────────────────────────────────────────────────
const PAGES = [
  { id: 'dashboard',   icon: '📊', label: 'Dashboard',         desc: 'Market overview & AI daily brief',        path: '/dashboard',     tags: ['home', 'overview', 'market'] },
  { id: 'gold',        icon: '🥇', label: 'Gold',              desc: 'XAUUSD price, key levels & AI plan',      path: '/gold',          tags: ['xauusd', 'xau', 'gold', 'price'] },
  { id: 'markets',     icon: '🌍', label: 'Markets',           desc: 'Forex, crypto, indices & commodities',    path: '/markets',       tags: ['forex', 'crypto', 'indices', 'instruments'] },
  { id: 'calendar',    icon: '📅', label: 'Economic Calendar', desc: 'CPI, FOMC, NFP — high-impact events',     path: '/calendar',      tags: ['events', 'economic', 'calendar', 'fomc', 'nfp', 'cpi'] },
  { id: 'news',        icon: '📰', label: 'News',              desc: 'Market headlines with AI sentiment',      path: '/news',          tags: ['headlines', 'articles', 'sentiment'] },
  { id: 'scenarios',   icon: '📈', label: 'Trading Scenarios', desc: 'Bullish & bearish trade setups',          path: '/scenarios',     tags: ['setup', 'trade', 'plan', 'long', 'short'] },
  { id: 'journal',     icon: '📔', label: 'Journal',           desc: 'Trade log & performance analytics',       path: '/journal',       tags: ['trades', 'log', 'history', 'pnl', 'performance'] },
  { id: 'ai-mentor',   icon: '🤖', label: 'AI Mentor',         desc: 'Trading Copilot — ask anything',         path: '/ai-mentor',     tags: ['ai', 'mentor', 'copilot', 'chat', 'analysis'] },
  { id: 'academy',     icon: '🎓', label: 'Academy',           desc: 'Trading courses & education',             path: '/academy',       tags: ['learn', 'course', 'education', 'lessons'] },
  { id: 'bots',        icon: '⚙️',  label: 'Bot Dashboard',    desc: 'Automated bots & signals',                path: '/bot-dashboard', tags: ['bot', 'signals', 'auto', 'robot', 'ea'] },
  { id: 'affiliate',   icon: '🤝', label: 'Affiliate',         desc: 'Referral program & earnings',             path: '/affiliate',     tags: ['referral', 'earn', 'commission', 'invite'] },
  { id: 'marketplace', icon: '🛒', label: 'Marketplace',       desc: 'Indicators, tools & templates',           path: '/marketplace',   tags: ['shop', 'buy', 'indicator', 'tool', 'template'] },
  { id: 'premium',     icon: '⭐', label: 'Premium',           desc: 'Upgrade your plan — Pro & Elite',        path: '/premium',       tags: ['pro', 'elite', 'upgrade', 'pricing', 'subscription'] },
]

// ── Trading concepts glossary ─────────────────────────────────────────────────
const CONCEPTS = [
  { id: 'fvg',        term: 'FVG',             full: 'Fair Value Gap',          desc: 'A 3-candle imbalance where price moves so fast it leaves an unfilled gap. Price often returns to fill it before the next leg.',                   path: '/academy', tags: ['fair value gap', 'imbalance', 'gap', 'ict', 'fvg'] },
  { id: 'ob',         term: 'Order Block',     full: 'Order Block (OB)',        desc: 'The last bearish or bullish candle before a strong impulse move. Marks where institutions placed large orders.',                                    path: '/academy', tags: ['order block', 'ob', 'institutional', 'smc'] },
  { id: 'liquidity',  term: 'Liquidity',       full: 'Liquidity Zone / Grab',   desc: 'Areas where stop losses cluster above swing highs or below swing lows. Institutions hunt these levels before the real directional move.',          path: '/academy', tags: ['liquidity', 'stop hunt', 'sweep', 'bsl', 'ssl'] },
  { id: 'smc',        term: 'SMC',             full: 'Smart Money Concept',     desc: 'Trading methodology aligned with institutional order flow using OBs, FVGs and liquidity grabs. Based on how banks and hedge funds position.',        path: '/academy', tags: ['smc', 'smart money', 'ict', 'institutional', 'smart money concept'] },
  { id: 'bos',        term: 'BOS',             full: 'Break of Structure',      desc: 'Price breaks a prior high (bullish BOS) or low (bearish BOS), confirming the current trend direction.',                                            path: '/academy', tags: ['break of structure', 'bos', 'structure', 'trend'] },
  { id: 'choch',      term: 'CHoCH',           full: 'Change of Character',     desc: 'A shift in market structure from bullish to bearish (or vice versa). An early signal of a potential trend reversal.',                              path: '/academy', tags: ['choch', 'change of character', 'reversal', 'structure shift'] },
  { id: 'mss',        term: 'MSS',             full: 'Market Structure Shift',  desc: 'Similar to CHoCH — a break of the last internal swing point, signaling a potential change in direction.',                                          path: '/academy', tags: ['mss', 'market structure shift', 'structure'] },
  { id: 'pd',         term: 'PD Array',        full: 'Premium / Discount',      desc: 'Institutions buy in discount (below equilibrium) and sell in premium (above it). Used with Fibonacci to identify optimal entry zones.',             path: '/academy', tags: ['pd array', 'premium', 'discount', 'equilibrium', 'fibonacci', 'pd'] },
  { id: 'rr',         term: 'R:R',             full: 'Risk : Reward Ratio',     desc: 'Ratio of potential profit to potential loss. A 1:2 R means risking $1 to make $2. Professionals aim for minimum 1:2 on every trade.',              path: '/journal', tags: ['risk reward', 'rr', 'r multiple', 'ratio', 'risk'] },
  { id: 'atr',        term: 'ATR',             full: 'Average True Range',      desc: 'Measures average volatility over a period. Used for setting stop loss distance and position sizing. Gold ATR is currently 28.5.',                  path: '/gold',    tags: ['atr', 'volatility', 'range', 'average true range'] },
  { id: 'dxy',        term: 'DXY',             full: 'US Dollar Index (DXY)',   desc: 'Measures dollar strength against a basket of currencies. Gold and DXY move inversely — a weak dollar is bullish for gold.',                        path: '/markets', tags: ['dxy', 'dollar index', 'dollar', 'usd', 'currency'] },
  { id: 'prop',       term: 'Prop Firm',       full: 'Prop Firm / Funded Account', desc: 'Funded trading account from a proprietary firm. You trade their capital and keep 70-90% of profits after passing a challenge.',               path: '/academy', tags: ['prop firm', 'funded', 'challenge', 'ftmo', 'mff', 'prop'] },
  { id: 'fomo',       term: 'FOMO',            full: 'Fear of Missing Out',     desc: 'Entering a trade late because you fear missing the move. One of the most common causes of losses in trading journals.',                            path: '/journal', tags: ['fomo', 'fear', 'psychology', 'emotion'] },
  { id: 'stophunt',   term: 'Stop Hunt',       full: 'Stop Hunt / Liquidity Grab', desc: 'Price briefly spikes past key levels (swing highs/lows) to trigger stop losses before reversing. Smart money exploits retail stop placement.', path: '/academy', tags: ['stop hunt', 'liquidity grab', 'manipulation', 'spike'] },
  { id: 'asianrange', term: 'Asian Range',     full: 'Asian Session Range',     desc: 'The high and low established during the Asian session (23:00–08:00 UTC). London session frequently breaks this range to hunt liquidity.',          path: '/gold',    tags: ['asian range', 'asian session', 'session', 'range'] },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function textMatch(text, s) {
  if (!text) return false
  const t = text.toLowerCase()
  if (t.includes(s)) return true
  // also match individual significant words in a multi-word query
  const words = s.split(/\s+/).filter(w => w.length >= 2)
  return words.some(w => t.includes(w))
}

function buildGroups(q, instruments) {
  if (!q.trim()) return null
  const s = q.toLowerCase().trim()

  const groups = []

  // ── Markets (instruments) ─────────────────────────────────────────
  const instHits = instruments.filter(i =>
    textMatch(i.name, s) || textMatch(i.symbol, s) ||
    textMatch(i.symbol.replace('USD',''), s) || textMatch(i.category, s)
  ).slice(0, 4)
  if (instHits.length) groups.push({ type: 'markets', label: 'Markets', items: instHits })

  // ── Calendar ──────────────────────────────────────────────────────
  const calHits = calendarEvents.filter(e =>
    textMatch(e.event, s) || textMatch(e.currency, s)
  ).slice(0, 3)
  if (calHits.length) groups.push({ type: 'calendar', label: 'Calendar', items: calHits })

  // ── News ──────────────────────────────────────────────────────────
  const newsHits = SITE_NEWS.filter(n =>
    textMatch(n.title, s) || textMatch(n.category, s) || textMatch(n.description, s)
  ).slice(0, 2)
  if (newsHits.length) groups.push({ type: 'news', label: 'News', items: newsHits })

  // ── Concepts ─────────────────────────────────────────────────────
  const conceptHits = CONCEPTS.filter(c =>
    textMatch(c.term, s) || textMatch(c.full, s) ||
    textMatch(c.desc, s) || c.tags.some(t => textMatch(t, s))
  ).slice(0, 3)
  if (conceptHits.length) groups.push({ type: 'concepts', label: 'Concepts', items: conceptHits })

  // ── Academy ───────────────────────────────────────────────────────
  const courseHits = academyCourses.filter(c =>
    textMatch(c.title, s) || textMatch(c.desc, s) || textMatch(c.category, s)
  ).slice(0, 2)
  if (courseHits.length) groups.push({ type: 'courses', label: 'Academy', items: courseHits })

  // ── Journal ───────────────────────────────────────────────────────
  const journalHits = journalTrades.filter(t =>
    textMatch(t.instrument, s) || textMatch(t.reason, s) || textMatch(t.direction, s)
  ).slice(0, 2)
  if (journalHits.length) groups.push({ type: 'journal', label: 'Journal', items: journalHits })

  // ── Pages ─────────────────────────────────────────────────────────
  const pageHits = PAGES.filter(p =>
    textMatch(p.label, s) || textMatch(p.desc, s) || p.tags.some(t => textMatch(t, s))
  ).slice(0, 3)
  if (pageHits.length) groups.push({ type: 'pages', label: 'Pages', items: pageHits })

  return groups
}

const CAT_BADGE = {
  markets:  { bg: 'rgba(52,211,153,0.1)',  color: '#34d399', border: 'rgba(52,211,153,0.25)',  label: 'MARKET' },
  calendar: { bg: 'rgba(96,165,250,0.1)',  color: '#60a5fa', border: 'rgba(96,165,250,0.25)',  label: 'CALENDAR' },
  news:     { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24', border: 'rgba(251,191,36,0.25)',  label: 'NEWS' },
  concepts: { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', border: 'rgba(245,158,11,0.25)',  label: 'CONCEPT' },
  courses:  { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: 'rgba(167,139,250,0.25)', label: 'ACADEMY' },
  journal:  { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', border: 'rgba(239,68,68,0.25)',   label: 'JOURNAL' },
  pages:    { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-3)', border: 'rgba(255,255,255,0.08)', label: 'PAGE' },
}
const IMPACT_COLOR = ['', '#64748b', '#22c55e', '#f59e0b', '#f97316', '#ef4444']
const LEVEL_COLOR  = { beginner: '#34d399', intermediate: '#f59e0b', advanced: '#ef4444' }

// ── Row renderers ──────────────────────────────────────────────────────────────
function RowMarket({ item, active }) {
  const up = item.changePct >= 0
  return (
    <>
      <span style={{ fontSize: 18, width: 32, textAlign: 'center', flexShrink: 0 }}>
        {item.symbol === 'XAUUSD' ? '🥇' : item.symbol === 'BTCUSD' ? '₿' : item.symbol === 'DXY' ? '💵' : item.category === 'crypto' ? '🪙' : item.category === 'forex' ? '💱' : '📊'}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{item.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 12, fontFamily: 'Orbitron, monospace', color: 'var(--text-2)', fontWeight: 700 }}>${item.price.toLocaleString()}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: up ? '#34d399' : '#ef4444' }}>{up ? '+' : ''}{item.changePct}%</span>
          <span style={{ fontSize: 10, color: up ? '#34d399' : '#ef4444', background: up ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${up ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 4, padding: '1px 5px' }}>{item.trend}</span>
        </div>
      </div>
    </>
  )
}

function RowCalendar({ item, active }) {
  const dots = Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: i < item.impact ? IMPACT_COLOR[item.impact] : 'rgba(255,255,255,0.12)' }} />
  ))
  const dateLabel = item.date === 'today' ? 'Today' : item.date === 'tomorrow' ? 'Tomorrow' : 'This Week'
  return (
    <>
      <span style={{ fontSize: 18, width: 32, textAlign: 'center', flexShrink: 0 }}>📅</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.event}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: IMPACT_COLOR[item.impact] || 'var(--text-3)', background: `${IMPACT_COLOR[item.impact]}14`, borderRadius: 4, padding: '1px 5px', border: `1px solid ${IMPACT_COLOR[item.impact]}30` }}>{dateLabel}</span>
          <span style={{ fontSize: 11, fontFamily: 'Orbitron, monospace', color: 'var(--text-3)' }}>{item.time} UTC</span>
          <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>{dots}</div>
        </div>
      </div>
    </>
  )
}

function RowNews({ item, active }) {
  const sentColor = item.sentiment === 'bullish' ? '#34d399' : item.sentiment === 'bearish' ? '#ef4444' : '#94a3b8'
  return (
    <>
      <span style={{ fontSize: 18, width: 32, textAlign: 'center', flexShrink: 0 }}>📰</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{item.time} · {item.source}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: sentColor, background: `${sentColor}14`, borderRadius: 4, padding: '1px 5px', textTransform: 'capitalize' }}>{item.sentiment}</span>
        </div>
      </div>
    </>
  )
}

function RowConcept({ item, active }) {
  return (
    <>
      <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#f59e0b', fontFamily: 'Orbitron, monospace' }}>
        {item.term.slice(0, 3)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{item.full}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>{item.desc}</div>
      </div>
    </>
  )
}

function RowCourse({ item, active }) {
  const lc = LEVEL_COLOR[item.level] || '#94a3b8'
  return (
    <>
      <span style={{ fontSize: 18, width: 32, textAlign: 'center', flexShrink: 0 }}>🎓</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: lc, background: `${lc}14`, borderRadius: 4, padding: '1px 5px', textTransform: 'capitalize' }}>{item.level}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.duration} · {item.lessons} lessons</span>
          {item.progress > 0 && <span style={{ fontSize: 10, color: '#a78bfa' }}>{item.progress}% done</span>}
        </div>
      </div>
    </>
  )
}

function RowJournal({ item, active }) {
  const win = item.status === 'win'
  return (
    <>
      <span style={{ fontSize: 18, width: 32, textAlign: 'center', flexShrink: 0 }}>{win ? '✅' : '❌'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{item.instrument} {item.direction} · {item.date}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: win ? '#34d399' : '#ef4444', fontFamily: 'Orbitron, monospace' }}>{item.result}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.rr}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.reason}</span>
        </div>
      </div>
    </>
  )
}

function RowPage({ item, active }) {
  return (
    <>
      <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: active ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
        {item.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{item.label}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 1 }}>{item.desc}</div>
      </div>
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CommandPalette() {
  const [open, setOpen]         = useState(false)
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const listRef  = useRef(null)
  const navigate = useNavigate()
  const { instruments: liveInstr } = useLiveMarket()

  // Patch mock instruments with live prices from TradingView context
  const SYM_MAP = { XAGUSD: 'SILVER', SPX500: 'SP500' }
  const instruments = useMemo(() => mockInstruments.map(inst => {
    const ctxSym = SYM_MAP[inst.symbol] ?? inst.symbol
    const live = liveInstr?.[ctxSym]
    if (!live) return inst
    return { ...inst, price: live.price, changePct: parseFloat(live.changePct.toFixed(2)) }
  }), [liveInstr])

  const groups    = query.trim() ? (buildGroups(query, instruments) || []) : null
  const showPages = !query.trim()
  const displayGroups = showPages
    ? [{ type: 'pages', label: 'Quick Access', items: PAGES }]
    : (groups || [])
  const flatItems = displayGroups.flatMap(g => g.items)
  const sel = Math.min(selected, Math.max(0, flatItems.length - 1))

  function getPath(item, type) {
    if (type === 'markets') return item.symbol === 'XAUUSD' ? '/gold' : '/markets'
    if (type === 'calendar') return '/calendar'
    if (type === 'news')     return '/news'
    if (type === 'concepts') return item.path
    if (type === 'courses')  return '/academy'
    if (type === 'journal')  return '/journal'
    return item.path
  }

  const close = useCallback(() => setOpen(false), [])
  const run   = useCallback((item, type) => { navigate(getPath(item, type)); close() }, [navigate, close])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(p => { if (!p) { setQuery(''); setSelected(0) } return !p })
      }
    }
    const onOpen = () => { setQuery(''); setSelected(0); setOpen(true) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('cp:open', onOpen)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('cp:open', onOpen) }
  }, [])

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 20) }, [open])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setSelected(s => Math.min(s + 1, flatItems.length - 1)) }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    else if (e.key === 'Enter')     { if (flatItems[sel]) run(flatItems[sel], displayGroups.flatMap(g => g.items.map(() => g.type))[sel]) }
    else if (e.key === 'Escape')    { close() }
  }

  const typeMap = displayGroups.flatMap(g => g.items.map(() => g.type))

  useEffect(() => {
    if (!listRef.current) return
    const allRows = listRef.current.querySelectorAll('[data-row]')
    allRows[sel]?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  if (!open) return null

  let flatIdx = -1

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(5,4,15,0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', animation: 'cp-bg 0.12s ease both' }}
      onClick={close}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 600, margin: '0 16px', background: '#0d0d1b', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 16, boxShadow: '0 32px 96px rgba(0,0,0,0.7), 0 0 60px rgba(109,40,217,0.1)', overflow: 'hidden', animation: 'cp-in 0.16s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0) }}
            onKeyDown={onKeyDown}
            placeholder="Search markets, news, concepts, journal, pages..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 15, color: 'var(--text-1)', fontFamily: 'inherit', caretColor: 'var(--gold)' }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setSelected(0); inputRef.current?.focus() }}
              style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 16, padding: '0 2px', lineHeight: 1 }}>×</button>
          )}
          <kbd style={{ fontSize: 10, color: 'rgba(139,92,246,0.55)', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 5, padding: '2px 7px', fontFamily: 'inherit', flexShrink: 0 }}>ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: 460, overflowY: 'auto' }}>
          {displayGroups.length === 0 && query && (
            <div style={{ padding: '36px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              No results for <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>"{query}"</span>
            </div>
          )}

          {displayGroups.map((group, gi) => {
            const badge = CAT_BADGE[group.type] || CAT_BADGE.pages
            return (
              <div key={group.type}>
                {/* Group header */}
                <div style={{ padding: '10px 16px 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: badge.color }}>{group.label}</span>
                  <div style={{ flex: 1, height: 1, background: `${badge.color}20` }} />
                </div>

                {group.items.map(item => {
                  flatIdx++
                  const myIdx = flatIdx
                  const isActive = myIdx === sel
                  const type = group.type

                  return (
                    <div
                      key={item.id ?? item.symbol ?? item.term ?? item.title ?? myIdx}
                      data-row
                      onMouseEnter={() => setSelected(myIdx)}
                      onClick={() => run(item, type)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px 8px 14px', cursor: 'pointer', userSelect: 'none', background: isActive ? 'rgba(139,92,246,0.09)' : 'transparent', borderLeft: `2px solid ${isActive ? badge.color : 'transparent'}`, transition: 'all 0.08s' }}
                    >
                      {type === 'markets'  && <RowMarket   item={item} active={isActive} />}
                      {type === 'calendar' && <RowCalendar item={item} active={isActive} />}
                      {type === 'news'     && <RowNews     item={item} active={isActive} />}
                      {type === 'concepts' && <RowConcept  item={item} active={isActive} />}
                      {type === 'courses'  && <RowCourse   item={item} active={isActive} />}
                      {type === 'journal'  && <RowJournal  item={item} active={isActive} />}
                      {type === 'pages'    && <RowPage     item={item} active={isActive} />}

                      {/* Category badge + enter key */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                        <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: badge.color, background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: 4, padding: '2px 6px' }}>{badge.label}</span>
                        {isActive && <kbd style={{ fontSize: 11, color: badge.color, background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: 4, padding: '2px 6px', fontFamily: 'inherit' }}>↵</kbd>}
                      </div>
                    </div>
                  )
                })}

                {gi < displayGroups.length - 1 && (
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '4px 0' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '7px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 14, fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>
          {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([key, label]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <kbd style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, padding: '1px 5px', fontFamily: 'inherit', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{key}</kbd>
              {label}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', opacity: 0.6 }}>Ctrl+K</span>
        </div>
      </div>

      <style>{`
        @keyframes cp-bg { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cp-in { from { opacity: 0; transform: scale(0.96) translateY(-10px) } to { opacity: 1; transform: scale(1) translateY(0) } }
      `}</style>
    </div>
  )
}
