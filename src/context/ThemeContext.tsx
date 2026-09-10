import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const c = useContext(ThemeContext)
  if (!c) throw new Error('useTheme must be inside ThemeProvider')
  return c
}
