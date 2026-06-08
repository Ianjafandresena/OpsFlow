// Script to activate all existing employees that don't have a password yet
// (they were created before the auth system was added)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function activateExisting() {
  console.log('Activating all pre-existing employees...')
  
  // Get EMPLOYE role (create if missing)
  let employeRole = await prisma.role.findUnique({ where: { niveau_acces: 'EMPLOYE' } })
  if (!employeRole) {
    employeRole = await prisma.role.create({ data: { niveau_acces: 'EMPLOYE' } })
    console.log('Created EMPLOYE role')
  }

  // Get all employees without a password (pre-auth accounts)
  const toActivate = await prisma.employe.findMany({
    where: { mot_de_passe: null }
  })

  console.log(`Found ${toActivate.length} pre-existing accounts to activate`)

  for (const emp of toActivate) {
    // Skip the eventadmin (already handled)
    if (emp.email === 'eventadmin') continue

    // Check if their role is set correctly — assign EMPLOYE if not
    const currentRole = await prisma.role.findUnique({ where: { id: emp.roleId } })
    const shouldSetRole = !currentRole || currentRole.niveau_acces === 'ADMIN'

    await prisma.employe.update({
      where: { id: emp.id },
      data: {
        is_active: true,
        roleId: shouldSetRole ? employeRole.id : emp.roleId
      }
    })
    console.log(`✓ Activated: ${emp.prenom} ${emp.nom} (${emp.email})`)
  }

  console.log('\nDone! All pre-existing employees are now active.')
  console.log('Note: They still have no password — they need to register or admin sets one.')
}

activateExisting().catch(console.error).finally(() => prisma.$disconnect())
