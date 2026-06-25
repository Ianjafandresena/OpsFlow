// GET /api/journals/:id/acces → { visibiliteMode: string, acces: [{employeId, peutEditer, employe}] }
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const journal = await prisma.journal.findUnique({
    where: { id },
    select: {
      visibiliteMode: true,
      acces: {
        include: {
          employe: { select: { id: true, nom: true, prenom: true } }
        }
      }
    }
  })
  if (!journal) throw createError({ statusCode: 404, statusMessage: 'Journal introuvable' })
  return journal
})
