import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const tacheId = getRouterParam(event, 'id')
  if (!tacheId) throw createError({ statusCode: 400, statusMessage: 'ID tâche manquant' })

  const body = await readBody(event)
  const { employeId } = body

  if (!employeId) {
    throw createError({ statusCode: 400, statusMessage: 'employeId manquant' })
  }

  try {
    const record = await prisma.tacheLue.upsert({
      where: { tacheId_employeId: { tacheId, employeId } },
      create: { tacheId, employeId },
      update: { luAt: new Date() }
    })
    return record
  } catch (error) {
    console.error('Erreur POST /taches/:id/lu:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de marquer la tâche comme lue' })
  }
})
