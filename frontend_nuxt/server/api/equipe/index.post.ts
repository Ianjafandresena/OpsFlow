export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.nom || !body.prenom || !body.email || !body.posteId || !body.roleId) {
    throw createError({ statusCode: 400, statusMessage: 'Champs obligatoires manquants' })
  }
  
  if (body.id) {
    // Modification
    return await prisma.employe.update({
      where: { id: body.id },
      data: {
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        posteId: body.posteId,
        roleId: body.roleId
      },
      include: { poste: { include: { departement: true } }, role: true }
    })
  } else {
    // Création
    return await prisma.employe.create({
      data: {
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        posteId: body.posteId,
        roleId: body.roleId
      },
      include: { poste: { include: { departement: true } }, role: true }
    })
  }
})
