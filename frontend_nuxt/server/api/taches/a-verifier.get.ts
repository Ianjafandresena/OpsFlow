// GET /api/taches/a-verifier — tâches + entrées manuelles soumises pour validation
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  if (query.count === 'true') {
    const [tachesCount, entreesCount] = await Promise.all([
      prisma.tache.count({ where: { aVerifier: true } }),
      prisma.entreeJournal.count({ where: { aVerifier: true, tacheId: null } })
    ])
    return { count: tachesCount + entreesCount }
  }

  const [taches, entreesManuelles] = await Promise.all([
    prisma.tache.findMany({
      where: { aVerifier: true },
      include: {
        employe: { select: { id: true, nom: true, prenom: true, poste: { select: { titre_poste: true, departement: { select: { nom_departement: true } } } } } },
        statutTache: true,
        edition: { select: { id: true, licence: { select: { sigle: true } }, ville: { select: { nom_ville: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.entreeJournal.findMany({
      where: { aVerifier: true, tacheId: null },
      include: {
        employe: { select: { id: true, nom: true, prenom: true, poste: { select: { titre_poste: true, departement: { select: { nom_departement: true } } } } } },
        journal: { select: { id: true, nom: true } },
        commentaires: { orderBy: { createdAt: 'asc' } }
      },
      orderBy: { updatedAt: 'desc' }
    })
  ])

  return { taches, entreesManuelles }
})
