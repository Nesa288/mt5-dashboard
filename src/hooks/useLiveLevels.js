import { useLiveMarket } from '../context/LiveMarketContext'
import { useLanguage } from '../context/LanguageContext'

export function useLiveLevels() {
  const { market, status } = useLiveMarket()
  const { t } = useLanguage()
  const liveG   = market?.gold
  const liveDXY = market?.dxy

  const price     = liveG?.price
  const high      = liveG?.high
  const low       = liveG?.low
  const change    = liveG?.change
  const changePct = liveG?.changePct

  // No live data yet — return null for all price-derived values so components
  // display '—' instead of stale mock numbers.
  if (!price) {
    return {
      price: null, high: null, low: null, change: null, changePct: null,
      dayRange: null, status,
      resistance: null, support: null, target: null, invalidation: null,
      liquidityZone: null, asianHigh: null, asianLow: null,
      manipHigh: null, manipLow: null,
      bias: 'NEUTRAL', biasColor: '#f59e0b', confidence: 50,
      trendStatus: 'Neutral', dxyFalling: false,
      aiDailyPlan: null, liveDXY,
    }
  }

  const dayRange = Math.max(high - low, 20)

  const resistance    = Math.ceil((Math.max(high, price) + 3) / 25) * 25
  const support       = Math.floor((Math.min(low, price) - 3) / 25) * 25
  const target        = Math.round((resistance + dayRange * 0.5) / 5) * 5
  const invalidation  = Math.round((support - dayRange * 0.25) / 5) * 5
  const liquidityZone = Math.round((price + resistance) / 2 / 5) * 5
  const manipHigh     = Math.round((support + (resistance - support) * 0.72) / 5) * 5
  const manipLow      = Math.round((support + (resistance - support) * 0.28) / 5) * 5

  const dxyFalling  = (liveDXY?.changePct ?? 0) < 0
  const bias        = changePct > 0.15 ? 'BULLISH' : changePct < -0.15 ? 'BEARISH' : 'NEUTRAL'
  const biasColor   = bias === 'BULLISH' ? '#34d399' : bias === 'BEARISH' ? '#ef4444' : '#f59e0b'
  const trendStatus = bias === 'BULLISH' ? 'Bullish' : bias === 'BEARISH' ? 'Bearish' : 'Neutral'

  let conf = 62
  if (price > (support + resistance) / 2) conf += 8
  if (dxyFalling)                          conf += 7
  if (changePct > 0.3)                     conf += 5
  if (changePct < -0.3)                    conf -= 10
  if (price >= resistance - dayRange * 0.12) conf += 5
  const confidence = Math.max(25, Math.min(92, Math.round(conf)))

  const e1 = Math.round((support + dayRange * 0.2) / 5) * 5
  const aiDailyPlan = bias === 'BULLISH'
    ? t('gold.aiPlanBull')
      .replace('{e1}', `$${e1.toLocaleString()}`)
      .replace('{support}', `$${support.toFixed(0)}`)
      .replace('{resistance}', `$${resistance.toFixed(0)}`)
      .replace('{target}', `$${target.toFixed(0)}`)
      .replace('{invalidation}', `$${invalidation.toFixed(0)}`)
    : bias === 'BEARISH'
    ? t('gold.aiPlanBear')
      .replace('{resistance}', `$${resistance.toFixed(0)}`)
      .replace('{support}', `$${support.toFixed(0)}`)
      .replace('{stopLevel}', `$${Math.round((resistance + dayRange * 0.2) / 5) * 5}`)
    : t('gold.aiPlanNeutral')
      .replace('{price}', `$${Math.round(price).toLocaleString()}`)
      .replace('{support}', `$${support.toFixed(0)}`)
      .replace('{resistance}', `$${resistance.toFixed(0)}`)

  return {
    price, high, low, change, changePct, dayRange, status,
    resistance, support, target, invalidation, liquidityZone,
    asianHigh: high, asianLow: low,
    manipHigh, manipLow,
    bias, biasColor, confidence, trendStatus, dxyFalling,
    aiDailyPlan, liveDXY,
  }
}
