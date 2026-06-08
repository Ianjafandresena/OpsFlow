export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.nom_complet || !body.sigle) {
    throw createError({ statusCode: 400, statusMessage: 'Nom et sigle requis' })
  }
  
  return await prisma.licence.create({
    data: {
      nom_complet: body.nom_complet,
      sigle: body.sigle
    }
  })
})
