// POST /api/taches/:id/modifier-demande — l'admin demande des modifications à l'employé
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { motif } = body

  if (!id || !motif?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'id et motif requis' })
  }

  const tache = await prisma.tache.update({
    where: { id },
    data: { aVerifier: false, motifModification: motif.trim() },
    include: { employe: { select: { id: true, nom: true, prenom: true } } }
  })

  // Notifier l'employé
  await prisma.notificationEmploye.create({
    data: {
      type: 'A_MODIFIER',
      message: `Tâche "${tache.titre}" à corriger : ${motif}`,
      employeId: tache.employe.id,
      refId: tache.id
    }
  })

  return tache
})
