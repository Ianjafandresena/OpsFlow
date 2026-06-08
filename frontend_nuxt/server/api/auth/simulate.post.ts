export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const posteId = body.posteId

  if (!posteId) throw createError({ statusCode: 400, statusMessage: 'Poste ID requis' })

  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const payload = verifyToken(token)
  if (!payload || !payload.id || payload.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Seul un administrateur peut simuler un rôle' })
  }

  // Vérifier si le poste existe
  const poste = await prisma.poste.findUnique({ where: { id: posteId } })
  if (!poste) throw createError({ statusCode: 404, statusMessage: 'Poste introuvable' })

  // Créer un nouveau token avec simulatedPosteId
  const newToken = signToken({
    id: payload.id,
    email: payload.email,
    role: payload.role,
    simulatedPosteId: poste.id
  })

  setCookie(event, 'auth_token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  })

  return { success: true, message: `Simulation du poste ${poste.titre} activée` }
})
