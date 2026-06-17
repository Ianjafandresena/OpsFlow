import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const tasks = await prisma.tache.findMany({
    include: { statutTache: true, employe: true }
  })
  console.log("Tasks and their statuts:")
  for (const t of tasks) {
    console.log(`  "${t.titre}" | statutTacheId: ${t.statutTacheId} | statutTache: ${JSON.stringify(t.statutTache)}`)
  }
  
  const statuts = await prisma.statutTache.findMany()
  console.log("\nAll statuts:", statuts)
}
main().then(() => prisma.$disconnect())
