export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { titre, description, url, auteurId } = body

  if (!titre?.trim() || !url?.trim() || !auteurId) {
    throw createError({ statusCode: 400, statusMessage: 'titre, url et auteurId sont requis' })
  }

  const lien = await prisma.lienImportant.create({
    data: { titre: titre.trim(), description: description?.trim() || null, url: url.trim(), auteurId },
    include: {
      auteur: { select: { id: true, nom: true, prenom: true } },
      modifiePar: { select: { id: true, nom: true, prenom: true } }
    }
  })
  return lien
})
