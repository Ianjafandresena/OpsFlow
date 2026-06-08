export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || !body.mot_de_passe) {
    throw createError({ statusCode: 400, statusMessage: 'Email et mot de passe requis.' })
  }

  const employe = await prisma.employe.findUnique({
    where: { email: body.email },
    include: { role: true, poste: { include: { departement: true } } }
  })

  if (!employe || !employe.mot_de_passe) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides.' })
  }

  if (!verifyPassword(body.mot_de_passe, employe.mot_de_passe)) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides.' })
  }

  if (!employe.is_active) {
    throw createError({ statusCode: 403, statusMessage: 'Votre compte est en attente de validation par un administrateur.' })
  }

  const isAdminLogin = body.isAdminLogin === true
  if (isAdminLogin && employe.role.niveau_acces !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Accès refusé. Réservé aux administrateurs.' })
  }

  const token = signToken({ id: employe.id, email: employe.email, role: employe.role.niveau_acces })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  const { mot_de_passe, ...safeEmploye } = employe
  return { success: true, user: safeEmploye }
})
