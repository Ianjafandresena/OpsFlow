import { b as defineEventHandler, r as getRouterParam, c as createError } from '../../../_/nitro.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const _id__delete = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, statusMessage: "ID manquant" });
  try {
    await prisma.editionPage.delete({
      where: { id }
    });
    return { success: true };
  } catch (e) {
    throw createError({ statusCode: 500, statusMessage: "Impossible de supprimer (d\xE9pendances existantes ?)" });
  }
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
