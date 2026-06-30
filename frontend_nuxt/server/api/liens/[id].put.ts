export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { titre, description, url, modifieParId } = body

  if (!titre?.trim() || !url?.trim() || !modifieParId) {
    throw createError({ statusCode: 400, statusMessage: 'titre, url et modifieParId sont requis' })
  }

  const lien = await prisma.lienImportant.update({
    where: { id },
    data: {
      titre: titre.trim(),
      description: description?.trim() || null,
      url: url.trim(),
      modifieParId,
      modifieLeAt: new Date()
    },
    include: {
      auteur: { select: { id: true, nom: true, prenom: true } },
      modifiePar: { select: { id: true, nom: true, prenom: true } }
    }
  })
  return lien
})
