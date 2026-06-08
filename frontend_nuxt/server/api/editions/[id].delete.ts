export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  try {
    await prisma.editionPage.delete({
      where: { id }
    })
    return { success: true }
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de supprimer (dépendances existantes ?)' })
  }
})
