'use client'

import { useEffect, useState } from 'react'

const storageKey = 'zamakuri-theme'
type ThemeMode = 'auto' | 'light' | 'dark'

function resolveTheme(mode: ThemeMode) {
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return mode
}

function applyTheme(theme: 'light' | 'dark', mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.dataset.theme = theme
  document.documentElement.dataset.themeMode = mode
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey)
    const initialMode: ThemeMode = stored === 'dark' || stored === 'light' || stored === 'auto' ? stored : 'auto'
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const sync = (nextMode: ThemeMode) => {
      const nextTheme = resolveTheme(nextMode)
      setMode(nextMode)
      setTheme(nextTheme)
      applyTheme(nextTheme, nextMode)
    }

    sync(initialMode)

    const handleChange = () => {
      const currentMode = (window.localStorage.getItem(storageKey) as ThemeMode | null) ?? 'auto'
      if (currentMode === 'auto') sync('auto')
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    const nextMode: ThemeMode = mode === 'auto' ? 'dark' : mode === 'dark' ? 'light' : 'auto'
    const nextTheme = resolveTheme(nextMode)
    setMode(nextMode)
    setTheme(nextTheme)
    window.localStorage.setItem(storageKey, nextMode)
    applyTheme(nextTheme, nextMode)
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex min-h-9 items-center justify-center border border-[#2c6a4b]/22 bg-white/60 px-3 text-[10px] font-semibold tracking-[0.12em] text-[#173b2a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72)] transition hover:border-[#b89558]/55 hover:bg-[#fdfaf0] hover:text-[#10291e] sm:px-4 sm:text-[11px]"
      title={mode === 'auto' ? `AUTO: ${theme.toUpperCase()}` : mode.toUpperCase()}
      aria-label="表示モードを切り替える"
    >
      {mode === 'auto' ? 'AUTO' : mode === 'dark' ? 'DARK' : 'LIGHT'}
    </button>
  )
}
