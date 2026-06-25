export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // ─── Input Validation ───────────────────────────────────────────
  if (!body.email || !body.mot_de_passe || !body.nom || !body.prenom) {
    throw createError({ statusCode: 400, statusMessage: 'Tous les champs obligatoires (nom, prénom, email, mot de passe) doivent être remplis.' })
  }

  // Sanitize: trim text fields
  const nom = String(body.nom).trim().slice(0, 100)
  const prenom = String(body.prenom).trim().slice(0, 100)
  const email = String(body.email).trim().toLowerCase().slice(0, 254)
  const motDePasse = String(body.mot_de_passe)

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Format d\'email invalide.' })
  }

  // Enforce minimum password length
  if (motDePasse.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Le mot de passe doit contenir au moins 8 caractères.' })
  }

  // Validate name fields are not just whitespace
  if (!nom || !prenom) {
    throw createError({ statusCode: 400, statusMessage: 'Le nom et le prénom ne peuvent pas être vides.' })
  }

  const existing = await prisma.employe.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 400, statusMessage: 'Cet email est déjà utilisé.' })
  }

  let role = await prisma.role.findUnique({ where: { niveau_acces: 'CM' } })
  if (!role) {
    role = await prisma.role.findFirst()
  }
  if (!role) {
    throw createError({ statusCode: 500, statusMessage: 'Aucun rôle configuré. Contactez un administrateur.' })
  }

  let poste = await prisma.poste.findFirst()
  if (!poste) {
    throw createError({ statusCode: 500, statusMessage: 'Aucun poste configuré. Contactez un administrateur.' })
  }

  await prisma.employe.create({
    data: {
      nom,
      prenom,
      email,
      mot_de_passe: hashPassword(motDePasse),
      is_active: false,
      roleId: role.id,
      posteId: poste.id,
      salaire_base: 400000
    }
  })

  return { success: true, message: 'Compte créé avec succès. Il est en attente de validation par un administrateur.' }
})
