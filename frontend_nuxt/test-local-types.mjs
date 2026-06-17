import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tasks = await prisma.tache.findMany({
    include: { employe: true, statutTache: true }
  })
  for (const t of tasks) {
    console.log(`Task: ${t.titre} | Type: ${t.typeTache}`)
  }
}
main()
