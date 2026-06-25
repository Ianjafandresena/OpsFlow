export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await prisma.evaluationSalaire.delete({ where: { id } })
  return { success: true }
})
