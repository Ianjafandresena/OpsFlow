// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp()

  // ─── Skip during initial client-side hydration ────────────────────
  // During SSR→client handoff, user state may not yet be restored.
  // Skipping here prevents the "flash to login then back" symptom.
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    return
  }

  const publicRoutes = ['/login', '/register', '/admin/login']
  const isPublicRoute = publicRoutes.includes(to.path)

  const { user, isAdmin, fetchMe } = useAuth()

  // Load user if not yet in memory
  if (!user.value) {
    await fetchMe()
  }

  // ─── Already logged in → redirect away from login/register pages ──
  if (user.value && isPublicRoute) {
    if (to.path === '/admin/login') {
      return isAdmin.value ? navigateTo('/admin') : navigateTo('/employe')
    }
    return isAdmin.value ? navigateTo('/admin') : navigateTo('/employe')
  }

  // ─── Not logged in → redirect to login ───────────────────────────
  if (!user.value && !isPublicRoute) {
    if (to.path.startsWith('/admin')) return navigateTo('/admin/login')
    return navigateTo('/login')
  }

  // ─── Logged in but not admin → block admin space ──────────────────
  if (to.path.startsWith('/admin') && !isAdmin.value) {
    return navigateTo('/employe')
  }
})

