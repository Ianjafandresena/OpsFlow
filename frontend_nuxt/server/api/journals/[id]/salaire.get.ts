import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const monthStr = query.month as string // format: YYYY-MM

  if (!journalId) {
    throw createError({ statusCode: 400, statusMessage: 'ID journal manquant' })
  }

  try {
    const journal = await prisma.journal.findUnique({
      where: { id: journalId },
      include: { employe1: { select: { id: true, salaire_base: true } } }
    })

    if (!journal) {
      throw createError({ statusCode: 404, statusMessage: 'Journal introuvable' })
    }

    const base = journal.employe1?.salaire_base ?? 0

    // Build date range for the month
    let startDate: Date
    let endDate: Date
    let mois: number
    let annee: number
    if (monthStr && /^\d{4}-\d{2}$/.test(monthStr)) {
      const [year, month] = monthStr.split('-').map(Number)
      startDate = new Date(year, month - 1, 1)
      endDate = new Date(year, month, 1)
      mois = month
      annee = year
    } else {
      const now = new Date()
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      mois = now.getMonth() + 1
      annee = now.getFullYear()
    }

    // Aggregate primes and pénalités for employe1 of this journal (legacy: EntreeJournal.evaluation_montant)
    const entries = await prisma.entreeJournal.findMany({
      where: {
        journalId,
        employeId: journal.employe1Id,
        evaluation_type: { in: ['PRIME', 'PENALITE'] },
        date: { gte: startDate, lt: endDate }
      },
      select: { evaluation_type: true, evaluation_montant: true }
    })

    let primes = 0
    let penalites = 0
    for (const e of entries) {
      if (e.evaluation_type === 'PRIME') primes += e.evaluation_montant ?? 0
      if (e.evaluation_type === 'PENALITE') penalites += e.evaluation_montant ?? 0
    }

    // Also aggregate EvaluationSalaire for the same employee and month
    const evalSalaires = await prisma.evaluationSalaire.findMany({
      where: {
        employeId: journal.employe1Id,
        mois,
        annee
      },
      select: { type: true, montant: true, statut: true }
    })

    for (const ev of evalSalaires) {
      // Include only ACQUIS evaluations in salary calculation
      if (ev.statut === 'ACQUIS') {
        if (ev.type === 'PRIME') primes += ev.montant
        if (ev.type === 'PENALITE') penalites += ev.montant
      }
    }

    return {
      base,
      primes,
      penalites,
      final: base + primes - penalites
    }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('Erreur GET /journals/:id/salaire:', error)
    throw createError({ statusCode: 500, statusMessage: 'Impossible de récupérer le salaire' })
  }
})
