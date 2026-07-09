import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const Ctx = createContext(null)

// ─── Gold / Silver ────────────────────────────────────────────────────────────
// Tries 3 sources in sequence; returns on first success.

async function fetchMetals() {
  // Source 1: goldprice.org public widget API — CORS-enabled (powers their embeddable widgets)
  try {
    const r = await fetch('https://data-asg.goldprice.org/dbXRates/USD')
    if (r.ok) {
      const d = await r.json()
      const item = d.items?.[0]
      if (item?.xauPrice > 100) {
        return {
          gold:   item.xauPrice,
          silver: item.xagPrice || null,
        }
      }
    }
  } catch (_) { /* fall through */ }

  // Source 2: metals.live community API
  try {
    const r = await fetch('https://api.metals.live/v1/spot')
    if (r.ok) {
      const data = await r.json()
      const row = Array.isArray(data) ? data[0] : data
      const gold   = parseFloat(row.gold   ?? row.XAU ?? row.GOLD)   || null
      const silver = parseFloat(row.silver ?? row.XAG ?? row.SILVER) || null
      if (gold) return { gold, silver }
    }
  } catch (_) { /* fall through */ }

  // Source 3: Forex API gold via metals symbols
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/XAU')
    if (r.ok) {
      const d = await r.json()
      if (d.rates?.USD > 100) {
        return { gold: d.rates.USD, silver: d.rates.USD / (d.rates.USD / (d.rates?.XAG ?? null)) || null }
      }
    }
  } catch (_) { /* fall through */ }

  throw new Error('all-metals-sources-failed')
}

// ─── BTC ─────────────────────────────────────────────────────────────────────
async function fetchBTC() {
  // Source 1: CoinCap
  try {
    const r = await fetch('https://api.coincap.io/v2/assets/bitcoin')
    if (r.ok) {
      const { data } = await r.json()
      return { price: parseFloat(data.priceUsd), changePct: parseFloat(data.changePercent24Hr) }
    }
  } catch (_) { /* fall through */ }

  // Source 2: Coinbase public price API (CORS-enabled)
  const r = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot')
  if (!r.ok) throw new Error('btc-all-failed')
  const { data } = await r.json()
  return { price: parseFloat(data.amount), changePct: 0 }
}

// ─── DXY via ECB rates (Frankfurter) ─────────────────────────────────────────
async function fetchDXY() {
  const r = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,JPY,GBP,CAD,SEK,CHF')
  if (!r.ok) throw new Error('fx')
  const { rates } = await r.json()
  const { EUR, JPY, GBP, CAD, SEK, CHF } = rates
  // Official ICE DXY formula
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

// ─── Gold news via RSS2JSON ───────────────────────────────────────────────────
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

// ─── Sessions ─────────────────────────────────────────────────────────────────
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

const POLL_MS  = 15_000    // 15 seconds — feels live
const NEWS_MS  = 600_000   // 10 minutes
const HIST_MAX = 40

export function LiveMarketProvider({ children }) {
  const [market, setMarket]       = useState(null)
  const [status, setStatus]       = useState('loading')
  const [lastUpdate, setLastUpdate] = useState(null)
  const [news, setNews]           = useState([])
  const [sessions, setSessions]   = useState(computeSessions)

  const openRef    = useRef({})
  const hiloRef    = useRef({})
  const historyRef = useRef([])

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
      historyRef.current.push({ price: p, time: new Date() })
      if (historyRef.current.length > HIST_MAX) historyRef.current.shift()
      out.gold = {
        price: p,
        change: p - open,
        changePct: ((p - open) / open) * 100,
        high: hiloRef.current.goldH,
        low:  hiloRef.current.goldL,
        bid:  p - 0.20,
        ask:  p + 0.20,
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
      out.dxy   = { price: p, changePct: ((p - open) / open) * 100 }
      out.forex = { eur, gbp, jpy, cad }
    }

    if (Object.keys(out).length > 0) {
      setMarket(prev => ({ ...prev, ...out }))
      setStatus('live')
      setLastUpdate(new Date())
    } else {
      setStatus(s => s === 'loading' ? 'error' : s)
    }
  }, [])

  // Price poll every 15s
  useEffect(() => {
    poll()
    const id = setInterval(poll, POLL_MS)
    return () => clearInterval(id)
  }, [poll])

  // News every 10 min
  useEffect(() => {
    fetchGoldNews().then(setNews).catch(() => {})
    const id = setInterval(() => fetchGoldNews().then(setNews).catch(() => {}), NEWS_MS)
    return () => clearInterval(id)
  }, [])

  // Sessions every minute
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
