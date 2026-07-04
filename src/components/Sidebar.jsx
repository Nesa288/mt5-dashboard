import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useMarketStatus } from '../hooks/useMarketStatus'
import {
  IcoDashboard, IcoGold, IcoMarkets, IcoCalendar, IcoNews,
  IcoScenarios, IcoJournal, IcoAcademy, IcoAIMentor, IcoBotDashboard,
  IcoAffiliate, IcoMarketplace, IcoPremium, IcoLogin,
} from './Icons'

const NAV_ITEMS = [
  { path: '/', key: 'dashboard', Icon: IcoDashboard },
  { path: '/gold', key: 'gold', Icon: IcoGold },
  { path: '/markets', key: 'markets', Icon: IcoMarkets },
  { path: '/calendar', key: 'calendar', Icon: IcoCalendar },
  { path: '/news', key: 'news', Icon: IcoNews },
  { path: '/scenarios', key: 'scenarios', Icon: IcoScenarios },
  { path: '/journal', key: 'journal', Icon: IcoJournal },
  { path: '/academy', key: 'academy', Icon: IcoAcademy },
  { path: '/ai-mentor', key: 'aiMentor', Icon: IcoAIMentor },
  { path: '/bot-dashboard', key: 'botDashboard', Icon: IcoBotDashboard },
  { path: '/affiliate', key: 'affiliate', Icon: IcoAffiliate },
  { path: '/marketplace', key: 'marketplace', Icon: IcoMarketplace },
  { path: '/premium', key: 'premium', Icon: IcoPremium },
]

const FLAGS = { en: '🇬🇧', sr: '🇷🇸' }

export default function Sidebar({ mobile, drawerOpen, onClose }) {
  const { t, lang, switchLang } = useLanguage()
  const { isOpen } = useMarketStatus()

  const cls = mobile
    ? `sidebar mobile-drawer${drawerOpen ? ' open' : ''}`
    : 'sidebar'

  return (
    <aside className={cls}>
      {/* Header */}
      {mobile ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 14px 14px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: 'Orbitron, monospace', fontSize: 18, fontWeight: 900,
              background: 'linear-gradient(135deg, #D4AF37, #FFD700, #F5A623)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', letterSpacing: '0.08em',
            }}>SEVORA</div>
            <div style={{
              fontSize: 9, fontWeight: 600, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 2,
            }}>AI Trading Platform</div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
            borderRadius: 8, width: 30, height: 30, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-2)', fontSize: 20, lineHeight: 1,
          }}>×</button>
        </div>
      ) : (
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">SEVORA</div>
          <div className="sidebar-logo-sub">AI Trading Platform</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ path, key, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            style={mobile ? { justifyContent: 'flex-start', padding: '10px 14px' } : undefined}
            onClick={mobile ? onClose : undefined}
          >
            <Icon className="nav-icon" size={17} />
            <span className="nav-label" style={mobile ? { display: 'block' } : undefined}>
              {t(`nav.${key}`)}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        {mobile && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            {['en', 'sr'].map(code => (
              <button key={code} onClick={() => switchLang(code)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '8px 0', borderRadius: 7,
                border: `1px solid ${lang === code ? 'rgba(212,175,55,0.45)' : 'var(--border)'}`,
                background: lang === code ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: 20 }}>{FLAGS[code]}</span>
              </button>
            ))}
          </div>
        )}

        <NavLink
          to="/login"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          style={mobile ? { justifyContent: 'flex-start', padding: '10px 14px' } : undefined}
          onClick={mobile ? onClose : undefined}
        >
          <IcoLogin className="nav-icon" size={17} />
          <span className="nav-label" style={mobile ? { display: 'block' } : undefined}>
            {t('nav.login')}
          </span>
        </NavLink>
      </div>
    </aside>
  )
}
