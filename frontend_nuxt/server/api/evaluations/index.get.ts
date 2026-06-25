// GET /api/evaluations?employeId=&mois=&annee=
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  const where: any = {}
  if (q.employeId) where.employeId = String(q.employeId)
  if (q.mois) where.mois = parseInt(String(q.mois))
  if (q.annee) where.annee = parseInt(String(q.annee))
  if (q.journalId) where.journalId = String(q.journalId)

  const evals = await prisma.evaluationSalaire.findMany({
    where,
    orderBy: [{ annee: 'desc' }, { mois: 'desc' }, { createdAt: 'desc' }],
    include: { employe: { select: { nom: true, prenom: true } } }
  })
  return evals
})
