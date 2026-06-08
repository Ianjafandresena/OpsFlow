// server/middleware/auth.ts
// Server-side route protection for ALL /api/* routes.
// Runs before every API request. Cannot be bypassed by the client.

// Public routes that don't require a valid session
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/register',
  '/api/auth/me',
]

// Routes that require ADMIN role
const ADMIN_ONLY_PREFIXES = [
  '/api/auth/pending',
  '/api/auth/manage',
  '/api/licences',
  '/api/villes',
  '/api/themes',
  '/api/roles',
  '/api/meta',
]

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname
  const method = event.method

  // Only protect API routes
  if (!path.startsWith('/api/')) return

  // Allow public routes
  if (PUBLIC_ROUTES.some(pub => path.startsWith(pub))) return

  // ─── Token Validation ───────────────────────────────────────
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Authentification requise.' })
  }

  const payload = verifyToken(token)
  if (!payload || !payload.id) {
    throw createError({ statusCode: 401, statusMessage: 'Session expirée ou invalide.' })
  }

  // Attach user payload to the event context for use in handlers
  event.context.user = payload

  // ─── Admin-only route enforcement ──────────────────────────
  const isAdmin = payload.role === 'ADMIN'

  if (ADMIN_ONLY_PREFIXES.some(r => path.startsWith(r))) {
    if (!isAdmin) {
      throw createError({ statusCode: 403, statusMessage: 'Accès refusé. Réservé aux administrateurs.' })
    }
  }

  // Write operations on shared resources restricted to admins
  // (employees can read but not write editions, equipe, postes, affectations)
  const writeOps = ['POST', 'PUT', 'PATCH', 'DELETE']
  const adminWriteRoutes = ['/api/equipe', '/api/affectations', '/api/editions', '/api/postes']
  if (writeOps.includes(method) && adminWriteRoutes.some(r => path.startsWith(r))) {
    if (!isAdmin) {
      throw createError({ statusCode: 403, statusMessage: 'Action réservée aux administrateurs.' })
    }
  }
})
