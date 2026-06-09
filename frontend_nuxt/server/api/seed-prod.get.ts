import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // 1. Roles
    const roles = await Promise.all([
      prisma.role.upsert({ where: { niveau_acces: 'ADMIN' }, update: {}, create: { niveau_acces: 'ADMIN' } }),
      prisma.role.upsert({ where: { niveau_acces: 'CM' }, update: {}, create: { niveau_acces: 'CM' } }),
      prisma.role.upsert({ where: { niveau_acces: 'DESIGNER' }, update: {}, create: { niveau_acces: 'DESIGNER' } }),
      prisma.role.upsert({ where: { niveau_acces: 'MONTEUR' }, update: {}, create: { niveau_acces: 'MONTEUR' } }),
      prisma.role.upsert({ where: { niveau_acces: 'DEV' }, update: {}, create: { niveau_acces: 'DEV' } }),
    ])

    // 2. Departements
    const depComm = await prisma.departement.upsert({ where: { nom_departement: 'Communication' }, update: {}, create: { nom_departement: 'Communication' } })
    const depTech = await prisma.departement.upsert({ where: { nom_departement: 'Technique' }, update: {}, create: { nom_departement: 'Technique' } })

    // 3. Postes
    await prisma.poste.upsert({ where: { titre_poste: 'Administrateur' }, update: { departementId: depComm.id }, create: { titre_poste: 'Administrateur', departementId: depComm.id } })
    await prisma.poste.upsert({ where: { titre_poste: 'Community Manager' }, update: { departementId: depComm.id }, create: { titre_poste: 'Community Manager', departementId: depComm.id } })
    await prisma.poste.upsert({ where: { titre_poste: 'Graphiste / Designer' }, update: { departementId: depComm.id }, create: { titre_poste: 'Graphiste / Designer', departementId: depComm.id } })
    await prisma.poste.upsert({ where: { titre_poste: 'Monteur Vidéo' }, update: { departementId: depComm.id }, create: { titre_poste: 'Monteur Vidéo', departementId: depComm.id } })
    await prisma.poste.upsert({ where: { titre_poste: 'Développeur Web' }, update: { departementId: depTech.id }, create: { titre_poste: 'Développeur Web', departementId: depTech.id } })

    // 5. Statuts de Tâches
    await Promise.all([
      prisma.statutTache.upsert({ where: { libelle: 'À faire' }, update: {}, create: { libelle: 'À faire', couleur: '#ef4444' } }),
      prisma.statutTache.upsert({ where: { libelle: 'En cours' }, update: {}, create: { libelle: 'En cours', couleur: '#f59e0b' } }),
      prisma.statutTache.upsert({ where: { libelle: 'En attente' }, update: {}, create: { libelle: 'En attente', couleur: '#3b82f6' } }),
      prisma.statutTache.upsert({ where: { libelle: 'Terminé' }, update: {}, create: { libelle: 'Terminé', couleur: '#22c55e' } }),
      prisma.statutTache.upsert({ where: { libelle: 'Publié' }, update: {}, create: { libelle: 'Publié', couleur: '#10b981' } }),
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

    return { message: 'Database seeded successfully on production!' }
  } catch (error) {
    console.error(error)
    return { error: 'Error seeding DB' }
  }
})
