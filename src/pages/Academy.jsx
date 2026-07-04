import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { academyCourses } from '../data/mockData'
import ScrollableTabs from '../components/ScrollableTabs'

const CATEGORIES = ['all', 'beginner', 'gold', 'risk', 'propFirm', 'technical', 'news', 'psychology']

const CATEGORY_ICONS = {
  beginner: '🌱', gold: '🏅', risk: '🛡️', propFirm: '🏆',
  technical: '📊', news: '📰', psychology: '🧠',
}

const LEVEL_COLORS = {
  beginner: 'var(--green)', intermediate: 'var(--amber)', advanced: 'var(--red)',
}

function CourseCard({ course }) {
  const { t } = useLanguage()
  const levelColor = LEVEL_COLORS[course.level] || 'var(--text-2)'
  const isCompleted = course.progress === 100
  const inProgress = course.progress > 0 && !isCompleted

  return (
    <div
      className="glass"
      style={{
        padding: '20px',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {isCompleted && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(0,212,160,0.15)', border: '1px solid rgba(0,212,160,0.3)',
          borderRadius: 20, padding: '2px 10px', fontSize: 10, fontWeight: 700, color: 'var(--green)',
        }}>
          ✓ {t('academy.completed')}
        </div>
      )}

      {/* Category icon */}
      <div style={{ fontSize: 28 }}>{CATEGORY_ICONS[course.category] || '📚'}</div>

      {/* Title */}
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.4 }}>{course.title}</div>

      {/* Description */}
      <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, flex: 1 }}>{course.desc}</p>

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{
          padding: '2px 9px', borderRadius: 20,
          background: `${levelColor}20`, border: `1px solid ${levelColor}50`,
          fontSize: 10, fontWeight: 700, color: levelColor, textTransform: 'capitalize',
        }}>
          {t(`academy.${course.level}`)}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          ⏱ {course.duration}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          📖 {course.lessons} lessons
        </span>
      </div>

      {/* Progress */}
      {course.progress > 0 && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{t('academy.progress')}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: isCompleted ? 'var(--green)' : 'var(--gold)' }}>{course.progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{
              width: `${course.progress}%`,
              background: isCompleted ? 'linear-gradient(90deg, var(--green-2), var(--green))' : 'linear-gradient(90deg, var(--gold-2), var(--gold))',
              boxShadow: isCompleted ? '0 0 8px rgba(0,212,160,0.4)' : '0 0 8px rgba(255,215,0,0.3)',
            }} />
          </div>
        </div>
      )}

      {/* CTA */}
      <button className={`btn ${isCompleted ? 'btn-ghost' : inProgress ? 'btn-gold' : 'btn-ghost'} btn-sm`} style={{ width: '100%', justifyContent: 'center' }}>
        {isCompleted ? '↩ ' + 'Review' : inProgress ? '▶ ' + t('academy.continue') : '▷ ' + t('academy.start')}
      </button>
    </div>
  )
}

export default function Academy() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all' ? academyCourses : academyCourses.filter(c => c.category === activeCategory)
  const totalProgress = Math.round(academyCourses.reduce((s, c) => s + c.progress, 0) / academyCourses.length)
  const completedCount = academyCourses.filter(c => c.progress === 100).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 className="page-title">{t('academy.title')}</h1>
        <p className="page-subtitle">{t('academy.subtitle')}</p>
      </div>

      {/* Start Here Banner */}
      <div className="glass-gold p-5" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 32 }}>🎓</span>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--gold)' }}>{t('academy.startHere')}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--gold)', fontFamily: 'Orbitron, monospace', lineHeight: 1 }}>{totalProgress}%</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{completedCount}/{academyCourses.length} completed</div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>
          We recommend starting with "How Financial Markets Work" then progressing through Risk Management before trading live.
        </p>
        <div className="progress-track" style={{ marginTop: 2 }}>
          <div className="progress-fill" style={{ width: `${totalProgress}%`, background: 'linear-gradient(90deg, var(--gold-2), var(--gold))' }} />
        </div>
      </div>

      {/* Category Filters */}
      <ScrollableTabs>
        {CATEGORIES.map(c => (
          <button key={c} className={`pill-tab ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>
            {c !== 'all' && CATEGORY_ICONS[c]} {c === 'all' ? 'All Courses' : t(`academy.categories.${c}`)}
          </button>
        ))}
      </ScrollableTabs>

      {/* Courses Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(course => <CourseCard key={course.id} course={course} />)}
      </div>
    </div>
  )
}
