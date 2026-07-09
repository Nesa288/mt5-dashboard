import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LiveMarketProvider } from './context/LiveMarketContext'
import Layout from './components/Layout'
import SplashScreen from './components/SplashScreen'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Gold from './pages/Gold'
import Markets from './pages/Markets'
import Calendar from './pages/Calendar'
import News from './pages/News'
import TradingScenarios from './pages/TradingScenarios'
import Journal from './pages/Journal'
import AIMentor from './pages/AIMentor'
import Academy from './pages/Academy'
import BotDashboard from './pages/BotDashboard'
import Affiliate from './pages/Affiliate'
import Marketplace from './pages/Marketplace'
import Premium from './pages/Premium'
import Login from './pages/Login'

export default function App() {
  const [splash, setSplash] = useState(
    () => !sessionStorage.getItem('sevora_splash_shown')
  )

  function handleSplashDone() {
    sessionStorage.setItem('sevora_splash_shown', '1')
    setSplash(false)
  }

  return (
    <LiveMarketProvider>
      {splash && <SplashScreen onComplete={handleSplashDone} />}
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gold" element={<Gold />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/news" element={<News />} />
        <Route path="/scenarios" element={<TradingScenarios />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/ai-mentor" element={<AIMentor />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/bot-dashboard" element={<BotDashboard />} />
        <Route path="/affiliate" element={<Affiliate />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/premium" element={<Premium />} />
      </Route>
    </Routes>
    </LiveMarketProvider>
  )
}
