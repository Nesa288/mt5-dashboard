import React from 'react'
import ReactDOM from 'react-dom/client'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.__SEVORA_VERSION__ = '1.0.6'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { LanguageProvider } from './context/LanguageContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </HashRouter>
  </React.StrictMode>
)
