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
    return message
  } catch (error) {
    console.error('Erreur POST /journals/:id/messages:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible d\'envoyer le message' })
  }
})
