// GET /api/employes/:id/journal
// Retourne les tâches d'un employé pour une date donnée (par défaut aujourd'hui)
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  // Date cible (par défaut aujourd'hui)
  const dateStr = query.date as string | undefined
  const targetDate = dateStr ? new Date(dateStr) : new Date()
  
  // Bornes de la journée ciblée
  const startOfDay = new Date(targetDate)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(targetDate)
  endOfDay.setHours(23, 59, 59, 999)

  // Tâches deadline dans la journée OU créées ce jour
  const taches = await prisma.tache.findMany({
    where: {
      employeId: id,
      OR: [
        // Tâches dont la deadline est dans la journée
        {
          date_limite: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        // Tâches créées ce jour
        {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      ]
    },
    include: {
      statutTache: true,
      edition: {
        include: { licence: true, ville: true }
      },
      themePub: true,
      themeSponso: true
    },
    orderBy: { date_limite: 'asc' }
  })

  return {
    date: targetDate.toISOString().split('T')[0],
    taches: taches
  }
})
