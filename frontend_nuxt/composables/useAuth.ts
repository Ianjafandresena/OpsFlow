// composables/useAuth.ts
export const useAuth = () => {
  // useState persists across SSR → client hydration via Nuxt payload
  const user = useState<any>('auth_user', () => null)

  const fetchMe = async () => {
    try {
      // ⚠️ CRITICAL FIX: On SSR, $fetch does NOT automatically forward the browser's
      // cookies to the internal API. We must explicitly pass them via useRequestHeaders.
      // Without this, auth_token is never sent to /api/auth/me on refresh → 401 → redirect to login.
      const headers = import.meta.server
        ? useRequestHeaders(['cookie'])
        : undefined

      const me = await $fetch('/api/auth/me', { headers })
      user.value = me
    } catch {
      user.value = null
    }
  }

  const login = async (email: string, password: string, isAdmin = false) => {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, mot_de_passe: password, isAdminLogin: isAdmin }
    })
    user.value = (res as any).user
    return (res as any).user
  }

  const register = async (data: { nom: string; prenom: string; email: string; mot_de_passe: string }) => {
    return await $fetch('/api/auth/register', { method: 'POST', body: data })
  }

  const logout = async () => {
    try {
      // Server deletes the httpOnly cookie
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    // Clear client state immediately
    user.value = null
    // Navigate to login (replace so user can't go back)
    await navigateTo('/login', { replace: true })
  }

  const isAdmin = computed(() => user.value?.role?.niveau_acces === 'ADMIN')
  const isAuthenticated = computed(() => !!user.value)

  return { user, isAdmin, isAuthenticated, fetchMe, login, logout, register }
}
