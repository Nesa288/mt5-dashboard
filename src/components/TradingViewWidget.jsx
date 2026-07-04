import { useEffect, useRef, memo } from 'react'

const TradingViewWidget = memo(({ type = 'advanced-chart', config = {}, height = 400, style = {} }) => {
  const containerRef = useRef(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ''

    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tradingview-widget-container__widget'
    widgetDiv.style.cssText = 'height:100%;width:100%;'
    container.appendChild(widgetDiv)

    const script = document.createElement('script')
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${type}.js`
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({ theme: 'dark', colorTheme: 'dark', ...config })
    container.appendChild(script)

    return () => {
      mountedRef.current = false
      if (container) container.innerHTML = ''
    }
  }, [type, config.symbol, config.symbols])

  return (
    <div
      className="tradingview-widget-container tv-container"
      ref={containerRef}
      style={{ height, width: '100%', ...style }}
    />
  )
})

TradingViewWidget.displayName = 'TradingViewWidget'
export default TradingViewWidget


// Pre-configured widgets

export function GoldChart({ height = 480, interval = 'H4' }) {
  return (
    <TradingViewWidget
      type="advanced-chart"
      height={height}
      config={{
        symbol: 'TVC:GOLD',
        interval,
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        width: '100%',
        height,
        enable_publishing: false,
        allow_symbol_change: false,
        save_image: false,
        hide_top_toolbar: false,
        toolbar_bg: '#0d1420',
        backgroundColor: 'rgba(7,11,17,0)',
        gridColor: 'rgba(255,255,255,0.04)',
        withdateranges: true,
        container_id: 'tv_gold_main',
      }}
    />
  )
}

export function GoldMiniChart({ height = 180 }) {
  return (
    <TradingViewWidget
      type="mini-symbol-overview"
      height={height}
      config={{
        symbol: 'TVC:GOLD',
        width: '100%',
        height,
        locale: 'en',
        dateRange: '1D',
        colorTheme: 'dark',
        isTransparent: true,
        autosize: true,
        largeChartUrl: '',
        chartOnly: true,
        noTimeScale: false,
      }}
    />
  )
}

export function MarketOverviewWidget({ height = 580 }) {
  return (
    <TradingViewWidget
      type="market-overview"
      height={height}
      config={{
        colorTheme: 'dark',
        dateRange: '1D',
        showChart: true,
        locale: 'en',
        largeChartUrl: '',
        isTransparent: true,
        showSymbolLogo: true,
        showFloatingTooltip: false,
        width: '100%',
        height,
        tabs: [
          {
            title: 'Metals',
            symbols: [
              { s: 'TVC:GOLD', d: 'Gold' },
              { s: 'TVC:SILVER', d: 'Silver' },
              { s: 'TVC:DXY', d: 'DXY' },
            ],
            originalTitle: 'Metals',
          },
          {
            title: 'Forex',
            symbols: [
              { s: 'FX:EURUSD', d: 'EUR/USD' },
              { s: 'FX:GBPUSD', d: 'GBP/USD' },
              { s: 'FX:USDJPY', d: 'USD/JPY' },
            ],
            originalTitle: 'Forex',
          },
          {
            title: 'Crypto',
            symbols: [
              { s: 'COINBASE:BTCUSD', d: 'BTC/USD' },
              { s: 'COINBASE:ETHUSD', d: 'ETH/USD' },
            ],
            originalTitle: 'Crypto',
          },
          {
            title: 'Indices',
            symbols: [
              { s: 'TVC:SPX', d: 'S&P 500' },
              { s: 'TVC:NDX', d: 'NASDAQ' },
            ],
            originalTitle: 'Indices',
          },
        ],
      }}
    />
  )
}

export function EconomicCalendarWidget({ height = 500 }) {
  return (
    <TradingViewWidget
      type="events-calendar"
      height={height}
      config={{
        colorTheme: 'dark',
        isTransparent: true,
        width: '100%',
        height,
        locale: 'en',
        importanceFilter: '-1,0,1',
        countryFilter: 'us,eu,gb,jp,cn',
      }}
    />
  )
}

export function NewsTimelineWidget({ height = 500 }) {
  return (
    <TradingViewWidget
      type="timeline"
      height={height}
      config={{
        colorTheme: 'dark',
        isTransparent: true,
        displayMode: 'regular',
        width: '100%',
        height,
        locale: 'en',
        feedMode: 'market',
        market: 'crypto',
        symbol: 'TVC:GOLD',
      }}
    />
  )
}

export function TickerTapeWidget() {
  return (
    <TradingViewWidget
      type="ticker-tape"
      height={44}
      config={{
        symbols: [
          { proName: 'TVC:GOLD', title: 'Gold' },
          { proName: 'TVC:SILVER', title: 'Silver' },
          { proName: 'TVC:DXY', title: 'DXY' },
          { proName: 'FX:EURUSD', title: 'EUR/USD' },
          { proName: 'COINBASE:BTCUSD', title: 'BTC' },
          { proName: 'TVC:SPX', title: 'S&P 500' },
        ],
        colorTheme: 'dark',
        isTransparent: true,
        showSymbolLogo: false,
        locale: 'en',
        displayMode: 'compact',
      }}
    />
  )
}
