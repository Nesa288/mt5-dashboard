import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const Ctx = createContext(null)

const T = 6000 // 6 s per source timeout

function sig() {
  try { return { signal: AbortSignal.timeout(T) } } catch (_) { return {} }
}

// ─── Gold / Silver sources (raced in parallel) ────────────────────────────────

async function src_goldpriceorg() {
  const r = await fetch('https://data-asg.goldprice.org/dbXRates/USD', sig())
  if (!r.ok) throw new Error('gpo')
  const d = await r.json()
  const item = d.items?.[0]
  if (!(item?.xauPrice > 100)) throw new Error('gpo-bad')
  return { gold: item.xauPrice, silver: item.xagPrice || null }
}

async function src_swissquote() {
  const r = await fetch(
    'https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD', sig()
  )
  if (!r.ok) throw new Error('sq')
  const d = await r.json()
  const row = Array.isArray(d) ? d[0] : d
  const price = parseFloat(row.bid ?? row.ask ?? row.price ?? 0)
  if (!(price > 100)) throw new Error('sq-bad')
  return { gold: price, silver: null }
}

async function src_metals_live() {
  const r = await fetch('https://api.metals.live/v1/spot', sig())
  if (!r.ok) throw new Error('ml')
  const data = await r.json()
  const row = Array.isArray(data) ? data[0] : data
  const gold   = parseFloat(row.gold   ?? row.XAU ?? row.GOLD ?? 0)
  const silver = parseFloat(row.silver ?? row.XAG ?? row.SILVER ?? 0) || null
  if (!(gold > 100)) throw new Error('ml-bad')
  return { gold, silver }
}

async function src_yahoo_allorigins() {
  const url = 'https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1m&range=1d&includePrePost=false'
  const r = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, sig())
  if (!r.ok) throw new Error('yf-ao')
  const d = await r.json()
  const meta = d.chart?.result?.[0]?.meta
  if (!(meta?.regularMarketPrice > 100)) throw new Error('yf-ao-bad')
  return {
    gold: meta.regularMarketPrice,
    silver: null,
    high: meta.regularMarketDayHigh,
    low: meta.regularMarketDayLow,
  }
}

async function src_yahoo_corsproxy() {
  const url = 'https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?interval=1m&range=1d&includePrePost=false'
  const r = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, sig())
  if (!r.ok) throw new Error('yf-cp')
  const d = await r.json()
  const meta = d.chart?.result?.[0]?.meta
  if (!(meta?.regularMarketPrice > 100)) throw new Error('yf-cp-bad')
  return {
    gold: meta.regularMarketPrice,
    silver: null,
    high: meta.regularMarketDayHigh,
    low: meta.regularMarketDayLow,
  }
}

async function fetchMetals() {
  // Race all 5 sources — use whichever responds first with valid data
  try {
    return await Promise.any([
      src_goldpriceorg(),
      src_swissquote(),
      src_metals_live(),
      src_yahoo_allorigins(),
      src_yahoo_corsproxy(),
    ])
  } catch (_) {
    throw new Error('all-gold-sources-failed')
  }
}

// ─── BTC ─────────────────────────────────────────────────────────────────────

async function fetchBTC() {
  try {
    const r = await fetch('https://api.coincap.io/v2/assets/bitcoin', sig())
    if (r.ok) {
      const { data } = await r.json()
      return { price: parseFloat(data.priceUsd), changePct: parseFloat(data.changePercent24Hr) }
    }
  } catch (_) {}
  // Fallback: Coinbase public API
  const r = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot', sig())
  if (!r.ok) throw new Error('btc-all-failed')
  const { data } = await r.json()
  return { price: parseFloat(data.amount), changePct: 0 }
}

// ─── DXY via ECB FX rates ─────────────────────────────────────────────────────

async function fetchDXY() {
  const r = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,JPY,GBP,CAD,SEK,CHF', sig())
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

// ─── Gold news ────────────────────────────────────────────────────────────────

async function fetchGoldNews() {
  const rss = 'https://feeds.finance.yahoo.com/rss/2.0/headline?s=GC=F'
  const r = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}&count=8`, sig()
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

const POLL_MS  = 20_000    // 20 seconds
const NEWS_MS  = 600_000   // 10 minutes
const HIST_MAX = 40

export function LiveMarketProvider({ children }) {
  const [market, setMarket]         = useState(null)
  const [status, setStatus]         = useState('loading')
  const [lastUpdate, setLastUpdate] = useState(null)
  const [news, setNews]             = useState([])
  const [sessions, setSessions]     = useState(computeSessions)

  const openRef    = useRef({})
  const hiloRef    = useRef({})
  const historyRef = useRef([])

  const poll = useCallback(async () => {
    const [metals, btc, dxyRes] = await Promise.allSettled([
      fetchMetals(), fetchBTC(), fetchDXY(),
    ])

    const out = {}

    if (metals.status === 'fulfilled' && metals.value?.gold > 100) {
      const p   = metals.value.gold
      const ext = metals.value          // may have .high, .low, .silver from Yahoo source
      if (!openRef.current.gold) openRef.current.gold = p
      hiloRef.current.goldH = Math.max(hiloRef.current.goldH ?? (ext.high ?? p), ext.high ?? p)
      hiloRef.current.goldL = Math.min(hiloRef.current.goldL ?? (ext.low  ?? p), ext.low  ?? p)
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
      if (ext.silver > 0) {
        const sp = ext.silver
        if (!openRef.current.silver) openRef.current.silver = sp
        const sopen = openRef.current.silver
        out.silver = { price: sp, changePct: ((sp - sopen) / sopen) * 100 }
      }
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

  return (
    <Ctx.Provider value={{ market, status, lastUpdate, poll, news, sessions }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLiveMarket() {
  return useContext(Ctx)
}
