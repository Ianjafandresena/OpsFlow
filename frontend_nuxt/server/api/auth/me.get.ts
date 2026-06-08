export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })

  const payload = verifyToken(token)
  if (!payload || !payload.id) throw createError({ statusCode: 401, statusMessage: 'Session expirée ou invalide' })

  const employe = await prisma.employe.findUnique({
    where: { id: payload.id },
    include: { role: true, poste: { include: { departement: true } } }
  })

  if (!employe || !employe.is_active) throw createError({ statusCode: 401, statusMessage: 'Compte inactif ou introuvable' })

  if (payload.simulatedPosteId) {
    const simulatedPoste = await prisma.poste.findUnique({
      where: { id: payload.simulatedPosteId },
      include: { departement: true }
    })
    if (simulatedPoste) {
      employe.poste = simulatedPoste
      // We also add a flag so the frontend knows it's a simulation
      employe.is_simulated = true
    }
  }

  const { mot_de_passe, ...safeEmploye } = employe
  return safeEmploye
})
