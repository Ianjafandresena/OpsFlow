import { b as defineEventHandler, m as getQuery } from '../../_/nitro.mjs';
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
  const query = getQuery(event);
  const where = {};
  if (query.employeId) where.employeId = query.employeId;
  if (query.editionId) where.editionId = query.editionId;
  if (query.statutTacheId) where.statutTacheId = query.statutTacheId;
  if (query.typeTache) {
    const types = query.typeTache.split(",");
    if (types.length === 1) {
      where.typeTache = types[0];
    } else {
      where.typeTache = { in: types };
    }
  }
  if (query.departementNom) {
    where.employe = {
      poste: {
        departement: {
          nom_departement: query.departementNom
        }
      }
    };
  }
  return await prisma.tache.findMany({
    where,
    include: {
      employe: true,
      edition: {
        include: { licence: true, ville: true }
      },
      statutTache: true,
      themePub: true,
      themeSponso: true
    },
    orderBy: { date_limite: "asc" }
  });
});

export { index_get as default };
//# sourceMappingURL=index.get7.mjs.map
