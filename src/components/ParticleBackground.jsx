import { useMemo } from 'react'

export default function ParticleBackground() {
  const particles = useMemo(() => {
    const rnd = (min, max) => Math.random() * (max - min) + min
    return Array.from({ length: 55 }, (_, i) => {
      const kind = i < 20 ? 'star' : i < 38 ? 'orb' : i < 49 ? 'glow' : 'gold'

      const color =
        kind === 'gold' ? 'rgba(245,158,11,'  :
        i % 5 === 0     ? 'rgba(59,130,246,'  :
        i % 3 === 0     ? 'rgba(167,139,250,' :
        i % 2 === 0     ? 'rgba(109,40,217,'  :
                          'rgba(139,92,246,'

      const anim =
        kind === 'star' ? 'twinkle' :
        kind === 'glow' ? 'floatC'  :
        ['floatA', 'floatB', 'floatC'][i % 3]

      const size =
        kind === 'star' ? rnd(2, 4)    :
        kind === 'glow' ? rnd(40, 90)  :
        kind === 'gold' ? rnd(3, 6)    :
                          rnd(6, 14)

      const opacity =
        kind === 'glow' ? rnd(0.08, 0.15) :
        kind === 'star' ? rnd(0.5, 0.9)   :
                          rnd(0.35, 0.75)

      const dur =
        kind === 'star' ? rnd(2, 5)   :
        kind === 'glow' ? rnd(35, 60) :
                          rnd(14, 30)

      return {
        id: i, kind,
        x: rnd(0, 100), y: rnd(0, 100),
        size, color, opacity, anim, dur,
        delay: rnd(-30, 0),
      }
    })
  }, [])

  return (
    <div className="particle-bg" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `${p.color}${p.opacity})`,
            boxShadow: p.kind === 'glow'
              ? `0 0 ${p.size}px ${p.size * 0.5}px ${p.color}0.12)`
              : p.kind === 'orb'
                ? `0 0 ${p.size * 2.5}px ${p.size * 0.8}px ${p.color}${p.opacity * 0.6})`
                : `0 0 ${p.size * 3}px ${p.color}${p.opacity * 0.8})`,
            animationName: p.anim,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
