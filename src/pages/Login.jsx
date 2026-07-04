import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import ParticleBackground from '../components/ParticleBackground'

export default function Login() {
  const { t, lang, switchLang } = useLanguage()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #070b11 0%, #0d1420 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      <ParticleBackground />

      {/* Background glows */}
      <div style={{ position: 'absolute', top: '20%', left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '25%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,160,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute', top: 24, left: 24,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
          background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)',
          color: 'var(--gold)', cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.4)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.25)' }}
      >
        {t('common.back')}
      </button>

      {/* Language switcher */}
      <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', gap: 8 }}>
        {[['en', '🇬🇧', 'EN'], ['sr', '🇷🇸', 'SR']].map(([code, flag, label]) => (
          <button
            key={code}
            onClick={() => switchLang(code)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: lang === code ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${lang === code ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: lang === code ? 'var(--gold)' : 'var(--text-3)', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 16 }}>{flag}</span> {label}
          </button>
        ))}
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 420, margin: '0 20px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 22,
        padding: '40px 36px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(255,215,0,0.05)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontSize: 28, fontFamily: 'Orbitron, monospace', fontWeight: 900,
            background: 'linear-gradient(135deg, #D4AF37, #FFD700, #F5A623)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', letterSpacing: '0.1em',
            marginBottom: 4,
          }}>
            SEVORA
          </div>
          <div style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-3)' }}>AI Trading Platform</div>

          <div style={{ marginTop: 22 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', marginBottom: 4 }}>{t('login.title')}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{t('login.subtitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t('login.email')}</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="trader@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div className="flex items-center justify-between mb-1">
              <label className="form-label" style={{ marginBottom: 0 }}>{t('login.password')}</label>
              <button type="button" style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                {t('login.forgot')}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 14,
                }}
              >
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="btn btn-gold"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 14, marginTop: 6 }}
          >
            {t('login.signIn')} →
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{t('login.orContinue')}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* OAuth */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[['🔵', 'Google'], ['⬛', 'Apple']].map(([icon, name]) => (
            <button
              key={name}
              className="btn btn-ghost flex-1"
              style={{ justifyContent: 'center', fontSize: 13 }}
            >
              <span style={{ fontSize: 16 }}>{icon}</span> {name}
            </button>
          ))}
        </div>

        {/* Sign Up */}
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-3)' }}>
          {t('login.noAccount')}{' '}
          <button style={{ background: 'none', border: 'none', color: 'var(--gold)', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
            {t('login.signUp')}
          </button>
        </div>
      </div>
    </div>
  )
}
