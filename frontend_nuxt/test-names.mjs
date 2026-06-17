import { PrismaClient } from '@prisma/client'

const NEON_URL = 'postgresql://neondb_owner:npg_twyi5kKNlJ2p@ep-steep-term-ag9nluw1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const prisma = new PrismaClient({
  datasources: { db: { url: NEON_URL } }
})

async function main() {
  const tasks = await prisma.tache.findMany({
    include: { employe: true, statutTache: true }
  })
  console.log("Tasks:", tasks.length)
  for (const t of tasks) {
    console.log(`Task: ${t.titre}`)
    console.log(`  Employe: ${t.employe ? t.employe.prenom + ' ' + t.employe.nom : 'NULL'}`)
    if (t.employe && !t.employe.nom) {
      console.log(`  !! NOM IS EMPTY OR NULL: ${t.employe.nom}`)
    }
  }
}
main()
