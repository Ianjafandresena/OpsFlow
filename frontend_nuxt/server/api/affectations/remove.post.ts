export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.employeId || !body.editionId) {
    throw createError({ statusCode: 400, statusMessage: 'Employe et Edition requis' })
  }
  
  // Disconnect l'édition de l'employé
  return await prisma.employe.update({
    where: { id: body.employeId },
    data: {
      editionsGerees: {
        disconnect: { id: body.editionId }
      }
    }
  })
})
