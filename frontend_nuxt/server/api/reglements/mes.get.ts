import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const employeId = query.employeId as string

  if (!employeId) {
    throw createError({ statusCode: 400, statusMessage: 'employeId manquant' })
  }

  try {
    const reglements = await prisma.reglement.findMany({
      where: {
        employes: { some: { employeId } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return reglements
  } catch (error) {
    console.error('Erreur GET /reglements/mes:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de récupérer vos règlements' })
  }
})
