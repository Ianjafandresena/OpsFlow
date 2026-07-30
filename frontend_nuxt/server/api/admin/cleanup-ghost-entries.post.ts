// POST /api/admin/cleanup-ghost-entries
// Supprime les entrées journal fantômes des tâches terminées.
// À appeler UNE FOIS manuellement. Données avant fromDate : intactes.
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  const user = verifyToken(token)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Token invalide' })

  const body = await readBody(event).catch(() => ({}))
  const fromDate = body?.fromDate || '2026-07-29'
  const cutoff = new Date(fromDate)

  // Source 1 : tâches avec une entrée tacheTerminee:true AVANT la coupure
  const terminatedBefore = await prisma.entreeJournal.findMany({
    where: {
      date: { lt: cutoff },
      tacheTerminee: true,
      tacheId: { not: null }
    },
    select: { tacheId: true },
    distinct: ['tacheId']
  })

  // Source 2 : tâches dont le statut actuel est "Terminé" ou "Publié"
  // (les entrées historiques peuvent avoir été supprimées par notre fix terminer.post.ts)
  const terminatedTaches = await prisma.tache.findMany({
    where: {
      OR: [
        { statutTache: { libelle: { contains: 'ermin', mode: 'insensitive' } } },
        { statutTache: { libelle: { contains: 'ubli', mode: 'insensitive' } } }
      ],
      entreesJournal: { some: { date: { gte: cutoff } } }
    },
    select: { id: true }
  })

  const tacheIdSet = new Set([
    ...terminatedBefore.map(e => e.tacheId as string),
    ...terminatedTaches.map(t => t.id)
  ])

  if (tacheIdSet.size === 0) {
    return { deleted: 0, tachesAffectees: 0, fromDate, message: 'Aucune entrée fantôme trouvée' }
  }

  // Supprimer toutes les entrées pour ces tâches à partir de la date de coupure
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
    message: `${result.count} entrées fantômes supprimées pour ${tacheIdSet.size} tâche(s) terminée(s)`
  }
})
