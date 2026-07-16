import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const Ctx = createContext(null)

// ── Single source of truth: TradingView scanner API ───────────────────────────
// Uses the EXACT same symbols as the TradingView chart widgets on this site.
// TVC:GOLD → same price the chart shows. COINBASE:BTCUSD → same as crypto chart.
// No other data source is used anywhere.

const TV_SCANNER = 'https://scanner.tradingview.com/symbol'
const TV_FIELDS  = 'close,change,change_abs,high,low,open'

// Symbols MUST match what the chart widgets use (see TradingViewWidget.jsx)
const TV_MAP = [
  { sym: 'XAUUSD', tv: 'TVC:GOLD',         decimals: 2 },
  { sym: 'SILVER', tv: 'TVC:SILVER',        decimals: 3 },
  { sym: 'DXY',    tv: 'TVC:DXY',           decimals: 3 },
  { sym: 'EURUSD', tv: 'FX:EURUSD',         decimals: 4 },
  { sym: 'GBPUSD', tv: 'FX:GBPUSD',         decimals: 4 },
  { sym: 'USDJPY', tv: 'FX:USDJPY',         decimals: 2 },
  { sym: 'USDCAD', tv: 'FX:USDCAD',         decimals: 4 },
  { sym: 'AUDUSD', tv: 'FX:AUDUSD',         decimals: 4 },
  { sym: 'BTCUSD', tv: 'COINBASE:BTCUSD',   decimals: 1 },
  { sym: 'ETHUSD', tv: 'COINBASE:ETHUSD',   decimals: 2 },
  { sym: 'NAS100', tv: 'NASDAQ:NDX',         decimals: 1 },
  { sym: 'SP500',  tv: 'SP:SPX',            decimals: 2 },
  { sym: 'USOIL',  tv: 'NYMEX:CL1!',        decimals: 2 },
  { sym: 'US10Y',  tv: 'TVC:US10Y',         decimals: 3 },
]

const POLL_MS  = 10_000
const NEWS_MS  = 600_000
const HIST_MAX = 40

function abortIn(ms) {
  const ctrl = new AbortController()
  const id = setTimeout(() => ctrl.abort(), ms)
  ctrl.signal.addEventListener('abort', () => clearTimeout(id), { once: true })
  return ctrl.signal
}

async function fetchTV(entry) {
  const url = `${TV_SCANNER}?symbol=${encodeURIComponent(entry.tv)}&fields=${TV_FIELDS}`
  const r = await fetch(url, { signal: abortIn(8000) })
  if (!r.ok) throw new Error(`${entry.sym}:${r.status}`)
  const d = await r.json()

  // Scanner returns { close: N, change: N, change_abs: N, high: N, low: N, open: N }
  const price = parseFloat(d.close)
  if (!(price > 0)) throw new Error(`${entry.sym}:no-price`)

  const changeAbs = parseFloat(d.change_abs ?? 0)
  const changePct = parseFloat(d.change     ?? 0)

  return {
    price,
    change:    changeAbs,
    changePct,
    high: parseFloat(d.high ?? price),
    low:  parseFloat(d.low  ?? price),
    open: parseFloat(d.open ?? (price - changeAbs)),
  }
}

