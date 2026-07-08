import { useEffect, useState } from 'react'

export default function SplashScreen({ onComplete }) {
  const [exiting, setExiting] = useState(false)
  const userName = localStorage.getItem('sevora_user_name') || 'Trader'

  useEffect(() => {
    // Total fill animation: 1s delay + 2s fill = 3s. Then exit.
    const exit = setTimeout(() => setExiting(true), 3200)
    return () => clearTimeout(exit)
  }, [])

  useEffect(() => {
    if (!exiting) return
    const done = setTimeout(onComplete, 700)
    return () => clearTimeout(done)
  }, [exiting, onComplete])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05040f',
      opacity: exiting ? 0 : 1,
      transition: 'opacity 0.7s ease',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <img
        src={`${import.meta.env.BASE_URL}splash-bg.png`}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      />

      {/* Dark gradient overlay so text is readable */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(5,4,15,0.2) 0%, rgba(5,4,15,0.75) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>

        {/* Welcome back */}
        <p style={{
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(167,139,250,0.8)',
          marginBottom: 10,
          animation: 'spl-up 0.7s ease 0.2s both',
        }}>
          Welcome back
        </p>

        {/* User name */}
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 64px)',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.02em',
          marginBottom: 52,
          animation: 'spl-up 0.7s ease 0.4s both',
        }}>
          {userName}
        </h1>

        {/* SEVORA logo with left-to-right fill */}
        <div style={{ position: 'relative', display: 'inline-block', animation: 'spl-up 0.5s ease 0.7s both' }}>
          {/* Dim outline layer — always visible */}
          <span style={{
            fontSize: 'clamp(36px, 5.5vw, 68px)',
            fontWeight: 900,
            letterSpacing: '0.18em',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(139,92,246,0.25)',
            display: 'block',
            userSelect: 'none',
          }}>
            SEVORA
          </span>

          {/* Fill layer — clips from left to right */}
          <span style={{
            position: 'absolute',
            top: 0,
            left: 0,
            overflow: 'hidden',
            display: 'block',
            whiteSpace: 'nowrap',
            animation: 'spl-fill 2s cubic-bezier(0.4,0,0.2,1) 1s both',
          }}>
            <span style={{
              fontSize: 'clamp(36px, 5.5vw, 68px)',
              fontWeight: 900,
              letterSpacing: '0.18em',
              background: 'linear-gradient(to right, #c4b5fd 0%, #7c3aed 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
              userSelect: 'none',
            }}>
              SEVORA
            </span>
          </span>
        </div>

        {/* Thin progress bar beneath logo */}
        <div style={{
          marginTop: 16,
          width: 'clamp(200px, 30vw, 360px)',
          height: 2,
          background: 'rgba(139,92,246,0.15)',
          borderRadius: 2,
          overflow: 'hidden',
          animation: 'spl-up 0.4s ease 0.9s both',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(to right, #7c3aed, #c4b5fd)',
            borderRadius: 2,
            animation: 'spl-fill 2s cubic-bezier(0.4,0,0.2,1) 1s both',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes spl-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spl-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  )
}
