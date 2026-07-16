import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const LEVELS_DATA = [
  {
    id: 0,
    label: { sr: 'Nivo 0', en: 'Level 0' },
    title: { sr: 'Apsolutna Nula', en: 'Absolute Zero' },
    subtitle: { sr: 'Pre-Osnove', en: 'Pre-Basics' },
    icon: '🌑',
    color: '#8b5cf6',
    goal: {
      sr: 'Korisnik koji nikad nije čuo za trejdovanje razume šta je tržište i kako uopšte izgleda ceo svet trejdovanja, pre nego što vidimo bilo kakav grafikon.',
      en: 'A user who has never heard of trading understands what a market is and how the entire world of trading works, before seeing any chart.',
    },
    modules: [
      {
        id: 1,
        title: { sr: 'Šta je trgovanje i kako funkcioniše tržište', en: 'What is trading and how the market works' },
        badge: { sr: 'Prvi korak', en: 'First Step' },
        lessons: [
          { id: '1.1', title: { sr: 'Šta znači "trgovati" — analogija sa pazarom i razmenom', en: 'What does "trading" mean — market and exchange analogy' } },
          { id: '1.2', title: { sr: 'Ko su učesnici tržišta (banke, institucije, mali trejderi, market makeri)', en: 'Who are the market participants (banks, institutions, retail traders, market makers)' } },
          { id: '1.3', title: { sr: 'Šta je cena i zašto se menja (ponuda i potražnja — objašnjeno kao pazar)', en: 'What is price and why it changes (supply and demand — explained as a market)' } },
          { id: '1.4', title: { sr: 'Šta je berza/tržište i kako se tamo "sastaju" kupci i prodavci', en: 'What is a stock exchange/market and how buyers and sellers "meet" there' } },
          { id: '1.5', title: { sr: 'Razlika između investiranja i trejdovanja', en: 'The difference between investing and trading' } },
          { id: '1.6', title: { sr: 'Šta je BUY i šta je SELL — najjednostavnije objašnjenje', en: 'What is BUY and what is SELL — the simplest explanation' } },
          { id: '1.7', title: { sr: 'Mit vs realnost — zašto trejdovanje nije "brzo bogaćenje"', en: 'Myth vs reality — why trading is not "get rich quick"' } },
        ],
        milestone: { sr: 'Kviz modula + bedž "Prvi korak"', en: 'Module quiz + "First Step" badge' },
      },
      {
        id: 2,
        title: { sr: 'Osnovni pojmovi tržišta (rečnik za potpune početnike)', en: 'Basic market terms (glossary for complete beginners)' },
        badge: { sr: 'Rečnik trejdera', en: "Trader's Dictionary" },
        lessons: [
          { id: '2.1', title: { sr: 'Šta je broker i čemu služi (analogija: broker kao "kasir" koji te spaja sa tržištem)', en: 'What is a broker and what it does (analogy: broker as a "cashier" connecting you to the market)' } },
          { id: '2.2', title: { sr: 'Šta je platforma za trgovanje (uvod, bez konkretnog softvera još)', en: 'What is a trading platform (introduction, no specific software yet)' } },
          { id: '2.3', title: { sr: 'Šta je CFD (Contract for Difference) — jednostavno objašnjeno', en: 'What is a CFD (Contract for Difference) — simply explained' } },
          { id: '2.4', title: { sr: 'Šta je Forex tržište', en: 'What is the Forex market' } },
          { id: '2.5', title: { sr: 'Šta je leverage (poluga) — analogija sa pozajmljenim novcem', en: 'What is leverage — analogy with borrowed money' } },
          { id: '2.6', title: { sr: 'Šta je margin i zašto je vezan za leverage', en: 'What is margin and why it is tied to leverage' } },
          { id: '2.7', title: { sr: 'Šta je spread i komisija (cena "ulaska" na tržište)', en: 'What is spread and commission (cost of "entering" the market)' } },
          { id: '2.8', title: { sr: 'Šta je swap (prenoćna kamata)', en: 'What is swap (overnight interest)' } },
          { id: '2.9', title: { sr: 'Šta je slippage (klizanje cene)', en: 'What is slippage (price slip)' } },
        ],
        milestone: { sr: 'Kviz modula + bedž "Rečnik trejdera"', en: "Module quiz + \"Trader's Dictionary\" badge" },
      },
      {
        id: 3,
        title: { sr: 'Vrste tržišta i instrumenti', en: 'Types of markets and instruments' },
        badge: { sr: 'Poznavanje tržišta', en: 'Market Knowledge' },
        lessons: [
          { id: '3.1', title: { sr: 'Forex (valute) — kako funkcioniše trgovina parovima valuta', en: 'Forex (currencies) — how currency pair trading works' } },
          { id: '3.2', title: { sr: 'Kripto tržište — osnove', en: 'Crypto market — basics' } },
          { id: '3.3', title: { sr: 'Indeksi (Indices) — šta predstavljaju (npr. korpa najvećih kompanija)', en: 'Indices — what they represent (e.g. basket of the largest companies)' } },
          { id: '3.4', title: { sr: 'Akcije (Stocks) — osnovni koncept vlasništva u kompaniji', en: 'Stocks — basic concept of ownership in a company' } },
          { id: '3.5', title: { sr: 'Zlato i srebro (Gold & Silver) — zašto se trguju kao "sigurna luka"', en: 'Gold & Silver — why they are traded as a "safe haven"' } },
          { id: '3.6', title: { sr: 'Nafta (Oil) — osnove energetskog tržišta', en: 'Oil — basics of the energy market' } },
          { id: '3.7', title: { sr: 'Poređenje tržišta — koje je tržište za koji tip ličnosti/stila', en: 'Market comparison — which market suits which personality/style' } },
        ],
        milestone: { sr: 'Kviz modula + bedž "Poznavanje tržišta"', en: 'Module quiz + "Market Knowledge" badge' },
      },
      {
        id: 4,
        title: { sr: 'Platforme za trgovanje', en: 'Trading Platforms' },
        badge: { sr: 'Spreman za grafikon', en: 'Chart Ready' },
        lessons: [
          { id: '4.1', title: { sr: 'Šta je TradingView i čemu služi (analiza i grafikoni)', en: 'What is TradingView and what it does (analysis and charts)' } },
          { id: '4.2', title: { sr: 'Šta je MetaTrader (MT4/MT5) i čemu služi (izvršavanje trejdova)', en: 'What is MetaTrader (MT4/MT5) and what it does (executing trades)' } },
          { id: '4.3', title: { sr: 'Razlika između demo i live (realnog) naloga', en: 'The difference between demo and live accounts' } },
          { id: '4.4', title: { sr: 'Kako izgleda osnovni interfejs platforme (tura kroz ekran)', en: 'What the basic platform interface looks like (screen tour)' } },
          { id: '4.5', title: { sr: 'Kako se otvara prvi demo nalog — vodič korak po korak', en: 'How to open a first demo account — step by step guide' } },
        ],
        milestone: { sr: 'Praktičan zadatak: otvori demo nalog + bedž "Spreman za grafikon"', en: 'Practical task: open a demo account + "Chart Ready" badge' },
      },
    ],
  },
  {
    id: 1,
    label: { sr: 'Nivo 1', en: 'Level 1' },
    title: { sr: 'Osnove', en: 'Basics' },
    subtitle: { sr: 'Čitanje grafikona', en: 'Chart Reading' },
    icon: '🌱',
    color: '#10b981',
    goal: {
      sr: 'Korisnik ume da pročita grafikon i razume osnovne tehničke termine koje koristi svaki trejder.',
      en: 'The user can read a chart and understands the basic technical terms used by every trader.',
    },
    modules: [
      {
        id: 5,
        title: { sr: 'Kako se čita grafikon', en: 'How to Read a Chart' },
        badge: { sr: 'Čitanje grafikona', en: 'Chart Reading' },
        lessons: [
          { id: '5.1', title: { sr: 'Šta je grafikon cene i zašto postoji', en: 'What is a price chart and why it exists' } },
          { id: '5.2', title: { sr: 'Vrste grafikona (linijski, bar, candlestick) — zašto su sveće standard', en: 'Types of charts (line, bar, candlestick) — why candles are the standard' } },
          { id: '5.3', title: { sr: 'Anatomija sveće (Candle Anatomy) — telo, senke, otvaranje/zatvaranje', en: 'Candle anatomy — body, wicks, open/close' } },
          { id: '5.4', title: { sr: 'Bullish vs Bearish sveća — boja i značenje', en: 'Bullish vs Bearish candle — color and meaning' } },
          { id: '5.5', title: { sr: 'Šta je timeframe (vremenski okvir) — 1m, 5m, 1h, 1D...', en: 'What is a timeframe — 1m, 5m, 1h, 1D...' } },
          { id: '5.6', title: { sr: 'Kako izgled grafikona zavisi od izabranog timeframe-a', en: 'How a chart looks depending on the selected timeframe' } },
        ],
        milestone: { sr: 'Kviz + praktičan zadatak (prepoznaj sveće na grafikonu) + bedž "Čitanje grafikona"', en: 'Quiz + practical task (identify candles on the chart) + "Chart Reading" badge' },
      },
      {
        id: 6,
        title: { sr: 'Tehnički pojmovi koje mora da znaš', en: 'Technical Terms You Must Know' },
        badge: { sr: 'Tehnički rečnik', en: 'Technical Dictionary' },
        lessons: [
          { id: '6.1', title: { sr: 'Pip i Point — najmanja jedinica kretanja cene', en: 'Pip and Point — the smallest unit of price movement' } },
          { id: '6.2', title: { sr: 'Tick — šta predstavlja', en: 'Tick — what it represents' } },
          { id: '6.3', title: { sr: 'Lot, Mini Lot, Micro Lot — veličina pozicije objašnjena kroz primer', en: 'Lot, Mini Lot, Micro Lot — position size explained through an example' } },
          { id: '6.4', title: { sr: 'Kako se računa vrednost pipa u zavisnosti od lota', en: 'How to calculate pip value depending on lot size' } },
          { id: '6.5', title: { sr: 'Margin Call i Stop Out — kada i zašto se to dešava (sa primerom)', en: 'Margin Call and Stop Out — when and why it happens (with an example)' } },
          { id: '6.6', title: { sr: 'Volatilnost — šta znači "tržište je nervozno"', en: 'Volatility — what it means when "the market is nervous"' } },
        ],
        milestone: { sr: 'Kviz + kalkulator-vežba (ručni proračun lota i pipa) + bedž "Tehnički rečnik"', en: 'Quiz + calculator exercise (manual lot and pip calculation) + "Technical Dictionary" badge' },
      },
      {
        id: 7,
        title: { sr: 'Trend i osnovna struktura tržišta', en: 'Trend and Basic Market Structure' },
        badge: { sr: 'Osnove osvojene', en: 'Basics Mastered' },
        lessons: [
          { id: '7.1', title: { sr: 'Šta je trend (uptrend, downtrend, sideways/range)', en: 'What is a trend (uptrend, downtrend, sideways/range)' } },
          { id: '7.2', title: { sr: 'Higher High / Higher Low — kako prepoznati uptrend', en: 'Higher High / Higher Low — how to identify an uptrend' } },
          { id: '7.3', title: { sr: 'Lower High / Lower Low — kako prepoznati downtrend', en: 'Lower High / Lower Low — how to identify a downtrend' } },
          { id: '7.4', title: { sr: 'Range (bočno tržište) — kada tržište "ne odlučuje"', en: "Range (sideways market) — when the market \"can't decide\"" } },
          { id: '7.5', title: { sr: 'Support i Resistance — analogija sa "podom i plafonom"', en: 'Support and Resistance — "floor and ceiling" analogy' } },
          { id: '7.6', title: { sr: 'Kako povući prvu liniju support/resistance na grafikonu', en: 'How to draw the first support/resistance line on a chart' } },
        ],
        milestone: { sr: 'Veliki kviz + praktičan zadatak + simulacija (uoči trend na 5 grafikona) + bedž "Osnove osvojene" + otključavanje Nivoa 2', en: 'Big quiz + practical task + simulation (identify trend on 5 charts) + "Basics Mastered" badge + Level 2 unlock' },
      },
    ],
  },
  {
    id: 2,
    label: { sr: 'Nivo 2', en: 'Level 2' },
    title: { sr: 'Napredni Početnik', en: 'Advanced Beginner' },
    subtitle: { sr: 'Formacije & Indikatori', en: 'Patterns & Indicators' },
    icon: '📈',
    color: '#3b82f6',
    goal: {
      sr: 'Korisnik ume da prepozna candlestick formacije, osnovne indikatore i poveže ponudu/potražnju sa cenom.',
      en: 'The user can identify candlestick patterns, basic indicators and link supply/demand with price.',
    },
    modules: [
      {
        id: 8,
        title: { sr: 'Candlestick formacije (Price Action osnove)', en: 'Candlestick Patterns (Price Action Basics)' },
        badge: { sr: 'Price Action osnove', en: 'Price Action Basics' },
        lessons: [
          { id: '8.1', title: { sr: 'Doji — neodlučnost tržišta', en: 'Doji — market indecision' } },
          { id: '8.2', title: { sr: 'Pin Bar — odbijanje cene', en: 'Pin Bar — price rejection' } },
          { id: '8.3', title: { sr: 'Engulfing (bullish/bearish) — preokret snage', en: 'Engulfing (bullish/bearish) — reversal of strength' } },
          { id: '8.4', title: { sr: 'Inside Bar — "stezanje" pred pokret', en: 'Inside Bar — "compression" before a move' } },
          { id: '8.5', title: { sr: 'Outside Bar — eksplozija volatilnosti', en: 'Outside Bar — volatility explosion' } },
          { id: '8.6', title: { sr: 'Gap — skok cene i šta znači', en: 'Gap — price jump and what it means' } },
        ],
        milestone: { sr: 'Kviz + zadatak prepoznavanja formacija na realnim grafikonima', en: 'Quiz + pattern recognition task on real charts' },
      },
      {
        id: 9,
        title: { sr: 'Ponuda, potražnja i kretanje cene', en: 'Supply, Demand and Price Movement' },
        badge: { sr: 'Price Action osnove', en: 'Price Action Basics' },
        lessons: [
          { id: '9.1', title: { sr: 'Supply i Demand zone — gde su "veliki igrači" ostavili trag', en: 'Supply and Demand zones — where the "big players" left their mark' } },
          { id: '9.2', title: { sr: 'Liquidity (likvidnost) — gde se nalazi novac na tržištu', en: 'Liquidity — where the money is in the market' } },
          { id: '9.3', title: { sr: 'Liquidity Zones — prepoznavanje na grafikonu', en: 'Liquidity Zones — identifying on the chart' } },
          { id: '9.4', title: { sr: 'Breakout — probijanje nivoa', en: 'Breakout — breaking through a level' } },
          { id: '9.5', title: { sr: 'Fake Breakout (lažni probni) — kako da ga ne uloviš', en: 'Fake Breakout — how to avoid falling for it' } },
          { id: '9.6', title: { sr: 'Pullback — povratak na nivo', en: 'Pullback — return to a level' } },
          { id: '9.7', title: { sr: 'Rejection — odbijanje od zone', en: 'Rejection — bouncing off a zone' } },
        ],
        milestone: { sr: 'Kviz + praktičan zadatak (obeleži supply/demand zone) + bedž "Price Action osnove"', en: 'Quiz + practical task (mark supply/demand zones) + "Price Action Basics" badge' },
      },
      {
        id: 10,
        title: { sr: 'Indikatori (osnovni alati)', en: 'Indicators (Basic Tools)' },
        badge: { sr: 'Alati trejdera', en: "Trader's Tools" },
        lessons: [
          { id: '10.1', title: { sr: 'Šta je indikator i zašto se koristi (alat, ne kristalna kugla)', en: 'What is an indicator and why it is used (a tool, not a crystal ball)' } },
          { id: '10.2', title: { sr: 'Moving Average — SMA vs EMA', en: 'Moving Average — SMA vs EMA' } },
          { id: '10.3', title: { sr: 'VWAP — prosečna cena ponderisana volumenom', en: 'VWAP — volume-weighted average price' } },
          { id: '10.4', title: { sr: 'RSI — merenje "umora" trenda', en: 'RSI — measuring trend "fatigue"' } },
          { id: '10.5', title: { sr: 'MACD — merenje momentuma', en: 'MACD — measuring momentum' } },
          { id: '10.6', title: { sr: 'Bollinger Bands — merenje volatilnosti', en: 'Bollinger Bands — measuring volatility' } },
          { id: '10.7', title: { sr: 'ATR — prosečan domet kretanja cene', en: 'ATR — average true range of price movement' } },
        ],
        milestone: { sr: 'Kviz + zadatak (postavi 2 indikatora na TradingView) + bedž "Alati trejdera"', en: "Quiz + task (add 2 indicators on TradingView) + \"Trader's Tools\" badge" },
      },
      {
        id: 11,
        title: { sr: 'Volume i volatilnost', en: 'Volume and Volatility' },
        badge: { sr: 'Napredni početnik', en: 'Advanced Beginner' },
        lessons: [
          { id: '11.1', title: { sr: 'Šta je volume i šta nam govori', en: 'What is volume and what it tells us' } },
          { id: '11.2', title: { sr: 'Momentum — snaga pokreta', en: 'Momentum — the strength of a move' } },
          { id: '11.3', title: { sr: 'Volatilnost kroz sesije (kada se tržište "budi")', en: 'Volatility through sessions (when the market "wakes up")' } },
        ],
        milestone: { sr: 'Veliki kviz + simulacija trejdovanja (1. nivo) + bedž "Napredni početnik" + otključavanje Nivoa 3', en: 'Big quiz + trading simulation (level 1) + "Advanced Beginner" badge + Level 3 unlock' },
      },
    ],
  },
  {
    id: 3,
    label: { sr: 'Nivo 3', en: 'Level 3' },
    title: { sr: 'Srednji Nivo', en: 'Intermediate' },
    subtitle: { sr: 'Smart Money & Fundamentali', en: 'Smart Money & Fundamentals' },
    icon: '🧠',
    color: '#f59e0b',
    goal: {
      sr: 'Korisnik razume strukturu tržišta na profesionalnom nivou (Smart Money koncepti), sesije i fundamentalne vesti.',
      en: 'The user understands market structure at a professional level (Smart Money concepts), sessions and fundamental news.',
    },
    modules: [
      {
        id: 12,
        title: { sr: 'Napredna struktura tržišta (Smart Money osnove)', en: 'Advanced Market Structure (Smart Money Basics)' },
        badge: { sr: 'Smart Money osnove', en: 'Smart Money Basics' },
        lessons: [
          { id: '12.1', title: { sr: 'Market Structure — pregled i povezivanje sa Nivoom 1', en: 'Market Structure — overview and connection to Level 1' } },
          { id: '12.2', title: { sr: 'Break of Structure (BOS) — nastavak trenda', en: 'Break of Structure (BOS) — trend continuation' } },
          { id: '12.3', title: { sr: 'Change of Character (CHoCH) — signal preokreta', en: 'Change of Character (CHoCH) — reversal signal' } },
          { id: '12.4', title: { sr: 'Order Block — gde su institucije ulazile', en: 'Order Block — where institutions entered' } },
          { id: '12.5', title: { sr: 'Fair Value Gap (FVG) — neefikasnost cene', en: 'Fair Value Gap (FVG) — price inefficiency' } },
          { id: '12.6', title: { sr: 'Mitigation — kako cena "popunjava" zonu', en: 'Mitigation — how price "fills" the zone' } },
          { id: '12.7', title: { sr: 'Retest — potvrda nivoa pre nastavka', en: 'Retest — confirming a level before continuation' } },
        ],
        milestone: { sr: 'Kviz + praktična analiza grafikona uživo (live primer) + bedž "Smart Money osnove"', en: 'Quiz + live chart analysis (live example) + "Smart Money Basics" badge' },
      },
      {
        id: 13,
        title: { sr: 'Sesije i fundamentalna analiza', en: 'Sessions and Fundamental Analysis' },
        badge: { sr: 'Fundamentalna osnova', en: 'Fundamental Foundation' },
        lessons: [
          { id: '13.1', title: { sr: 'Trading sesije — Azijska, Londonska, Njujorška', en: 'Trading sessions — Asian, London, New York' } },
          { id: '13.2', title: { sr: 'Preklapanje sesija i zašto je tad najviše kretanja', en: 'Session overlaps and why there is the most movement then' } },
          { id: '13.3', title: { sr: 'Ekonomski kalendar — šta je i kako se koristi', en: 'Economic calendar — what it is and how to use it' } },
          { id: '13.4', title: { sr: 'High Impact News — zašto se izbegava trejdovanje u tim trenucima', en: 'High Impact News — why trading is avoided during those times' } },
          { id: '13.5', title: { sr: 'Kamatne stope (Interest Rates) — uticaj na tržište', en: 'Interest Rates — impact on the market' } },
          { id: '13.6', title: { sr: 'Inflacija (Inflation) i CPI', en: 'Inflation and CPI' } },
          { id: '13.7', title: { sr: 'NFP (Non-Farm Payrolls) — zašto je "najveća vest meseca"', en: 'NFP (Non-Farm Payrolls) — why it is the "biggest news of the month"' } },
          { id: '13.8', title: { sr: 'FOMC — odluke centralne banke', en: 'FOMC — central bank decisions' } },
          { id: '13.9', title: { sr: 'GDP i Unemployment — opšta slika ekonomije', en: 'GDP and Unemployment — the big picture of the economy' } },
        ],
        milestone: { sr: 'Kviz + zadatak (pronađi 3 vesti na ekonomskom kalendaru) + bedž "Fundamentalna osnova"', en: 'Quiz + task (find 3 events on the economic calendar) + "Fundamental Foundation" badge' },
      },
      {
        id: 14,
        title: { sr: 'Risk Management (osnove)', en: 'Risk Management (Basics)' },
        badge: { sr: 'Zaštićen trejder', en: 'Protected Trader' },
        lessons: [
          { id: '14.1', title: { sr: 'Zašto je risk management važniji od strategije', en: 'Why risk management is more important than strategy' } },
          { id: '14.2', title: { sr: 'Position Size — koliko "uložiti" u jedan trejd', en: 'Position Size — how much to "put in" per trade' } },
          { id: '14.3', title: { sr: 'Risk/Reward odnos — objašnjeno kroz primer kockice', en: 'Risk/Reward ratio — explained through a dice example' } },
          { id: '14.4', title: { sr: 'Stop Loss i Take Profit — zaštita i cilj', en: 'Stop Loss and Take Profit — protection and target' } },
          { id: '14.5', title: { sr: 'Margin Call i Stop Out — povezivanje sa Modulom 6', en: 'Margin Call and Stop Out — connecting to Module 6' } },
        ],
        milestone: { sr: 'Veliki kviz + kalkulacija position size na primeru + simulacija + bedž "Zaštićen trejder" + otključavanje Nivoa 4', en: 'Big quiz + position size calculation + simulation + "Protected Trader" badge + Level 4 unlock' },
      },
    ],
  },
  {
    id: 4,
    label: { sr: 'Nivo 4', en: 'Level 4' },
    title: { sr: 'Napredni Nivo', en: 'Advanced Level' },
    subtitle: { sr: 'Psihologija & Strategije', en: 'Psychology & Strategies' },
    icon: '⚡',
    color: '#f97316',
    goal: {
      sr: 'Korisnik upravlja rizikom kao profesionalac, razume psihologiju i počinje da gradi sopstvenu strategiju.',
      en: 'The user manages risk like a professional, understands psychology and begins building their own strategy.',
    },
    modules: [
      {
        id: 15,
        title: { sr: 'Risk Management (napredno)', en: 'Risk Management (Advanced)' },
        badge: { sr: 'Napredno upravljanje rizikom', en: 'Advanced Risk Management' },
        lessons: [
          { id: '15.1', title: { sr: 'Trailing Stop — pomeranje zaštite sa profitom', en: 'Trailing Stop — moving protection with profit' } },
          { id: '15.2', title: { sr: 'Break Even — "trejd koji ne može da izgubi"', en: "Break Even — \"the trade that can't lose\"" } },
          { id: '15.3', title: { sr: 'Scaling (uvećavanje pozicije)', en: 'Scaling (increasing position size)' } },
          { id: '15.4', title: { sr: 'Partial Close — delimično zatvaranje pozicije', en: 'Partial Close — partially closing a position' } },
        ],
        milestone: { sr: 'Kviz + praktičan zadatak na demo nalogu', en: 'Quiz + practical task on demo account' },
      },
      {
        id: 16,
        title: { sr: 'Trading psihologija', en: 'Trading Psychology' },
        badge: { sr: 'Mentalna disciplina', en: 'Mental Discipline' },
        lessons: [
          { id: '16.1', title: { sr: 'Zašto je psihologija 80% uspeha u trejdovanju', en: 'Why psychology is 80% of trading success' } },
          { id: '16.2', title: { sr: 'Disciplina — najvažnija osobina trejdera', en: 'Discipline — the most important trader trait' } },
          { id: '16.3', title: { sr: 'Emocije — kako prepoznati kad odlučuješ emotivno', en: 'Emotions — how to recognize when you are deciding emotionally' } },
          { id: '16.4', title: { sr: 'Greed (pohlepa) — kako uništava nalog', en: 'Greed — how it destroys accounts' } },
          { id: '16.5', title: { sr: 'Fear (strah) — kako te sprečava da pratiš plan', en: 'Fear — how it stops you from following the plan' } },
          { id: '16.6', title: { sr: 'Overtrading — zamka "moram da uhvatim sve"', en: 'Overtrading — the "I must catch everything" trap' } },
          { id: '16.7', title: { sr: 'Revenge Trading — najopasnija navika', en: 'Revenge Trading — the most dangerous habit' } },
          { id: '16.8', title: { sr: 'Kako izgraditi mentalnu rutinu profesionalnog trejdera', en: 'How to build the mental routine of a professional trader' } },
        ],
        milestone: { sr: 'Veliki kviz + lični "psihološki self-assessment" zadatak + bedž "Mentalna disciplina"', en: 'Big quiz + personal "psychological self-assessment" task + "Mental Discipline" badge' },
      },
      {
        id: 17,
        title: { sr: 'Strategije trgovanja', en: 'Trading Strategies' },
        badge: { sr: 'Strateg', en: 'Strategist' },
        lessons: [
          { id: '17.1', title: { sr: 'Šta je strategija i zašto ti treba pisana strategija', en: 'What is a strategy and why you need a written strategy' } },
          { id: '17.2', title: { sr: 'Trend Following strategija', en: 'Trend Following strategy' } },
          { id: '17.3', title: { sr: 'Breakout strategija', en: 'Breakout strategy' } },
          { id: '17.4', title: { sr: 'Reversal (preokret) strategija', en: 'Reversal strategy' } },
          { id: '17.5', title: { sr: 'Scalping — stil brzog trejdovanja', en: 'Scalping — fast trading style' } },
          { id: '17.6', title: { sr: 'Swing Trading — stil trejdovanja na dane/nedelje', en: 'Swing Trading — day/week trading style' } },
          { id: '17.7', title: { sr: 'Kombinovanje koncepata iz Nivoa 2 i 3 u jednu strategiju', en: 'Combining concepts from Level 2 and 3 into one strategy' } },
        ],
        milestone: { sr: 'Kviz + zadatak: izaberi i opiši svoju prvu strategiju + bedž "Strateg"', en: 'Quiz + task: choose and describe your first strategy + "Strategist" badge' },
      },
      {
        id: 18,
        title: { sr: 'Trading Journal i testiranje strategije', en: 'Trading Journal and Strategy Testing' },
        badge: { sr: 'Profesionalna navika', en: 'Professional Habit' },
        lessons: [
          { id: '18.1', title: { sr: 'Šta je Trading Journal i zašto ga svaki profesionalac vodi', en: 'What is a Trading Journal and why every professional keeps one' } },
          { id: '18.2', title: { sr: 'Šta beležiti u journal (ulaz, izlaz, razlog, emocija, rezultat)', en: 'What to record in the journal (entry, exit, reason, emotion, result)' } },
          { id: '18.3', title: { sr: 'Backtesting — testiranje strategije na prošlim podacima', en: 'Backtesting — testing a strategy on historical data' } },
          { id: '18.4', title: { sr: 'Forward Testing — testiranje strategije u realnom vremenu (demo)', en: 'Forward Testing — testing a strategy in real time (demo)' } },
        ],
        milestone: { sr: 'Veliki kviz + zadatak (vodi journal 5 demo trejdova) + simulacija + bedž "Profesionalna navika" + otključavanje Nivoa 5', en: 'Big quiz + task (keep journal for 5 demo trades) + simulation + "Professional Habit" badge + Level 5 unlock' },
      },
    ],
  },
  {
    id: 5,
    label: { sr: 'Nivo 5', en: 'Level 5' },
    title: { sr: 'Profesionalni Nivo', en: 'Professional Level' },
    subtitle: { sr: 'Spreman za Demo', en: 'Ready for Demo' },
    icon: '🏆',
    color: '#d97706',
    goal: {
      sr: 'Korisnik je spreman da samostalno i odgovorno koristi demo nalog, sa kompletnim planom, sa razumevanjem brokera i realnosti tržišta.',
      en: 'The user is ready to independently and responsibly use a demo account, with a complete plan, and understanding of brokers and market reality.',
    },
    modules: [
      {
        id: 19,
        title: { sr: 'Trading plan i checklista', en: 'Trading Plan and Checklist' },
        badge: { sr: 'Plan na papiru', en: 'Plan on Paper' },
        lessons: [
          { id: '19.1', title: { sr: 'Šta je profesionalni trading plan i šta sadrži', en: 'What is a professional trading plan and what it contains' } },
          { id: '19.2', title: { sr: 'Kako napraviti sopstvenu pre-trejd checklistu', en: 'How to create your own pre-trade checklist' } },
          { id: '19.3', title: { sr: 'Pravila za ulazak, izlazak i upravljanje rizikom — pisano pravilo', en: 'Entry, exit and risk management rules — written rules' } },
          { id: '19.4', title: { sr: 'Primer kompletnog trading plana (popunjen šablon)', en: 'Example of a complete trading plan (filled template)' } },
        ],
        milestone: { sr: 'Zadatak: kreiraj sopstveni trading plan + bedž "Plan na papiru"', en: 'Task: create your own trading plan + "Plan on Paper" badge' },
      },
      {
        id: 20,
        title: { sr: 'Live primeri i analiza tržišta', en: 'Live Examples and Market Analysis' },
        badge: { sr: 'Live analiza', en: 'Live Analysis' },
        lessons: [
          { id: '20.1', title: { sr: 'Live primer analize na Forex paru (korak po korak)', en: 'Live analysis example on a Forex pair (step by step)' } },
          { id: '20.2', title: { sr: 'Live primer analize na Zlatu', en: 'Live analysis example on Gold' } },
          { id: '20.3', title: { sr: 'Live primer analize na Indeksu', en: 'Live analysis example on an Index' } },
          { id: '20.4', title: { sr: 'Live primer analize na Kriptu', en: 'Live analysis example on Crypto' } },
          { id: '20.5', title: { sr: 'Kako spojiti tehničku i fundamentalnu analizu u odluku', en: 'How to combine technical and fundamental analysis into a decision' } },
        ],
        milestone: { sr: 'Kviz + simulacija analize na novom grafikonu (provera znanja)', en: 'Quiz + analysis simulation on a new chart (knowledge check)' },
      },
      {
        id: 21,
        title: { sr: 'Najčešće greške početnika', en: 'Most Common Beginner Mistakes' },
        badge: { sr: 'Svesan trejder', en: 'Aware Trader' },
        lessons: [
          { id: '21.1', title: { sr: 'Trejdovanje bez plana', en: 'Trading without a plan' } },
          { id: '21.2', title: { sr: 'Premali stop loss / preveliki lot', en: 'Too small stop loss / too large lot' } },
          { id: '21.3', title: { sr: 'Trejdovanje pred velike vesti', en: 'Trading before major news' } },
          { id: '21.4', title: { sr: 'Praćenje "signala" bez razumevanja', en: 'Following "signals" without understanding' } },
          { id: '21.5', title: { sr: 'Preterano trejdovanje (overtrading) — zamka "moram da uhvatim sve"', en: 'Overtrading — the "I must catch everything" trap' } },
          { id: '21.6', title: { sr: 'Brzo prelaženje na live nalog bez dovoljno demo iskustva', en: 'Rushing to a live account without enough demo experience' } },
          { id: '21.7', title: { sr: 'Nerealna očekivanja o profitu', en: 'Unrealistic profit expectations' } },
        ],
        milestone: { sr: 'Kviz "Prepoznaj grešku" + bedž "Svesan trejder"', en: '"Spot the Mistake" quiz + "Aware Trader" badge' },
      },
      {
        id: 22,
        title: { sr: 'Brokeri, demo i funded nalozi', en: 'Brokers, Demo and Funded Accounts' },
        badge: { sr: 'Informisan trejder', en: 'Informed Trader' },
        lessons: [
          { id: '22.1', title: { sr: 'Kako se bira regulisan broker — na šta paziti', en: 'How to choose a regulated broker — what to watch for' } },
          { id: '22.2', title: { sr: 'Demo nalog — koliko dugo vežbati pre live naloga', en: 'Demo account — how long to practice before going live' } },
          { id: '22.3', title: { sr: 'Funded Accounts (prop firme) — šta su i kako funkcionišu', en: 'Funded Accounts (prop firms) — what they are and how they work' } },
          { id: '22.4', title: { sr: 'Realna očekivanja — edukacija nije garancija profita', en: 'Realistic expectations — education is not a guarantee of profit' } },
        ],
        milestone: { sr: 'Kviz + bedž "Informisan trejder"', en: 'Quiz + "Informed Trader" badge' },
      },
      {
        id: 23,
        title: { sr: 'Priprema za prvi pravi trejd (Završni modul)', en: 'Preparation for the First Real Trade (Final Module)' },
        badge: { sr: 'SEVORA Diploma', en: 'SEVORA Diploma' },
        lessons: [
          { id: '23.1', title: { sr: 'Rezime celog puta — od Nivoa 0 do Nivoa 5', en: 'Summary of the entire journey — from Level 0 to Level 5' } },
          { id: '23.2', title: { sr: 'Finalna checklista pre prvog demo trejda', en: 'Final checklist before the first demo trade' } },
          { id: '23.3', title: { sr: 'Kako postaviti realne ciljeve za sledeća 3 meseca', en: 'How to set realistic goals for the next 3 months' } },
          { id: '23.4', title: { sr: 'Završni veliki ispit (kombinovani kviz svih nivoa)', en: 'Final comprehensive exam (combined quiz of all levels)' } },
          { id: '23.5', title: { sr: 'Finalna simulacija trejdovanja na demo nalogu', en: 'Final trading simulation on a demo account' } },
        ],
        milestone: { sr: 'Završni bedž "SEVORA Diploma — Spreman za Demo" + sertifikat o završenoj edukaciji', en: 'Final badge "SEVORA Diploma — Ready for Demo" + certificate of completed education' },
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

function ModuleCard({ module, isOpen, toggle, levelColor, comingSoonLabel }) {
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
            {module.lessons.length} lec
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
                {comingSoonLabel}
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
  const { t, lang } = useLanguage()
  const L = lang === 'sr' ? 'sr' : 'en'

  const LEVELS = LEVELS_DATA.map(lvl => ({
    ...lvl,
    label: lvl.label[L],
    title: lvl.title[L],
    subtitle: lvl.subtitle[L],
    goal: lvl.goal[L],
    modules: lvl.modules.map(mod => ({
      ...mod,
      title: mod.title[L],
      badge: mod.badge[L],
      milestone: mod.milestone[L],
      lessons: mod.lessons.map(les => ({ ...les, title: les.title[L] })),
    })),
  }))

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
          <h1 className="page-title">{t('academy.title')}</h1>
          <p className="page-subtitle">{t('academy.headerSubtitle')}</p>
        </div>
        <div style={{ display: 'flex', gap: 20, paddingBottom: 4 }}>
          {[
            { value: '6', label: t('academy.levelCount') },
            { value: '23', label: t('academy.moduleCount') },
            { value: `${allLessons}`, label: t('academy.lessonCount') },
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
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>📦 {level.modules.length} {t('academy.moduleLabel')}</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>🎬 {totalLessons} {t('academy.lessonLabel')}</span>
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
            comingSoonLabel={t('academy.comingSoon')}
          />
        ))}
      </div>

    </div>
  )
}
