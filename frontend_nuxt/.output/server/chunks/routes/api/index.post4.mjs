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
  if (!body.nom_complet || !body.sigle) {
    throw createError({ statusCode: 400, statusMessage: "Nom et sigle requis" });
  }
  return await prisma.licence.create({
    data: {
      nom_complet: body.nom_complet,
      sigle: body.sigle
    }
  });
});

export { index_post as default };
//# sourceMappingURL=index.post4.mjs.map
