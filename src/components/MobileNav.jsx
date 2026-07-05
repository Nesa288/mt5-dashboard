import { NavLink } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { IcoDashboard, IcoGold, IcoMarkets, IcoNews, IcoAIMentor } from './Icons'

const ITEMS = [
  { path: '/dashboard', key: 'dashboard', Icon: IcoDashboard },
  { path: '/gold', key: 'gold', Icon: IcoGold },
  { path: '/markets', key: 'markets', Icon: IcoMarkets },
  { path: '/news', key: 'news', Icon: IcoNews },
  { path: '/ai-mentor', key: 'aiMentor', Icon: IcoAIMentor },
]

export default function MobileNav() {
  const { t } = useLanguage()

  return (
    <nav className="mob-nav">
      {ITEMS.map(({ path, key, Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/dashboard'}
          className={({ isActive }) => `mob-nav-item${isActive ? ' active' : ''}`}
        >
          <Icon size={20} />
          <span>{t(`nav.${key}`)}</span>
        </NavLink>
      ))}
    </nav>
  )
}
