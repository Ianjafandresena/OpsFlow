export default defineEventHandler(async (event) => {
  return await prisma.poste.findMany({
    include: { departement: true },
    orderBy: { titre_poste: 'asc' }
  })
})
