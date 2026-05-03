'use client'

import { useEffect, useState } from 'react'

const storageKey = 'zamakuri-theme'
type ThemeMode = 'auto' | 'light' | 'dark'

const themeOptions: { mode: ThemeMode; label: string }[] = [
  { mode: 'auto', label: 'AUTO' },
  { mode: 'light', label: 'LIGHT' },
  { mode: 'dark', label: 'DARK' },
]

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

  const selectTheme = (nextMode: ThemeMode) => {
    const nextTheme = resolveTheme(nextMode)
    setMode(nextMode)
    setTheme(nextTheme)
    window.localStorage.setItem(storageKey, nextMode)
    applyTheme(nextTheme, nextMode)
  }

  return (
    <div
      className="inline-flex overflow-hidden border border-[#2c6a4b]/22 bg-white/52 p-0.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72)] dark:border-[#d9ffd8]/18 dark:bg-[#07110c]/52"
      role="group"
      aria-label={`表示モード選択。現在は${mode === 'auto' ? `AUTO ${theme.toUpperCase()}` : mode.toUpperCase()}です。`}
    >
      {themeOptions.map((option) => {
        const active = mode === option.mode

        return (
          <button
            key={option.mode}
            type="button"
            onClick={() => selectTheme(option.mode)}
            aria-pressed={active}
            className={[
              'min-h-8 px-2.5 text-[10px] font-semibold tracking-[0.12em] transition sm:px-3 sm:text-[11px]',
              active
                ? 'bg-[#143326] text-[#fffef8] shadow-[0_8px_24px_rgba(44,106,75,0.18)] dark:bg-[#d9ffd8] dark:text-[#07110c]'
                : 'text-[#173b2a]/66 hover:bg-[#fdfaf0] hover:text-[#10291e] dark:text-[#f7fbf1]/68 dark:hover:bg-[#d9ffd8]/10 dark:hover:text-[#f7fbf1]',
            ].join(' ')}
            title={option.mode === 'auto' ? `AUTO: ${theme.toUpperCase()}` : option.label}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
