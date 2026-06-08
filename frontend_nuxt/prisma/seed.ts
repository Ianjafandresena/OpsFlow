import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Roles
  const roles = await Promise.all([
    prisma.role.upsert({ where: { niveau_acces: 'ADMIN' }, update: {}, create: { niveau_acces: 'ADMIN' } }),
    prisma.role.upsert({ where: { niveau_acces: 'CM' }, update: {}, create: { niveau_acces: 'CM' } }),
    prisma.role.upsert({ where: { niveau_acces: 'DESIGNER' }, update: {}, create: { niveau_acces: 'DESIGNER' } }),
    prisma.role.upsert({ where: { niveau_acces: 'MONTEUR' }, update: {}, create: { niveau_acces: 'MONTEUR' } }),
    prisma.role.upsert({ where: { niveau_acces: 'DEV' }, update: {}, create: { niveau_acces: 'DEV' } }),
  ])
  console.log('Roles created')

  // 2. Departements
  const depComm = await prisma.departement.upsert({ where: { nom_departement: 'Communication' }, update: {}, create: { nom_departement: 'Communication' } })
  const depTech = await prisma.departement.upsert({ where: { nom_departement: 'Technique' }, update: {}, create: { nom_departement: 'Technique' } })

  // 3. Postes
  const posteAdmin = await prisma.poste.create({ data: { titre_poste: 'Administrateur', departementId: depComm.id } })
  const posteCM = await prisma.poste.create({ data: { titre_poste: 'Community Manager', departementId: depComm.id } })
  const posteDes = await prisma.poste.create({ data: { titre_poste: 'Graphiste / Designer', departementId: depComm.id } })
  const posteMon = await prisma.poste.create({ data: { titre_poste: 'Monteur Vidéo', departementId: depComm.id } })
  const posteDev = await prisma.poste.create({ data: { titre_poste: 'Développeur Web', departementId: depTech.id } })

  // 4. Employés (Test Users)
  await prisma.employe.upsert({ where: { email: 'admin@eventsync.local' }, update: {}, create: { nom: 'Admin', prenom: 'Super', email: 'admin@eventsync.local', posteId: posteAdmin.id, roleId: roles[0].id } })
  await prisma.employe.upsert({ where: { email: 'aina@eventsync.local' }, update: {}, create: { nom: 'R.', prenom: 'Aina', email: 'aina@eventsync.local', posteId: posteCM.id, roleId: roles[1].id } })
  await prisma.employe.upsert({ where: { email: 'designer@eventsync.local' }, update: {}, create: { nom: 'Art', prenom: 'Designer', email: 'designer@eventsync.local', posteId: posteDes.id, roleId: roles[2].id } })
  await prisma.employe.upsert({ where: { email: 'video@eventsync.local' }, update: {}, create: { nom: 'Cut', prenom: 'Monteur', email: 'video@eventsync.local', posteId: posteMon.id, roleId: roles[3].id } })
  await prisma.employe.upsert({ where: { email: 'dev@eventsync.local' }, update: {}, create: { nom: 'Code', prenom: 'Dev', email: 'dev@eventsync.local', posteId: posteDev.id, roleId: roles[4].id } })

  // 5. Statuts de Tâches
  await Promise.all([
    prisma.statutTache.upsert({ where: { libelle: 'À faire' }, update: {}, create: { libelle: 'À faire' } }),
    prisma.statutTache.upsert({ where: { libelle: 'En cours' }, update: {}, create: { libelle: 'En cours' } }),
    prisma.statutTache.upsert({ where: { libelle: 'En attente' }, update: {}, create: { libelle: 'En attente' } }),
    prisma.statutTache.upsert({ where: { libelle: 'Terminé' }, update: {}, create: { libelle: 'Terminé' } }),
    prisma.statutTache.upsert({ where: { libelle: 'Publié' }, update: {}, create: { libelle: 'Publié' } }),
  ])

  // 6. Thèmes
  const themes = ['Annonce', 'Pass -16 ans', 'Pass Week-end', 'Roulette', 'Quizz', 'Invité VIP']
  for (const t of themes) {
    await prisma.theme.upsert({ where: { nom_theme: t }, update: {}, create: { nom_theme: t } })
  }

  // 7. Licences & Villes
  const jof = await prisma.licence.upsert({ where: { sigle: 'JOF' }, update: {}, create: { nom_complet: 'Japan Otaku Festival', sigle: 'JOF' } })
  const jmw = await prisma.licence.upsert({ where: { sigle: 'JMW' }, update: {}, create: { nom_complet: 'Japan Manga Wave', sigle: 'JMW' } })
  
  const vEvreux = await prisma.ville.upsert({ where: { nom_ville: 'Évreux' }, update: {}, create: { nom_ville: 'Évreux' } })
  const vMetz = await prisma.ville.upsert({ where: { nom_ville: 'Metz' }, update: {}, create: { nom_ville: 'Metz' } })

  // 8. Éditions Pages
  await prisma.editionPage.upsert({
    where: { licenceId_villeId: { licenceId: jof.id, villeId: vEvreux.id } },
    update: {},
    create: { licenceId: jof.id, villeId: vEvreux.id, date_debut: new Date('2026-05-23'), date_fin: new Date('2026-05-24') }
  })
  
  await prisma.editionPage.upsert({
    where: { licenceId_villeId: { licenceId: jmw.id, villeId: vMetz.id } },
    update: {},
    create: { licenceId: jmw.id, villeId: vMetz.id, date_debut: new Date('2026-09-18'), date_fin: new Date('2026-09-19') }
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
