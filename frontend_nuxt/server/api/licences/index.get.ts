export default defineEventHandler(async (event) => {
  return await prisma.licence.findMany({
    orderBy: { nom_complet: 'asc' }
  })
})
