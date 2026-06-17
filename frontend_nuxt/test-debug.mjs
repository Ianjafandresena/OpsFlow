import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Simulate what admin/taches/cm.vue sends to the API
  const cmTypes = ['PUBLICATION', 'SPONSORISATION', 'MAILING', 'ADMINISTRATIVE']
  
  const allTasks = await prisma.tache.findMany({
    include: { employe: { include: { poste: { include: { departement: true } } } }, statutTache: true }
  })
  console.log("=== ALL TASKS ===")
  for (const t of allTasks) {
    console.log(`  [${t.typeTache}] ${t.titre} | Employe: ${t.employe?.nom || 'NULL'} | Dept: ${t.employe?.poste?.departement?.nom_departement || 'NULL'}`)
  }
  
  console.log("\n=== TASKS WITH CM TYPES ===")
  const cmTasks = allTasks.filter(t => cmTypes.includes(t.typeTache))
  console.log("  Count:", cmTasks.length)
  
  console.log("\n=== ALL UNIQUE typeTache VALUES ===")
  const types = [...new Set(allTasks.map(t => t.typeTache))]
  console.log(" ", types)
  
  console.log("\n=== CM EMPLOYEES ===")
  const employes = await prisma.employe.findMany({
    include: { poste: { include: { departement: true } } }
  })
  const cmEmployes = employes.filter(e => e.poste?.departement?.nom_departement === 'Communication')
  for (const e of cmEmployes) {
    console.log(`  ${e.prenom} ${e.nom} | Poste: ${e.poste?.titre_poste} | Dept: ${e.poste?.departement?.nom_departement}`)
  }
}

main().then(() => prisma.$disconnect())
