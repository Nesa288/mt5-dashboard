import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { affiliateData } from '../data/mockData'
import { IcoCopy, IcoCheck } from '../components/Icons'

export default function Affiliate() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateData.referralLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="page-title">{t('affiliate.title')}</h1>
        <p className="page-subtitle">{t('affiliate.subtitle')}</p>
      </div>

      {/* Hero Banner */}
      <div style={{
        padding: '36px 40px',
        borderRadius: 18,
        background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(0,212,160,0.08) 100%)',
        border: '1px solid var(--gold-border)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 42, marginBottom: 12 }}>🤝</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--gold)', marginBottom: 8 }}>
          {t('affiliate.subtitle')}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
          Earn 30% commission on every subscription payment from your referred traders. No cap, no expiry.
        </p>
      </div>

      {/* Stats Row */}
      <div className="g-3" style={{ gap: 14 }}>
        <div className="stat-card glass-gold" style={{ textAlign: 'center' }}>
          <div className="stat-label">{t('affiliate.invitedUsers')}</div>
          <div className="stat-value text-gold">{affiliateData.invitedUsers}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Registered this month</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-label">{t('affiliate.totalEarnings')}</div>
          <div className="stat-value text-green">{affiliateData.totalEarnings}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>All time</div>
        </div>
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div className="stat-label">{t('affiliate.paymentStatus')}</div>
          <div style={{ marginTop: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 2 }}>{t('affiliate.pending')}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--amber)', fontFamily: 'Orbitron, monospace' }}>{affiliateData.pendingAmount}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: 2 }}>{t('affiliate.paid')}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--green)', fontFamily: 'Orbitron, monospace' }}>{affiliateData.paidAmount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="g-2" style={{ gap: 20 }}>
        {/* Referral Link */}
        <div className="glass p-5">
          <div className="section-label mb-3">🔗 {t('affiliate.yourLink')}</div>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center',
            padding: '12px 16px', borderRadius: 10,
            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-2)',
          }}>
            <span style={{ fontSize: 12, color: 'var(--text-2)', flex: 1, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {affiliateData.referralLink}
            </span>
            <button
              className={`btn btn-sm ${copied ? 'btn-green' : 'btn-gold'}`}
              onClick={handleCopy}
              style={{ flexShrink: 0 }}
            >
              {copied ? <IcoCheck size={14} /> : <IcoCopy size={14} />}
              <span className="mob-hide">{copied ? t('affiliate.copied') : t('affiliate.copyLink')}</span>
            </button>
          </div>

          <div className="section-label mb-3" style={{ marginTop: 28 }}>💡 {t('affiliate.howItWorks')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { step: '1', text: t('affiliate.step1'), icon: '🔗' },
              { step: '2', text: t('affiliate.step2'), icon: '👤' },
              { step: '3', text: t('affiliate.step3'), icon: '💰' },
            ].map(({ step, text, icon }) => (
              <div key={step} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,215,0,0.15)', border: '1px solid var(--gold-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>{icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>Step {step}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5 }}>{text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass p-5">
          <div className="section-label mb-3">🏆 {t('affiliate.leaderboard')}</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('affiliate.rank')}</th>
                <th>{t('affiliate.name')}</th>
                <th style={{ textAlign: 'right' }}>{t('affiliate.referrals')}</th>
                <th className="mob-hide" style={{ textAlign: 'right' }}>{t('affiliate.earnings')}</th>
              </tr>
            </thead>
            <tbody>
              {affiliateData.leaderboard.map(row => (
                <tr key={row.rank} style={row.isCurrentUser ? { background: 'rgba(255,215,0,0.06)' } : {}}>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 26, height: 26, borderRadius: '50%',
                      background: row.rank <= 3 ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${row.rank <= 3 ? 'var(--gold-border)' : 'var(--border)'}`,
                      fontSize: 12, fontWeight: 700,
                      color: row.rank === 1 ? '#FFD700' : row.rank === 2 ? '#C0C0C0' : row.rank === 3 ? '#CD7F32' : 'var(--text-3)',
                    }}>
                      {row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : row.rank}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, fontWeight: row.isCurrentUser ? 700 : 500, color: row.isCurrentUser ? 'var(--gold)' : 'var(--text-1)' }}>
                      {row.name}
                      {row.isCurrentUser && <span style={{ fontSize: 10, marginLeft: 6, color: 'var(--text-3)' }}>(you)</span>}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'Orbitron, monospace', fontSize: 12, color: 'var(--text-2)' }}>{row.referrals}</td>
                  <td className="mob-hide" style={{ textAlign: 'right', fontFamily: 'Orbitron, monospace', fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>{row.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
