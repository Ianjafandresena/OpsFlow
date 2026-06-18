import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { nom, employe1Id, employe2Id, employe3Id, employe4Id } = body

  if (!journalId || !nom) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nom requis"
    })
  }

  try {
    const data: any = { nom }
    if (employe1Id !== undefined) data.employe1Id = employe1Id
    if (employe2Id !== undefined) data.employe2Id = employe2Id || null
    if (employe3Id !== undefined) data.employe3Id = employe3Id || null
    if (employe4Id !== undefined) data.employe4Id = employe4Id || null

    const journal = await prisma.journal.update({
      where: { id: journalId },
      data
    })

    return journal
  } catch (error) {
    console.error("Erreur PUT /journals/:id:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de modifier le journal"
    })
  }
})
