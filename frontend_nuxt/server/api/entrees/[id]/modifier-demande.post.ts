export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { motif } = body
  if (!id || !motif?.trim()) throw createError({ statusCode: 400, statusMessage: 'id et motif requis' })

  const entree = await prisma.entreeJournal.update({
    where: { id },
    data: { aVerifier: false, motifModification: motif.trim() },
    include: { employe: { select: { id: true, nom: true, prenom: true } } }
  })

  await prisma.notificationEmploye.create({
    data: {
      type: 'A_MODIFIER',
      message: `Entrée journal du ${new Date(entree.date).toLocaleDateString('fr-FR')} à ${entree.heure} à corriger : ${motif.trim()}`,
      employeId: entree.employe.id,
      refId: entree.id
    }
  })

  return entree
})
