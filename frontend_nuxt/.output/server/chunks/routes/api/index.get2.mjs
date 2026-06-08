import { b as defineEventHandler } from '../../_/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  return await prisma.editionPage.findMany({
    include: {
      licence: true,
      ville: true
    },
    orderBy: { date_debut: "asc" }
  });
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
