import { b as defineEventHandler, C as readBody, c as createError } from '../../_/nitro.mjs';
import { p as prisma } from '../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.nom || !body.prenom || !body.email || !body.posteId || !body.roleId) {
    throw createError({ statusCode: 400, statusMessage: "Champs obligatoires manquants" });
  }
  if (body.id) {
    return await prisma.employe.update({
      where: { id: body.id },
      data: {
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        posteId: body.posteId,
        roleId: body.roleId
      },
      include: { poste: { include: { departement: true } }, role: true }
    });
  } else {
    return await prisma.employe.create({
      data: {
        nom: body.nom,
        prenom: body.prenom,
        email: body.email,
        posteId: body.posteId,
        roleId: body.roleId
      },
      include: { poste: { include: { departement: true } }, role: true }
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post3.mjs.map
