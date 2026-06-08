import { b as defineEventHandler, C as readBody, c as createError } from '../../../../../_/nitro.mjs';
import { p as prisma } from '../../../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@prisma/client';

const decider_post = defineEventHandler(async (event) => {
  var _a;
  const id = (_a = event.context.params) == null ? void 0 : _a.id;
  const body = await readBody(event);
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "ID de demande manquant" });
  }
  if (body.decision !== "APPROVE" && body.decision !== "REJECT") {
    throw createError({ statusCode: 400, statusMessage: "decision doit \xEAtre APPROVE ou REJECT" });
  }
  const demande = await prisma.demandeTache.findUnique({
    where: { id }
  });
  if (!demande) {
    throw createError({ statusCode: 404, statusMessage: "Demande introuvable" });
  }
  if (demande.statut !== "EN_ATTENTE") {
    throw createError({ statusCode: 400, statusMessage: "Cette demande a d\xE9j\xE0 \xE9t\xE9 trait\xE9e" });
  }
  if (body.decision === "APPROVE") {
    if (demande.typeDemande === "SUPPRESSION") {
      await prisma.tache.delete({
        where: { id: demande.tacheId }
      });
      return { success: true, message: "T\xE2che supprim\xE9e avec succ\xE8s" };
    } else if (demande.typeDemande === "MODIFICATION") {
      if (!demande.donneesModif) {
        throw createError({ statusCode: 400, statusMessage: "Aucune donn\xE9e de modification fournie" });
      }
      const parsed = JSON.parse(demande.donneesModif);
      const updateData = {};
      const fields = [
        "titre",
        "description",
        "date_limite",
        "demandeur",
        "type_visuel",
        "quantite",
        "format_video",
        "duree_cible",
        "type_technique",
        "type_demarche",
        "outil_mailing",
        "plateforme",
        "type_pub",
        "themePubId",
        "themeSponsoId",
        "budget",
        "audience",
        "editionId",
        "statutTacheId"
      ];
      for (const f of fields) {
        if (parsed[f] !== void 0) {
          if ((f === "date_limite" || f === "date_demande" || f === "date_resultat") && parsed[f]) {
            updateData[f] = new Date(parsed[f]);
          } else {
            updateData[f] = parsed[f];
          }
        }
      }
      await prisma.tache.update({
        where: { id: demande.tacheId },
        data: updateData
      });
      const updatedDemande = await prisma.demandeTache.update({
        where: { id },
        data: { statut: "ACCEPTEE" }
      });
      return { success: true, message: "Modification appliqu\xE9e avec succ\xE8s", demande: updatedDemande };
    }
  } else {
    const updatedDemande = await prisma.demandeTache.update({
      where: { id },
      data: { statut: "REFUSEE" }
    });
    return { success: true, message: "Demande refus\xE9e", demande: updatedDemande };
  }
});

export { decider_post as default };
//# sourceMappingURL=decider.post.mjs.map
