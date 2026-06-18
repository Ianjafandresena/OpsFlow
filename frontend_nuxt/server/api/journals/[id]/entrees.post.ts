import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { date, entrees } = body

  if (!journalId || !date || !Array.isArray(entrees)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Données invalides"
    })
  }

  try {
    const dateQuery = new Date(date)

    // Using a transaction to upsert each entry
    const results = await prisma.$transaction(
      entrees.map((entree: any) => {
        return prisma.entreeJournal.upsert({
          where: {
            journalId_employeId_date_heure: {
              journalId,
              employeId: entree.employeId,
              date: dateQuery,
              heure: entree.heure
            }
          },
          update: {
            contenu: entree.contenu
          },
          create: {
            journalId,
            employeId: entree.employeId,
            date: dateQuery,
            heure: entree.heure,
            contenu: entree.contenu
          }
        })
      })
    )
    
    return { success: true, count: results.length }
  } catch (error) {
    console.error("Erreur POST /journals/:id/entrees:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de sauvegarder les entrées"
    })
  }
})
