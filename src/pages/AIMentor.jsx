import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import ScrollableTabs from '../components/ScrollableTabs'

const MOCK_RESPONSES = {
  default: {
    context: 'Gold is trading near $3,248, consolidating above the key $3,235 support zone. DXY is weakening slightly at 104.23, which is supportive for gold.',
    trend: 'Bullish on all major timeframes. Daily, H4, and H1 trends all point upward. The overall market structure is making higher highs and higher lows.',
    keyLevels: 'Key support: $3,218 and $3,235. Key resistance: $3,265 and $3,285. Liquidity sits at $3,250 — watch for potential manipulation before the real move.',
    risk: 'CPI release tomorrow at 14:30 UTC. Significant volatility expected. Reduce position size to 50% of normal and avoid holding through the news unless your risk management is tight.',
    simple: 'Gold is in a strong uptrend. Buy the dip near $3,235, target $3,265. Do NOT trade during CPI tomorrow without a plan.',
  }
}

function ChatMessage({ msg, isBot }) {
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      justifyContent: isBot ? 'flex-start' : 'flex-end',
      marginBottom: 16,
    }}>
      {isBot && (
        <div style={{
          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: '75%',
        background: isBot ? 'rgba(255,255,255,0.05)' : 'rgba(255,215,0,0.12)',
        border: `1px solid ${isBot ? 'var(--border)' : 'var(--gold-border)'}`,
        borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        padding: '12px 16px',
      }}>
        {isBot && msg.sections ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(msg.sections).map(([key, val]) => {
              const labels = { context: '📊 Market Context', trend: '📈 Trend', keyLevels: '🎯 Key Levels', risk: '⚠️ Risk Warning', simple: '💡 Simple Explanation' }
              const colors = { context: 'var(--blue)', trend: 'var(--green)', keyLevels: 'var(--gold)', risk: 'var(--red)', simple: 'var(--text-1)' }
              return (
                <div key={key}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: colors[key], marginBottom: 4 }}>{labels[key]}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65 }}>{val}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: isBot ? 'var(--text-2)' : 'var(--text-1)', lineHeight: 1.6 }}>{msg.text}</p>
        )}
      </div>
      {!isBot && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
        }}>👤</div>
      )}
    </div>
  )
}

export default function AIMentor() {
  const { t } = useLanguage()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1, isBot: true,
      sections: MOCK_RESPONSES.default,
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now(), isBot: false, text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    await new Promise(r => setTimeout(r, 1200))

    const botMsg = {
      id: Date.now() + 1,
      isBot: true,
      sections: MOCK_RESPONSES.default,
    }
    setIsTyping(false)
    setMessages(prev => [...prev, botMsg])
  }

  const questions = t('aiMentor.questions')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="page-title">{t('aiMentor.title')}</h1>
        <p className="page-subtitle">{t('aiMentor.subtitle')}</p>
      </div>

      <div className="g-aside" style={{ alignItems: 'start' }}>
        {/* Chat Area */}
        <div className="glass" style={{ display: 'flex', flexDirection: 'column', height: 600 }}>
          {/* Header */}
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>🤖</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>SEVORA AI Mentor</div>
              <div style={{ fontSize: 11, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'dotPulse 1.5s ease infinite' }} />
                Online • Trading Intelligence
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }} className="mob-hide">
              <span className="badge badge-demo">AI Response is DEMO</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px' }}>
            {messages.map(msg => <ChatMessage key={msg.id} msg={msg} isBot={msg.isBot} />)}
            {isTyping && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #FFD700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '4px 14px 14px 14px', padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {[0, 150, 300].map(d => (
                      <div key={d} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-3)', animation: `dotPulse 1.2s ease infinite`, animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Topic Quick Buttons */}
          <div style={{ padding: '8px 20px', borderTop: '1px solid var(--border)' }}>
            <ScrollableTabs btnRow>
              {Object.entries({ gold: 'Ask about Gold', news: 'Ask about News', risk: 'Ask about Risk', journal: 'Ask about Journal' }).map(([key, label]) => (
                <button key={key} className="btn btn-ghost btn-xs" onClick={() => sendMessage(label)}>
                  {key === 'gold' ? '🏅' : key === 'news' ? '📰' : key === 'risk' ? '⚠️' : '📔'} {t(`aiMentor.topics.${key}`)}
                </button>
              ))}
            </ScrollableTabs>
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
            <input
              ref={inputRef}
              className="form-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
              placeholder={t('aiMentor.placeholder')}
              style={{ flex: 1 }}
            />
            <button className="btn btn-gold" onClick={() => sendMessage(input)} disabled={!input.trim()}>
              {t('aiMentor.send')} ↑
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 20 }}>
          {/* Suggested Questions */}
          <div className="glass p-4">
            <div className="section-label mb-3">{t('aiMentor.suggestedQuestions')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(Array.isArray(questions) ? questions : []).map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: '10px 12px', borderRadius: 8, textAlign: 'left',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                    color: 'var(--text-2)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,0.2)'; e.currentTarget.style.color = 'var(--text-1)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
