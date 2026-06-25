export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant' })

  const journalAsMain = await prisma.journal.findFirst({ where: { employe1Id: id } })
  if (journalAsMain) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Cet employé est lié à un ou plusieurs journaux. Supprimez d\'abord ses journaux avant de supprimer ce collaborateur.'
    })
  }

  try {
    await prisma.employe.delete({ where: { id } })
    return { success: true }
  } catch (e: any) {
    if (e?.code === 'P2003') {
      throw createError({ statusCode: 409, statusMessage: 'Impossible de supprimer : cet employé est lié à d\'autres données.' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Impossible de supprimer ce collaborateur.' })
  }
})
