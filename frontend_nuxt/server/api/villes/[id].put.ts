export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const body = await readBody(event)
  const { statut, statut_commentaire } = body

  try {
    return await prisma.ville.update({
      where: { id },
      data: {
        statut: statut ?? 'NEUTRE',
        statut_commentaire: statut_commentaire ?? null
      }
    })
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de mettre à jour la ville' })
  }
})
