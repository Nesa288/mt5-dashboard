import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const Ctx = createContext(null)

function sig() {
  try { return { signal: AbortSignal.timeout(5000) } } catch (_) { return {} }
}

// Single source of truth — TradingView scanner for every instrument
const TV_MAP = [
  { sym: 'XAUUSD', tv: 'TVC:GOLD',       decimals: 2 },
  { sym: 'SILVER', tv: 'TVC:SILVER',      decimals: 3 },
  { sym: 'DXY',    tv: 'TVC:DXY',         decimals: 3 },
  { sym: 'EURUSD', tv: 'FX_IDC:EURUSD',   decimals: 4 },
  { sym: 'GBPUSD', tv: 'FX_IDC:GBPUSD',   decimals: 4 },
  { sym: 'USDJPY', tv: 'FX_IDC:USDJPY',   decimals: 2 },
  { sym: 'USDCAD', tv: 'FX_IDC:USDCAD',   decimals: 4 },
  { sym: 'AUDUSD', tv: 'FX_IDC:AUDUSD',   decimals: 4 },
  { sym: 'BTCUSD', tv: 'COINBASE:BTCUSD', decimals: 1 },
  { sym: 'ETHUSD', tv: 'COINBASE:ETHUSD', decimals: 2 },
  { sym: 'NAS100', tv: 'NASDAQ:NDX',      decimals: 1 },
  { sym: 'SP500',  tv: 'SP:SPX',          decimals: 2 },
  { sym: 'USOIL',  tv: 'NYMEX:CL1!',       decimals: 2 },
]

const TV_COLS   = ['close', 'change', 'change_abs', 'high', 'low', 'open']
const POLL_MS   = 8_000
const NEWS_MS   = 600_000
const HIST_MAX  = 40

// One batch POST → all 13 instruments in a single request (13× fewer API calls)
async function fetchAllTV() {
  const r = await fetch('https://scanner.tradingview.com/global/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbols: { tickers: TV_MAP.map(s => s.tv) }, columns: TV_COLS }),
    ...sig(),
  })
  if (!r.ok) throw new Error(`scan:${r.status}`)
  const { data = [] } = await r.json()
  const fresh = {}
  data.forEach(({ s, d }) => {
    const entry = TV_MAP.find(m => m.tv === s)
    if (!entry || !d) return
    const [close, change, changeAbs, high, low, open] = d
    const price = parseFloat(close)
    if (!(price > 0)) return
    fresh[entry.sym] = {
      price,
      change:    parseFloat(changeAbs ?? 0),
      changePct: parseFloat(change    ?? 0),
      high:      parseFloat(high  ?? close),
      low:       parseFloat(low   ?? close),
      open:      parseFloat(open  ?? close),
    }
  })
  return fresh
}

async function fetchGoldNews() {
  const rss = 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=GC=F'
  const r = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}&count=8`, sig())
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

  // WS real-time overrides — written without triggering re-renders
  const wsRef   = useRef({})
  const histRef = useRef([])

  const poll = useCallback(async () => {
    let fresh
    try {
      fresh = await fetchAllTV()
    } catch (_) {
      setStatus(s => s === 'loading' ? 'error' : s)
      return
    }

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

  // Binance WebSocket — real-time BTC + ETH (ref-only, no re-render)
  useEffect(() => {
    let ws
    try {
      ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@aggTrade/ethusdt@aggTrade')
      ws.onmessage = (e) => {
        try {
          const { stream, data } = JSON.parse(e.data)
          const p = parseFloat(data.p)
          if (p > 0) wsRef.current[stream.startsWith('btc') ? 'BTCUSD' : 'ETHUSD'] = p
        } catch (_) {}
      }
      ws.onerror = () => {}
    } catch (_) {}
    return () => ws?.close()
  }, [])


  useEffect(() => {
    fetchGoldNews().then(setNews).catch(() => {})
    const id = setInterval(() => fetchGoldNews().then(setNews).catch(() => {}), NEWS_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setSessions(computeSessions()), 60_000)
    return () => clearInterval(id)
  }, [])

  // Backward-compat `market` object — recomputed every 8 s when setInstruments fires
  const xau     = instruments.XAUUSD
  const liveBtc = wsRef.current.BTCUSD ?? instruments.BTCUSD?.price

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
    btc:    instruments.BTCUSD ? { price: liveBtc, changePct: instruments.BTCUSD.changePct } : null,
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
