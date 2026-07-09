import { createContext, useContext, useState, useEffect, useRef } from 'react'

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
  // EUR and GBP rates are inverted (1 USD = X EUR → EUR/USD = 1/X)
  const dxy =
    50.14348112 *
    Math.pow(1 / EUR, -0.576) *  // EUR/USD
    Math.pow(JPY,      0.136) *  // USD/JPY
    Math.pow(1 / GBP, -0.119) * // GBP/USD
    Math.pow(CAD,      0.091) *  // USD/CAD
    Math.pow(SEK,      0.042) *  // USD/SEK
    Math.pow(CHF,      0.036)    // USD/CHF
  return dxy
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const POLL_MS = 30_000

export function LiveMarketProvider({ children }) {
  const [market, setMarket] = useState(null)
  const [status, setStatus]  = useState('loading')
  const [lastUpdate, setLastUpdate] = useState(null)

  const openRef = useRef({})  // session-open prices
  const hiloRef = useRef({})  // session high / low

  async function poll() {
    const [metals, btc, dxy] = await Promise.allSettled([
      fetchMetals(),
      fetchBTC(),
      fetchDXY(),
    ])

    const out = {}

    // ── Gold ──────────────────────────────────────────────────────────────────
    if (metals.status === 'fulfilled' && metals.value.gold != null) {
      const p = metals.value.gold
      if (!openRef.current.gold) openRef.current.gold = p
      hiloRef.current.goldH = Math.max(hiloRef.current.goldH ?? p, p)
      hiloRef.current.goldL = Math.min(hiloRef.current.goldL ?? p, p)
      const open = openRef.current.gold
      out.gold = {
        price:       p,
        change:      p - open,
        changePct:   ((p - open) / open) * 100,
        high:        hiloRef.current.goldH,
        low:         hiloRef.current.goldL,
        bid:         p - 0.20,
        ask:         p + 0.20,
      }
    }

    // ── Silver ────────────────────────────────────────────────────────────────
    if (metals.status === 'fulfilled' && metals.value.silver != null) {
      const p = metals.value.silver
      if (!openRef.current.silver) openRef.current.silver = p
      const open = openRef.current.silver
      out.silver = { price: p, changePct: ((p - open) / open) * 100 }
    }

    // ── BTC ───────────────────────────────────────────────────────────────────
    if (btc.status === 'fulfilled') {
      out.btc = btc.value
    }

    // ── DXY ───────────────────────────────────────────────────────────────────
    if (dxy.status === 'fulfilled') {
      const p = dxy.value
      if (!openRef.current.dxy) openRef.current.dxy = p
      const open = openRef.current.dxy
      out.dxy = { price: p, changePct: ((p - open) / open) * 100 }
    }

    if (Object.keys(out).length > 0) {
      setMarket(prev => ({ ...prev, ...out }))
      setStatus('live')
      setLastUpdate(new Date())
    } else {
      setStatus(s => (s === 'loading' ? 'error' : s))
    }
  }

  useEffect(() => {
    poll()
    const id = setInterval(poll, POLL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <Ctx.Provider value={{ market, status, lastUpdate, poll }}>
      {children}
    </Ctx.Provider>
  )
}

export function useLiveMarket() {
  return useContext(Ctx)
}
