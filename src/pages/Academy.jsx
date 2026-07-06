import { useState } from 'react'

const LEVELS = [
  {
    id: 0,
    label: 'Nivo 0',
    title: 'Apsolutna Nula',
    subtitle: 'Pre-Osnove',
    icon: '🌑',
    color: '#8b5cf6',
    goal: 'Korisnik koji nikad nije čuo za trejdovanje razume šta je tržište i kako uopšte izgleda ceo svet trejdovanja, pre nego što vidimo bilo kakav grafikon.',
    modules: [
      {
        id: 1,
        title: 'Šta je trgovanje i kako funkcioniše tržište',
        badge: 'Prvi korak',
        lessons: [
          { id: '1.1', title: 'Šta znači "trgovati" — analogija sa pazarom i razmenom' },
          { id: '1.2', title: 'Ko su učesnici tržišta (banke, institucije, mali trejderi, market makeri)' },
          { id: '1.3', title: 'Šta je cena i zašto se menja (ponuda i potražnja — objašnjeno kao pazar)' },
          { id: '1.4', title: 'Šta je berza/tržište i kako se tamo "sastaju" kupci i prodavci' },
          { id: '1.5', title: 'Razlika između investiranja i trejdovanja' },
          { id: '1.6', title: 'Šta je BUY i šta je SELL — najjednostavnije objašnjenje' },
          { id: '1.7', title: 'Mit vs realnost — zašto trejdovanje nije "brzo bogaćenje"' },
        ],
        milestone: 'Kviz modula + bedž "Prvi korak"',
      },
      {
        id: 2,
        title: 'Osnovni pojmovi tržišta (rečnik za potpune početnike)',
        badge: 'Rečnik trejdera',
        lessons: [
          { id: '2.1', title: 'Šta je broker i čemu služi (analogija: broker kao "kasir" koji te spaja sa tržištem)' },
          { id: '2.2', title: 'Šta je platforma za trgovanje (uvod, bez konkretnog softvera još)' },
          { id: '2.3', title: 'Šta je CFD (Contract for Difference) — jednostavno objašnjeno' },
          { id: '2.4', title: 'Šta je Forex tržište' },
          { id: '2.5', title: 'Šta je leverage (poluga) — analogija sa pozajmljenim novcem' },
          { id: '2.6', title: 'Šta je margin i zašto je vezan za leverage' },
          { id: '2.7', title: 'Šta je spread i komisija (cena "ulaska" na tržište)' },
          { id: '2.8', title: 'Šta je swap (prenoćna kamata)' },
          { id: '2.9', title: 'Šta je slippage (klizanje cene)' },
        ],
        milestone: 'Kviz modula + bedž "Rečnik trejdera"',
      },
      {
        id: 3,
        title: 'Vrste tržišta i instrumenti',
        badge: 'Poznavanje tržišta',
        lessons: [
          { id: '3.1', title: 'Forex (valute) — kako funkcioniše trgovina parovima valuta' },
          { id: '3.2', title: 'Kripto tržište — osnove' },
          { id: '3.3', title: 'Indeksi (Indices) — šta predstavljaju (npr. korpa najvećih kompanija)' },
          { id: '3.4', title: 'Akcije (Stocks) — osnovni koncept vlasništva u kompaniji' },
          { id: '3.5', title: 'Zlato i srebro (Gold & Silver) — zašto se trguju kao "sigurna luka"' },
          { id: '3.6', title: 'Nafta (Oil) — osnove energetskog tržišta' },
          { id: '3.7', title: 'Poređenje tržišta — koje je tržište za koji tip ličnosti/stila' },
        ],
        milestone: 'Kviz modula + bedž "Poznavanje tržišta"',
      },
      {
        id: 4,
        title: 'Platforme za trgovanje',
        badge: 'Spreman za grafikon',
        lessons: [
          { id: '4.1', title: 'Šta je TradingView i čemu služi (analiza i grafikoni)' },
          { id: '4.2', title: 'Šta je MetaTrader (MT4/MT5) i čemu služi (izvršavanje trejdova)' },
          { id: '4.3', title: 'Razlika između demo i live (realnog) naloga' },
          { id: '4.4', title: 'Kako izgleda osnovni interfejs platforme (tura kroz ekran)' },
          { id: '4.5', title: 'Kako se otvara prvi demo nalog — vodič korak po korak' },
        ],
        milestone: 'Praktičan zadatak: otvori demo nalog + bedž "Spreman za grafikon"',
      },
    ],
  },
  {
    id: 1,
    label: 'Nivo 1',
    title: 'Osnove',
    subtitle: 'Čitanje grafikona',
    icon: '🌱',
    color: '#10b981',
    goal: 'Korisnik ume da pročita grafikon i razume osnovne tehničke termine koje koristi svaki trejder.',
    modules: [
      {
        id: 5,
        title: 'Kako se čita grafikon',
        badge: 'Čitanje grafikona',
        lessons: [
          { id: '5.1', title: 'Šta je grafikon cene i zašto postoji' },
          { id: '5.2', title: 'Vrste grafikona (linijski, bar, candlestick) — zašto su sveće standard' },
          { id: '5.3', title: 'Anatomija sveće (Candle Anatomy) — telo, senke, otvaranje/zatvaranje' },
          { id: '5.4', title: 'Bullish vs Bearish sveća — boja i značenje' },
          { id: '5.5', title: 'Šta je timeframe (vremenski okvir) — 1m, 5m, 1h, 1D...' },
          { id: '5.6', title: 'Kako izgled grafikona zavisi od izabranog timeframe-a' },
        ],
        milestone: 'Kviz + praktičan zadatak (prepoznaj sveće na grafikonu) + bedž "Čitanje grafikona"',
      },
      {
        id: 6,
        title: 'Tehnički pojmovi koje mora da znaš',
        badge: 'Tehnički rečnik',
        lessons: [
          { id: '6.1', title: 'Pip i Point — najmanja jedinica kretanja cene' },
          { id: '6.2', title: 'Tick — šta predstavlja' },
          { id: '6.3', title: 'Lot, Mini Lot, Micro Lot — veličina pozicije objašnjena kroz primer' },
          { id: '6.4', title: 'Kako se računa vrednost pipa u zavisnosti od lota' },
          { id: '6.5', title: 'Margin Call i Stop Out — kada i zašto se to dešava (sa primerom)' },
          { id: '6.6', title: 'Volatilnost — šta znači "tržište je nervozno"' },
        ],
        milestone: 'Kviz + kalkulator-vežba (ručni proračun lota i pipa) + bedž "Tehnički rečnik"',
      },
      {
        id: 7,
        title: 'Trend i osnovna struktura tržišta',
        badge: 'Osnove osvojene',
        lessons: [
          { id: '7.1', title: 'Šta je trend (uptrend, downtrend, sideways/range)' },
          { id: '7.2', title: 'Higher High / Higher Low — kako prepoznati uptrend' },
          { id: '7.3', title: 'Lower High / Lower Low — kako prepoznati downtrend' },
          { id: '7.4', title: 'Range (bočno tržište) — kada tržište "ne odlučuje"' },
          { id: '7.5', title: 'Support i Resistance — analogija sa "podom i plafonom"' },
          { id: '7.6', title: 'Kako povući prvu liniju support/resistance na grafikonu' },
        ],
        milestone: 'Veliki kviz + praktičan zadatak + simulacija (uoči trend na 5 grafikona) + bedž "Osnove osvojene" + otključavanje Nivoa 2',
      },
    ],
  },
  {
    id: 2,
    label: 'Nivo 2',
    title: 'Napredni Početnik',
    subtitle: 'Formacije & Indikatori',
    icon: '📈',
    color: '#3b82f6',
    goal: 'Korisnik ume da prepozna candlestick formacije, osnovne indikatore i poveže ponudu/potražnju sa cenom.',
    modules: [
      {
        id: 8,
        title: 'Candlestick formacije (Price Action osnove)',
        badge: 'Price Action osnove',
        lessons: [
          { id: '8.1', title: 'Doji — neodlučnost tržišta' },
          { id: '8.2', title: 'Pin Bar — odbijanje cene' },
          { id: '8.3', title: 'Engulfing (bullish/bearish) — preokret snage' },
          { id: '8.4', title: 'Inside Bar — "stezanje" pred pokret' },
          { id: '8.5', title: 'Outside Bar — eksplozija volatilnosti' },
          { id: '8.6', title: 'Gap — skok cene i šta znači' },
        ],
        milestone: 'Kviz + zadatak prepoznavanja formacija na realnim grafikonima',
      },
      {
        id: 9,
        title: 'Ponuda, potražnja i kretanje cene',
        badge: 'Price Action osnove',
        lessons: [
          { id: '9.1', title: 'Supply i Demand zone — gde su "veliki igrači" ostavili trag' },
          { id: '9.2', title: 'Liquidity (likvidnost) — gde se nalazi novac na tržištu' },
          { id: '9.3', title: 'Liquidity Zones — prepoznavanje na grafikonu' },
          { id: '9.4', title: 'Breakout — probijanje nivoa' },
          { id: '9.5', title: 'Fake Breakout (lažni probni) — kako da ga ne uloviš' },
          { id: '9.6', title: 'Pullback — povratak na nivo' },
          { id: '9.7', title: 'Rejection — odbijanje od zone' },
        ],
        milestone: 'Kviz + praktičan zadatak (obeleži supply/demand zone) + bedž "Price Action osnove"',
      },
      {
        id: 10,
        title: 'Indikatori (osnovni alati)',
        badge: 'Alati trejdera',
        lessons: [
          { id: '10.1', title: 'Šta je indikator i zašto se koristi (alat, ne kristalna kugla)' },
          { id: '10.2', title: 'Moving Average — SMA vs EMA' },
          { id: '10.3', title: 'VWAP — prosečna cena ponderisana volumenom' },
          { id: '10.4', title: 'RSI — merenje "umora" trenda' },
          { id: '10.5', title: 'MACD — merenje momentuma' },
          { id: '10.6', title: 'Bollinger Bands — merenje volatilnosti' },
          { id: '10.7', title: 'ATR — prosečan domet kretanja cene' },
        ],
        milestone: 'Kviz + zadatak (postavi 2 indikatora na TradingView) + bedž "Alati trejdera"',
      },
      {
        id: 11,
        title: 'Volume i volatilnost',
        badge: 'Napredni početnik',
        lessons: [
          { id: '11.1', title: 'Šta je volume i šta nam govori' },
          { id: '11.2', title: 'Momentum — snaga pokreta' },
          { id: '11.3', title: 'Volatilnost kroz sesije (kada se tržište "budi")' },
        ],
        milestone: 'Veliki kviz + simulacija trejdovanja (1. nivo) + bedž "Napredni početnik" + otključavanje Nivoa 3',
      },
    ],
  },
  {
    id: 3,
    label: 'Nivo 3',
    title: 'Srednji Nivo',
    subtitle: 'Smart Money & Fundamentali',
    icon: '🧠',
    color: '#f59e0b',
    goal: 'Korisnik razume strukturu tržišta na profesionalnom nivou (Smart Money koncepti), sesije i fundamentalne vesti.',
    modules: [
      {
        id: 12,
        title: 'Napredna struktura tržišta (Smart Money osnove)',
        badge: 'Smart Money osnove',
        lessons: [
          { id: '12.1', title: 'Market Structure — pregled i povezivanje sa Nivoom 1' },
          { id: '12.2', title: 'Break of Structure (BOS) — nastavak trenda' },
          { id: '12.3', title: 'Change of Character (CHoCH) — signal preokreta' },
          { id: '12.4', title: 'Order Block — gde su institucije ulazile' },
          { id: '12.5', title: 'Fair Value Gap (FVG) — neefikasnost cene' },
          { id: '12.6', title: 'Mitigation — kako cena "popunjava" zonu' },
          { id: '12.7', title: 'Retest — potvrda nivoa pre nastavka' },
        ],
        milestone: 'Kviz + praktična analiza grafikona uživo (live primer) + bedž "Smart Money osnove"',
      },
      {
        id: 13,
        title: 'Sesije i fundamentalna analiza',
        badge: 'Fundamentalna osnova',
        lessons: [
          { id: '13.1', title: 'Trading sesije — Azijska, Londonska, Njujorška' },
          { id: '13.2', title: 'Preklapanje sesija i zašto je tad najviše kretanja' },
          { id: '13.3', title: 'Ekonomski kalendar — šta je i kako se koristi' },
          { id: '13.4', title: 'High Impact News — zašto se izbegava trejdovanje u tim trenucima' },
          { id: '13.5', title: 'Kamatne stope (Interest Rates) — uticaj na tržište' },
          { id: '13.6', title: 'Inflacija (Inflation) i CPI' },
          { id: '13.7', title: 'NFP (Non-Farm Payrolls) — zašto je "najveća vest meseca"' },
          { id: '13.8', title: 'FOMC — odluke centralne banke' },
          { id: '13.9', title: 'GDP i Unemployment — opšta slika ekonomije' },
        ],
        milestone: 'Kviz + zadatak (pronađi 3 vesti na ekonomskom kalendaru) + bedž "Fundamentalna osnova"',
      },
      {
        id: 14,
        title: 'Risk Management (osnove)',
        badge: 'Zaštićen trejder',
        lessons: [
          { id: '14.1', title: 'Zašto je risk management važniji od strategije' },
          { id: '14.2', title: 'Position Size — koliko "uložiti" u jedan trejd' },
          { id: '14.3', title: 'Risk/Reward odnos — objašnjeno kroz primer kockice' },
          { id: '14.4', title: 'Stop Loss i Take Profit — zaštita i cilj' },
          { id: '14.5', title: 'Margin Call i Stop Out — povezivanje sa Modulom 6' },
        ],
        milestone: 'Veliki kviz + kalkulacija position size na primeru + simulacija + bedž "Zaštićen trejder" + otključavanje Nivoa 4',
      },
    ],
  },
  {
    id: 4,
    label: 'Nivo 4',
    title: 'Napredni Nivo',
    subtitle: 'Psihologija & Strategije',
    icon: '⚡',
    color: '#f97316',
    goal: 'Korisnik upravlja rizikom kao profesionalac, razume psihologiju i počinje da gradi sopstvenu strategiju.',
    modules: [
      {
        id: 15,
        title: 'Risk Management (napredno)',
        badge: 'Napredno upravljanje rizikom',
        lessons: [
          { id: '15.1', title: 'Trailing Stop — pomeranje zaštite sa profitom' },
          { id: '15.2', title: 'Break Even — "trejd koji ne može da izgubi"' },
          { id: '15.3', title: 'Scaling (uvećavanje pozicije)' },
          { id: '15.4', title: 'Partial Close — delimično zatvaranje pozicije' },
        ],
        milestone: 'Kviz + praktičan zadatak na demo nalogu',
      },
      {
        id: 16,
        title: 'Trading psihologija',
        badge: 'Mentalna disciplina',
        lessons: [
          { id: '16.1', title: 'Zašto je psihologija 80% uspeha u trejdovanju' },
          { id: '16.2', title: 'Disciplina — najvažnija osobina trejdera' },
          { id: '16.3', title: 'Emocije — kako prepoznati kad odlučuješ emotivno' },
          { id: '16.4', title: 'Greed (pohlepa) — kako uništava nalog' },
          { id: '16.5', title: 'Fear (strah) — kako te sprečava da pratiš plan' },
          { id: '16.6', title: 'Overtrading — zamka "moram da uhvatim sve"' },
          { id: '16.7', title: 'Revenge Trading — najopasnija navika' },
          { id: '16.8', title: 'Kako izgraditi mentalnu rutinu profesionalnog trejdera' },
        ],
        milestone: 'Veliki kviz + lični "psihološki self-assessment" zadatak + bedž "Mentalna disciplina"',
      },
      {
        id: 17,
        title: 'Strategije trgovanja',
        badge: 'Strateg',
        lessons: [
          { id: '17.1', title: 'Šta je strategija i zašto ti treba pisana strategija' },
          { id: '17.2', title: 'Trend Following strategija' },
          { id: '17.3', title: 'Breakout strategija' },
          { id: '17.4', title: 'Reversal (preokret) strategija' },
          { id: '17.5', title: 'Scalping — stil brzog trejdovanja' },
          { id: '17.6', title: 'Swing Trading — stil trejdovanja na dane/nedelje' },
          { id: '17.7', title: 'Kombinovanje koncepata iz Nivoa 2 i 3 u jednu strategiju' },
        ],
        milestone: 'Kviz + zadatak: izaberi i opiši svoju prvu strategiju + bedž "Strateg"',
      },
      {
        id: 18,
        title: 'Trading Journal i testiranje strategije',
        badge: 'Profesionalna navika',
        lessons: [
          { id: '18.1', title: 'Šta je Trading Journal i zašto ga svaki profesionalac vodi' },
          { id: '18.2', title: 'Šta beležiti u journal (ulaz, izlaz, razlog, emocija, rezultat)' },
          { id: '18.3', title: 'Backtesting — testiranje strategije na prošlim podacima' },
          { id: '18.4', title: 'Forward Testing — testiranje strategije u realnom vremenu (demo)' },
        ],
        milestone: 'Veliki kviz + zadatak (vodi journal 5 demo trejdova) + simulacija + bedž "Profesionalna navika" + otključavanje Nivoa 5',
      },
    ],
  },
  {
    id: 5,
    label: 'Nivo 5',
    title: 'Profesionalni Nivo',
    subtitle: 'Spreman za Demo',
    icon: '🏆',
    color: '#d97706',
    goal: 'Korisnik je spreman da samostalno i odgovorno koristi demo nalog, sa kompletnim planom, sa razumevanjem brokera i realnosti tržišta.',
    modules: [
      {
        id: 19,
        title: 'Trading plan i checklista',
        badge: 'Plan na papiru',
        lessons: [
          { id: '19.1', title: 'Šta je profesionalni trading plan i šta sadrži' },
          { id: '19.2', title: 'Kako napraviti sopstvenu pre-trejd checklistu' },
          { id: '19.3', title: 'Pravila za ulazak, izlazak i upravljanje rizikom — pisano pravilo' },
          { id: '19.4', title: 'Primer kompletnog trading plana (popunjen šablon)' },
        ],
        milestone: 'Zadatak: kreiraj sopstveni trading plan + bedž "Plan na papiru"',
      },
      {
        id: 20,
        title: 'Live primeri i analiza tržišta',
        badge: 'Live analiza',
        lessons: [
          { id: '20.1', title: 'Live primer analize na Forex paru (korak po korak)' },
          { id: '20.2', title: 'Live primer analize na Zlatu' },
          { id: '20.3', title: 'Live primer analize na Indeksu' },
          { id: '20.4', title: 'Live primer analize na Kriptu' },
          { id: '20.5', title: 'Kako spojiti tehničku i fundamentalnu analizu u odluku' },
        ],
        milestone: 'Kviz + simulacija analize na novom grafikonu (provera znanja)',
      },
      {
        id: 21,
        title: 'Najčešće greške početnika',
        badge: 'Svesan trejder',
        lessons: [
          { id: '21.1', title: 'Trejdovanje bez plana' },
          { id: '21.2', title: 'Premali stop loss / preveliki lot' },
          { id: '21.3', title: 'Trejdovanje pred velike vesti' },
          { id: '21.4', title: 'Praćenje "signala" bez razumevanja' },
          { id: '21.5', title: 'Preterano trejdovanje (overtrading) — zamka "moram da uhvatim sve"' },
          { id: '21.6', title: 'Brzo prelaženje na live nalog bez dovoljno demo iskustva' },
          { id: '21.7', title: 'Nerealna očekivanja o profitu' },
        ],
        milestone: 'Kviz "Prepoznaj grešku" + bedž "Svesan trejder"',
      },
      {
        id: 22,
        title: 'Brokeri, demo i funded nalozi',
        badge: 'Informisan trejder',
        lessons: [
          { id: '22.1', title: 'Kako se bira regulisan broker — na šta paziti' },
          { id: '22.2', title: 'Demo nalog — koliko dugo vežbati pre live naloga' },
          { id: '22.3', title: 'Funded Accounts (prop firme) — šta su i kako funkcionišu' },
          { id: '22.4', title: 'Realna očekivanja — edukacija nije garancija profita' },
        ],
        milestone: 'Kviz + bedž "Informisan trejder"',
      },
      {
        id: 23,
        title: 'Priprema za prvi pravi trejd (Završni modul)',
        badge: 'SEVORA Diploma',
        lessons: [
          { id: '23.1', title: 'Rezime celog puta — od Nivoa 0 do Nivoa 5' },
          { id: '23.2', title: 'Finalna checklista pre prvog demo trejda' },
          { id: '23.3', title: 'Kako postaviti realne ciljeve za sledeća 3 meseca' },
          { id: '23.4', title: 'Završni veliki ispit (kombinovani kviz svih nivoa)' },
          { id: '23.5', title: 'Finalna simulacija trejdovanja na demo nalogu' },
        ],
        milestone: 'Završni bedž "SEVORA Diploma — Spreman za Demo" + sertifikat o završenoj edukaciji',
      },
    ],
  },
]