async function fetchGoldNews() {
  const rss = 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=GC=F'
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}&count=8`
  const r = await fetch(url, { signal: abortIn(8000) })
  if (!r.ok) throw new Error('news')
  const data = await r.json()
  if (data.status !== 'ok') throw new Error('news-status')
  return (data.items || []).map((item, i) => ({
    id: item.guid || String(i),
    title: item.title || 'Untitled',
    source: data.feed?.title || 'Yahoo Finance',
    time: new Date(item.pubDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    pubDate: item.pubDate,
    link: item.link,
    summary: (item.description || '').replace(/<[^>]+>/g, '').slice(0, 140),
    sentiment: /bullish|surge|rally|rise|gain/i.test(item.title) ? 'bullish'
      : /bearish|drop|fall|decline|sell/i.test(item.title) ? 'bearish' : 'neutral',
    impact: /CPI|NFP|FOMC|Fed|rate/i.test(item.title) ? 'high' : 'medium',
  }))
}

function computeSessions() {
  const now = new Date()
  const h = now.getUTCHours()
  const m = now.getUTCMinutes()
  const decimal = h + m / 60
  return {
    asian:   decimal >= 23 || decimal < 8,
    london:  decimal >= 8 && decimal < 17,
    newYork: decimal >= 17 && decimal < 22,
    overlap: decimal >= 13 && decimal < 17,
    current: (decimal >= 23 || decimal < 8) ? 'asian'
      : (decimal >= 13 && decimal < 17) ? 'overlap'
      : (decimal >= 8 && decimal < 17) ? 'london'
      : (decimal >= 17 && decimal < 22) ? 'newYork' : 'none',
    utcHour: h, utcMin: m, time: now,
  }
}

export function LiveMarketProvider({ children }) {
  const [instruments, setInstruments] = useState({})
  const [status, setStatus]           = useState('loading')
  const [lastUpdate, setLastUpdate]   = useState(null)
  const [news, setNews]               = useState([])
  const [sessions, setSessions]       = useState(computeSessions)

  // wsRef kept for API compatibility with PriceTicker — no WebSocket used
  const wsRef   = useRef({})
  const histRef = useRef([])

  const poll = useCallback(async () => {
    const settled = await Promise.allSettled(TV_MAP.map(entry => fetchTV(entry)))
    const fresh = {}
    settled.forEach((res, i) => {
      if (res.status === 'fulfilled') fresh[TV_MAP[i].sym] = res.value
    })

    if (Object.keys(fresh).length === 0) {
      setStatus(s => s === 'loading' ? 'error' : s)
      return
    }

    if (fresh.XAUUSD) {
      histRef.current.push({ price: fresh.XAUUSD.price, time: new Date() })
      if (histRef.current.length > HIST_MAX) histRef.current.shift()
      fresh.XAUUSD = { ...fresh.XAUUSD, history: [...histRef.current] }
    }

    setInstruments(prev => ({ ...prev, ...fresh }))
    setStatus('live')
    setLastUpdate(Date.now())
  }, [])

  useEffect(() => {
    poll()
    const id = setInterval(poll, POLL_MS)
    return () => clearInterval(id)
  }, [poll])

  useEffect(() => {
    fetchGoldNews().then(setNews).catch(() => {})
    const id = setInterval(() => fetchGoldNews().then(setNews).catch(() => {}), NEWS_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setSessions(computeSessions()), 60_000)
    return () => clearInterval(id)
  }, [])

  // `market` backward-compat object — recomputed when instruments updates
  const xau = instruments.XAUUSD

  const market = xau ? {
    gold: {
      price:     xau.price,
      change:    xau.change,
      changePct: xau.changePct,
      high:      xau.high,
      low:       xau.low,
      open:      xau.open,
      bid:       xau.price - 0.20,
      ask:       xau.price + 0.20,
      history:   xau.history ?? [],
    },
    btc:    instruments.BTCUSD ? { price: instruments.BTCUSD.price, changePct: instruments.BTCUSD.changePct } : null,
    silver: instruments.SILVER ? { price: instruments.SILVER.price, changePct: instruments.SILVER.changePct } : null,
    dxy:    instruments.DXY    ? { price: instruments.DXY.price,    changePct: instruments.DXY.changePct    } : null,
    forex: {
      eur: instruments.EURUSD?.price,
      gbp: instruments.GBPUSD?.price,
      jpy: instruments.USDJPY?.price,
      cad: instruments.USDCAD?.price,
    },
  } : null

  return (
    <Ctx.Provider value={{ market, instruments, wsRef, status, lastUpdate, poll, news, sessions }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLiveMarket() {
  return useContext(Ctx)
}
