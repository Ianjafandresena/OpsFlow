export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id manquant' })

  return prisma.historiqueTache.findMany({
    where: { tacheId: id },
    include: { auteur: { select: { id: true, nom: true, prenom: true } } },
    orderBy: { createdAt: 'desc' }
  })
})
