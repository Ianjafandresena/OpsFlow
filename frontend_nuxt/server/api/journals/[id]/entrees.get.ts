import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const buildTimeSlots = () => {
  const slots: string[] = []
  for (let h = 0; h <= 23; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
}

export default defineEventHandler(async (event) => {
  const journalId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const dateStr = query.date as string
  const startDateStr = query.startDate as string
  const endDateStr = query.endDate as string

  if (!journalId || (!dateStr && !startDateStr)) {
    throw createError({
      statusCode: 400,
      statusMessage: "journalId et (date ou startDate/endDate) sont requis"
    })
  }

  try {
    let dateCondition: any = {}
    if (startDateStr && endDateStr) {
      dateCondition = {
        gte: new Date(startDateStr),
        lte: new Date(endDateStr)
      }
    } else if (dateStr) {
      dateCondition = new Date(dateStr)
    }

    const entrees: any[] = await prisma.entreeJournal.findMany({
      where: {
        journalId,
        date: dateCondition
      },
      include: {
        tache: {
          select: { id: true, titre: true, lien_livrable: true, statutTache: { select: { libelle: true } } }
        },
        editeur: { select: { id: true, nom: true, prenom: true } },
        commentaires: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    // Auto-sync : for single-date queries, ensure all tasks created on that date
    // for journal members are visible (creates missing entries on the fly)
    if (dateStr) {
      try {
        const journal = await prisma.journal.findUnique({
          where: { id: journalId },
          select: { employe1Id: true, employe2Id: true, employe3Id: true, employe4Id: true }
        })

        if (journal) {
          const memberIds = [
            journal.employe1Id, journal.employe2Id,
            journal.employe3Id, journal.employe4Id
          ].filter(Boolean) as string[]

          const existingTacheIds = new Set(entrees.filter(e => e.tacheId).map(e => e.tacheId))

          const viewDate = new Date(dateStr) // UTC midnight
          const nextDate = new Date(viewDate.getTime() + 24 * 60 * 60 * 1000)

          const notInClause = existingTacheIds.size > 0
            ? { notIn: [...existingTacheIds] }
            : undefined

          const tasksToAdd = await prisma.tache.findMany({
            where: {
              employeId: { in: memberIds },
              createdAt: { gte: viewDate, lt: nextDate },
              ...(notInClause ? { id: notInClause } : {})
            },
            include: {
              statutTache: { select: { libelle: true } }
            }
          })

          if (tasksToAdd.length > 0) {
            const allSlots = buildTimeSlots()
            // Track used slots per employee (real entries + newly created)
            const usedSlotsByEmp: Record<string, Set<string>> = {}
            for (const e of entrees) {
              if (!usedSlotsByEmp[e.employeId]) usedSlotsByEmp[e.employeId] = new Set()
              usedSlotsByEmp[e.employeId].add(e.heure)
            }

            for (const task of tasksToAdd) {
              const used = usedSlotsByEmp[task.employeId] || new Set<string>()
              const taskDate = new Date(task.createdAt)
              const taskSlotStr = `${String(taskDate.getUTCHours()).padStart(2, '0')}:${taskDate.getUTCMinutes() < 30 ? '00' : '30'}`
              const startIdx = Math.max(0, allSlots.indexOf(taskSlotStr))
              const ordered = [...allSlots.slice(startIdx), ...allSlots.slice(0, startIdx)]
              const targetSlot = ordered.find(s => !used.has(s)) || taskSlotStr

              const isTermine = (task.statutTache?.libelle || '').toLowerCase().includes('termin') ||
                (task.statutTache?.libelle || '').toLowerCase().includes('publi')

              try {
                const newEntry = await prisma.entreeJournal.create({
                  data: {
                    journalId,
                    employeId: task.employeId,
                    date: viewDate,
                    heure: targetSlot,
                    contenu: task.titre,
                    tacheId: task.id,
                    tacheTerminee: isTermine,
                    lien: task.lien_livrable || null
                  },
                  include: {
                    tache: { select: { id: true, titre: true, lien_livrable: true, statutTache: { select: { libelle: true } } } },
                    editeur: { select: { id: true, nom: true, prenom: true } },
                    commentaires: { orderBy: { createdAt: 'asc' } }
                  }
                })
                entrees.push(newEntry)
                if (!usedSlotsByEmp[task.employeId]) usedSlotsByEmp[task.employeId] = new Set()
                usedSlotsByEmp[task.employeId].add(targetSlot)
              } catch (createErr: any) {
                // P2002 = unique constraint: slot already taken (race condition) — skip
                if (createErr?.code !== 'P2002') {
                  console.error('Auto-sync journal entry error for task', task.id, createErr)
                }
              }
            }
          }
        }
      } catch (syncErr) {
        console.error('Journal auto-sync error:', syncErr)
        // Non-fatal: return whatever entries we already have
      }
    }

    return entrees
  } catch (error) {
    console.error("Erreur GET /journals/:id/entrees:", error)
    throw createError({
      statusCode: 500,
      statusMessage: "Impossible de récupérer les entrées"
    })
  }
})
