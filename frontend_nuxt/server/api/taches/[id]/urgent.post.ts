export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const tache = await prisma.tache.findUnique({ where: { id }, select: { urgent: true } })
  if (!tache) throw createError({ statusCode: 404, statusMessage: 'Tâche introuvable' })

  return prisma.tache.update({
    where: { id },
    data: { urgent: !tache.urgent },
    select: { id: true, urgent: true }
  })
})
