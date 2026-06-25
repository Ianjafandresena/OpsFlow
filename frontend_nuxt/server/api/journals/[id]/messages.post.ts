import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { entreeId, contenu, isAdmin, auteur } = body

  if (!journalId || !entreeId || !contenu?.trim() || !auteur) {
    throw createError({ statusCode: 400, statusMessage: 'Données invalides' })
  }

  try {
    const message = await prisma.commentaireJournal.create({
      data: {
        entreeId,
        contenu: contenu.trim(),
        isAdmin: !!isAdmin,
        auteur
      }
    })

    // If admin sends a message, create a notification for the employee who owns this entry
    if (isAdmin) {
      try {
        const entree = await prisma.entreeJournal.findUnique({
          where: { id: entreeId },
          select: { employeId: true }
        })
        if (entree?.employeId) {
          await prisma.notificationEmploye.create({
            data: {
              type: 'COMMENTAIRE',
              message: `L'administrateur a commenté votre journal : "${contenu.trim().substring(0, 80)}${contenu.trim().length > 80 ? '...' : ''}"`,
              employeId: entree.employeId,
              refId: journalId
            }
          })
        }
      } catch (notifErr) {
        console.error('Erreur création notification commentaire:', notifErr)
      }
    }

    return message
  } catch (error) {
    console.error('Erreur POST /journals/:id/messages:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible d\'envoyer le message' })
  }
})
