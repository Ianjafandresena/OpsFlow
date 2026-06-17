import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const tasks = await prisma.tache.findMany({
    where: {
      typeTache: {
        in: ['PUBLICATION', 'SPONSORISATION', 'MAILING', 'ADMINISTRATIVE']
      }
    },
    include: { employe: true, statutTache: true }
  })
  console.log("Tasks found with typeTache filter:", tasks.length)
}
main()
