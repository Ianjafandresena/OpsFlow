export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const q = getQuery(event)

  const where: any = { journalId }
  if (q.startDate) where.createdAt = { ...where.createdAt, gte: new Date(String(q.startDate)) }
  if (q.endDate) {
    const end = new Date(String(q.endDate))
    end.setHours(23, 59, 59, 999)
    where.createdAt = { ...where.createdAt, lte: end }
  }

  return await prisma.memo.findMany({
    where,
    include: { auteur: { select: { id: true, nom: true, prenom: true } } },
    orderBy: { createdAt: 'desc' }
  })
})
