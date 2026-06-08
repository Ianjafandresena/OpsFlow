export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  
  // Construction du filtre Prisma
  const where: any = {}
  
  if (query.employeId) where.employeId = query.employeId
  if (query.editionId) where.editionId = query.editionId
  if (query.statutTacheId) where.statutTacheId = query.statutTacheId
  
  // Filtrage par typeTache (enum)
  if (query.typeTache) {
    // Supporte un seul type ou une liste séparée par des virgules
    const types = (query.typeTache as string).split(',')
    if (types.length === 1) {
      where.typeTache = types[0]
    } else {
      where.typeTache = { in: types }
    }
  }
  
  if (query.departementNom) {
    where.employe = {
      poste: {
        departement: {
          nom_departement: query.departementNom
        }
      }
    }
  }

  return await prisma.tache.findMany({
    where,
    include: {
      employe: true,
      edition: {
        include: { licence: true, ville: true }
      },
      statutTache: true,
      themePub: true,
      themeSponso: true
    },
    orderBy: { date_limite: 'asc' }
  })
})
