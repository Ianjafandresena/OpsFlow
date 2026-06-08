export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Par défaut, on ne filtre que sur EN_ATTENTE sauf si demandé autrement
  const statut = (query.statut as string) || 'EN_ATTENTE'

  const demandes = await prisma.demandeTache.findMany({
    where: {
      statut: statut
    },
    include: {
      tache: {
        include: {
          employe: {
            include: {
              poste: {
                include: {
                  departement: true
                }
              }
            }
          },
          edition: {
            include: {
              licence: true,
              ville: true
            }
          },
          statutTache: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return demandes
})
