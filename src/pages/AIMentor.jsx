import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'

const SUGGESTED = [
  { icon: '📈', text: 'Why is Gold going up?' },
  { icon: '🔍', text: "Explain today's trend" },
  { icon: '🎯', text: 'Show key levels' },
  { icon: '🚫', text: 'What should I avoid today?' },
  { icon: '📔', text: 'Analyze my journal' },
]

const RESPONSES = {
  "Why is Gold going up?": {
    trend: 'Bullish', confidence: 83,
    keyLevels: [3395, 3382, 3370],
    news: [{ name: 'CPI', time: '14:30', risk: 'High' }],
    conclusion: 'Gold is rising on DXY weakness and falling real yields. Safe haven demand is elevated. Structure remains bullish above 3,378.',
  },
  "Explain today's trend": {
    trend: 'Bullish', confidence: 78,
    keyLevels: [3395, 3378, 3355],
    news: [{ name: 'FOMC Min.', time: '19:00', risk: 'Medium' }],
    conclusion: 'Daily trend is bullish. H4 shows a continuation pattern with higher highs. Wait for a pullback to 3,378 for an optimal entry.',
  },
  'Show key levels': {
    trend: 'Bullish', confidence: 91,
    keyLevels: [3402, 3395, 3382, 3370, 3355],
    news: [{ name: 'CPI', time: '14:30', risk: 'High' }, { name: 'Fed Speak', time: '16:00', risk: 'Medium' }],
    conclusion: 'Resistance at 3,395 and 3,402. Strong support at 3,370. Liquidity pool above 3,395 is the primary target.',
  },
  'What should I avoid today?': {
    trend: 'Neutral', confidence: 62,
    keyLevels: [3395, 3370],
    news: [{ name: 'CPI', time: '14:30', risk: 'High' }],
    conclusion: 'Avoid entering 30 min before CPI. Do not hold large positions through the release. Avoid shorts until price breaks below 3,370.',
  },
  'Analyze my journal': {
    trend: 'Neutral', confidence: 70,
    keyLevels: [3382, 3370],
    news: [{ name: 'CPI', time: '14:30', risk: 'High' }],
    conclusion: 'Your recent trades show overtrading during news. Average hold time is too short. Focus on H4 setups and reduce frequency.',
  },
}

const DEFAULT_RESPONSE = {
  trend: 'Bullish', confidence: 76,
  keyLevels: [3395, 3382, 3370],
  news: [{ name: 'CPI', time: '14:30', risk: 'High' }],
  conclusion: 'Wait for CPI before entering. Current setup has elevated volatility. Reduce position size to 50%.',
}

const RISK_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#34d399' }

