import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { marketplaceProducts } from '../data/mockData'
import { IcoStar } from '../components/Icons'
import ScrollableTabs from '../components/ScrollableTabs'

const CATEGORIES = ['all', 'indicators', 'aiTools', 'templates', 'bots']

const CATEGORY_ICONS = { indicators: '📊', aiTools: '🤖', templates: '📋', bots: '⚡', all: '🛒' }

function ProductCard({ product }) {
  const { t } = useLanguage()
  const isFree = product.price === 'FREE'

  return (
    <div
      className="glass"
      style={{
        padding: '20px', display: 'flex', flexDirection: 'column', gap: 12,
        transition: 'all 0.25s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {product.badge && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '2px 10px', borderRadius: 20, fontSize: 9, fontWeight: 800, letterSpacing: '0.08em',
          background: product.badge === 'FREE' ? 'rgba(0,212,160,0.2)' : product.badge === 'BESTSELLER' ? 'rgba(139,92,246,0.2)' : 'rgba(59,130,246,0.2)',
          color: product.badge === 'FREE' ? 'var(--green)' : product.badge === 'BESTSELLER' ? 'var(--gold)' : 'var(--blue)',
          border: `1px solid ${product.badge === 'FREE' ? 'rgba(0,212,160,0.4)' : product.badge === 'BESTSELLER' ? 'var(--gold-border)' : 'rgba(59,130,246,0.4)'}`,
        }}>
          {product.badge}
        </div>
      )}

      {/* Icon */}
      <div style={{ fontSize: 32 }}>{CATEGORY_ICONS[product.category] || '🔧'}</div>

      {/* Name */}
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.4, paddingRight: product.badge ? 80 : 0 }}>
        {product.name}
      </div>

      {/* Description */}
      <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, flex: 1 }}>{t(`marketplace.products.p${product.id}.desc`)}</p>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <span key={i} style={{ color: i <= Math.round(product.rating) ? 'var(--gold)' : 'var(--text-4)', fontSize: 13 }}>★</span>
          ))}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)' }}>{product.rating}</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>({product.reviews} {t('marketplace.reviews')})</span>
      </div>

      {/* Price + CTA */}
      <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontSize: isFree ? 14 : 20, fontWeight: 800,
          color: isFree ? 'var(--green)' : 'var(--text-1)',
          fontFamily: 'Orbitron, monospace',
        }}>
          {isFree ? t('marketplace.free') : product.price}
          {!isFree && <span style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: 'var(--text-3)', marginLeft: 2 }}>{t('marketplace.perOnce')}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>{t('marketplace.preview')}</button>
          <button className={`btn ${isFree ? 'btn-green' : ''}`} style={isFree ? { flex: 2, padding: '7px 16px', fontSize: 13 } : { flex: 2, padding: '7px 16px', fontSize: 13, background: '#000', color: '#fff', border: '1px solid rgba(255,140,0,0.7)', boxShadow: '0 0 10px rgba(255,120,0,0.5), 0 0 22px rgba(255,100,0,0.25), inset 0 0 6px rgba(255,120,0,0.08)' }}>
            {isFree ? <><span style={{ fontSize: 16 }}>↓</span> {t('marketplace.free')}</> : <><span style={{ fontSize: 16 }}>🛒</span> {t('marketplace.buyNow')}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const { t } = useLanguage()
  const [category, setCategory] = useState('all')

  const filtered = category === 'all' ? marketplaceProducts : marketplaceProducts.filter(p => p.category === category)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="page-title">{t('marketplace.title')}</h1>
        <p className="page-subtitle">{t('marketplace.subtitle')}</p>
      </div>

      {/* Hero banner */}
      <div className="marketplace-hero">
        <div className="marketplace-hero-top">
          <div style={{ fontSize: 38 }}>🛒</div>
          <div className="marketplace-hero-stat">
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--green)', fontFamily: 'Orbitron, monospace', lineHeight: 1 }}>6</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t('marketplace.heroProducts')}</div>
          </div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)', lineHeight: 1.3 }}>
          {t('marketplace.heroTitle')}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
          {t('marketplace.heroDesc')}
        </p>
      </div>

      {/* Category Filters */}
      <ScrollableTabs>
        {CATEGORIES.map(c => (
          <button key={c} className={`pill-tab ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
            {CATEGORY_ICONS[c]} {t(`marketplace.categories.${c}`)}
          </button>
        ))}
      </ScrollableTabs>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {/* Coming Soon */}
      <div className="glass p-5" style={{ textAlign: 'center', borderStyle: 'dashed' }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>🔜</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-2)', marginBottom: 6 }}>{t('marketplace.comingSoon')}</div>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{t('marketplace.comingSoonDesc')}</p>
      </div>
    </div>
  )
}