function ChevronIcon({ open }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s ease', flexShrink: 0 }}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function LevelCard({ level, active, onClick }) {
  const totalLessons = level.modules.reduce((a, m) => a + m.lessons.length, 0)
  return (
    <button onClick={onClick} style={{
      flex: '0 0 auto',
      minWidth: 148,
      padding: '14px 16px',
      borderRadius: 14,
      border: active ? `1.5px solid ${level.color}` : '1px solid rgba(255,255,255,0.07)',
      background: active ? `${level.color}15` : 'rgba(255,255,255,0.025)',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s',
      outline: 'none',
    }}>
      <div style={{ fontSize: 26, lineHeight: 1, marginBottom: 9 }}>{level.icon}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: level.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{level.label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: active ? 'var(--text-1)' : 'var(--text-2)', lineHeight: 1.3, marginBottom: 7 }}>{level.title}</div>
      <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{level.modules.length} mod · {totalLessons} lec</div>
    </button>
  )
}

function ModuleCard({ module, isOpen, toggle, levelColor }) {
  return (
    <div style={{
      borderRadius: 12,
      border: `1px solid ${isOpen ? levelColor + '30' : 'rgba(255,255,255,0.07)'}`,
      background: isOpen ? `${levelColor}08` : 'rgba(255,255,255,0.02)',
      marginBottom: 8,
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      <button onClick={toggle} style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '15px 18px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        outline: 'none',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: `${levelColor}18`,
          border: `1px solid ${levelColor}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, color: levelColor,
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          {String(module.id).padStart(2, '0')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1.4 }}>{module.title}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
            {module.lessons.length} lekcija
            {module.badge && (
              <span style={{ marginLeft: 8, color: levelColor, opacity: 0.8 }}>· 🎖 {module.badge}</span>
            )}
          </div>
        </div>
        <div style={{ color: 'var(--text-3)' }}>
          <ChevronIcon open={isOpen} />
        </div>
      </button>

      {isOpen && (
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
          {module.lessons.map((lesson, idx) => (
            <div key={lesson.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 18px 11px 22px',
              borderBottom: idx < module.lessons.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.15s',
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: levelColor,
                background: `${levelColor}12`,
                border: `1px solid ${levelColor}28`,
                borderRadius: 6, padding: '2px 7px',
                fontFamily: "'Space Grotesk', sans-serif",
                flexShrink: 0, letterSpacing: '0.02em',
              }}>
                {lesson.id}
              </span>
              <div style={{ flex: 1, fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{lesson.title}</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontSize: 10, color: 'var(--text-3)',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 6, padding: '3px 9px',
                flexShrink: 0,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.6 }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
                Uskoro
              </div>
            </div>
          ))}

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '12px 18px',
            background: 'rgba(245,158,11,0.05)',
            borderTop: '1px solid rgba(245,158,11,0.14)',
          }}>
            <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>🏁</span>
            <div style={{ fontSize: 12, color: 'rgba(245,158,11,0.8)', lineHeight: 1.6 }}>{module.milestone}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Academy() {
  const [activeLevel, setActiveLevel] = useState(0)
  const [openModules, setOpenModules] = useState(new Set([1]))

  const level = LEVELS[activeLevel]
  const totalLessons = level.modules.reduce((a, m) => a + m.lessons.length, 0)
  const allLessons = LEVELS.reduce((a, l) => a + l.modules.reduce((b, m) => b + m.lessons.length, 0), 0)

  const toggleModule = (id) => {
    setOpenModules(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const switchLevel = (id) => {
    setActiveLevel(id)
    setOpenModules(new Set([LEVELS[id].modules[0].id]))
  }

  return (
    <div className="page-inner" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Akademija</h1>
          <p className="page-subtitle">Od apsolutne nule do profesionalnog trejdera</p>
        </div>
        <div style={{ display: 'flex', gap: 20, paddingBottom: 4 }}>
          {[
            { value: '6', label: 'Nivoa' },
            { value: '23', label: 'Modula' },
            { value: `${allLessons}`, label: 'Lekcija' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)', fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Level path */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
        {LEVELS.map(lvl => (
          <LevelCard key={lvl.id} level={lvl} active={activeLevel === lvl.id} onClick={() => switchLevel(lvl.id)} />
        ))}
      </div>

      {/* Active level banner */}
      <div className="glass" style={{
        padding: '18px 22px',
        borderLeft: `3px solid ${level.color}`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}>
        <span style={{ fontSize: 34, lineHeight: 1, flexShrink: 0 }}>{level.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: level.color, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
            {level.label} — {level.subtitle}
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-1)', marginBottom: 8 }}>{level.title}</div>
          <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.65, margin: '0 0 10px' }}>🎯 {level.goal}</p>
          <div style={{ display: 'flex', gap: 18 }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>📦 {level.modules.length} modula</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>🎬 {totalLessons} lekcija</span>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div>
        {level.modules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            isOpen={openModules.has(module.id)}
            toggle={() => toggleModule(module.id)}
            levelColor={level.color}
          />
        ))}
      </div>

    </div>
  )
}
