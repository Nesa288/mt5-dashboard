import { useNavigate } from 'react-router-dom'
import { IcoGold, IcoAIMentor, IcoJournal, IcoAcademy } from '../components/Icons'
import { useLanguage } from '../context/LanguageContext'

const FEATURE_KEYS = [
  { Icon: IcoGold,     key: 'smartTrading', color: '#8B5CF6', path: '/gold' },
  { Icon: IcoAIMentor, key: 'aiMentor',     color: '#3B82F6', path: '/ai-mentor' },
  { Icon: IcoJournal,  key: 'journal',      color: '#00D4A0', path: '/journal' },
  { Icon: IcoAcademy,  key: 'academy',      color: '#F59E0B',
    path: '/academy',
  },
]

function HeroBullVisual() {
  const W = 560, H = 520

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      <defs>
        {/* Filters */}
        <filter id="hbBG" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="22"/>
        </filter>
        <filter id="hbRim" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hbEye" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="7" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hbSoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="hbSpec" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Atmosphere */}
        <radialGradient id="hbAtmo" cx="50%" cy="44%" r="58%">
          <stop offset="0%" stopColor="rgba(109,40,217,0.42)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>

        {/* Head — lit from upper-left, shadow lower-right */}
        <radialGradient id="hbHeadShade" cx="36%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#1e095a"/>
          <stop offset="25%"  stopColor="#110438"/>
          <stop offset="60%"  stopColor="#080220"/>
          <stop offset="100%" stopColor="#030010"/>
        </radialGradient>

        {/* Muzzle 3D */}
        <radialGradient id="hbMuzzle3D" cx="42%" cy="36%" r="65%">
          <stop offset="0%"   stopColor="#1a0848"/>
          <stop offset="50%"  stopColor="#0e0430"/>
          <stop offset="100%" stopColor="#060118"/>
        </radialGradient>

        {/* Ear inner pink/purple */}
        <radialGradient id="hbEarInner" cx="55%" cy="45%" r="65%">
          <stop offset="0%"   stopColor="rgba(100,35,180,0.70)"/>
          <stop offset="100%" stopColor="rgba(28,8,60,0.20)"/>
        </radialGradient>

        {/* Horn gradients (lighter at thick base, taper to dark tip) */}
        <linearGradient id="hbHornL" x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%"   stopColor="#18064a"/>
          <stop offset="55%"  stopColor="#0b0230"/>
          <stop offset="100%" stopColor="#050115"/>
        </linearGradient>
        <linearGradient id="hbHornR" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%"   stopColor="#18064a"/>
          <stop offset="55%"  stopColor="#0b0230"/>
          <stop offset="100%" stopColor="#050115"/>
        </linearGradient>

        {/* Jacket 3D — shoulder highlight fades to shadow */}
        <linearGradient id="hbJacket" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%"   stopColor="#130528"/>
          <stop offset="35%"  stopColor="#0d0420"/>
          <stop offset="100%" stopColor="#060210"/>
        </linearGradient>
        <radialGradient id="hbShoulderHL" cx="50%" cy="5%" r="70%">
          <stop offset="0%"   stopColor="rgba(130,65,230,0.20)"/>
          <stop offset="100%" stopColor="rgba(60,20,120,0)"/>
        </radialGradient>

        {/* Iris gradients */}
        <radialGradient id="hbIrisL" cx="35%" cy="32%" r="70%">
          <stop offset="0%"   stopColor="#7a32e0"/>
          <stop offset="45%"  stopColor="#521898"/>
          <stop offset="100%" stopColor="#2a0860"/>
        </radialGradient>
        <radialGradient id="hbIrisR" cx="65%" cy="32%" r="70%">
          <stop offset="0%"   stopColor="#7a32e0"/>
          <stop offset="45%"  stopColor="#521898"/>
          <stop offset="100%" stopColor="#2a0860"/>
        </radialGradient>
      </defs>

      {/* Atmosphere */}
      <ellipse cx={280} cy={265} rx={295} ry={278} fill="url(#hbAtmo)"/>
      {[90, 170, 250, 330, 410, 490].map((y, i) => (
        <line key={i} x1="0" y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.016)" strokeWidth="1"/>
      ))}

      {/* ── JACKET — 3D ── */}
      <path d="M 78 520 L 78 352 C 78 322 124 292 180 280 L 258 264 L 302 264 L 380 280 C 436 292 482 322 482 352 L 482 520 Z"
        fill="#6D28D9" filter="url(#hbBG)" opacity="0.32"/>
      <path d="M 78 520 L 78 352 C 78 322 124 292 180 280 L 258 264 L 302 264 L 380 280 C 436 292 482 322 482 352 L 482 520 Z"
        fill="url(#hbJacket)"/>
      {/* shoulder highlight (light hits the top ridge of each shoulder) */}
      <path d="M 78 352 C 78 322 124 292 180 280 L 258 264 L 302 264 L 380 280 C 436 292 482 322 482 352 L 482 400 C 420 358 340 338 280 338 C 220 338 140 358 78 400 Z"
        fill="url(#hbShoulderHL)"/>
      {/* cloth-fold shadow lines */}
      <path d="M 152 318 C 160 385 162 450 160 520" stroke="rgba(0,0,0,0.38)" strokeWidth="1.5" fill="none"/>
      <path d="M 408 318 C 400 385 398 450 400 520" stroke="rgba(0,0,0,0.38)" strokeWidth="1.5" fill="none"/>
      <path d="M 152 318 C 160 385 162 450 160 520" stroke="rgba(120,60,220,0.10)" strokeWidth="1" fill="none"/>
      <path d="M 408 318 C 400 385 398 450 400 520" stroke="rgba(120,60,220,0.10)" strokeWidth="1" fill="none"/>
      {/* jacket rim */}
      <path d="M 78 520 L 78 352 C 78 322 124 292 180 280 L 258 264 M 302 264 L 380 280 C 436 292 482 322 482 352 L 482 520"
        fill="none" stroke="rgba(109,40,217,0.45)" strokeWidth="1.8" filter="url(#hbRim)"/>

      {/* Left lapel — lit face + shadow edge */}
      <path d="M 258 264 L 222 308 L 220 360 L 260 378 L 258 264 Z" fill="#0d0722"/>
      <path d="M 244 278 C 236 308 232 342 236 374 L 260 378 L 258 264 Z" fill="rgba(110,55,210,0.10)"/>
      <path d="M 258 264 L 222 308 L 220 360" fill="none" stroke="rgba(120,60,220,0.52)" strokeWidth="1.6" filter="url(#hbRim)"/>

      {/* Right lapel */}
      <path d="M 302 264 L 338 308 L 340 360 L 300 378 L 302 264 Z" fill="#0d0722"/>
      <path d="M 316 278 C 324 308 328 342 324 374 L 300 378 L 302 264 Z" fill="rgba(110,55,210,0.10)"/>
      <path d="M 302 264 L 338 308 L 340 360" fill="none" stroke="rgba(120,60,220,0.52)" strokeWidth="1.6" filter="url(#hbRim)"/>

      {/* Center strip */}
      <path d="M 220 360 L 260 378 L 280 520 L 300 378 L 340 360 L 318 368 L 280 396 L 242 368 Z" fill="#07020f"/>

      {/* Shirt collar — 3D fold */}
      <path d="M 258 264 L 273 252 L 280 260 L 268 274 Z" fill="rgba(215,205,255,0.86)"/>
      <path d="M 302 264 L 287 252 L 280 260 L 292 274 Z" fill="rgba(215,205,255,0.86)"/>
      <path d="M 273 252 L 280 260 L 287 252 L 282 244 L 278 244 Z" fill="rgba(232,225,255,0.92)"/>
      {/* collar shadow under chin */}
      <path d="M 268 274 L 280 260 L 292 274 L 286 281 L 274 281 Z" fill="rgba(0,0,0,0.22)"/>

      {/* Tie — 3D with centre highlight stripe */}
      <path d="M 275 258 L 271 295 L 280 520 L 289 295 L 285 258 L 280 263 Z" fill="#360b7c"/>
      <path d="M 278 262 L 276 296 L 280 520 L 284 296 L 282 262 L 280 265 Z" fill="rgba(130,65,230,0.18)"/>
      <path d="M 275 258 L 271 295 L 280 520 L 289 295 L 285 258" fill="none" stroke="rgba(139,92,246,0.42)" strokeWidth="1" filter="url(#hbRim)"/>
      <path d="M 273 262 L 280 254 L 287 262 L 285 276 L 275 276 Z" fill="#52169e"/>
      <path d="M 273 262 L 278 258 L 280 254 L 280 263 Z" fill="rgba(160,100,255,0.28)"/>

      {/* Pocket square */}
      <path d="M 408 332 L 420 320 L 438 323 L 438 342 L 408 342 Z" fill="rgba(139,92,246,0.70)" filter="url(#hbSoft)"/>
      <path d="M 416 326 L 428 322 L 434 329 L 418 334 Z" fill="rgba(190,150,255,0.45)"/>

      {/* Button */}
      <circle cx={280} cy={400} r={5} fill="#12052a" stroke="rgba(139,92,246,0.55)" strokeWidth="1.2"/>

      {/* ── NECK — 3D ── */}
      <path d="M 258 264 C 258 254 267 246 280 244 C 293 246 302 254 302 264 L 305 288 L 255 288 Z" fill="#0a041e"/>
      {/* lit right side of neck */}
      <path d="M 280 244 C 293 246 302 254 302 264 L 305 288 L 280 288 Z" fill="rgba(100,45,195,0.12)"/>
      <path d="M 258 264 C 258 254 267 246 280 244 C 293 246 302 254 302 264" fill="none" stroke="rgba(109,40,217,0.42)" strokeWidth="1.4" filter="url(#hbRim)"/>

      {/* ── EARS — 3D ── */}
      <path d="M 188 162 C 164 144 138 148 132 168 C 126 188 142 212 167 216 C 188 220 204 206 204 188 C 204 170 192 160 188 162 Z"
        fill="#6D28D9" filter="url(#hbBG)" opacity="0.36"/>
      <path d="M 188 162 C 164 144 138 148 132 168 C 126 188 142 212 167 216 C 188 220 204 206 204 188 C 204 170 192 160 188 162 Z"
        fill="#0a041e"/>
      {/* ear lit upper area */}
      <path d="M 188 162 C 176 153 160 153 150 163 C 142 172 144 187 154 195 C 165 204 180 204 188 196 Z"
        fill="rgba(105,48,200,0.17)"/>
      <path d="M 183 170 C 163 156 142 160 138 174 C 134 188 146 204 164 206 C 178 208 188 200 186 188 Z"
        fill="url(#hbEarInner)"/>
      <path d="M 188 162 C 164 144 138 148 132 168 C 126 188 142 212 167 216 C 188 220 204 206 204 188 C 204 170 192 160 188 162 Z"
        fill="none" stroke="rgba(109,40,217,0.50)" strokeWidth="1.5" filter="url(#hbRim)"/>

      <path d="M 372 162 C 396 144 422 148 428 168 C 434 188 418 212 393 216 C 372 220 356 206 356 188 C 356 170 368 160 372 162 Z"
        fill="#6D28D9" filter="url(#hbBG)" opacity="0.36"/>
      <path d="M 372 162 C 396 144 422 148 428 168 C 434 188 418 212 393 216 C 372 220 356 206 356 188 C 356 170 368 160 372 162 Z"
        fill="#0a041e"/>
      <path d="M 372 162 C 383 153 400 152 410 162 C 420 172 420 188 410 197 C 400 206 384 206 374 197 Z"
        fill="rgba(105,48,200,0.17)"/>
      <path d="M 377 170 C 397 156 418 160 422 174 C 426 188 414 204 396 206 C 382 208 372 200 374 188 Z"
        fill="url(#hbEarInner)"/>
      <path d="M 372 162 C 396 144 422 148 428 168 C 434 188 418 212 393 216 C 372 220 356 206 356 188 C 356 170 368 160 372 162 Z"
        fill="none" stroke="rgba(109,40,217,0.50)" strokeWidth="1.5" filter="url(#hbRim)"/>

      {/* ── HEAD — 3D gradient lit from upper-left ── */}
      <path d="M 184 190 C 184 140 200 102 226 88 C 246 77 264 74 280 74 C 296 74 314 77 334 88 C 360 102 376 140 376 190 C 376 234 366 262 346 278 C 328 292 306 300 280 300 C 254 300 232 292 214 278 C 194 262 184 234 184 190 Z"
        fill="#6D28D9" filter="url(#hbBG)" opacity="0.46"/>
      <path d="M 184 190 C 184 140 200 102 226 88 C 246 77 264 74 280 74 C 296 74 314 77 334 88 C 360 102 376 140 376 190 C 376 234 366 262 346 278 C 328 292 306 300 280 300 C 254 300 232 292 214 278 C 194 262 184 234 184 190 Z"
        fill="url(#hbHeadShade)"/>
      {/* Specular highlight — forehead catch light */}
      <ellipse cx={252} cy={132} rx={52} ry={38} fill="rgba(145,80,255,0.12)" filter="url(#hbSpec)"/>
      <ellipse cx={244} cy={124} rx={26} ry={17} fill="rgba(185,140,255,0.09)" filter="url(#hbSpec)"/>
      {/* Jaw/chin ambient occlusion shadow */}
      <path d="M 214 278 C 232 292 254 300 280 300 C 306 300 328 292 346 278 C 338 290 316 298 280 298 C 244 298 222 290 214 278 Z"
        fill="rgba(0,0,0,0.28)"/>
      {/* Head rim */}
      <path d="M 184 190 C 184 140 200 102 226 88 C 246 77 264 74 280 74 C 296 74 314 77 334 88 C 360 102 376 140 376 190 C 376 234 366 262 346 278 C 328 292 306 300 280 300 C 254 300 232 292 214 278 C 194 262 184 234 184 190 Z"
        fill="none" stroke="rgba(109,40,217,0.60)" strokeWidth="2" filter="url(#hbRim)"/>

      {/* ── MUZZLE — 3D ── */}
      <ellipse cx={280} cy={270} rx={74} ry={50} fill="#6D28D9" filter="url(#hbBG)" opacity="0.20"/>
      <ellipse cx={280} cy={270} rx={74} ry={50} fill="url(#hbMuzzle3D)"/>
      {/* muzzle surface highlight */}
      <ellipse cx={260} cy={254} rx={35} ry={20} fill="rgba(145,78,255,0.10)" filter="url(#hbSpec)"/>
      <ellipse cx={280} cy={270} rx={74} ry={50} fill="none" stroke="rgba(100,40,170,0.36)" strokeWidth="1.5" filter="url(#hbRim)"/>
      {/* Nostrils */}
      <ellipse cx={254} cy={276} rx={18} ry={13} fill="#040010"/>
      <ellipse cx={249} cy={270} rx={7} ry={5} fill="rgba(85,25,155,0.60)"/>
      <ellipse cx={252} cy={268} rx={3} ry={2} fill="rgba(145,85,255,0.35)"/>
      <ellipse cx={306} cy={276} rx={18} ry={13} fill="#040010"/>
      <ellipse cx={301} cy={270} rx={7} ry={5} fill="rgba(85,25,155,0.60)"/>
      <ellipse cx={304} cy={268} rx={3} ry={2} fill="rgba(145,85,255,0.35)"/>
      {/* upper lip line */}
      <path d="M 268 296 C 273 303 287 303 292 296" stroke="rgba(45,12,95,0.50)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* ── EYES — 3D ── */}
      <ellipse cx={228} cy={200} rx={22} ry={16} fill="#6D28D9" filter="url(#hbEye)" opacity="0.58"/>
      <ellipse cx={228} cy={200} rx={18} ry={13} fill="#08030e"/>
      <ellipse cx={228} cy={200} rx={11} ry={9} fill="url(#hbIrisL)"/>
      <ellipse cx={228} cy={201} rx={5.5} ry={5} fill="#060115"/>
      {/* eyelid top shadow */}
      <path d="M 210 196 C 218 190 228 188 238 192 C 228 196 218 196 210 196 Z" fill="rgba(0,0,0,0.32)"/>
      {/* specular glint */}
      <ellipse cx={221} cy={195} rx={4} ry={3} fill="rgba(225,198,255,0.96)"/>
      <ellipse cx={234} cy={207} rx={2} ry={1.5} fill="rgba(180,150,255,0.48)"/>

      <ellipse cx={332} cy={200} rx={22} ry={16} fill="#6D28D9" filter="url(#hbEye)" opacity="0.58"/>
      <ellipse cx={332} cy={200} rx={18} ry={13} fill="#08030e"/>
      <ellipse cx={332} cy={200} rx={11} ry={9} fill="url(#hbIrisR)"/>
      <ellipse cx={332} cy={201} rx={5.5} ry={5} fill="#060115"/>
      <path d="M 322 196 C 330 190 340 188 350 192 C 340 196 330 196 322 196 Z" fill="rgba(0,0,0,0.32)"/>
      <ellipse cx={325} cy={195} rx={4} ry={3} fill="rgba(225,198,255,0.96)"/>
      <ellipse cx={338} cy={207} rx={2} ry={1.5} fill="rgba(180,150,255,0.48)"/>

      {/* Brow ridges — shadow + purple edge */}
      <path d="M 202 184 C 213 172 228 168 244 172" stroke="rgba(30,8,70,0.55)" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M 202 184 C 213 172 228 168 244 172" stroke="rgba(130,65,240,0.35)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M 358 184 C 347 172 332 168 316 172" stroke="rgba(30,8,70,0.55)" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M 358 184 C 347 172 332 168 316 172" stroke="rgba(130,65,240,0.35)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* ── HORNS — 3D gradient ── */}
      <path d="M 215 90 C 196 64 165 34 132 10 C 118 -2 106 -10 112 -4 C 120 5 146 32 178 72 C 188 80 202 88 215 90 C 220 88 228 82 230 80 C 218 55 200 28 178 10 C 168 2 162 -2 168 2 C 174 10 192 34 208 76 Z"
        fill="#8B5CF6" filter="url(#hbBG)" opacity="0.72"/>
      <path d="M 215 90 C 196 64 165 34 132 10 C 118 -2 106 -10 112 -4 C 120 5 146 32 178 72 C 188 80 202 88 215 90 C 220 88 228 82 230 80 C 218 55 200 28 178 10 C 168 2 162 -2 168 2 C 174 10 192 34 208 76 Z"
        fill="url(#hbHornL)"/>
      {/* horn outer-face highlight (light catches outer curve) */}
      <path d="M 215 90 C 204 72 187 50 168 30 C 159 20 154 12 157 15 C 163 24 181 47 200 78 Z"
        fill="rgba(135,72,245,0.20)"/>
      <path d="M 215 90 C 196 64 165 34 132 10 C 118 -2 106 -10 112 -4 C 120 5 146 32 178 72 C 188 80 202 88 215 90"
        fill="none" stroke="rgba(139,92,246,0.82)" strokeWidth="2.2" filter="url(#hbRim)"/>
      <path d="M 230 80 C 218 55 200 28 178 10 C 168 2 162 -2 168 2 C 174 10 192 34 208 76"
        fill="none" stroke="rgba(100,50,200,0.45)" strokeWidth="1.4" filter="url(#hbRim)"/>

      <path d="M 345 90 C 364 64 395 34 428 10 C 442 -2 454 -10 448 -4 C 440 5 414 32 382 72 C 372 80 358 88 345 90 C 340 88 332 82 330 80 C 342 55 360 28 382 10 C 392 2 398 -2 392 2 C 386 10 368 34 352 76 Z"
        fill="#8B5CF6" filter="url(#hbBG)" opacity="0.72"/>
      <path d="M 345 90 C 364 64 395 34 428 10 C 442 -2 454 -10 448 -4 C 440 5 414 32 382 72 C 372 80 358 88 345 90 C 340 88 332 82 330 80 C 342 55 360 28 382 10 C 392 2 398 -2 392 2 C 386 10 368 34 352 76 Z"
        fill="url(#hbHornR)"/>
      <path d="M 345 90 C 357 70 377 48 396 28 C 406 18 414 8 412 12 C 406 24 389 47 370 74 Z"
        fill="rgba(135,72,245,0.20)"/>
      <path d="M 345 90 C 364 64 395 34 428 10 C 442 -2 454 -10 448 -4 C 440 5 414 32 382 72 C 372 80 358 88 345 90"
        fill="none" stroke="rgba(139,92,246,0.82)" strokeWidth="2.2" filter="url(#hbRim)"/>
      <path d="M 330 80 C 342 55 360 28 382 10 C 392 2 398 -2 392 2 C 386 10 368 34 352 76"
        fill="none" stroke="rgba(100,50,200,0.45)" strokeWidth="1.4" filter="url(#hbRim)"/>

      {/* Sparkles */}
      {[[510, 68], [32, 435], [526, 342], [22, 128], [514, 185], [520, 455], [126, 35], [486, 40]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 2.5 : 1.5} fill="#A78BFA" opacity="0.38" filter="url(#hbSoft)"/>
      ))}
    </svg>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className="home-root">

      {/* ── HERO ───────────────────────────────────── */}
      <section className="home-hero">

        {/* BG glows */}
        <div style={{ position: 'absolute', top: -180, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '25%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Left: full-bleed bull image */}
        <div className="home-hero-image" style={{
          flex: '0 0 45%',
          alignSelf: 'stretch',
          position: 'relative',
          overflow: 'hidden',
          margin: '-28px 0 -24px -40px',
          zIndex: 0,
          maskImage: 'linear-gradient(to right, black 55%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, black 55%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 82%, transparent 100%)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}>
          <img
            src={`${import.meta.env.BASE_URL}bull2.png`}
            alt="Bull trader"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
              mixBlendMode: 'screen',
              filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
            }}
          />
        </div>

        {/* Right: text */}
        <div className="home-hero-left" style={{ zIndex: 1 }}>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 9, marginBottom: 28,
            padding: '5px 16px', borderRadius: 20,
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.28)',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 8px var(--gold)', animation: 'dotPulse 2s ease infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)' }}>{t('home.welcomeBadge')}</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(34px, 3.8vw, 56px)', fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: 20,
          }}>
            {t('home.heroLine1')}<br />
            <span style={{ color: 'var(--gold)' }}>{t('home.heroLine2')}</span>
          </h1>

          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.75, maxWidth: 430, marginBottom: 38 }}>
            {t('home.heroDesc')}
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
            <button className="btn btn-gold" onClick={() => navigate('/gold')} style={{ padding: '14px 30px', fontSize: 14, gap: 10 }}>
              <IcoGold size={16} />
              {t('home.goToTrading')}
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')} style={{ padding: '14px 28px', fontSize: 14 }}>
              {t('home.exploreFeatures')}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { value: '14+', label: t('home.stats.tradingTools') },
              { value: '24/7', label: t('home.stats.aiMonitoring') },
              { value: '100%', label: t('home.stats.webBased') },
            ].map(s => (
              <div key={s.value}>
                <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-1)', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1, letterSpacing: '-0.02em' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5, letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* white divider pinned to bottom of hero */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: 1,
          background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.25) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.25) 80%, transparent 100%)',
          boxShadow: '0 0 8px 2px rgba(255,255,255,0.12)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />
      </section>

      {/* ── MINDSET BANNER ─────────────────────── */}
      <section className="mindset-banner" style={{
        margin: '0',
        padding: '0px 40px 0px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 40,
        position: 'relative',
        background: 'var(--bg-2)',
        overflow: 'hidden',
      }}>
        {/* BG glows */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: 520, height: '100%', background: 'radial-gradient(ellipse at 80% 50%, rgba(109,40,217,0.10) 0%, rgba(139,92,246,0.04) 40%, transparent 75%)', pointerEvents: 'none' }} />

        {/* Left: text */}
        <div className="mindset-text" style={{ flex: '1 1 52%', minWidth: 0, paddingTop: 25, paddingBottom: 25, textAlign: 'center', alignSelf: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 22,
            padding: '4px 14px', borderRadius: 20,
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
          }}>
            <span style={{ fontSize: 11 }}>🎓</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>{t('home.mindsetBadge')}</span>
          </div>

          {/* Heading */}
          <h2 style={{
            fontSize: 'clamp(34px, 3.8vw, 56px)', fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em', marginBottom: 22, color: 'var(--text-1)',
          }}>
            <span style={{ color: 'var(--text-1)' }}>{t('home.mindsetLine1')}</span><br />
            <span style={{ color: 'var(--gold)' }}>{t('home.mindsetLine2')}</span>
          </h2>

          {/* Quote */}
          <p style={{
            fontSize: 16, fontStyle: 'italic', color: 'var(--text-2)', lineHeight: 1.72,
            marginBottom: 32,
          }}>
            Discipline today, freedom tomorrow.<br />The market rewards patience, not emotion.
          </p>
          {/* CTA */}
          <button
            className="btn btn-gold"
            onClick={() => navigate('/academy')}
            style={{ padding: '14px 30px', fontSize: 14, gap: 10 }}
          >
            <IcoAcademy size={15} />
            {t('home.startLearning')}
          </button>
        </div>

        {/* Right: sitting bull image */}
        <div className="mindset-img" style={{
          flex: '0 0 auto',
          width: 'calc(38% + 40px)',
          position: 'relative',
          alignSelf: 'stretch',
          marginRight: -40,
        }}>
          <img
            src={`${import.meta.env.BASE_URL}whitebull2.png`}
            alt="SEVORA Academy"
            style={{
              width: '100%', height: '100%', display: 'block',
              objectFit: 'cover', objectPosition: 'center top',
              maskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 100%)',
            }}
          />
        </div>

      </section>

    </div>
  )
}
