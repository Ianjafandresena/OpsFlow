import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { employeId, type } = body

  if (!employeId) {
    throw createError({ statusCode: 400, statusMessage: 'employeId manquant' })
  }

  try {
    const where: any = { employeId, lue: false }
    if (type) where.type = type

    await prisma.notificationEmploye.updateMany({
      where,
      data: { lue: true }
    })
    return { success: true }
  } catch (error) {
    console.error('Erreur POST /notifications/marquer-lu:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de marquer les notifications comme lues' })
  }
})
