import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const dateStr = query.date as string
  const startDateStr = query.startDate as string
  const endDateStr = query.endDate as string

  if (!journalId || (!dateStr && !startDateStr)) {
    throw createError({
      statusCode: 400,
      statusMessage: "journalId et (date ou startDate/endDate) sont requis"
    })
  }

  try {
    let dateCondition: any = {}
    if (startDateStr && endDateStr) {
      dateCondition = {
        gte: new Date(startDateStr),
        lte: new Date(endDateStr)
      }
    } else if (dateStr) {
      dateCondition = new Date(dateStr)
    }
    
    const entrees = await prisma.entreeJournal.findMany({
      where: {
        journalId,
        date: dateCondition
      },
      include: {
        tache: {
          select: { id: true, titre: true, lien_livrable: true }
        },
        commentaires: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    
    return entrees
  } catch (error) {
    console.error("Erreur GET /journals/:id/entrees:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de récupérer les entrées"
    })
  }
})
