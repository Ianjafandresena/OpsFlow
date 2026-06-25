import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const reglements = await prisma.reglement.findMany({
      include: {
        employes: {
          include: {
            employe: { select: { id: true, nom: true, prenom: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return reglements
  } catch (error) {
    console.error('Erreur GET /reglements:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de récupérer les règlements' })
  }
})
