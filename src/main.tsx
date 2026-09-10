import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

// Apply saved/preferred theme immediately, before first paint, to avoid a flash.
;(function initTheme() {
  const saved = localStorage.getItem('theme')
  const theme =
    saved === 'light' || saved === 'dark'
      ? saved
      : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  document.documentElement.setAttribute('data-theme', theme)
})()

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
