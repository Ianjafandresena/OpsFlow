// POST /api/admin/cleanup-ghost-entries
// Supprime les entrées journal fantômes des tâches terminées/publiées.
// Approche directe : lit les entrées, vérifie le statut de la tâche liée, supprime.
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  const user = verifyToken(token)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Token invalide' })

  const body = await readBody(event).catch(() => ({}))
  const fromDate = body?.fromDate || '2026-07-29'
  const cutoff = new Date(fromDate)

  // Récupérer TOUTES les entrées à partir de la coupure liées à une tâche
  const entries = await prisma.entreeJournal.findMany({
    where: {
      date: { gte: cutoff },
      tacheId: { not: null }
    },
    include: {
      tache: {
        select: { id: true, titre: true, statutTache: { select: { libelle: true } } }
      }
    }
  })

  // Filtrer : entrées dont la tâche est "Terminée" ou "Publiée"
  const toDelete = entries.filter(e => {
    const lib = (e.tache?.statutTache?.libelle || '').toLowerCase()
    return lib.includes('termin') || lib.includes('ubli')
  })

  // Mode debug : retourner les statuts sans supprimer
  if (body?.debug) {
    return {
      totalEntries: entries.length,
      entries: entries.map(e => ({
        date: e.date,
        tacheTerminee: e.tacheTerminee,
        titre: e.tache?.titre,
        statut: e.tache?.statutTache?.libelle,
        tacheId: e.tacheId
      }))
    }
  }

  if (toDelete.length === 0) {
    return {
      deleted: 0,
      totalEntries: entries.length,
      fromDate,
      message: 'Aucune entrée fantôme trouvée parmi ' + entries.length + ' entrées'
    }
  }

  const result = await prisma.entreeJournal.deleteMany({
    where: { id: { in: toDelete.map(e => e.id) } }
  })

  return {
    deleted: result.count,
    totalEntries: entries.length,
    fromDate,
    tachesAffectees: new Set(toDelete.map(e => e.tacheId)).size,
    message: `${result.count} entrées fantômes supprimées`
  }
})
