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
  if (!body.nom_theme) {
    throw createError({ statusCode: 400, statusMessage: "Nom du th\xE8me requis" });
  }
  if (body.id) {
    return await prisma.theme.update({
      where: { id: body.id },
      data: { nom_theme: body.nom_theme }
    });
  } else {
    return await prisma.theme.create({
      data: { nom_theme: body.nom_theme }
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post6.mjs.map
