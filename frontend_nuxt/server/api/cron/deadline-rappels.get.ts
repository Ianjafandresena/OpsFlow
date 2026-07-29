export default defineEventHandler(async (event) => {
  const now = new Date()
  const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000)

  const taches = await prisma.tache.findMany({
    where: { date_limite: { gte: now, lte: in48h } },
    include: { statutTache: true }
  })

  const actives = taches.filter(t => {
    const lib = (t.statutTache?.libelle || '').toLowerCase()
    return !lib.includes('termin') && !lib.includes('publi')
  })

  let created = 0
  for (const tache of actives) {
    const existing = await prisma.notificationEmploye.findFirst({
      where: {
        employeId: tache.employeId,
        refId: tache.id,
        type: 'DEADLINE',
        createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
      }
    })
    if (existing) continue

    const heures = Math.floor((new Date(tache.date_limite).getTime() - now.getTime()) / (60 * 60 * 1000))
    await prisma.notificationEmploye.create({
      data: {
        type: 'DEADLINE',
        message: `Deadline dans ${heures}h : "${tache.titre}"`,
        employeId: tache.employeId,
        refId: tache.id
      }
    })
    created++
  }

  return { checked: actives.length, created }
})
