import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nom, employe1Id, employe2Id, employe3Id, employe4Id, editionIds } = body

  if (!nom || !employe1Id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Le nom et le premier employé sont obligatoires."
    })
  }

  try {
    const newJournal = await prisma.journal.create({
      data: {
        nom,
        employe1Id,
        employe2Id: employe2Id || null,
        employe3Id: employe3Id || null,
        employe4Id: employe4Id || null,
        editions: editionIds?.length
          ? { create: editionIds.map((editionId: string) => ({ editionId })) }
          : undefined
      },
      include: {
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
      }
    })

    return newJournal
  } catch (error) {
    console.error("Erreur POST /journals:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de créer le journal"
    })
  }
})
