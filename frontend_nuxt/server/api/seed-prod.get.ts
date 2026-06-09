import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // 1. Roles
    await prisma.role.upsert({ where: { niveau_acces: 'ADMIN' }, update: {}, create: { niveau_acces: 'ADMIN' } })
    await prisma.role.upsert({ where: { niveau_acces: 'CM' }, update: {}, create: { niveau_acces: 'CM' } })
    await prisma.role.upsert({ where: { niveau_acces: 'DESIGNER' }, update: {}, create: { niveau_acces: 'DESIGNER' } })
    await prisma.role.upsert({ where: { niveau_acces: 'MONTEUR' }, update: {}, create: { niveau_acces: 'MONTEUR' } })
    await prisma.role.upsert({ where: { niveau_acces: 'DEV' }, update: {}, create: { niveau_acces: 'DEV' } })

    // 2. Departements
    const depComm = await prisma.departement.upsert({
      where: { nom_departement: 'Communication' },
      update: {},
      create: { nom_departement: 'Communication' }
    })
    const depTech = await prisma.departement.upsert({
      where: { nom_departement: 'Technique' },
      update: {},
      create: { nom_departement: 'Technique' }
    })

    // 3. Postes — createMany with skipDuplicates (Poste.titre_poste n'est pas unique dans le schema)
    const existingPostes = await prisma.poste.findMany({ select: { titre_poste: true } })
    const existingTitles = new Set(existingPostes.map(p => p.titre_poste))

    const postesToCreate = [
      { titre_poste: 'Administrateur', departementId: depComm.id },
      { titre_poste: 'Community Manager', departementId: depComm.id },
      { titre_poste: 'Graphiste / Designer', departementId: depComm.id },
      { titre_poste: 'Monteur Vidéo', departementId: depComm.id },
      { titre_poste: 'Développeur Web', departementId: depTech.id },
    ].filter(p => !existingTitles.has(p.titre_poste))

    if (postesToCreate.length > 0) {
      await prisma.poste.createMany({ data: postesToCreate })
    }

    // 4. Statuts de Tâches (StatutTache has no couleur field in schema — only libelle)
    const statuts = ['À faire', 'En cours', 'En attente', 'Terminé', 'Publié']
    for (const libelle of statuts) {
      await prisma.statutTache.upsert({
        where: { libelle },
        update: {},
        create: { libelle }
      })
    }

    // 5. Thèmes
    const themes = ['Annonce', 'Pass -16 ans', 'Pass Week-end', 'Roulette', 'Quizz', 'Invité VIP']
    for (const nom_theme of themes) {
      await prisma.theme.upsert({ where: { nom_theme }, update: {}, create: { nom_theme } })
    }

    // 6. Licences & Villes
    const jof = await prisma.licence.upsert({ where: { sigle: 'JOF' }, update: {}, create: { nom_complet: 'Japan Otaku Festival', sigle: 'JOF' } })
    const jmw = await prisma.licence.upsert({ where: { sigle: 'JMW' }, update: {}, create: { nom_complet: 'Japan Manga Wave', sigle: 'JMW' } })

    const vEvreux = await prisma.ville.upsert({ where: { nom_ville: 'Évreux' }, update: {}, create: { nom_ville: 'Évreux' } })
    const vMetz = await prisma.ville.upsert({ where: { nom_ville: 'Metz' }, update: {}, create: { nom_ville: 'Metz' } })
    const vBordeaux = await prisma.ville.upsert({ where: { nom_ville: 'Bordeaux' }, update: {}, create: { nom_ville: 'Bordeaux' } })

    // 7. Éditions Pages
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
      where: { licenceId_villeId: { licenceId: jof.id, villeId: vBordeaux.id } },
      update: {},
      create: { licenceId: jof.id, villeId: vBordeaux.id, date_debut: new Date('2026-06-07'), date_fin: new Date('2026-06-08') }
    })

    const postesAfter = await prisma.poste.findMany()
    return { 
      success: true, 
      message: 'Base de données initialisée avec succès !',
      postes: postesAfter.map(p => p.titre_poste)
    }
  } catch (error: any) {
    console.error('Seed error:', error)
    return { error: 'Error seeding DB', details: error?.message || 'Unknown error' }
  } finally {
    await prisma.$disconnect()
  }
})
