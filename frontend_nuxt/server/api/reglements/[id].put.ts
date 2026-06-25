import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const body = await readBody(event)
  const { titre, contenu, employeIds } = body

  if (!titre?.trim() || !contenu?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Titre et contenu sont obligatoires' })
  }

  try {
    // Delete all existing assignments then re-create
    await prisma.reglementEmploye.deleteMany({ where: { reglementId: id } })

    const updated = await prisma.reglement.update({
      where: { id },
      data: {
        titre: titre.trim(),
        contenu: contenu.trim(),
        employes: employeIds?.length
          ? { create: (employeIds as string[]).map((empId: string) => ({ employeId: empId })) }
          : undefined
      },
      include: {
        employes: {
          include: { employe: { select: { id: true, nom: true, prenom: true } } }
        }
      }
    })
    return updated
  } catch (error) {
    console.error('Erreur PUT /reglements/:id:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de mettre à jour le règlement' })
  }
})
