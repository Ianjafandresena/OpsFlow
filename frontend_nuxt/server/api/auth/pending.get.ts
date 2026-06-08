// Returns pending accounts
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'Réservé aux admins' })

  return await prisma.employe.findMany({
    where: { is_active: false },
    include: { role: true, poste: { include: { departement: true } } },
    orderBy: { nom: 'asc' }
  })
})
