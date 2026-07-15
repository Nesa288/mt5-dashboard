import { useLiveMarket } from '../context/LiveMarketContext'
import { goldData } from '../data/mockData'

export function useLiveLevels() {
  const { market, status } = useLiveMarket()
  const liveG   = market?.gold
  const liveDXY = market?.dxy

  const price     = liveG?.price     ?? goldData.price
  const high      = liveG?.high      ?? goldData.high
  const low       = liveG?.low       ?? goldData.low
  const change    = liveG?.change    ?? goldData.change
  const changePct = liveG?.changePct ?? goldData.changePercent

  const dayRange = Math.max(high - low, 20)

  const resistance    = Math.ceil((Math.max(high, price) + 3) / 25) * 25
  const support       = Math.floor((Math.min(low, price) - 3) / 25) * 25
  const target        = Math.round((resistance + dayRange * 0.5) / 5) * 5
  const invalidation  = Math.round((support - dayRange * 0.25) / 5) * 5
  const liquidityZone = Math.round((price + resistance) / 2 / 5) * 5
  const manipHigh     = Math.round((support + (resistance - support) * 0.72) / 5) * 5
  const manipLow      = Math.round((support + (resistance - support) * 0.28) / 5) * 5

  const dxyFalling  = (liveDXY?.changePct ?? -0.1) < 0
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
    ? `Look for longs on pullbacks to $${e1}–$${support.toFixed(0)}. First target: $${resistance.toFixed(0)}. Extended: $${target.toFixed(0)}. Stop below $${invalidation.toFixed(0)}. Avoid 30 min before major news. Keep risk at 1%.`
    : bias === 'BEARISH'
    ? `Watch for rejections near $${resistance.toFixed(0)}. Short entries targeting $${support.toFixed(0)}. Stop above $${Math.round((resistance + dayRange * 0.2) / 5) * 5}. Reduce size ahead of data releases. Keep risk at 1%.`
    : `Range-bound near $${Math.round(price)}. Wait for a clear break of $${support.toFixed(0)} or $${resistance.toFixed(0)} before committing. Avoid trading the middle of the range. Keep risk below 0.5%.`

  return {
    price, high, low, change, changePct, dayRange, status,
    resistance, support, target, invalidation, liquidityZone,
    asianHigh: high, asianLow: low,
    manipHigh, manipLow,
    bias, biasColor, confidence, trendStatus, dxyFalling,
    aiDailyPlan, liveDXY,
  }
}
