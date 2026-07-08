import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const COMMANDS = [
  { id: 'dashboard',   icon: '📊', label: 'Dashboard',          desc: 'Market overview & AI daily brief',          path: '/dashboard',     tags: ['home', 'overview', 'market', 'summary'],                         cat: 'Page' },
  { id: 'gold',        icon: '🥇', label: 'Gold',               desc: 'XAUUSD price, key levels & AI plan',        path: '/gold',          tags: ['xauusd', 'gold', 'price', 'chart', 'xau'],                       cat: 'Page' },
  { id: 'markets',     icon: '🌍', label: 'Markets',            desc: 'Forex, crypto, indices & commodities',      path: '/markets',       tags: ['btc', 'bitcoin', 'dxy', 'silver', 'forex', 'crypto', 'nasdaq', 'spx', 'oil', 'instruments', 'eth', 'ethereum'], cat: 'Page' },
  { id: 'calendar',    icon: '📅', label: 'Economic Calendar',  desc: 'CPI, FOMC, NFP events with AI notes',       path: '/calendar',      tags: ['cpi', 'fomc', 'nfp', 'events', 'economic', 'calendar', 'fed'],   cat: 'Page' },
  { id: 'news',        icon: '📰', label: 'News',               desc: 'Market headlines with AI sentiment',        path: '/news',          tags: ['news', 'headlines', 'fed', 'sentiment', 'articles'],              cat: 'Page' },
  { id: 'scenarios',   icon: '📈', label: 'Trading Scenarios',  desc: 'Bullish & bearish trade setups',            path: '/scenarios',     tags: ['scenarios', 'setup', 'trade', 'bullish', 'bearish', 'long', 'short', 'plan'], cat: 'Page' },
  { id: 'journal',     icon: '📔', label: 'Journal',            desc: 'Trade log, analytics & performance',        path: '/journal',       tags: ['journal', 'trades', 'log', 'history', 'performance', 'pnl', 'winrate', 'analytics'], cat: 'Page' },
  { id: 'ai-mentor',   icon: '🤖', label: 'AI Mentor',          desc: 'Trading Copilot — ask anything',           path: '/ai-mentor',     tags: ['ai', 'mentor', 'copilot', 'chat', 'ask', 'analysis', 'intelligence'], cat: 'Page' },
  { id: 'academy',     icon: '🎓', label: 'Academy',            desc: 'Trading courses & education',               path: '/academy',       tags: ['academy', 'learn', 'course', 'education', 'lessons', 'tutorial'],  cat: 'Page' },
  { id: 'bots',        icon: '⚙️',  label: 'Bot Dashboard',      desc: 'Automated bots, signals & P&L',            path: '/bot-dashboard', tags: ['bot', 'bots', 'signals', 'auto', 'automate', 'robot', 'ea'],      cat: 'Page' },
  { id: 'affiliate',   icon: '🤝', label: 'Affiliate',          desc: 'Referral program & earnings',               path: '/affiliate',     tags: ['affiliate', 'referral', 'earn', 'commission', 'invite', 'rewards'], cat: 'Page' },
  { id: 'marketplace', icon: '🛒', label: 'Marketplace',        desc: 'Indicators, tools & templates',             path: '/marketplace',   tags: ['marketplace', 'shop', 'buy', 'indicator', 'tool', 'template', 'plugin'], cat: 'Page' },
  { id: 'premium',     icon: '⭐', label: 'Premium',            desc: 'Upgrade plan — Pro & Elite',               path: '/premium',       tags: ['premium', 'pro', 'elite', 'upgrade', 'plan', 'subscription', 'pricing', 'price'], cat: 'Page' },
]

function score(cmd, q) {
  if (!q) return 1
  const s = q.toLowerCase().trim()
  if (cmd.label.toLowerCase().startsWith(s)) return 3
  if (cmd.id.toLowerCase().startsWith(s)) return 2
  if (cmd.label.toLowerCase().includes(s)) return 2
  if (cmd.desc.toLowerCase().includes(s)) return 1.5
  if (cmd.tags.some(t => t.startsWith(s))) return 1.5
  if (cmd.tags.some(t => t.includes(s))) return 1
  return 0
}

