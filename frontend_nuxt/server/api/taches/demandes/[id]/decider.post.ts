export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID de demande manquant' })
  }

  if (body.decision !== 'APPROVE' && body.decision !== 'REJECT') {
    throw createError({ statusCode: 400, statusMessage: 'decision doit être APPROVE ou REJECT' })
  }

  // Récupérer la demande
  const demande = await prisma.demandeTache.findUnique({
    where: { id }
  })

  if (!demande) {
    throw createError({ statusCode: 404, statusMessage: 'Demande introuvable' })
  }

  if (demande.statut !== 'EN_ATTENTE') {
    throw createError({ statusCode: 400, statusMessage: 'Cette demande a déjà été traitée' })
  }

  if (body.decision === 'APPROVE') {
    if (demande.typeDemande === 'SUPPRESSION') {
      // Supprimer la tâche directement
      // La cascade onDelete supprimera automatiquement cette demande également
      await prisma.tache.delete({
        where: { id: demande.tacheId }
      })
      return { success: true, message: 'Tâche supprimée avec succès' }
    } else if (demande.typeDemande === 'MODIFICATION') {
      if (!demande.donneesModif) {
        throw createError({ statusCode: 400, statusMessage: 'Aucune donnée de modification fournie' })
      }

      const parsed = JSON.parse(demande.donneesModif)
      const updateData: any = {}
      
      const fields = [
        'titre', 'description', 'date_limite', 'demandeur', 'type_visuel', 'quantite',
        'format_video', 'duree_cible', 'type_technique', 'type_demarche', 'outil_mailing',
        'plateforme', 'type_pub', 'themePubId', 'themeSponsoId', 'budget', 'audience',
        'editionId', 'statutTacheId'
      ]

      for (const f of fields) {
        if (parsed[f] !== undefined) {
          if ((f === 'date_limite' || f === 'date_demande' || f === 'date_resultat') && parsed[f]) {
            updateData[f] = new Date(parsed[f])
          } else {
            updateData[f] = parsed[f]
          }
        }
      }

      // Appliquer les changements sur la tâche
      await prisma.tache.update({
        where: { id: demande.tacheId },
        data: updateData
      })

      // Mettre à jour la demande comme acceptée
      const updatedDemande = await prisma.demandeTache.update({
        where: { id },
        data: { statut: 'ACCEPTEE' }
      })

      return { success: true, message: 'Modification appliquée avec succès', demande: updatedDemande }
    }
  } else {
    // Rejet
    const updatedDemande = await prisma.demandeTache.update({
      where: { id },
      data: { statut: 'REFUSEE' }
    })
    return { success: true, message: 'Demande refusée', demande: updatedDemande }
  }
})
