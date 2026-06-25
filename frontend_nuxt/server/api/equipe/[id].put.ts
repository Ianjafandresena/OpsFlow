import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const body = await readBody(event)
  const { nom, prenom, email, salaire_base } = body

  if (!nom || !prenom || !email) {
    throw createError({ statusCode: 400, statusMessage: 'Nom, prénom et email sont obligatoires' })
  }

  const updateData: any = { nom: nom.trim(), prenom: prenom.trim(), email: email.trim().toLowerCase() }
  if (salaire_base !== undefined) {
    updateData.salaire_base = (salaire_base === '' || salaire_base === null) ? null : parseFloat(String(salaire_base))
  }

  try {
    const updated = await prisma.employe.update({
      where: { id },
      data: updateData,
      include: {
        poste: { include: { departement: true } },
        role: true,
        editionsGerees: { include: { licence: true, ville: true } }
      }
    })
    return updated
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Cet email est déjà utilisé' })
    }
    console.error('Erreur PUT /equipe/:id:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de mettre à jour le profil' })
  }
})
