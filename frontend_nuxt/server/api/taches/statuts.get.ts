export default defineEventHandler(async (event) => {
  const statuts = await prisma.statutTache.findMany()
  
  // Mapping local pour ajouter des couleurs et ordre
  const details = {
    'À faire': { couleur: '#64748b', niveau_progression: 0 },
    'En cours': { couleur: '#3b82f6', niveau_progression: 1 },
    'En attente': { couleur: '#f59e0b', niveau_progression: 2 },
    'Terminé': { couleur: '#10b981', niveau_progression: 3 },
    'Publié': { couleur: '#8b5cf6', niveau_progression: 4 }
  }

  return statuts.map(s => ({
    ...s,
    nom: s.libelle, // Alias pour le frontend
    couleur: details[s.libelle]?.couleur || '#64748b',
    niveau_progression: details[s.libelle]?.niveau_progression || 0
  })).sort((a, b) => a.niveau_progression - b.niveau_progression)
})
