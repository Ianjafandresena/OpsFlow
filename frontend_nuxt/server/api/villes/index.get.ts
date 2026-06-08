export default defineEventHandler(async (event) => {
  return await prisma.ville.findMany({
    orderBy: { nom_ville: 'asc' }
  })
})
