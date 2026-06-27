export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await prisma.journal.updateMany({ where: { groupeId: id }, data: { groupeId: null } })
  await prisma.groupeJournal.delete({ where: { id } })
  return { success: true }
})
