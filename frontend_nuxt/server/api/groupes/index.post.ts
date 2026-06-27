export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.nom?.trim() || !Array.isArray(body.journalIds) || body.journalIds.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Nom et au moins 2 journaux requis' })
  }
  const groupe = await prisma.groupeJournal.create({ data: { nom: body.nom.trim() } })
  await prisma.journal.updateMany({
    where: { id: { in: body.journalIds } },
    data: { groupeId: groupe.id }
  })
  return groupe
})
