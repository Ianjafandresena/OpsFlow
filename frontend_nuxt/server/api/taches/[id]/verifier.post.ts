// POST /api/taches/:id/verifier — l'employé soumet la tâche pour validation admin
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id manquant' })

  const tache = await prisma.tache.update({
    where: { id },
    data: { aVerifier: true, motifModification: null },
    include: { employe: { select: { nom: true, prenom: true } } }
  })

  return tache
})
