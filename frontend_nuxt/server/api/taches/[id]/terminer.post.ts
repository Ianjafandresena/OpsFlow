// POST /api/taches/:id/terminer — marque la tâche comme terminée
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  // Trouver le statut "Terminé"
  const statutTermine = await prisma.statutTache.findFirst({
    where: { OR: [{ libelle: { contains: 'ermin', mode: 'insensitive' } }] }
  })
  if (!statutTermine) throw createError({ statusCode: 404, statusMessage: 'Statut terminé introuvable' })

  const tache = await prisma.tache.update({
    where: { id },
    data: { statutTacheId: statutTermine.id, aVerifier: false, motifModification: null }
  })

  // Marquer toutes les entrées comme terminées
  await prisma.entreeJournal.updateMany({
    where: { tacheId: id },
    data: { tacheTerminee: true }
  })

  // Supprimer les entrées des jours précédents — seule l'entrée du jour de clôture reste
  const now = new Date()
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  await prisma.entreeJournal.deleteMany({
    where: { tacheId: id, date: { lt: todayUTC } }
  })

  return tache
})
