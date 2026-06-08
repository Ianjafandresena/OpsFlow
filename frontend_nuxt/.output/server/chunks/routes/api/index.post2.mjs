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
  if (!body.licenceId || !body.villeId) {
    throw createError({ statusCode: 400, statusMessage: "Licence et Ville requises" });
  }
  if (body.id) {
    return await prisma.editionPage.update({
      where: { id: body.id },
      data: {
        licenceId: body.licenceId,
        villeId: body.villeId,
        date_debut: body.date_debut ? new Date(body.date_debut) : null,
        date_fin: body.date_fin ? new Date(body.date_fin) : null,
        metaPageId: body.metaPageId || null
      },
      include: { licence: true, ville: true }
    });
  } else {
    return await prisma.editionPage.create({
      data: {
        licenceId: body.licenceId,
        villeId: body.villeId,
        date_debut: body.date_debut ? new Date(body.date_debut) : null,
        date_fin: body.date_fin ? new Date(body.date_fin) : null,
        metaPageId: body.metaPageId || null
      },
      include: { licence: true, ville: true }
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post2.mjs.map
