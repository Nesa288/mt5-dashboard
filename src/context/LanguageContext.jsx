import { createContext, useContext, useState, useCallback } from 'react'
import en from '../translations/en'
import sr from '../translations/sr'

const translations = { en, sr }

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('sevora_lang') || 'en')

  const switchLang = useCallback((newLang) => {
    setLang(newLang)
    localStorage.setItem('sevora_lang', newLang)
  }, [])

  const t = useCallback((key) => {
    const keys = key.split('.')
    let value = translations[lang]
    for (const k of keys) {
      if (value === undefined) return key
      value = value[k]
    }
    return value ?? key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
