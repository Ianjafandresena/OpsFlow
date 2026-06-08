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
  if (!body.employeId || !body.editionId) {
    throw createError({ statusCode: 400, statusMessage: "Employe et Edition requis" });
  }
  return await prisma.employe.update({
    where: { id: body.employeId },
    data: {
      editionsGerees: {
        connect: { id: body.editionId }
      }
    }
  });
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
