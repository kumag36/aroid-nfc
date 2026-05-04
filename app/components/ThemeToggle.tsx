'use client'

import { useEffect, useState } from 'react'

const storageKey = 'zamakuri-theme'
type ThemeMode = 'auto' | 'light' | 'dark'

const themeOptions: { mode: ThemeMode; label: string }[] = [
  { mode: 'auto', label: '自動' },
  { mode: 'light', label: '明' },
  { mode: 'dark', label: '暗' },
]

function resolveTheme(mode: ThemeMode) {
  if (mode === 'auto') return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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

  const selectTheme = (nextMode: ThemeMode) => {
    const nextTheme = resolveTheme(nextMode)
    setMode(nextMode)
    setTheme(nextTheme)
    window.localStorage.setItem(storageKey, nextMode)
    applyTheme(nextTheme, nextMode)
  }

  return (
    <div className="zmk-theme-toggle inline-flex shrink-0 gap-1 border border-[#10291e]/18 bg-white/75 p-1 dark:border-[#d9ffd8]/18 dark:bg-[#07110c]/70" role="group" aria-label={`表示モード選択。現在は${mode === 'auto' ? `自動 ${theme}` : mode}です`}>
      {themeOptions.map((option) => {
        const active = mode === option.mode
        return (
          <button
            key={option.mode}
            type="button"
            onClick={() => selectTheme(option.mode)}
            aria-pressed={active}
            className={[
              'min-h-8 min-w-8 px-2 text-[11px] font-extrabold leading-none transition sm:min-w-10',
              active ? 'bg-[#123d2b] text-white dark:bg-[#d9ffd8] dark:text-[#07110c]' : 'text-[#10291e] dark:text-[#f7fbf1]',
            ].join(' ')}
            title={option.mode === 'auto' ? `自動: ${theme}` : option.label}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}