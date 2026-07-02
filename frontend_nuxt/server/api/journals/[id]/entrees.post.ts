import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { date, entrees } = body

  if (!journalId || !date || !Array.isArray(entrees)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Données invalides"
    })
  }

  try {
    const dateQuery = new Date(date)

    const results = await prisma.$transaction(
      entrees.map((entree: any) => {
        const entryDate = entree.date ? new Date(entree.date) : dateQuery
        return prisma.entreeJournal.upsert({
          where: {
            journalId_employeId_date_heure: {
              journalId,
              employeId: entree.employeId,
              date: entryDate,
              heure: entree.heure
            }
          },
          update: {
            contenu: entree.contenu,
            commentaire: entree.commentaire,
            admin_commentaire: entree.admin_commentaire !== undefined ? entree.admin_commentaire : undefined,
            lien: entree.lien,
            recherches: entree.recherches !== undefined ? entree.recherches : undefined,
            heure_affichage: entree.heure_affichage !== undefined ? entree.heure_affichage : undefined,
            heure_fin: entree.heure_fin !== undefined ? entree.heure_fin : undefined,
            evaluation_type: entree.evaluation_type !== undefined ? entree.evaluation_type : undefined,
            evaluation_montant: entree.evaluation_montant !== undefined ? entree.evaluation_montant : undefined,
            editeurId: entree.editeurId !== undefined ? entree.editeurId : undefined,
            tacheTerminee: entree.tacheTerminee !== undefined ? entree.tacheTerminee : undefined,
            aVerifier: entree.aVerifier !== undefined ? entree.aVerifier : undefined,
            motifModification: entree.motifModification !== undefined ? entree.motifModification : undefined
          },
          create: {
            journalId,
            employeId: entree.employeId,
            date: entryDate,
            heure: entree.heure,
            contenu: entree.contenu || '',
            commentaire: entree.commentaire,
            admin_commentaire: entree.admin_commentaire,
            lien: entree.lien,
            recherches: entree.recherches,
            heure_affichage: entree.heure_affichage,
            heure_fin: entree.heure_fin || null,
            evaluation_type: entree.evaluation_type,
            evaluation_montant: entree.evaluation_montant,
            editeurId: entree.editeurId || null,
            tacheTerminee: entree.tacheTerminee || false,
            aVerifier: entree.aVerifier || false,
            motifModification: entree.motifModification || null
          }
        })
      })
    )

    return { success: true, count: results.length }
  } catch (error) {
    console.error("Erreur POST /journals/:id/entrees:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de sauvegarder les entrées"
    })
  }
})
