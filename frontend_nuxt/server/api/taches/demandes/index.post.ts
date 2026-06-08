export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.tacheId || !body.typeDemande || !body.motif) {
    throw createError({ statusCode: 400, statusMessage: 'Champs requis manquants (tacheId, typeDemande, motif)' })
  }

  if (body.typeDemande !== 'MODIFICATION' && body.typeDemande !== 'SUPPRESSION') {
    throw createError({ statusCode: 400, statusMessage: 'typeDemande doit être MODIFICATION ou SUPPRESSION' })
  }

  // Vérifier si la tâche existe
  const task = await prisma.tache.findUnique({
    where: { id: body.tacheId }
  })
  if (!task) {
    throw createError({ statusCode: 404, statusMessage: 'Tâche introuvable' })
  }

  // Si modification, sérialiser les données proposées
  let stringifiedDonneesModif = null
  if (body.typeDemande === 'MODIFICATION' && body.donneesModif) {
    stringifiedDonneesModif = JSON.stringify(body.donneesModif)
  }

  const demande = await prisma.demandeTache.create({
    data: {
      tacheId: body.tacheId,
      typeDemande: body.typeDemande,
      motif: body.motif,
      donneesModif: stringifiedDonneesModif,
      statut: 'EN_ATTENTE'
    }
  })

  return demande
})
