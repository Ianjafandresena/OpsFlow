export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'ADMIN') throw createError({ statusCode: 403, statusMessage: 'Réservé aux admins' })

  const body = await readBody(event)
  if (!body.employeId || !body.action) throw createError({ statusCode: 400, statusMessage: 'Paramètres manquants' })

  const employe = await prisma.employe.findUnique({ where: { id: body.employeId } })
  if (!employe) throw createError({ statusCode: 404, statusMessage: 'Employé introuvable' })

  if (body.action === 'validate') {
    const updateData: any = { is_active: true }
    if (body.data?.posteId) updateData.posteId = body.data.posteId
    if (body.data?.roleId) updateData.roleId = body.data.roleId
    await prisma.employe.update({ where: { id: body.employeId }, data: updateData })
    return { success: true, message: `Compte de ${employe.nom} ${employe.prenom} activé.` }
  }

  if (body.action === 'reject') {
    await prisma.employe.delete({ where: { id: body.employeId } })
    return { success: true, message: 'Compte supprimé.' }
  }

  if (body.action === 'set_password') {
    if (!body.data?.password) throw createError({ statusCode: 400, statusMessage: 'Mot de passe manquant' })
    await prisma.employe.update({
      where: { id: body.employeId },
      data: { mot_de_passe: hashPassword(body.data.password) }
    })
    return { success: true, message: 'Mot de passe mis à jour.' }
  }

  if (body.action === 'set_role') {
    if (!body.data?.roleId) throw createError({ statusCode: 400, statusMessage: 'Rôle manquant' })
    await prisma.employe.update({
      where: { id: body.employeId },
      data: { roleId: body.data.roleId }
    })
    return { success: true, message: 'Rôle mis à jour.' }
  }

  if (body.action === 'toggle_active') {
    const newStatus = !employe.is_active
    await prisma.employe.update({
      where: { id: body.employeId },
      data: { is_active: newStatus }
    })
    return { success: true, message: newStatus ? 'Compte activé.' : 'Compte désactivé.' }
  }

  throw createError({ statusCode: 400, statusMessage: 'Action inconnue' })
})
