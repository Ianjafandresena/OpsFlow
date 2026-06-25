// PUT /api/journals/:id/acces → body: { mode: 'TOUS'|'SELECTIONNES', acces: [{employeId, peutEditer}] }
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { mode, acces } = body

  await prisma.journal.update({ where: { id }, data: { visibiliteMode: mode } })

  // Replace all acces entries
  await prisma.journalAcces.deleteMany({ where: { journalId: id } })
  if (acces && acces.length > 0) {
    await prisma.journalAcces.createMany({
      data: acces.map((a: any) => ({ journalId: id, employeId: a.employeId, peutEditer: !!a.peutEditer }))
    })
  }
  return { success: true }
})
