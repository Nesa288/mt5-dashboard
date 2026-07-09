import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const Ctx = createContext(null)

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchMetals() {
  const r = await fetch('https://api.metals.live/v1/spot')
  if (!r.ok) throw new Error('metals')
  const data = await r.json()
  const row = Array.isArray(data) ? data[0] : data
  return {
    gold:   parseFloat(row.gold   ?? row.XAU) || null,
    silver: parseFloat(row.silver ?? row.XAG) || null,
  }
}

async function fetchBTC() {
  const r = await fetch('https://api.coincap.io/v2/assets/bitcoin')
  if (!r.ok) throw new Error('btc')
  const { data } = await r.json()
  return {
    price:     parseFloat(data.priceUsd),
    changePct: parseFloat(data.changePercent24Hr),
  }
}

// Official ICE DXY formula from ECB mid-market FX rates
async function fetchDXY() {
  const r = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,JPY,GBP,CAD,SEK,CHF')
  if (!r.ok) throw new Error('fx')
  const { rates } = await r.json()
  const { EUR, JPY, GBP, CAD, SEK, CHF } = rates
  const dxy =
    50.14348112 *
    Math.pow(1 / EUR, -0.576) *
    Math.pow(JPY,      0.136) *
    Math.pow(1 / GBP, -0.119) *
    Math.pow(CAD,      0.091) *
    Math.pow(SEK,      0.042) *
    Math.pow(CHF,      0.036)
  return { dxy, eur: 1 / EUR, gbp: 1 / GBP, jpy: JPY, cad: CAD }
}

async function fetchGoldNews() {
  const rss = 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=GC=F'
  const r = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}&count=8`
  )
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
      : /bearish|drop|fall|decline|sell/i.test(item.title) ? 'bearish'
      : 'neutral',
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
      : (decimal >= 17 && decimal < 22) ? 'newYork'
      : 'none',
    utcHour: h, utcMin: m, time: now,
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const POLL_MS   = 30_000
const NEWS_MS   = 600_000   // 10 minutes
const HIST_MAX  = 40

export function LiveMarketProvider({ children }) {
  const [market, setMarket] = useState(null)
  const [status, setStatus]  = useState('loading')
  const [lastUpdate, setLastUpdate] = useState(null)
  const [news, setNews]      = useState([])
  const [sessions, setSessions] = useState(computeSessions)

  const openRef    = useRef({})
  const hiloRef    = useRef({})
  const historyRef = useRef([])   // [{price, time}, …]

  const poll = useCallback(async () => {
    const [metals, btc, dxyRes] = await Promise.allSettled([
      fetchMetals(), fetchBTC(), fetchDXY(),
    ])
    const out = {}

    if (metals.status === 'fulfilled' && metals.value.gold != null) {
      const p = metals.value.gold
      if (!openRef.current.gold) openRef.current.gold = p
      hiloRef.current.goldH = Math.max(hiloRef.current.goldH ?? p, p)
      hiloRef.current.goldL = Math.min(hiloRef.current.goldL ?? p, p)
      const open = openRef.current.gold
      // accumulate history
      historyRef.current.push({ price: p, time: new Date() })
      if (historyRef.current.length > HIST_MAX) historyRef.current.shift()
      out.gold = {
        price: p, change: p - open, changePct: ((p - open) / open) * 100,
        high: hiloRef.current.goldH, low: hiloRef.current.goldL,
        bid: p - 0.20, ask: p + 0.20,
        history: [...historyRef.current],
      }
    }

    if (metals.status === 'fulfilled' && metals.value.silver != null) {
      const p = metals.value.silver
      if (!openRef.current.silver) openRef.current.silver = p
      const open = openRef.current.silver
      out.silver = { price: p, changePct: ((p - open) / open) * 100 }
    }

    if (btc.status === 'fulfilled') out.btc = btc.value

    if (dxyRes.status === 'fulfilled') {
      const { dxy: p, eur, gbp, jpy, cad } = dxyRes.value
      if (!openRef.current.dxy) openRef.current.dxy = p
      const open = openRef.current.dxy
      out.dxy    = { price: p, changePct: ((p - open) / open) * 100 }
      out.forex  = { eur, gbp, jpy, cad }
    }

    if (Object.keys(out).length > 0) {
      setMarket(prev => ({ ...prev, ...out }))
      setStatus('live')
      setLastUpdate(new Date())
    } else {
      setStatus(s => (s === 'loading' ? 'error' : s))
    }
  }, [])

  // Price poll: every 30s
  useEffect(() => {
    poll()
    const id = setInterval(poll, POLL_MS)
    return () => clearInterval(id)
  }, [poll])

  // News poll: on mount + every 10min
  useEffect(() => {
    fetchGoldNews().then(setNews).catch(() => {})
    const id = setInterval(() => fetchGoldNews().then(setNews).catch(() => {}), NEWS_MS)
    return () => clearInterval(id)
  }, [])

  // Sessions: recompute every minute
  useEffect(() => {
    const id = setInterval(() => setSessions(computeSessions()), 60_000)
    return () => clearInterval(id)
  }, [])

  return (
    <Ctx.Provider value={{ market, status, lastUpdate, poll, news, sessions }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLiveMarket() {
  return useContext(Ctx)
}
