import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')

  if (!journalId) {
    throw createError({ statusCode: 400, statusMessage: 'ID manquant' })
  }

  try {
    await prisma.journal.delete({ where: { id: journalId } })
    return { success: true }
  } catch (error) {
    console.error('Erreur DELETE /journals/:id:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de supprimer le journal' })
  }
})