export default function CommandPalette() {
  const [open, setOpen]       = useState(false)
  const [query, setQuery]     = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const listRef  = useRef(null)
  const navigate = useNavigate()

  const results = COMMANDS
    .map(c => ({ ...c, _score: score(c, query) }))
    .filter(c => c._score > 0)
    .sort((a, b) => b._score - a._score)

  const sel = Math.min(selected, Math.max(0, results.length - 1))

  const close = useCallback(() => setOpen(false), [])

  const run = useCallback((cmd) => {
    navigate(cmd.path)
    close()
  }, [navigate, close])

  // Ctrl+K / Cmd+K global shortcut + cp:open custom event from topbar button
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => {
          if (!prev) { setQuery(''); setSelected(0) }
          return !prev
        })
      }
    }
    const onOpen = () => { setQuery(''); setSelected(0); setOpen(true) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('cp:open', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('cp:open', onOpen)
    }
  }, [])

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 20)
  }, [open])

  // Keyboard navigation inside palette
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); setSelected(s => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      if (results[sel]) run(results[sel])
    } else if (e.key === 'Escape') {
      close()
    }
  }

  // Scroll active item into view
  useEffect(() => {
    listRef.current?.children[sel]?.scrollIntoView({ block: 'nearest' })
  }, [sel])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(5,4,15,0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '16vh',
        animation: 'cp-bg 0.15s ease both',
      }}
      onClick={close}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 560, margin: '0 16px',
          background: '#0e0e1c',
          border: '1px solid rgba(139,92,246,0.35)',
          borderRadius: 16,
          boxShadow: '0 32px 96px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.1), 0 0 60px rgba(109,40,217,0.12)',
          overflow: 'hidden',
          animation: 'cp-in 0.16s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        {/* Search input row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '13px 16px',
          borderBottom: results.length > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="rgba(139,92,246,0.65)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0) }}
            onKeyDown={onKeyDown}
            placeholder="Search pages, features, instruments..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 15, color: 'var(--text-1)', fontFamily: 'inherit',
              caretColor: 'var(--gold)', lineHeight: 1.4,
            }}
          />
          <kbd style={{
            fontSize: 10, color: 'rgba(139,92,246,0.55)',
            background: 'rgba(139,92,246,0.06)',
            border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: 5, padding: '2px 7px', fontFamily: 'inherit',
            letterSpacing: '0.03em', flexShrink: 0,
          }}>ESC</kbd>
        </div>

        {/* Results list */}
        {results.length > 0 && (
          <div
            ref={listRef}
            style={{ maxHeight: 352, overflowY: 'auto', padding: '5px 6px 6px' }}
          >
            {results.map((cmd, i) => {
              const active = i === sel
              return (
                <div
                  key={cmd.id}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => run(cmd)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '9px 11px', borderRadius: 9,
                    cursor: 'pointer', userSelect: 'none',
                    background: active ? 'rgba(139,92,246,0.1)' : 'transparent',
                    border: `1px solid ${active ? 'rgba(139,92,246,0.22)' : 'transparent'}`,
                    transition: 'background 0.08s, border-color 0.08s',
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: active ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, transition: 'all 0.08s',
                  }}>
                    {cmd.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: active ? 'var(--text-1)' : 'var(--text-1)',
                      marginBottom: 1,
                    }}>
                      {cmd.label}
                    </div>
                    <div style={{
                      fontSize: 11, color: 'var(--text-3)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {cmd.desc}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: 'var(--text-3)',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 4, padding: '2px 7px',
                    }}>{cmd.cat}</span>
                    {active && (
                      <kbd style={{
                        fontSize: 11, color: 'var(--gold)',
                        background: 'rgba(139,92,246,0.08)',
                        border: '1px solid rgba(139,92,246,0.2)',
                        borderRadius: 5, padding: '2px 7px', fontFamily: 'inherit',
                      }}>↵</kbd>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {query && results.length === 0 && (
          <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
            No results for <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>"{query}"</span>
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '7px 14px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 14,
          fontSize: 10, color: 'rgba(255,255,255,0.25)',
        }}>
          {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([key, label]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <kbd style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3, padding: '1px 5px', fontFamily: 'inherit', fontSize: 10,
                color: 'rgba(255,255,255,0.35)',
              }}>{key}</kbd>
              {label}
            </span>
          ))}
          <span style={{ marginLeft: 'auto', opacity: 0.7 }}>Ctrl+K</span>
        </div>
      </div>

      <style>{`
        @keyframes cp-bg {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes cp-in {
          from { opacity: 0; transform: scale(0.97) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
