import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useLiveMarket } from '../context/LiveMarketContext'
import { instruments } from '../data/mockData'
import { MarketOverviewWidget } from '../components/TradingViewWidget'
import { IcoArrowUp, IcoArrowDown, IcoStar } from '../components/Icons'
import ScrollableTabs from '../components/ScrollableTabs'

const FILTERS = ['all', 'favorites', 'forex', 'metals', 'crypto', 'indices', 'commodities']

function HeatCell({ inst }) {
  if (inst.changePct == null) {
    return (
      <div className="heatmap-cell" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="heatmap-sym" style={{ color: 'var(--text-3)' }}>{inst.symbol}</div>
        <div className="heatmap-pct" style={{ color: 'var(--text-3)', fontFamily: 'Orbitron, monospace' }}>—</div>
      </div>
    )
  }
  const isPos = inst.changePct >= 0
  const intensity = Math.min(Math.abs(inst.changePct) / 3, 1)
  const bg = isPos
    ? `rgba(0,212,160,${0.08 + intensity * 0.25})`
    : `rgba(239,68,68,${0.08 + intensity * 0.25})`
  const border = isPos ? 'rgba(0,212,160,0.3)' : 'rgba(239,68,68,0.3)'

  return (
    <div className="heatmap-cell" style={{ background: bg, border: `1px solid ${border}` }}>
      <div className="heatmap-sym" style={{ color: isPos ? 'var(--green)' : 'var(--red)' }}>{inst.symbol}</div>
      <div className="heatmap-pct" style={{ color: isPos ? 'var(--green)' : 'var(--red)', fontFamily: 'Orbitron, monospace' }}>
        {isPos ? '+' : ''}{inst.changePct.toFixed(2)}%
      </div>
    </div>
  )
}

export default function Markets() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState('all')
  const [favs, setFavs] = useState(() => new Set(instruments.filter(i => i.isFav).map(i => i.symbol)))
  const { instruments: liveInstr } = useLiveMarket()

  // mockData uses XAGUSD + SPX500; context uses SILVER + SP500
  const SYM_MAP = { XAGUSD: 'SILVER', SPX500: 'SP500' }
  const patchedInstruments = instruments.map(inst => {
    const ctxSym = SYM_MAP[inst.symbol] ?? inst.symbol
    const live = liveInstr?.[ctxSym]
    if (!live) return { ...inst, price: null, changePct: null, change: null }
    return { ...inst, price: live.price, changePct: live.changePct, change: live.change }
  })

  const toggleFav = (symbol, e) => {
    e.stopPropagation()
    setFavs(prev => {
      const next = new Set(prev)
      next.has(symbol) ? next.delete(symbol) : next.add(symbol)
      return next
    })
  }

  const filtered = patchedInstruments.filter(i => {
    if (filter === 'all') return true
    if (filter === 'favorites') return favs.has(i.symbol)
    return i.category === filter
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="page-title">{t('markets.title')}</h1>
        <p className="page-subtitle">{t('markets.subtitle')}</p>
      </div>

      {/* Filter Pills */}
      <ScrollableTabs>
        {FILTERS.map(f => (
          <button key={f} className={`pill-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'favorites' ? '⭐ ' : ''}{t(`markets.filters.${f}`)}
          </button>
        ))}
      </ScrollableTabs>

      {/* Instruments Table */}
      <div className="glass" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="data-table" style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th></th>
              <th>{t('markets.symbol')}</th>
              <th className="col-name">{t('markets.name')}</th>
              <th style={{ textAlign: 'right' }}>{t('markets.price')}</th>
              <th style={{ textAlign: 'right' }}>{t('markets.change')}</th>
              <th className="col-trend" style={{ textAlign: 'center' }}>{t('markets.trend')}</th>
              <th className="col-signal" style={{ textAlign: 'center' }}>{t('markets.signal')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inst => {
              const isPos = inst.changePct != null && inst.changePct >= 0
              return (
                <tr key={inst.symbol} style={{ cursor: 'pointer' }}>
                  <td style={{ width: 36, cursor: 'pointer' }} onClick={e => toggleFav(inst.symbol, e)}>
                    <IcoStar size={14} color={favs.has(inst.symbol) ? 'var(--gold)' : 'var(--text-4)'} fill={favs.has(inst.symbol) ? 'var(--gold)' : 'none'} />
                  </td>
                  <td>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 13, fontWeight: 700, color: 'var(--gold)' }}>{inst.symbol}</span>
                    <div className="col-name-sub">{inst.name}</div>
                  </td>
                  <td className="col-name" style={{ color: 'var(--text-2)', fontSize: 13 }}>{inst.name}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 14, fontWeight: 700 }}>
                      {inst.price == null ? '—' : inst.price > 100 ? inst.price.toLocaleString() : inst.price.toFixed(4)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      color: isPos ? 'var(--green)' : 'var(--red)',
                      fontSize: 13, fontWeight: 600,
                    }}>
                      {inst.changePct == null ? '—' : <>{isPos ? <IcoArrowUp size={12} /> : <IcoArrowDown size={12} />}{isPos ? '+' : ''}{inst.changePct.toFixed(2)}%</>}
                    </span>
                  </td>
                  <td className="col-trend" style={{ textAlign: 'center' }}>
                    <span className={`badge ${inst.trend === 'Bullish' ? 'badge-bull' : inst.trend === 'Bearish' ? 'badge-bear' : 'badge-neutral'}`}>
                      {inst.trend}
                    </span>
                  </td>
                  <td className="col-signal" style={{ textAlign: 'center' }}>
                    <span className={`badge ${inst.signal === 'Bullish' ? 'badge-bull' : inst.signal === 'Bearish' ? 'badge-bear' : 'badge-neutral'}`}>
                      {inst.signal}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Heatmap */}
      <div className="glass p-5">
        <div className="section-label mb-4">{t('markets.heatmap')}</div>
        <div className="heatmap-grid">
          {patchedInstruments.map(inst => <HeatCell key={inst.symbol} inst={inst} />)}
        </div>
      </div>

      {/* TradingView Market Overview */}
      <div className="glass" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
          <div className="section-label" style={{ marginBottom: 0 }}>Live Market Data — TradingView</div>
        </div>
        <MarketOverviewWidget height={560} />
      </div>
    </div>
  )
}
