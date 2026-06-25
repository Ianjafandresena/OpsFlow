import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const employeId = query.employeId ? String(query.employeId) : null

    const journals = await prisma.journal.findMany({
      include: {
        employe1: { select: { id: true, nom: true, prenom: true, salaire_base: true } },
        employe2: { select: { id: true, nom: true, prenom: true } },
        employe3: { select: { id: true, nom: true, prenom: true } },
        employe4: { select: { id: true, nom: true, prenom: true } },
        editions: {
          include: {
            edition: {
              include: {
                licence: { select: { id: true, sigle: true } },
                ville: { select: { id: true, nom_ville: true } }
              }
            }
          }
        },
        acces: {
          include: {
            employe: { select: { id: true, nom: true, prenom: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Count recent unread employee messages (last 30 days, isAdmin=false) per journal
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const messageCounts = await prisma.$queryRaw<{ journalId: string; count: bigint }[]>`
      SELECT ej."journalId", COUNT(cj."id") as count
      FROM "CommentaireJournal" cj
      JOIN "EntreeJournal" ej ON cj."entreeId" = ej."id"
      WHERE cj."isAdmin" = false
        AND cj."createdAt" >= ${thirtyDaysAgo}
      GROUP BY ej."journalId"
    `

    const countMap: Record<string, number> = {}
    for (const row of messageCounts) {
      countMap[row.journalId] = Number(row.count)
    }

    let filteredJournals = journals

    // If employeId provided, filter by visibility
    if (employeId) {
      filteredJournals = journals.filter(j => {
        // Always visible if mode is TOUS
        if (j.visibiliteMode === 'TOUS') return true
        // Always visible if employee is directly assigned to journal
        if (j.employe1Id === employeId || j.employe2Id === employeId ||
            j.employe3Id === employeId || j.employe4Id === employeId) return true
        // Mode SELECTIONNES: visible only if in acces list
        return j.acces.some(a => a.employeId === employeId)
      })
    }

    return filteredJournals.map(j => ({
      ...j,
      recentMessages: countMap[j.id] || 0
    }))
  } catch (error) {
    console.error("Erreur GET /journals:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de récupérer les journaux"
    })
  }
})
