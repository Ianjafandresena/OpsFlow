export default defineEventHandler(async (event) => {
  const memoId = getRouterParam(event, 'memoId')
  try {
    await prisma.memo.delete({ where: { id: memoId } })
    return { success: true }
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Mémo introuvable' })
  }
})
