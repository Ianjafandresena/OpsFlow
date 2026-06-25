export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.nom || !body.prenom || !body.email || !body.posteId || !body.roleId) {
    throw createError({ statusCode: 400, statusMessage: 'Champs obligatoires manquants' })
  }
  
  const salaireBase = body.salaire_base !== undefined && body.salaire_base !== ''
    ? parseFloat(String(body.salaire_base))
    : undefined

  if (body.id) {
    // Modification
    const updateData: any = {
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      posteId: body.posteId,
      roleId: body.roleId
    }
    if (salaireBase !== undefined) updateData.salaire_base = salaireBase
    return await prisma.employe.update({
      where: { id: body.id },
      data: updateData,
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
        roleId: body.roleId,
        salaire_base: salaireBase ?? 400000
      },
      include: { poste: { include: { departement: true } }, role: true }
    })
  }
})
