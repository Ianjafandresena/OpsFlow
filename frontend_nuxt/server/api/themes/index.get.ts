export default defineEventHandler(async (event) => {
  return await prisma.theme.findMany({
    orderBy: { nom_theme: 'asc' }
  })
})
