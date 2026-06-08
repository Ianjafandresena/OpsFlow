export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.nom_theme) {
    throw createError({ statusCode: 400, statusMessage: 'Nom du thème requis' })
  }
  
  if (body.id) {
    // Modification
    return await prisma.theme.update({
      where: { id: body.id },
      data: { nom_theme: body.nom_theme }
    })
  } else {
    // Création
    return await prisma.theme.create({
      data: { nom_theme: body.nom_theme }
    })
  }
})
