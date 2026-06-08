import { b as defineEventHandler, m as getQuery } from '../../../_/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const statut = query.statut || "EN_ATTENTE";
  const demandes = await prisma.demandeTache.findMany({
    where: {
      statut
    },
    include: {
      tache: {
        include: {
          employe: {
            include: {
              poste: {
                include: {
                  departement: true
                }
              }
            }
          },
          edition: {
            include: {
              licence: true,
              ville: true
            }
          },
          statutTache: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return demandes;
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
