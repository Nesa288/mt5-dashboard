import React from 'react'
import ReactDOM from 'react-dom/client'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
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
