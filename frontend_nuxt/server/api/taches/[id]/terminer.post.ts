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
    data: { statutTacheId: statutTermine.id, aVerifier: false }
  })

  // Marquer les entrées associées comme terminées
  await prisma.entreeJournal.updateMany({
    where: { tacheId: id },
    data: { tacheTerminee: true }
  })

  return tache
})
