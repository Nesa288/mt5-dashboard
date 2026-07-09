import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const Ctx = createContext(null)

function sig() {
  try { return { signal: AbortSignal.timeout(5000) } } catch (_) { return {} }
}

// ─── GOLD SOURCES — raced in parallel, first valid price wins ─────────────────

// 1. Bybit XAUUSDT perpetual — crypto exchange, always CORS-enabled, most reliable
async function src_bybit() {
  const r = await fetch('https://api.bybit.com/v5/market/tickers?category=linear&symbol=XAUUSDT', sig())
  const d = await r.json()
  if (d.retCode !== 0) throw new Error('bybit')
  const item = d.result?.list?.[0]
  const price = parseFloat(item?.lastPrice)
  if (!(price > 100)) throw new Error('bybit-range')
  return { gold: price, silver: null, high: parseFloat(item.highPrice24h) || price, low: parseFloat(item.lowPrice24h) || price }
}

// 2. TradingView scanner — same data source the TV chart uses
async function src_tradingview() {
  const r = await fetch(
    'https://scanner.tradingview.com/symbol?symbol=TVC%3AGOLD&fields=close%2Cchange%2Cchange_abs%2Chigh%2Clow&no_404=1',
    sig()
  )
  const d = await r.json()
  const price = parseFloat(d.close)
  if (!(price > 100)) throw new Error('tv-range')
  return { gold: price, silver: null, high: parseFloat(d.high) || price, low: parseFloat(d.low) || price }
}

// 3. OKX XAU-USDT swap — second crypto exchange fallback, CORS-enabled
async function src_okx() {
  const r = await fetch('https://www.okx.com/api/v5/market/ticker?instId=XAU-USDT-SWAP', sig())
  const d = await r.json()
  const item = d.data?.[0]
  const price = parseFloat(item?.last)
  if (!(price > 100)) throw new Error('okx-range')
  return { gold: price, silver: null, high: parseFloat(item.high24h) || price, low: parseFloat(item.low24h) || price }
}

// 4. goldprice.org widget API — CORS-enabled (powers their embeddable widgets)
async function src_goldpriceorg() {
  const r = await fetch('https://data-asg.goldprice.org/dbXRates/USD', sig())
  const d = await r.json()
  const item = d.items?.[0]
  if (!(item?.xauPrice > 100)) throw new Error('gpo-range')
  return { gold: item.xauPrice, silver: item.xagPrice || null }
}

// 5 & 6. Yahoo Finance SPOT gold (XAUUSD=X, not futures GC=F) via two proxies
async function src_yahoo_ao() {
  const url = 'https://query1.finance.yahoo.com/v8/finance/chart/XAUUSD%3DX?interval=1m&range=1d&includePrePost=false'
  const r = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, sig())
  const d = await r.json()
  const meta = d.chart?.result?.[0]?.meta
  const price = parseFloat(meta?.regularMarketPrice)
  if (!(price > 100)) throw new Error('yf-ao-range')
  return { gold: price, silver: null, high: parseFloat(meta.regularMarketDayHigh) || price, low: parseFloat(meta.regularMarketDayLow) || price }
}

async function src_yahoo_cp() {
  const url = 'https://query1.finance.yahoo.com/v8/finance/chart/XAUUSD%3DX?interval=1m&range=1d&includePrePost=false'
  const r = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, sig())
  const d = await r.json()
  const meta = d.chart?.result?.[0]?.meta
  const price = parseFloat(meta?.regularMarketPrice)
  if (!(price > 100)) throw new Error('yf-cp-range')
  return { gold: price, silver: null, high: parseFloat(meta.regularMarketDayHigh) || price, low: parseFloat(meta.regularMarketDayLow) || price }
}

async function fetchMetals() {
  // Race all 6 — whichever responds first with a valid price wins
  return await Promise.any([
    src_bybit(),
    src_tradingview(),
    src_okx(),
    src_goldpriceorg(),
    src_yahoo_ao(),
    src_yahoo_cp(),
  ])
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
  const r = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot', sig())
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
      : (decimal >= 17 && decimal < 22) ? 'newYork' : 'none',
    utcHour: h, utcMin: m, time: now,
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const POLL_MS = 5_000     // 5-second price refresh
const NEWS_MS = 600_000
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
      const ext = metals.value
      if (!openRef.current.gold) openRef.current.gold = p
      const exH = ext.high && ext.high > p ? ext.high : p
      const exL = ext.low  && ext.low  < p ? ext.low  : p
      hiloRef.current.goldH = Math.max(hiloRef.current.goldH ?? exH, exH)
      hiloRef.current.goldL = Math.min(hiloRef.current.goldL ?? exL, exL)
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
        out.silver = { price: sp, changePct: ((sp - openRef.current.silver) / openRef.current.silver) * 100 }
      }
    }

    if (btc.status === 'fulfilled') out.btc = btc.value

    if (dxyRes.status === 'fulfilled') {
      const { dxy: p, eur, gbp, jpy, cad } = dxyRes.value
      if (!openRef.current.dxy) openRef.current.dxy = p
      out.dxy   = { price: p, changePct: ((p - openRef.current.dxy) / openRef.current.dxy) * 100 }
      out.forex = { eur, gbp, jpy, cad }
    }

    if (Object.keys(out).length > 0) {
      setMarket(prev => ({ ...prev, ...out }))
      setStatus('live')
      setLastUpdate(Date.now())
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
