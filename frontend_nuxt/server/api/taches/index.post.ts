const TRACKED_FIELDS: Record<string, string> = {
  titre: 'Titre', description: 'Description', date_limite: 'Deadline',
  lien_livrable: 'Livrable', plateforme: 'Plateforme', type_pub: 'Type publication',
  budget: 'Budget', audience: 'Audience', format_video: 'Format vidéo',
  duree_cible: 'Durée cible', type_visuel: 'Type visuel', quantite: 'Quantité',
  type_technique: 'Type technique', type_demarche: 'Démarche', outil_mailing: 'Outil mailing'
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = getCookie(event, 'auth_token')
  const currentUser = token ? verifyToken(token) : null
  const auteurId = currentUser?.id || null

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

    if (t === 'MONTEUR') return 'MONTEUR'
    if (t === 'DESIGNER') return 'DESIGNER'
    if (t === 'DEV') return 'DEV'
    if (t === 'PUBLICATION') return 'PUBLICATION'
    if (t === 'SPONSORISATION') return 'SPONSORISATION'
    if (t === 'ADMINISTRATIVE') return 'ADMINISTRATIVE'
    if (t === 'MAILING') return 'MAILING'

    if (t === 'Publication') return 'PUBLICATION'
    if (t === 'Sponsorisation (Ads)') return 'SPONSORISATION'
    if (t === 'Démarche Administrative') return 'ADMINISTRATIVE'
    if (t === 'Mailing (Newsletter)') return 'MAILING'

    if (body.format_video || body.duree_cible || body.demandeur) return 'MONTEUR'
    if (body.type_technique) return 'DEV'
    if (body.plateforme && body.type_pub) return 'PUBLICATION'
    if (body.themeSponsoId || (body.budget && !body.outil_mailing)) return 'SPONSORISATION'
    if (body.type_demarche) return 'ADMINISTRATIVE'
    if (body.outil_mailing) return 'MAILING'
    if (body.type_visuel || body.quantite) return 'DESIGNER'

    return 'PUBLICATION'
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
    demandeur: body.demandeur,
    lien_livrable: body.lien_livrable,
    urgent: body.urgent === true || body.urgent === 'true'
  }

  // --- Helpers ---
  const buildTimeSlots = () => {
    const slots: string[] = []
    for (let h = 0; h <= 23; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`)
      slots.push(`${String(h).padStart(2, '0')}:30`)
    }
    return slots
  }

  // Toujours minuit UTC pour cohérence avec les requêtes du frontend
  const todayUTC = () => {
    const d = new Date()
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  }

  const findJournal = async (employeId: string) => {
    return prisma.journal.findFirst({
      where: {
        OR: [
          { employe1Id: employeId },
          { employe2Id: employeId },
          { employe3Id: employeId },
          { employe4Id: employeId },
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  const findAvailableSlot = async (journalId: string, employeId: string, date: Date) => {
    const allSlots = buildTimeSlots()
    const now = new Date()
    const currentHeure = `${String(now.getUTCHours()).padStart(2, '0')}:${now.getUTCMinutes() < 30 ? '00' : '30'}`
    const startIdx = Math.max(0, allSlots.indexOf(currentHeure))
    const orderedSlots = [...allSlots.slice(startIdx), ...allSlots.slice(0, startIdx)]

    const existing = await prisma.entreeJournal.findMany({
      where: { journalId, employeId, date },
      select: { heure: true }
    })
    const usedHeures = new Set(existing.map((e: any) => e.heure))

    return orderedSlots.find(s => !usedHeures.has(s)) || currentHeure
  }

  if (body.id) {
    // --- MODIFICATION ---
    const oldTache = await prisma.tache.findUnique({
      where: { id: body.id },
      include: { statutTache: true }
    })

    const updatedTache = await prisma.tache.update({
      where: { id: body.id },
      data,
      include: { statutTache: true }
    })

    // Enregistrer historique
    try {
      const statutChange = oldTache?.statutTacheId !== body.statutTacheId
      if (statutChange) {
        await prisma.historiqueTache.create({
          data: {
            tacheId: updatedTache.id,
            auteurId,
            action: 'STATUT',
            details: JSON.stringify({ ancien: oldTache?.statutTache?.libelle, nouveau: updatedTache.statutTache?.libelle })
          }
        })
      }
      const champs = Object.keys(TRACKED_FIELDS)
        .filter(k => oldTache && String(oldTache[k as keyof typeof oldTache] ?? '') !== String((data as any)[k] ?? ''))
        .map(k => ({ champ: TRACKED_FIELDS[k], ancien: oldTache![k as keyof typeof oldTache], nouveau: (data as any)[k] }))
      if (champs.length > 0) {
        await prisma.historiqueTache.create({
          data: { tacheId: updatedTache.id, auteurId, action: 'MODIFICATION', details: JSON.stringify({ champs }) }
        })
      }
    } catch {}

    const libelle = (updatedTache.statutTache?.libelle || updatedTache.statutTache?.nom || '').toLowerCase()
    const isTermine = libelle.includes('termin') || libelle.includes('publi')

    if (isTermine) {
      try {
        // Marquer toutes les entrées comme terminées
        await prisma.entreeJournal.updateMany({
          where: { tacheId: updatedTache.id },
          data: { tacheTerminee: true }
        })

        // Supprimer les entrées des jours précédents — seule l'entrée du jour de clôture reste
        await prisma.entreeJournal.deleteMany({
          where: { tacheId: updatedTache.id, date: { lt: todayUTC() } }
        })

        // Mettre à jour le contenu de l'entrée la plus récente
        const latestEntry = await prisma.entreeJournal.findFirst({
          where: { tacheId: updatedTache.id },
          orderBy: { date: 'desc' }
        })

        if (latestEntry) {
          await prisma.entreeJournal.update({
            where: { id: latestEntry.id },
            data: {
              contenu: `Tâche terminée : ${updatedTache.titre}`,
              lien: updatedTache.lien_livrable || latestEntry.lien
            }
          })
        } else {
          // Fallback : aucune entrée existante, en créer une nouvelle
          const journal = await findJournal(updatedTache.employeId)
          if (journal) {
            const today = todayUTC()
            const targetSlot = await findAvailableSlot(journal.id, updatedTache.employeId, today)
            try {
              await prisma.entreeJournal.create({
                data: {
                  journalId: journal.id,
                  employeId: updatedTache.employeId,
                  date: today,
                  heure: targetSlot,
                  contenu: `Tâche terminée : ${updatedTache.titre}`,
                  tacheId: updatedTache.id,
                  tacheTerminee: true,
                  lien: updatedTache.lien_livrable || null
                }
              })
            } catch {}
          }
        }
      } catch (err) {
        console.error("Erreur mise à jour journal lors de la clôture de tâche :", err)
      }
    }

    return updatedTache
  } else {
    // --- CRÉATION ---
    const newTache = await prisma.tache.create({ data })

    try {
      await prisma.historiqueTache.create({
        data: { tacheId: newTache.id, auteurId, action: 'CREATION' }
      })
    } catch {}

    // Notification pour l'employé assigné
    try {
      await prisma.notificationEmploye.create({
        data: {
          type: 'NOUVELLE_TACHE',
          message: `Nouvelle tâche assignée : "${newTache.titre}"`,
          employeId: newTache.employeId,
          refId: newTache.id
        }
      })
    } catch (notifErr) {
      console.error('Erreur création notification nouvelle tâche:', notifErr)
    }

    // Auto-ajouter dans le journal de l'employé dès la création
    try {
      const journal = await findJournal(newTache.employeId)
      if (journal) {
        const today = todayUTC()
        const targetSlot = await findAvailableSlot(journal.id, newTache.employeId, today)
        try {
          await prisma.entreeJournal.create({
            data: {
              journalId: journal.id,
              employeId: newTache.employeId,
              date: today,
              heure: targetSlot,
              contenu: newTache.titre,
              tacheId: newTache.id,
              tacheTerminee: false,
              lien: newTache.lien_livrable || null
            }
          })
        } catch (slotErr) {
          console.error('Erreur création entrée journal pour nouvelle tâche:', slotErr)
        }
      }
    } catch (journalErr) {
      console.error("Erreur ajout journal pour nouvelle tâche:", journalErr)
    }

    return newTache
  }
})
