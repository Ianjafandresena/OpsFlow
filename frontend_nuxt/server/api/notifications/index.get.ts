import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const employeId = query.employeId as string

  if (!employeId) {
    throw createError({ statusCode: 400, statusMessage: 'employeId manquant' })
  }

  try {
    const notifications = await prisma.notificationEmploye.findMany({
      where: { employeId, lue: false },
      orderBy: { createdAt: 'desc' }
    })
    return notifications
  } catch (error) {
    console.error('Erreur GET /notifications:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de récupérer les notifications' })
  }
})
