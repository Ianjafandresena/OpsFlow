export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Convertir les chaînes vides et undefined en null pour les clés étrangères
  const optionalFields = [
    'plateforme', 'type_pub', 'type_demarche', 'themePubId', 'themeSponsoId',
    'budget', 'audience', 'format_video', 'duree_cible', 'type_visuel', 'quantite',
    'type_technique', 'date_demande', 'date_resultat', 'outil_mailing', 'demandeur',
    'description', 'lien_livrable', 'editionId'
  ]
  for (const key of optionalFields) {
    if (body[key] === '' || body[key] === undefined) body[key] = null
  }

  if (!body.titre || !body.employeId || !body.statutTacheId || !body.date_limite) {
    throw createError({ statusCode: 400, statusMessage: 'Champs obligatoires manquants' })
  }

  // Déterminer le TypeTache enum à partir du contexte frontend
  const resolveTypeTache = () => {
    const t = body.typeTache || ''
    
    // 1. Vérifier d'abord les valeurs enum explicites (déjà convertis)
    if (t === 'MONTEUR') return 'MONTEUR'
    if (t === 'DESIGNER') return 'DESIGNER'
    if (t === 'DEV') return 'DEV'
    if (t === 'PUBLICATION') return 'PUBLICATION'
    if (t === 'SPONSORISATION') return 'SPONSORISATION'
    if (t === 'ADMINISTRATIVE') return 'ADMINISTRATIVE'
    if (t === 'MAILING') return 'MAILING'
    
    // 2. Vérifier les labels du formulaire CM (chaînes françaises du frontend)
    if (t === 'Publication') return 'PUBLICATION'
    if (t === 'Sponsorisation (Ads)') return 'SPONSORISATION'
    if (t === 'Démarche Administrative') return 'ADMINISTRATIVE'
    if (t === 'Mailing (Newsletter)') return 'MAILING'
    
    // 3. Heuristiques basées sur les champs spécialisés (quand typeTache n'est pas défini)
    if (body.format_video || body.duree_cible || body.demandeur) return 'MONTEUR'
    if (body.type_technique) return 'DEV'
    if (body.plateforme && body.type_pub) return 'PUBLICATION'
    if (body.themeSponsoId || (body.budget && !body.outil_mailing)) return 'SPONSORISATION'
    if (body.type_demarche) return 'ADMINISTRATIVE'
    if (body.outil_mailing) return 'MAILING'
    // Note: type_visuel/quantite are last because CM defaultForm initializes them too
    if (body.type_visuel || body.quantite) return 'DESIGNER'
    
    return 'PUBLICATION' // Défaut
  }

  const data = {
    typeTache: resolveTypeTache(),
    titre: body.titre,
    description: body.description,
    date_limite: new Date(body.date_limite),
    employeId: body.employeId,
    editionId: body.editionId,
    statutTacheId: body.statutTacheId,
    plateforme: body.plateforme,
    type_pub: body.type_pub,
    type_demarche: body.type_demarche,
    themePubId: body.themePubId,
    themeSponsoId: body.themeSponsoId,
    budget: body.budget ? parseFloat(body.budget) : null,
    audience: body.audience,
    format_video: body.format_video,
    duree_cible: body.duree_cible,
    type_visuel: body.type_visuel,
    quantite: body.quantite ? parseInt(body.quantite) : null,
    type_technique: body.type_technique,
    date_demande: body.date_demande ? new Date(body.date_demande) : null,
    date_resultat: body.date_resultat ? new Date(body.date_resultat) : null,
    outil_mailing: body.outil_mailing,
    demandeur: body.demandeur
  }

  if (body.id) {
    // Modification
    const updatedTache = await prisma.tache.update({
      where: { id: body.id },
      data,
      include: { statutTache: true }
    })

    // Si la tâche est terminée, on l'ajoute automatiquement au journal du jour s'il existe
    if (updatedTache.statutTache?.libelle?.toLowerCase() === 'terminé' || updatedTache.statutTache?.libelle?.toLowerCase() === 'terminée') {
      try {
        // Chercher le dernier journal actif de cet employé
        const journal = await prisma.journal.findFirst({
          where: {
            OR: [
              { employe1Id: body.employeId },
              { employe2Id: body.employeId }
            ]
          },
          orderBy: { createdAt: 'desc' }
        })

        if (journal) {
          // Calculer l'heure actuelle arrondie à 30 min (ex: 14:30)
          const now = new Date()
          const minutes = now.getMinutes()
          const roundedMinutes = minutes < 30 ? '00' : '30'
          const heure = `${now.getHours().toString().padStart(2, '0')}:${roundedMinutes}`
          
          // Date du jour sans heure
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          await prisma.entreeJournal.upsert({
            where: {
              journalId_employeId_date_heure: {
                journalId: journal.id,
                employeId: body.employeId,
                date: today,
                heure: heure
              }
            },
            update: {
              contenu: `Tâche terminée : ${updatedTache.titre}`,
              tacheId: updatedTache.id
            },
            create: {
              journalId: journal.id,
              employeId: body.employeId,
              date: today,
              heure: heure,
              contenu: `Tâche terminée : ${updatedTache.titre}`,
              tacheId: updatedTache.id
            }
          })
          console.log(`Entrée de journal automatique ajoutée pour la tâche ${updatedTache.id} à ${heure}`)
        }
      } catch (err) {
        console.error("Erreur lors de l'ajout automatique au journal :", err)
      }
    }

    return updatedTache
  } else {
    // Création
    console.log('--- CREATING TACHE ---')
    console.log(data)
    return await prisma.tache.create({ data })
  }
})
