export default defineEventHandler(async (event) => {
  const liens = await prisma.lienImportant.findMany({
    include: {
      auteur: { select: { id: true, nom: true, prenom: true } },
      modifiePar: { select: { id: true, nom: true, prenom: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  return liens
})
