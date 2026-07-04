import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { pricingPlans } from '../data/mockData'
import { IcoCheck, IcoX } from '../components/Icons'

export default function Premium() {
  const { t } = useLanguage()
  const [billing, setBilling] = useState('monthly')

  const PLAN_ICONS = { free: '🌱', pro: '⚡', elite: '👑' }
  const PLAN_COLORS = { free: 'var(--text-2)', pro: 'var(--blue)', elite: 'var(--gold)' }
  const PLAN_GLOW = { free: 'transparent', pro: 'rgba(59,130,246,0.15)', elite: 'rgba(255,215,0,0.15)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 className="page-title" style={{ fontSize: 28 }}>{t('premium.title')}</h1>
        <p className="page-subtitle" style={{ marginTop: 6, fontSize: 15 }}>{t('premium.subtitle')}</p>
      </div>

      {/* Billing Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: billing === 'monthly' ? 'var(--text-1)' : 'var(--text-3)', fontWeight: billing === 'monthly' ? 700 : 500 }}>{t('premium.monthly')}</span>
        <label className="toggle" style={{ width: 48, height: 26 }}>
          <input type="checkbox" checked={billing === 'yearly'} onChange={e => setBilling(e.target.checked ? 'yearly' : 'monthly')} />
          <span className="toggle-slider" />
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: billing === 'yearly' ? 'var(--text-1)' : 'var(--text-3)', fontWeight: billing === 'yearly' ? 700 : 500 }}>{t('premium.yearly')}</span>
          {billing === 'yearly' && (
            <span className="badge badge-bull" style={{ fontSize: 10 }}>{t('premium.save')}</span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="g-3" style={{ gap: 20, maxWidth: 960, margin: '0 auto', width: '100%' }}>
        {pricingPlans.map((plan, i) => {
          const planName = plan.id
          const isRecommended = planName === 'pro'
          const price = billing === 'yearly' ? plan.price.yearly : plan.price.monthly
          const isFree = price === 0
          const color = PLAN_COLORS[planName]
          const glow = PLAN_GLOW[planName]

          return (
            <div
              key={planName}
              style={{
                padding: '28px 24px', borderRadius: 18,
                background: `rgba(255,255,255,${isRecommended ? '0.07' : '0.04'})`,
                border: `1px solid ${isRecommended ? color + '60' : 'var(--border)'}`,
                boxShadow: isRecommended ? `0 0 40px ${glow}` : 'none',
                position: 'relative', overflow: 'hidden',
                transform: isRecommended ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.25s ease',
              }}
            >
              {isRecommended && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(59,130,246,0.1))',
                  padding: '6px', textAlign: 'center',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', color,
                }}>
                  {t('premium.recommended')}
                </div>
              )}

              <div style={{ marginTop: isRecommended ? 20 : 0 }}>
                {/* Icon & Name */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{PLAN_ICONS[planName]}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color }}>{t(`premium.plans.${planName}.name`)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>{t(`premium.plans.${planName}.desc`)}</div>
                </div>

                {/* Price */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  {isFree ? (
                    <div style={{ fontSize: 36, fontWeight: 900, color, fontFamily: 'Orbitron, monospace' }}>FREE</div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 40, fontWeight: 900, color, fontFamily: 'Orbitron, monospace' }}>
                        ${price}
                        <span style={{ fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: 500, color: 'var(--text-3)' }}>/mo</span>
                      </div>
                      {billing === 'yearly' && (
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
                          Billed ${price * 12}/year · Save 20%
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-1)' }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                        background: `${color}20`, border: `1px solid ${color}50`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IcoCheck size={10} color={color} />
                      </div>
                      {f}
                    </div>
                  ))}
                  {plan.notIncluded.slice(0, 3).map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-4)', textDecoration: 'none' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IcoX size={10} color="var(--text-4)" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  className={`btn ${isRecommended ? 'btn-gold' : isFree ? 'btn-ghost' : 'btn-ghost'}`}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                >
                  {isFree ? t('premium.currentPlan') : t('premium.getStarted')}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ / Guarantee */}
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
        <div className="glass p-5" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🛡️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>30-Day Money Back Guarantee</div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
            Not satisfied? We'll refund you, no questions asked. We're confident SEVORA will transform your trading.
          </p>
        </div>
      </div>
    </div>
  )
}
