export default defineEventHandler(async (event) => {
  return await prisma.role.findMany({
    orderBy: { niveau_acces: 'asc' }
  })
})
