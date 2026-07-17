import { useEffect, useRef } from 'react'
import { useLiveMarket } from '../context/LiveMarketContext'

const INSTR = [
  { sym: 'XAUUSD', label: 'Gold',     decimals: 2 },
  { sym: 'EURUSD', label: 'EUR/USD',  decimals: 4 },
  { sym: 'BTCUSD', label: 'Bitcoin',  decimals: 1 },
  { sym: 'GBPUSD', label: 'GBP/USD',  decimals: 4 },
  { sym: 'USDJPY', label: 'USD/JPY',  decimals: 2 },
  { sym: 'NAS100', label: 'NASDAQ',   decimals: 1 },
  { sym: 'SP500',  label: 'S&P 500',  decimals: 2 },
  { sym: 'ETHUSD', label: 'Ethereum', decimals: 2 },
  { sym: 'USOIL',  label: 'WTI Oil',  decimals: 2 },
  { sym: 'USDCAD', label: 'USD/CAD',  decimals: 4 },
  { sym: 'SILVER', label: 'Silver',   decimals: 3 },
  { sym: 'AUDUSD', label: 'AUD/USD',  decimals: 4 },
]

const DOUBLED = [...INSTR, ...INSTR]

function fmt(price, decimals) {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return price.toFixed(decimals)
}

export default function PriceTicker() {
  const { instruments, wsRef } = useLiveMarket()
  const priceEls  = useRef([])
  const changeEls = useRef([])
  const instrRef  = useRef({})

  // Keep instrRef current whenever context updates (every 5 s)
  useEffect(() => {
    instrRef.current = instruments
  }, [instruments])

  // DOM update loop: reads wsRef for real-time BTC/ETH/Gold, instrRef for everything else
  useEffect(() => {
    const updateDOM = () => {
      INSTR.forEach((item, i) => {
        const wsPrice = wsRef?.current?.[item.sym]
        const base    = instrRef.current[item.sym]
        const price   = wsPrice ?? base?.price
        if (!price) return  // No data from any source — leave as '—'

        const open      = base?.open ?? price
        const changePct = open > 0 ? ((price - open) / open * 100) : (base?.changePct ?? 0)
        const up        = changePct >= 0
        const color     = up ? '#00D4A0' : '#F87171'

        ;[i, i + INSTR.length].forEach(idx => {
          const pEl = priceEls.current[idx]
          const cEl = changeEls.current[idx]
          if (pEl) { pEl.textContent = fmt(price, item.decimals); pEl.style.color = color }
          if (cEl) { cEl.textContent = `${up ? '▲' : '▼'} ${Math.abs(changePct).toFixed(2)}%`; cEl.style.color = color }
        })
      })
    }

    const id = setInterval(updateDOM, 200)
    return () => clearInterval(id)
  }, [wsRef])

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {DOUBLED.map((t, i) => {
          const base = instruments[t.sym]
          const initPrice = base ? fmt(base.price, t.decimals) : '—'
          const initChange = base
            ? `${base.changePct >= 0 ? '▲' : '▼'} ${Math.abs(base.changePct).toFixed(2)}%`
            : '—'
          const initColor = base ? (base.changePct >= 0 ? '#00D4A0' : '#F87171') : '#00D4A0'
          return (
            <div key={i} className="ticker-item">
              <span className="ticker-sym">{t.sym}</span>
              <span className="ticker-label">{t.label}</span>
              <span className="ticker-price" ref={el => { priceEls.current[i] = el }} style={{ color: initColor }}>
                {initPrice}
              </span>
              <span className="ticker-change" ref={el => { changeEls.current[i] = el }} style={{ color: initColor }}>
                {initChange}
              </span>
              <span className="ticker-sep">·</span>
            </div>
          )
        })}
      </div>
      <div className="ticker-fade-l" />
      <div className="ticker-fade-r" />
    </div>
  )
}
