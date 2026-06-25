import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const employeId = query.employeId as string

  if (!employeId) {
    throw createError({ statusCode: 400, statusMessage: 'employeId manquant' })
  }

  try {
    const lues = await prisma.tacheLue.findMany({
      where: { employeId },
      select: { tacheId: true }
    })
    return lues.map(l => l.tacheId)
  } catch (error) {
    console.error('Erreur GET /taches/lues:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de récupérer les tâches lues' })
  }
})