function CopilotCard({ data }) {
  const trendColor = data.trend === 'Bullish' ? '#34d399' : data.trend === 'Bearish' ? '#ef4444' : '#94a3b8'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(139,92,246,0.18)',
      borderRadius: 12,
      overflow: 'hidden',
      minWidth: 0,
    }}>
      {/* Card header */}
      <div style={{
        padding: '10px 14px',
        background: 'rgba(139,92,246,0.06)',
        borderBottom: '1px solid rgba(139,92,246,0.12)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'dotPulse 1.5s ease infinite', flexShrink: 0 }} />
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
          Market Context
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--text-3)' }}>SEVORA AI</span>
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Trend + Confidence */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: '1 1 50%',
            background: 'rgba(255,255,255,0.03)', borderRadius: 8,
            padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>Trend</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 10px', borderRadius: 20,
              background: `${trendColor}14`, border: `1px solid ${trendColor}30`,
              color: trendColor, fontSize: 12, fontWeight: 700,
            }}>
              {data.trend === 'Bullish' ? '↑' : data.trend === 'Bearish' ? '↓' : '→'} {data.trend}
            </div>
          </div>

          <div style={{
            flex: '1 1 50%',
            background: 'rgba(255,255,255,0.03)', borderRadius: 8,
            padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>Confidence</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${data.confidence}%`,
                  background: `linear-gradient(to right, ${trendColor}80, ${trendColor})`,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: trendColor, fontFamily: 'Orbitron, monospace', minWidth: 32 }}>{data.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Key Levels */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', borderRadius: 8,
          padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>Key Levels</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.keyLevels.map((lvl, i) => (
              <span key={i} style={{
                fontSize: 12, fontWeight: 700, fontFamily: 'Orbitron, monospace',
                padding: '3px 10px', borderRadius: 6,
                background: i === 0 ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${i === 0 ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: i === 0 ? 'var(--gold)' : 'var(--text-2)',
              }}>
                {lvl.toLocaleString()}
              </span>
            ))}
          </div>
        </div>

        {/* Important News */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', borderRadius: 8,
          padding: '9px 12px', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>Important News</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {data.news.map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-1)', minWidth: 70 }}>{n.name}</span>
                <span style={{ fontSize: 11, fontFamily: 'Orbitron, monospace', color: 'var(--text-3)' }}>{n.time}</span>
                <span style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '2px 7px', borderRadius: 4,
                  background: `${RISK_COLORS[n.risk]}18`,
                  color: RISK_COLORS[n.risk],
                  border: `1px solid ${RISK_COLORS[n.risk]}30`,
                }}>
                  Risk: {n.risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div style={{
          background: 'rgba(139,92,246,0.05)', borderRadius: 8,
          padding: '10px 12px', borderLeft: '3px solid rgba(139,92,246,0.4)',
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Conclusion</div>
          <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>{data.conclusion}</p>
        </div>
      </div>
    </div>
  )
}

function UserBubble({ text }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end', marginBottom: 16 }}>
      <div style={{
        maxWidth: '70%',
        background: 'rgba(139,92,246,0.12)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '14px 4px 14px 14px',
        padding: '10px 14px',
        fontSize: 13, color: 'var(--text-1)', lineHeight: 1.6,
      }}>
        {text}
      </div>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
      }}>👤</div>
    </div>
  )
}

function BotMessage({ msg }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
      }}>🤖</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {msg.data ? <CopilotCard data={msg.data} /> : (
          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
            borderRadius: '4px 14px 14px 14px', padding: '10px 14px',
            fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6,
          }}>{msg.text}</div>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px', display: 'flex', gap: 5, alignItems: 'center' }}>
        {[0, 150, 300].map(d => (
          <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-3)', animation: 'dotPulse 1.2s ease infinite', animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  )
}

export default function AIMentor() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', data: DEFAULT_RESPONSE },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  async function send(text) {
    if (!text.trim() || isTyping) return
    setMessages(p => [...p, { id: Date.now(), type: 'user', text }])
    setInput('')
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1100 + Math.random() * 600))
    const data = RESPONSES[text] || DEFAULT_RESPONSE
    setIsTyping(false)
    setMessages(p => [...p, { id: Date.now() + 1, type: 'bot', data }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 className="page-title">Trading Copilot</h1>
          <p className="page-subtitle">AI-powered analysis. Ask anything about the market.</p>
        </div>
        <span className="badge badge-demo">AI Response is DEMO</span>
      </div>

      {/* Main 2-column layout — chat left, panel right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, alignItems: 'start' }}>

        {/* LEFT: Chat */}
        <div className="glass" style={{ display: 'flex', flexDirection: 'column', height: 640 }}>
          {/* Chat header */}
          <div style={{
            padding: '12px 18px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
              flexShrink: 0,
            }}>🤖</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>SEVORA Trading Copilot</div>
              <div style={{ fontSize: 10, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', animation: 'dotPulse 1.5s ease infinite' }} />
                Online · Analyzing markets
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 16px 8px' }}>
            {messages.map(msg =>
              msg.type === 'user'
                ? <UserBubble key={msg.id} text={msg.text} />
                : <BotMessage key={msg.id} msg={msg} />
            )}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              className="form-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask about Gold, trends, levels, risk..."
              style={{ flex: 1, fontSize: 13 }}
            />
            <button
              className="btn btn-gold"
              onClick={() => send(input)}
              disabled={!input.trim() || isTyping}
              style={{ padding: '0 18px', fontSize: 13 }}
            >
              ↑
            </button>
          </div>
        </div>

        {/* RIGHT: Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 20 }}>

          {/* Suggested Questions */}
          <div className="glass p-4">
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
              Suggested Questions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SUGGESTED.map((q, i) => (
                <button
                  key={i}
                  onClick={() => send(q.text)}
                  disabled={isTyping}
                  style={{
                    padding: '9px 12px', borderRadius: 8, textAlign: 'left',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                    color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all 0.18s',
                    opacity: isTyping ? 0.5 : 1,
                  }}
                  onMouseEnter={e => { if (!isTyping) { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'; e.currentTarget.style.color = 'var(--text-1)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
                >
                  <span style={{ fontSize: 14 }}>{q.icon}</span>
                  {q.text}
                </button>
              ))}
            </div>
          </div>

          {/* Live Market Snapshot */}
          <div className="glass p-4">
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
              Market Snapshot
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Gold', value: '3,382.40', change: '+0.62%', up: true },
                { label: 'DXY', value: '104.18', change: '-0.31%', up: false },
                { label: 'US10Y', value: '4.21%', change: '-0.04%', up: false },
                { label: 'VIX', value: '18.42', change: '+1.2%', up: true },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'Orbitron, monospace', color: 'var(--text-1)' }}>{row.value}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: row.up ? 'var(--green)' : 'var(--red)' }}>{row.change}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
