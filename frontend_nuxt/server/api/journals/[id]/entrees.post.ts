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
        const entryDate = entree.date ? new Date(entree.date) : dateQuery
        return prisma.entreeJournal.upsert({
          where: {
            journalId_employeId_date_heure: {
              journalId,
              employeId: entree.employeId,
              date: entryDate,
              heure: entree.heure
            }
          },
          update: {
            contenu: entree.contenu,
            commentaire: entree.commentaire,
            admin_commentaire: entree.admin_commentaire !== undefined ? entree.admin_commentaire : undefined,
            lien: entree.lien
          },
          create: {
            journalId,
            employeId: entree.employeId,
            date: entryDate,
            heure: entree.heure,
            contenu: entree.contenu,
            commentaire: entree.commentaire,
            admin_commentaire: entree.admin_commentaire,
            lien: entree.lien
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
