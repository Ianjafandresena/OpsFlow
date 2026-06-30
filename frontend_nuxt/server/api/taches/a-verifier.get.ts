// GET /api/taches/a-verifier — liste des tâches soumises pour validation
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (query.count === 'true') {
    const count = await prisma.tache.count({ where: { aVerifier: true } })
    return { count }
  }

  const taches = await prisma.tache.findMany({
    where: { aVerifier: true },
    include: {
      employe: { select: { id: true, nom: true, prenom: true, poste: { select: { titre_poste: true, departement: { select: { nom_departement: true } } } } } },
      statutTache: true,
      edition: { select: { id: true, licence: { select: { sigle: true } }, ville: { select: { nom_ville: true } } } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return taches
})
