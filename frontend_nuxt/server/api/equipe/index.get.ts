export default defineEventHandler(async (event) => {
  const employes = await prisma.employe.findMany({
    include: {
      poste: { include: { departement: true } },
      role: true,
      editionsGerees: {
        include: {
          licence: true,
          ville: true
        }
      }
    },
    orderBy: { nom: 'asc' }
  })

  return employes.map(emp => {
    const { mot_de_passe, ...safeEmp } = emp
    return safeEmp
  })
})
