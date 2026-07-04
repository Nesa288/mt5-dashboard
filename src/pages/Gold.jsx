import { useLanguage } from '../context/LanguageContext'
import { goldData } from '../data/mockData'
import { GoldChart } from '../components/TradingViewWidget'
import { IcoArrowUp, IcoArrowDown, IcoAlert, IcoBolt, IcoTarget, IcoShield, IcoInfo } from '../components/Icons'
import ScrollableTabs from '../components/ScrollableTabs'

function TFRow({ tf, trend, detail }) {
  const isUp = trend === 'Bullish'
  const isDown = trend === 'Bearish'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', minWidth: 50 }}>{tf}</span>
      <span className={`badge ${isUp ? 'badge-bull' : isDown ? 'badge-bear' : 'badge-neutral'}`}>
        {isUp ? <IcoArrowUp size={10} /> : isDown ? <IcoArrowDown size={10} /> : null}
        {trend}
      </span>
      <span style={{ fontSize: 11, color: 'var(--text-3)', maxWidth: 120, textAlign: 'right' }}>{detail}</span>
    </div>
  )
}

export default function Gold() {
  const { t } = useLanguage()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">{t('gold.title')}</h1>
          <p className="page-subtitle">{t('gold.subtitle')}</p>
        </div>
        <ScrollableTabs btnRow>
          <button className="btn btn-ghost btn-sm">📊 {t('gold.setAlert')}</button>
          <button className="btn btn-ghost btn-sm">📔 {t('gold.saveJournal')}</button>
          <button className="btn btn-ghost btn-sm">🤖 {t('gold.openMentor')}</button>
          <button className="btn btn-gold btn-sm">⚡ {t('gold.generatePlan')}</button>
        </ScrollableTabs>
      </div>

      {/* Warning Banner */}
      <div className="alert-box alert-warn">
        <IcoAlert size={16} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>{goldData.tradingWarning}</span>
      </div>

      {/* Main layout: Chart + Right panel */}
      <div className="g-aside" style={{ alignItems: 'start' }}>
        {/* Chart */}
        <div className="glass" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px 10px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Orbitron, monospace', color: 'var(--gold)' }}>
                ${goldData.price.toFixed(2)}
              </span>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 4,
                color: 'var(--green)', fontSize: 14, fontWeight: 600,
              }}>
                <IcoArrowUp size={14} />
                +${goldData.change.toFixed(2)} ({goldData.changePercent}%)
              </span>
              <span className="badge badge-bull">BULLISH</span>
              <span className="badge badge-demo mob-hide" style={{ marginLeft: 'auto' }}>{t('gold.demoNote').substring(0, 15)}...</span>
            </div>
          </div>
          <GoldChart height={500} interval="H4" />
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* AI Summary */}
          <div className="glass-gold p-4">
            <div className="section-label mb-2">🤖 {t('gold.aiSummary')}</div>
            <p style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.7 }}>{goldData.aiSummaryText}</p>
          </div>

          {/* Timeframe Trend */}
          <div className="glass p-4">
            <div className="section-label mb-1">{t('gold.timeframeTrend')}</div>
            <TFRow tf="Daily" trend={goldData.dailyTrend} detail="Strong bullish" />
            <TFRow tf="H4" trend={goldData.h4Trend} detail="Above key MA" />
            <TFRow tf="H1" trend={goldData.h1Trend} detail="Consolidating" />
            <TFRow tf="M15" trend={goldData.m15Trend} detail="Short term pullback" />
          </div>

          {/* Key Levels */}
          <div className="glass p-4">
            <div className="section-label mb-2">{t('gold.keyLevels')}</div>
            {[
              { label: t('gold.support'), value: `$${goldData.support.toLocaleString()}`, color: 'var(--green)', Icon: IcoShield },
              { label: t('gold.resistance'), value: `$${goldData.resistance.toLocaleString()}`, color: 'var(--red)', Icon: IcoTarget },
              { label: t('gold.liquidityAreas'), value: `$${goldData.liquidityZone.toLocaleString()}`, color: 'var(--amber)', Icon: IcoInfo },
              { label: t('gold.manipulationZone'), value: `$${goldData.manipulationZone.low}–${goldData.manipulationZone.high}`, color: 'var(--purple)', Icon: IcoAlert },
            ].map(({ label, value, color, Icon }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                marginBottom: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={13} color={color} />
                  <span style={{ fontSize: 11, color: 'var(--text-2)' }}>{label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color, fontFamily: 'Orbitron, monospace' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Market Influences */}
          <div className="glass p-4">
            <div className="section-label mb-2">{t('gold.influences')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{t('gold.dxy')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--red)', fontFamily: 'Orbitron, monospace' }}>104.23</span>
                  <span style={{ color: 'var(--red)', fontSize: 11 }}>-0.30%</span>
                  <span className="badge badge-bull" style={{ fontSize: 9 }}>↑ Gold</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{t('gold.us10y')}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)', fontFamily: 'Orbitron, monospace' }}>4.82%</span>
                  <span style={{ color: 'var(--red)', fontSize: 11 }}>+0.04%</span>
                  <span className="badge badge-bear" style={{ fontSize: 9 }}>↓ Gold</span>
                </div>
              </div>
              <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 4 }}>{t('gold.newsImpact')}</div>
                <p style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>CPI tomorrow at 14:30 UTC — major move expected. Prepare for 20–40 pip swings in either direction.</p>
              </div>
            </div>
          </div>

          {/* Volatility */}
          <div className="glass p-4">
            <div className="section-label mb-2">{t('gold.volatility')}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--amber)' }}>HIGH</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>ATR(14): {goldData.atr} pips</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {['L', 'M', 'H', 'H'].map((v, i) => (
                  <div key={i} style={{
                    width: 10, height: i < 3 ? 16 + i * 8 : 38,
                    borderRadius: 3,
                    background: i < 3 ? 'rgba(255,255,255,0.15)' : 'var(--amber)',
                  }} />
                ))}
              </div>
            </div>
            <div className="progress-track mt-2">
              <div className="progress-fill" style={{ width: '75%', background: 'linear-gradient(90deg, var(--green), var(--amber))' }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Daily Plan */}
      <div className="glass-gold p-5">
        <div className="flex items-center gap-2 mb-3">
          <IcoBolt size={16} color="var(--gold)" />
          <div className="section-label" style={{ marginBottom: 0 }}>{t('gold.aiDailyPlan')}</div>
          <span className="badge badge-demo mob-hide" style={{ fontSize: 9, marginLeft: 'auto' }}>{t('gold.demoNote').substring(0, 20)}...</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.8 }}>{goldData.aiDailyPlan}</p>
      </div>
    </div>
  )
}
