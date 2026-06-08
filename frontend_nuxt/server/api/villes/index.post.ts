export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.nom_ville) {
    throw createError({ statusCode: 400, statusMessage: 'Nom de ville requis' })
  }
  
  return await prisma.ville.create({
    data: {
      nom_ville: body.nom_ville
    }
  })
})
