// POST /api/taches/:id/verifier — l'employé soumet la tâche pour validation admin
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id manquant' })

  const tache = await prisma.tache.update({
    where: { id },
    data: { aVerifier: true, motifModification: null },
    include: { employe: { select: { nom: true, prenom: true } } }
  })

  try {
    const admins = await prisma.employe.findMany({
      where: { role: { niveau_acces: 'ADMIN' } },
      select: { id: true }
    })
    for (const admin of admins) {
      await prisma.notificationEmploye.create({
        data: {
          type: 'A_VERIFIER',
          message: `Tâche à vérifier : "${tache.titre}" soumise par ${tache.employe.prenom} ${tache.employe.nom}`,
          employeId: admin.id,
          refId: tache.id
        }
      })
    }
  } catch {}

  return tache
})
