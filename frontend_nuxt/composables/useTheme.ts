// composables/useTheme.ts
// Uses a cookie for theme preference so SSR and client agree on the same value,
// eliminating the hydration mismatch caused by localStorage (client-only).

export const useTheme = () => {
  // useState ensures the same state instance is shared across all components
  const isDark = useState<boolean>('app_theme_dark', () => false)

  // useCookie is SSR-safe: readable on both server and client
  const themeCookie = useCookie<'dark' | 'light'>('opsflow_theme', {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    path: '/'
  })

  // Initialize theme from cookie (works on SSR too)
  const initTheme = () => {
    const saved = themeCookie.value
    const prefersDark = import.meta.client
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false

    const shouldBeDark = saved === 'dark' || (!saved && prefersDark)
    isDark.value = shouldBeDark

    if (import.meta.client) {
      if (shouldBeDark) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    }
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    themeCookie.value = isDark.value ? 'dark' : 'light'

    if (import.meta.client) {
      if (isDark.value) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    }
  }

  return { isDark, toggleTheme, initTheme }
}
