// POST /api/evaluations — créer une évaluation
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { employeId, journalId, mois, annee, type, montant, motif, statut } = body
  if (!employeId || !mois || !annee || !type || !montant || !motif) {
    throw createError({ statusCode: 400, statusMessage: 'Champs manquants' })
  }
  return await prisma.evaluationSalaire.create({
    data: {
      employeId,
      journalId: journalId || null,
      mois: parseInt(String(mois)),
      annee: parseInt(String(annee)),
      type,
      montant: parseFloat(String(montant)),
      motif,
      statut: statut || 'ACQUIS'
    }
  })
})
