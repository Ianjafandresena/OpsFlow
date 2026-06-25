import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const reglementId = getRouterParam(event, 'id')
  if (!reglementId) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const body = await readBody(event)
  const { employeIds } = body

  if (!Array.isArray(employeIds)) {
    throw createError({ statusCode: 400, statusMessage: 'employeIds doit être un tableau' })
  }

  try {
    // Replace all assignments
    await prisma.reglementEmploye.deleteMany({ where: { reglementId } })

    if (employeIds.length > 0) {
      await prisma.reglementEmploye.createMany({
        data: (employeIds as string[]).map((employeId: string) => ({ reglementId, employeId }))
      })
    }

    const updated = await prisma.reglement.findUnique({
      where: { id: reglementId },
      include: {
        employes: {
          include: { employe: { select: { id: true, nom: true, prenom: true } } }
        }
      }
    })
    return updated
  } catch (error) {
    console.error('Erreur POST /reglements/:id/assigner:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible d\'assigner les employés' })
  }
})
