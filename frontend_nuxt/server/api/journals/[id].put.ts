import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { nom } = body

  if (!journalId || !nom) {
    throw createError({
      statusCode: 400,
      statusMessage: "Nom requis"
    })
  }

  try {
    const journal = await prisma.journalActivite.update({
      where: { id: journalId },
      data: { nom }
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
