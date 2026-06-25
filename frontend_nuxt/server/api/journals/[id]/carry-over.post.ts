// POST /api/journals/:id/carry-over?date=YYYY-MM-DD
// Cherche les entrées de jours précédents avec tacheId non terminée et les crée pour aujourd'hui
export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const dateStr = String(query.date || new Date().toISOString().split('T')[0])
  const targetDate = new Date(dateStr)
  targetDate.setHours(0, 0, 0, 0)

  // Chercher les entrées des 30 derniers jours avec tacheId non terminée
  const pastCutoff = new Date(targetDate)
  pastCutoff.setDate(pastCutoff.getDate() - 30)

  const pendingEntries = await prisma.entreeJournal.findMany({
    where: {
      journalId,
      tacheId: { not: null },
      tacheTerminee: false,
      date: { gte: pastCutoff, lt: targetDate },
      reportee: false
    },
    include: { tache: { include: { statutTache: true } } }
  })

  let created = 0
  for (const entry of pendingEntries) {
    // Vérifier que la tâche n'est pas réellement terminée
    const statut = entry.tache?.statutTache
    const isTermine = statut?.libelle?.toLowerCase().includes('termin') || (statut as any)?.nom?.toLowerCase().includes('termin')
    if (isTermine) continue

    // Créer l'entrée pour aujourd'hui si elle n'existe pas déjà
    try {
      await prisma.entreeJournal.upsert({
        where: {
          journalId_employeId_date_heure: {
            journalId,
            employeId: entry.employeId,
            date: targetDate,
            heure: entry.heure
          }
        },
        update: {},  // ne pas écraser si déjà existante
        create: {
          journalId,
          employeId: entry.employeId,
          date: targetDate,
          heure: entry.heure,
          contenu: entry.contenu,
          tacheId: entry.tacheId,
          reportee: true,
          lien: entry.lien
        }
      })
      created++
    } catch {}
  }

  return { created }
})
