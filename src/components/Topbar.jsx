import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useMarketStatus } from '../hooks/useMarketStatus'
import { useClock } from '../hooks/useClock'
import { IcoClock, IcoUser, IcoBell } from './Icons'

const FLAGS = { en: '🇬🇧', sr: '🇷🇸' }
const LANG_NAMES = { en: 'EN', sr: 'SR' }
const LANG_FULL = { en: 'English', sr: 'Serbian' }

export default function Topbar({ onMenuOpen }) {
  const { t, lang, switchLang } = useLanguage()
  const { isOpen, session, countdown, countdownLabel } = useMarketStatus()
  const { utc, dateStr } = useClock()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const sessionLabel = t(`topbar.sessions.${
    session === 'overlap' ? 'overlap' : session === 'london' ? 'london'
    : session === 'newYork' ? 'newYork' : session === 'asian' ? 'asian' : 'afterHours'
  }`)

  return (
    <header className="topbar">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuOpen}
        style={{
          display: 'none',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--text-2)', padding: '6px', borderRadius: 8,
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
        className="mob-hamburger"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Logo text — mobile only */}
      <span className="mob-logo-text" style={{
        display: 'none', fontFamily: "'Geist', 'Inter', sans-serif", fontWeight: 800,
        fontSize: 15, color: 'var(--gold)', letterSpacing: '0.04em',
      }}>SEVORA</span>

      {/* Clock — hidden on mobile */}
      <div className="topbar-clock-wrap">
        <IcoClock size={14} color="var(--text-3)" />
        <div>
          <div className="topbar-clock">
            {[...utc].map((ch, i) => (
              <span key={i} style={{ display: 'inline-block', width: '1ch', textAlign: 'center' }}>{ch}</span>
            ))}
          </div>
          <div className="topbar-date">{dateStr}</div>
        </div>
      </div>

      <div className="topbar-divider" />

      {/* Market Status */}
      <div className={`market-pill ${isOpen ? 'open' : 'closed'}`}>
        <div className={`market-dot ${isOpen ? 'open' : 'closed'}`} />
        {isOpen ? t('topbar.marketOpen') : t('topbar.marketClosed')}
      </div>

      {/* Session info — hidden on mobile */}
      <div className="topbar-session-info">
        {isOpen && (
          <>
            <div className="topbar-divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gold)' }}>{sessionLabel}</span>
              <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{t(`topbar.${countdownLabel}`)} {countdown}</span>
            </div>
          </>
        )}
        {!isOpen && (
          <>
            <div className="topbar-divider" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{t('topbar.lastCloseData')}</span>
              <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{t('topbar.opensIn')} {countdown}</span>
            </div>
          </>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Command palette trigger — hidden on mobile */}
      <button
        className="mob-hide"
        onClick={() => window.dispatchEvent(new CustomEvent('cp:open'))}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 10px 5px 9px', borderRadius: 8,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.6)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <span style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.01em' }}>{t('topbar.searchPlaceholder')}</span>
        <kbd style={{
          fontSize: 9, color: 'rgba(139,92,246,0.6)',
          background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)',
          borderRadius: 4, padding: '1px 6px', fontFamily: 'inherit', letterSpacing: '0.04em',
        }}>Ctrl K</kbd>
      </button>

      <div className="topbar-divider" />

      {/* Notifications — hidden on mobile */}
      <button className="mob-hide" style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--text-3)', padding: '6px', borderRadius: 8,
        display: 'flex', alignItems: 'center', transition: 'color 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-1)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
      >
        <IcoBell size={18} />
      </button>

      <div className="topbar-divider" />

      {/* Language Switcher — hidden on mobile (use drawer instead) */}
      <div ref={langRef} className="mob-hide" style={{ position: 'relative' }}>
        <button className="lang-btn" onClick={() => setLangOpen(v => !v)}>
          <span style={{ fontSize: 16 }}>{FLAGS[lang]}</span>
          <span className="lang-name-full">{LANG_FULL[lang]}</span>
          <span className="lang-name-short" style={{ display: 'none' }}>{LANG_NAMES[lang]}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        {langOpen && (
          <div className="lang-dropdown">
            {Object.entries(LANG_FULL).map(([code, name]) => (
              <button
                key={code}
                className={`lang-option ${lang === code ? 'selected' : ''}`}
                onClick={() => { switchLang(code); setLangOpen(false) }}
              >
                <span style={{ fontSize: 18 }}>{FLAGS[code]}</span>
                <span>{name}</span>
                {lang === code && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 'auto', color: 'var(--gold)' }}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="topbar-divider" />

      {/* User avatar */}
      <div onClick={() => navigate('/login')} style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
      }}>
        <IcoUser size={16} color="#ffffff" />
      </div>
    </header>
  )
}
