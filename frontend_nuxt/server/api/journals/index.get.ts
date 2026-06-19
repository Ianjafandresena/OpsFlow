import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const journals = await prisma.journal.findMany({
      include: {
        employe1: { select: { id: true, nom: true, prenom: true } },
        employe2: { select: { id: true, nom: true, prenom: true } },
        employe3: { select: { id: true, nom: true, prenom: true } },
        employe4: { select: { id: true, nom: true, prenom: true } },
        editions: {
          include: {
            edition: {
              include: {
                licence: { select: { id: true, sigle: true } },
                ville: { select: { id: true, nom_ville: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return journals
  } catch (error) {
    console.error("Erreur GET /journals:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de récupérer les journaux"
    })
  }
})
