export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const entree = await prisma.entreeJournal.findUnique({ where: { id }, select: { urgent: true } })
  if (!entree) throw createError({ statusCode: 404, statusMessage: 'Entrée introuvable' })

  return prisma.entreeJournal.update({
    where: { id },
    data: { urgent: !entree.urgent },
    select: { id: true, urgent: true }
  })
})
