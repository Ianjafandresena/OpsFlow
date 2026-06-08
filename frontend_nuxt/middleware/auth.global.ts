// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp()

  // ─── Skip during initial client-side hydration ────────────────────
  // Prevents the "flash to login then back" during SSR→client handoff
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) {
    return
  }

  const { user, isAdmin, fetchMe } = useAuth()

  // Load user if not yet in memory
  if (!user.value) {
    await fetchMe()
  }

  const path = to.path

  // ─── /admin/login : accessible à tous sauf les admins déjà connectés ──
  // Un employé non-admin peut y accéder pour s'authentifier comme admin.
  if (path === '/admin/login') {
    if (user.value && isAdmin.value) {
      return navigateTo('/admin') // déjà admin → dashboard admin
    }
    return // sinon : toujours laisser passer
  }

  // ─── /login et /register : redirige si déjà connecté ─────────────
  if (path === '/login' || path === '/register') {
    if (user.value) {
      return isAdmin.value ? navigateTo('/admin') : navigateTo('/employe')
    }
    return
  }

  // ─── Pages protégées : doit être connecté ─────────────────────────
  if (!user.value) {
    if (path.startsWith('/admin')) return navigateTo('/admin/login')
    return navigateTo('/login')
  }

  // ─── Espace admin : réservé aux admins ────────────────────────────
  if (path.startsWith('/admin') && !isAdmin.value) {
    return navigateTo('/employe')
  }
})

