import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Fix tasks that were wrongly saved as DESIGNER/MONTEUR but are CM tasks
  // (they have plateforme/type_pub fields which indicate they are publications)
  const wrongTasks = await prisma.tache.findMany({
    where: {
      typeTache: { in: ['DESIGNER', 'MONTEUR'] },
      // CM tasks have plateforme or type_pub
      OR: [
        { plateforme: { not: null } },
        { type_pub: { not: null } },
        { type_demarche: { not: null } },
        { outil_mailing: { not: null } }
      ]
    }
  })
  
  console.log("Tasks to fix:", wrongTasks.length)
  
  for (const t of wrongTasks) {
    let newType = t.typeTache
    if (t.plateforme && t.type_pub) newType = 'PUBLICATION'
    else if (t.type_demarche) newType = 'ADMINISTRATIVE'
    else if (t.outil_mailing) newType = 'MAILING'
    else if (t.budget) newType = 'SPONSORISATION'
    
    if (newType !== t.typeTache) {
      await prisma.tache.update({
        where: { id: t.id },
        data: { typeTache: newType }
      })
      console.log(`Fixed: "${t.titre}" [${t.typeTache}] => [${newType}]`)
    }
  }
  
  console.log("Done!")
}

main().then(() => prisma.$disconnect())
