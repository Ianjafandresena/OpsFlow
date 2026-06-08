// server/api/auth/logout.post.ts
// Destroy the auth_token cookie properly.
// Must use same path/sameSite options as setCookie to ensure the browser removes it.
export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  })
  return { success: true, message: 'Déconnexion réussie.' }
})
