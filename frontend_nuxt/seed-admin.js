import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derivedKey}`
}

async function seedAdmin() {
  console.log('Seeding super admin...')
  
  // Find an admin role
  let adminRole = await prisma.role.findUnique({ where: { niveau_acces: 'ADMIN' } })
  if (!adminRole) {
    adminRole = await prisma.role.create({ data: { niveau_acces: 'ADMIN' } })
  }

  // Find a default department and poste just in case
  let dept = await prisma.departement.findFirst()
  if (!dept) {
    dept = await prisma.departement.create({ data: { nom_departement: 'Direction' } })
  }
  let poste = await prisma.poste.findFirst()
  if (!poste) {
    poste = await prisma.poste.create({ data: { titre_poste: 'Directeur', departementId: dept.id } })
  }

  const existing = await prisma.employe.findUnique({ where: { email: 'eventadmin' } })
  if (existing) {
    console.log('Admin already exists! Updating password and active status...')
    await prisma.employe.update({
      where: { email: 'eventadmin' },
      data: {
        mot_de_passe: hashPassword('admin123'),
        is_active: true,
        roleId: adminRole.id
      }
    })
    console.log('Admin updated successfully.')
  } else {
    await prisma.employe.create({
      data: {
        nom: 'Admin',
        prenom: 'System',
        email: 'eventadmin',
        mot_de_passe: hashPassword('admin123'),
        is_active: true,
        roleId: adminRole.id,
        posteId: poste.id
      }
    })
    console.log('Admin created successfully.')
  }
}

seedAdmin().catch(console.error).finally(() => prisma.$disconnect())
