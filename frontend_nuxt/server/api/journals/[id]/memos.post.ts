export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const body = await readBody(event)
  if (!body.contenu?.trim() || !body.auteurId) {
    throw createError({ statusCode: 400, statusMessage: 'Contenu et auteur requis' })
  }
  return await prisma.memo.create({
    data: {
      contenu: body.contenu.trim(),
      liens: body.liens?.trim() || null,
      auteurId: body.auteurId,
      journalId
    },
    include: { auteur: { select: { id: true, nom: true, prenom: true } } }
  })
})
