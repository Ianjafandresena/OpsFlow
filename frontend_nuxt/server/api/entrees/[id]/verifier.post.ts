export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'id manquant' })

  const entree = await prisma.entreeJournal.update({
    where: { id },
    data: { aVerifier: true, motifModification: null }
  })
  return entree
})
