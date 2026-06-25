import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { titre, contenu, employeIds } = body

  if (!titre?.trim() || !contenu?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Titre et contenu sont obligatoires' })
  }

  try {
    const reglement = await prisma.reglement.create({
      data: {
        titre: titre.trim(),
        contenu: contenu.trim(),
        employes: employeIds?.length
          ? { create: (employeIds as string[]).map((id: string) => ({ employeId: id })) }
          : undefined
      },
      include: {
        employes: {
          include: { employe: { select: { id: true, nom: true, prenom: true } } }
        }
      }
    })

    // Create notifications for assigned employees
    if (employeIds?.length) {
      try {
        await prisma.notificationEmploye.createMany({
          data: (employeIds as string[]).map((empId: string) => ({
            type: 'REGLEMENT',
            message: `Nouveau règlement : "${titre.trim()}"`,
            employeId: empId,
            refId: reglement.id
          }))
        })
      } catch (notifErr) {
        console.error('Erreur notifications règlement:', notifErr)
      }
    }

    return reglement
  } catch (error) {
    console.error('Erreur POST /reglements:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de créer le règlement' })
  }
})
