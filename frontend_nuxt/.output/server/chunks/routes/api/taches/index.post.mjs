import { b as defineEventHandler, C as readBody, c as createError } from '../../../_/nitro.mjs';
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

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.tacheId || !body.typeDemande || !body.motif) {
    throw createError({ statusCode: 400, statusMessage: "Champs requis manquants (tacheId, typeDemande, motif)" });
  }
  if (body.typeDemande !== "MODIFICATION" && body.typeDemande !== "SUPPRESSION") {
    throw createError({ statusCode: 400, statusMessage: "typeDemande doit \xEAtre MODIFICATION ou SUPPRESSION" });
  }
  const task = await prisma.tache.findUnique({
    where: { id: body.tacheId }
  });
  if (!task) {
    throw createError({ statusCode: 404, statusMessage: "T\xE2che introuvable" });
  }
  let stringifiedDonneesModif = null;
  if (body.typeDemande === "MODIFICATION" && body.donneesModif) {
    stringifiedDonneesModif = JSON.stringify(body.donneesModif);
  }
  const demande = await prisma.demandeTache.create({
    data: {
      tacheId: body.tacheId,
      typeDemande: body.typeDemande,
      motif: body.motif,
      donneesModif: stringifiedDonneesModif,
      statut: "EN_ATTENTE"
    }
  });
  return demande;
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
