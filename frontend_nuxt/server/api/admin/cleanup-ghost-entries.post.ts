// POST /api/admin/cleanup-ghost-entries
// Supprime les entrées journal fantômes pour les tâches déjà terminées avant une date de coupure.
// À appeler UNE FOIS manuellement après le déploiement du fix rollover.
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  const user = verifyToken(token)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Token invalide' })

  const body = await readBody(event).catch(() => ({}))
  const fromDate = body?.fromDate || '2026-07-29'
  const cutoff = new Date(fromDate)

  // 1. Trouver les tâches qui ont au moins une entrée terminée AVANT la date de coupure
  const terminatedBefore = await prisma.entreeJournal.findMany({
    where: {
      date: { lt: cutoff },
      tacheTerminee: true,
      tacheId: { not: null }
    },
    select: { tacheId: true },
    distinct: ['tacheId']
  })

  const tacheIdSet = new Set(terminatedBefore.map(e => e.tacheId as string))

  if (tacheIdSet.size === 0) {
    return { deleted: 0, tachesAffectees: 0, message: 'Aucune entrée fantôme trouvée' }
  }

  // 3. Supprimer toutes les entrées pour ces tâches à partir de la date de coupure
  const result = await prisma.entreeJournal.deleteMany({
    where: {
      tacheId: { in: [...tacheIdSet] },
      date: { gte: cutoff }
    }
  })

  return {
    deleted: result.count,
    tachesAffectees: tacheIdSet.size,
    fromDate,
    message: `${result.count} entrées fantômes supprimées pour ${tacheIdSet.size} tâche(s)`
  }
})
