import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
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

    return journals.map(j => ({
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
