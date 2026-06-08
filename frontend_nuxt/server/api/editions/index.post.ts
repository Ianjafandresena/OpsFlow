export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.licenceId || !body.villeId) {
    throw createError({ statusCode: 400, statusMessage: 'Licence et Ville requises' })
  }
  
  if (body.id) {
    // Modification
    return await prisma.editionPage.update({
      where: { id: body.id },
      data: {
        licenceId: body.licenceId,
        villeId: body.villeId,
        date_debut: body.date_debut ? new Date(body.date_debut) : null,
        date_fin: body.date_fin ? new Date(body.date_fin) : null,
        metaPageId: body.metaPageId || null,
      },
      include: { licence: true, ville: true }
    })
  } else {
    // Création
    return await prisma.editionPage.create({
      data: {
        licenceId: body.licenceId,
        villeId: body.villeId,
        date_debut: body.date_debut ? new Date(body.date_debut) : null,
        date_fin: body.date_fin ? new Date(body.date_fin) : null,
        metaPageId: body.metaPageId || null,
      },
      include: { licence: true, ville: true }
    })
  }
})
