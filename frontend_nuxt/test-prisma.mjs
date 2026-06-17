import { PrismaClient } from '@prisma/client'

const NEON_URL = 'postgresql://neondb_owner:npg_twyi5kKNlJ2p@ep-steep-term-ag9nluw1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
const prisma = new PrismaClient({
  datasources: { db: { url: NEON_URL } }
})

async function main() {
  try {
    const types = 'PUBLICATION,SPONSORISATION,MAILING,ADMINISTRATIVE'.split(',')
    const where = { typeTache: { in: types } }
    console.log("Query where:", where)
    const res = await prisma.tache.findMany({ where })
    console.log("Found", res.length, "tasks")
    if (res.length > 0) {
      console.log(res[0])
    }
  } catch (e) {
    console.error("Prisma error:", e)
  }
}

main()
