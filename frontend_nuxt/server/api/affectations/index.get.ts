export default defineEventHandler(async (event) => {
  // Récupérer les employés avec leurs affectations
  return await prisma.employe.findMany({
    include: {
      poste: true,
      editionsGerees: {
        include: {
          licence: true,
          ville: true
        }
      }
    },
    orderBy: { nom: 'asc' }
  })
})
