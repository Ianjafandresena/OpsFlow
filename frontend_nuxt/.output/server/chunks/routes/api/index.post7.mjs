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
  if (!body.nom_ville) {
    throw createError({ statusCode: 400, statusMessage: "Nom de ville requis" });
  }
  return await prisma.ville.create({
    data: {
      nom_ville: body.nom_ville
    }
  });
});

export { index_post as default };
//# sourceMappingURL=index.post7.mjs.map
