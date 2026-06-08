export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.employeId || !body.editionId) {
    throw createError({ statusCode: 400, statusMessage: 'Employe et Edition requis' })
  }
  
  // Connect l'édition à l'employé
  return await prisma.employe.update({
    where: { id: body.employeId },
    data: {
      editionsGerees: {
        connect: { id: body.editionId }
      }
    }
  })
})
