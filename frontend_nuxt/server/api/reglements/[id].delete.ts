import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  try {
    await prisma.reglement.delete({ where: { id } })
    return { success: true }
  } catch (error) {
    console.error('Erreur DELETE /reglements/:id:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de supprimer le règlement' })
  }
})
