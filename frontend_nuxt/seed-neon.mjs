import { PrismaClient } from '@prisma/client'

const NEON_URL = 'postgresql://neondb_owner:npg_twyi5kKNlJ2p@ep-steep-term-ag9nluw1-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

const prisma = new PrismaClient({
  datasources: { db: { url: NEON_URL } }
})

async function main() {
  console.log('🚀 Connexion à Neon...')

  // 1. Roles
  for (const r of ['ADMIN','CM','DESIGNER','MONTEUR','DEV']) {
    await prisma.role.upsert({ where: { niveau_acces: r }, update: {}, create: { niveau_acces: r } })
  }
  console.log('✅ Rôles OK')

  // 2. Departements
  const depComm = await prisma.departement.upsert({
    where: { nom_departement: 'Communication' }, update: {}, create: { nom_departement: 'Communication' }
  })
  const depTech = await prisma.departement.upsert({
    where: { nom_departement: 'Technique' }, update: {}, create: { nom_departement: 'Technique' }
  })
  console.log('✅ Départements OK — Communication:', depComm.id, '| Technique:', depTech.id)

  // 3. Postes — check existence first
  const allPostes = await prisma.poste.findMany()
  console.log('Postes existants:', allPostes.map(p => p.titre_poste))

  const postesNeeded = [
    { titre_poste: 'Administrateur', departementId: depComm.id },
    { titre_poste: 'Community Manager', departementId: depComm.id },
    { titre_poste: 'Graphiste / Designer', departementId: depComm.id },
    { titre_poste: 'Monteur Vidéo', departementId: depComm.id },
    { titre_poste: 'Développeur Web', departementId: depTech.id },
  ]

  for (const p of postesNeeded) {
    const exists = allPostes.find(x => x.titre_poste === p.titre_poste)
    if (!exists) {
      const created = await prisma.poste.create({ data: p })
      console.log('  ➕ Poste créé:', created.titre_poste)
    } else {
      console.log('  ✓ Poste existe déjà:', p.titre_poste)
    }
  }

  // 4. Statuts
  for (const libelle of ['À faire', 'En cours', 'En attente', 'Terminé', 'Publié']) {
    await prisma.statutTache.upsert({ where: { libelle }, update: {}, create: { libelle } })
  }
  console.log('✅ Statuts OK')

  // 5. Thèmes
  for (const nom_theme of ['Annonce', 'Pass -16 ans', 'Pass Week-end', 'Roulette', 'Quizz', 'Invité VIP']) {
    await prisma.theme.upsert({ where: { nom_theme }, update: {}, create: { nom_theme } })
  }
  console.log('✅ Thèmes OK')

  // 6. Licences
  const jof = await prisma.licence.upsert({ where: { sigle: 'JOF' }, update: {}, create: { nom_complet: 'Japan Otaku Festival', sigle: 'JOF' } })
  const jmw = await prisma.licence.upsert({ where: { sigle: 'JMW' }, update: {}, create: { nom_complet: 'Japan Manga Wave', sigle: 'JMW' } })
  console.log('✅ Licences OK')

  // 7. Villes
  const vEvreux  = await prisma.ville.upsert({ where: { nom_ville: 'Évreux' },   update: {}, create: { nom_ville: 'Évreux' } })
  const vMetz    = await prisma.ville.upsert({ where: { nom_ville: 'Metz' },     update: {}, create: { nom_ville: 'Metz' } })
  const vBord    = await prisma.ville.upsert({ where: { nom_ville: 'Bordeaux' }, update: {}, create: { nom_ville: 'Bordeaux' } })
  console.log('✅ Villes OK')

  // 8. Éditions
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
  await prisma.editionPage.upsert({
    where: { licenceId_villeId: { licenceId: jof.id, villeId: vBord.id } },
    update: {},
    create: { licenceId: jof.id, villeId: vBord.id, date_debut: new Date('2026-06-07'), date_fin: new Date('2026-06-08') }
  })
  console.log('✅ Éditions OK')

  // Résultat final
  const finalPostes = await prisma.poste.findMany({ include: { departement: true } })
  console.log('\n🎉 TERMINÉ ! Postes en base:')
  finalPostes.forEach(p => console.log(`  - ${p.titre_poste} (${p.departement.nom_departement})`))
}

main()
  .catch(e => { console.error('❌ ERREUR:', e.message); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
