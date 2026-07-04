const Icon = ({ d, size = 18, color = 'currentColor', fill = 'none', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
)

export const IcoDashboard = (p) => <Icon {...p} d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>} />
export const IcoGold = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><path d="M12 6l1.5 4.5H18l-3.7 2.7 1.4 4.3L12 15l-3.7 2.5 1.4-4.3L6 10.5h4.5z"/></>} fill="currentColor" />
export const IcoMarkets = (p) => <Icon {...p} d="M3 17l4-8 4 4 4-6 4 5" />
export const IcoCalendar = (p) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>} />
export const IcoNews = (p) => <Icon {...p} d={<><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a4 4 0 01-4-4V6"/><path d="M10 9h8M10 13h8M10 17h4"/></>} />
export const IcoScenarios = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/></>} />
export const IcoJournal = (p) => <Icon {...p} d={<><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>} />
export const IcoAcademy = (p) => <Icon {...p} d={<><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>} />
export const IcoAIMentor = (p) => <Icon {...p} d={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1" fill="currentColor"/></>} />
export const IcoBotDashboard = (p) => <Icon {...p} d={<><rect x="3" y="8" width="18" height="14" rx="2"/><path d="M8 8V5.5a2 2 0 014 0V8M16 8V5.5a2 2 0 00-4 0V8M7 16h.01M12 16h.01M17 16h.01"/><path d="M12 2v3"/></>} />
export const IcoAffiliate = (p) => <Icon {...p} d={<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>} />
export const IcoMarketplace = (p) => <Icon {...p} d={<><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></>} />
export const IcoPremium = (p) => <Icon {...p} d="M2 4l3 12h14l3-12-6 7-4-7-4 7z" />
export const IcoLogin = (p) => <Icon {...p} d={<><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></>} />
export const IcoChevronDown = (p) => <Icon {...p} d="M6 9l6 6 6-6" />
export const IcoChevronRight = (p) => <Icon {...p} d="M9 6l6 6-6 6" />
export const IcoArrowUp = (p) => <Icon {...p} d="M12 19V5M5 12l7-7 7 7" />
export const IcoArrowDown = (p) => <Icon {...p} d="M12 5v14M19 12l-7 7-7-7" />
export const IcoTrendUp = (p) => <Icon {...p} d="M22 7l-8.5 8.5-5-5L2 17M16 7h6v6" />
export const IcoTrendDown = (p) => <Icon {...p} d="M22 17l-8.5-8.5-5 5L2 7M16 17h6v-6" />
export const IcoClock = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>} />
export const IcoAlert = (p) => <Icon {...p} d={<><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></>} />
export const IcoInfo = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></>} />
export const IcoCheck = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />
export const IcoX = (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />
export const IcoSearch = (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>} />
export const IcoBell = (p) => <Icon {...p} d={<><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></>} />
export const IcoUser = (p) => <Icon {...p} d={<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />
export const IcoRefresh = (p) => <Icon {...p} d={<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></>} />
export const IcoStar = (p) => <Icon {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
export const IcoCopy = (p) => <Icon {...p} d={<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>} />
export const IcoPlay = (p) => <Icon {...p} d="M5 3l14 9-14 9V3z" fill="currentColor" />
export const IcoStop = (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor"/></>} />
export const IcoBolt = (p) => <Icon {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
export const IcoShield = (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
export const IcoTarget = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></>} />
export const IcoMenu = (p) => <Icon {...p} d={<><path d="M3 12h18M3 6h18M3 18h18"/></>} />
export const IcoWallet = (p) => <Icon {...p} d={<><path d="M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z"/><path d="M16 10h2"/></>} />
