export default defineEventHandler(async (event) => {
  return await prisma.editionPage.findMany({
    include: {
      licence: true,
      ville: true
    },
    orderBy: { date_debut: 'asc' }
  })
})
