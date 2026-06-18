import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const dateStr = query.date as string

  if (!journalId || !dateStr) {
    throw createError({
      statusCode: 400,
      statusMessage: "journalId et date sont requis"
    })
  }

  try {
    const dateQuery = new Date(dateStr)
    // Fix issue where midnight UTC matches another day if there's a timezone difference,
    // Since it's a date only, we just search for exactly this date if saved properly, or a range
    
    const entrees = await prisma.entreeJournal.findMany({
      where: {
        journalId,
        date: dateQuery
      },
      include: {
        tache: {
          select: { id: true, titre: true, lien_livrable: true }
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
