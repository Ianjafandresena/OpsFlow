import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nom, employe1Id, employe2Id } = body

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
        employe2Id: employe2Id || null
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
