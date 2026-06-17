import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tasks = await prisma.tache.findMany({
    include: { employe: true, statutTache: true }
  })
  console.log("Tasks:", tasks.length)
  for (const t of tasks) {
    console.log(`Task: ${t.titre}`)
    console.log(`  Employe: ${t.employe ? t.employe.prenom + ' ' + t.employe.nom : 'NULL'}`)
    console.log(`  Statut: ${t.statutTache ? t.statutTache.libelle : 'NULL'}`)
  }
}
main()
