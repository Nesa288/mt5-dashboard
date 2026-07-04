import { useState, useEffect } from 'react'

function getMarketInfo() {
  const now = new Date()
  const dayUTC = now.getUTCDay() // 0=Sun, 1=Mon,...,5=Fri,6=Sat
  const hourUTC = now.getUTCHours()
  const minUTC = now.getUTCMinutes()
  const secUTC = now.getUTCSeconds()
  const totalMinUTC = hourUTC * 60 + minUTC

  // Gold (XAUUSD) is open Mon 00:00 UTC – Fri 22:00 UTC (closed weekends + Fri 22:00-Mon 00:00)
  const isWeekend = dayUTC === 0 || dayUTC === 6 || (dayUTC === 5 && hourUTC >= 22)
  const isOpen = !isWeekend

  // Determine active session (UTC times)
  // Asian: 23:00-08:00 UTC (crosses midnight)
  // London: 08:00-17:00 UTC
  // New York: 13:00-22:00 UTC
  // Overlap: 13:00-17:00 UTC

  let session = 'afterHours'
  if (isOpen) {
    if (totalMinUTC >= 13 * 60 && totalMinUTC < 17 * 60) {
      session = 'overlap'
    } else if (totalMinUTC >= 8 * 60 && totalMinUTC < 17 * 60) {
      session = 'london'
    } else if (totalMinUTC >= 13 * 60 && totalMinUTC < 22 * 60) {
      session = 'newYork'
    } else if (totalMinUTC >= 23 * 60 || totalMinUTC < 8 * 60) {
      session = 'asian'
    }
  }

  // Compute countdown
  let countdownMs = 0
  let countdownLabel = ''

  if (!isOpen) {
    // Find next open: next Monday 00:00 UTC
    const msInDay = 86400000
    let daysUntilMon = (8 - dayUTC) % 7
    if (daysUntilMon === 0 && (hourUTC > 0 || minUTC > 0)) daysUntilMon = 7
    if (dayUTC === 1 && hourUTC === 0 && minUTC === 0) daysUntilMon = 0
    // For Friday after 22:00 and weekends
    if (dayUTC === 5 && hourUTC >= 22) {
      daysUntilMon = 3
    } else if (dayUTC === 6) {
      daysUntilMon = 2
    } else if (dayUTC === 0) {
      daysUntilMon = 1
    }
    const nextOpen = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilMon, 23, 0, 0))
    countdownMs = nextOpen - now
    countdownLabel = 'opensIn'
  } else {
    // Time until session ends or market closes
    let closeHour = 22
    let closeMin = 0
    // If Friday, market closes at 22:00
    // Otherwise session-based
    if (session === 'london' && !(totalMinUTC >= 13 * 60)) {
      closeHour = 17
    } else if (session === 'overlap') {
      closeHour = 17
    } else if (session === 'newYork') {
      closeHour = 22
    } else if (session === 'asian') {
      closeHour = 8
    }
    let closeTotal = closeHour * 60 + closeMin
    let diff = closeTotal - totalMinUTC
    if (diff < 0) diff += 24 * 60
    countdownMs = diff * 60000 - secUTC * 1000
    countdownLabel = 'closesIn'
  }

  const h = Math.floor(countdownMs / 3600000)
  const m = Math.floor((countdownMs % 3600000) / 60000)
  const s = Math.floor((countdownMs % 60000) / 1000)
  const countdown = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return { isOpen, session, countdown, countdownLabel }
}

export function useMarketStatus() {
  const [status, setStatus] = useState(getMarketInfo)

  useEffect(() => {
    const id = setInterval(() => setStatus(getMarketInfo()), 1000)
    return () => clearInterval(id)
  }, [])

  return status
}
