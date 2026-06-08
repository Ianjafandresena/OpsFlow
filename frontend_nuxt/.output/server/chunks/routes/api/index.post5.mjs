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
  const optionalFields = [
    "plateforme",
    "type_pub",
    "type_demarche",
    "themePubId",
    "themeSponsoId",
    "budget",
    "audience",
    "format_video",
    "duree_cible",
    "type_visuel",
    "quantite",
    "type_technique",
    "date_demande",
    "date_resultat",
    "outil_mailing",
    "demandeur",
    "description",
    "lien_livrable",
    "editionId"
  ];
  for (const key of optionalFields) {
    if (body[key] === "" || body[key] === void 0) body[key] = null;
  }
  if (!body.titre || !body.employeId || !body.statutTacheId || !body.date_limite) {
    throw createError({ statusCode: 400, statusMessage: "Champs obligatoires manquants" });
  }
  const resolveTypeTache = () => {
    const t = body.typeTache || "";
    if (t === "MONTEUR" || body.format_video || body.duree_cible || body.demandeur) return "MONTEUR";
    if (t === "DESIGNER" || body.type_visuel || body.quantite) return "DESIGNER";
    if (t === "DEV" || body.type_technique) return "DEV";
    if (t === "Publication" || body.plateforme && body.type_pub) return "PUBLICATION";
    if (t === "Sponsorisation (Ads)" || body.themeSponsoId || body.budget && !body.outil_mailing) return "SPONSORISATION";
    if (t === "D\xE9marche Administrative" || body.type_demarche) return "ADMINISTRATIVE";
    if (t === "Mailing (Newsletter)" || body.outil_mailing) return "MAILING";
    return "PUBLICATION";
  };
  const data = {
    typeTache: resolveTypeTache(),
    titre: body.titre,
    description: body.description,
    date_limite: new Date(body.date_limite),
    employeId: body.employeId,
    editionId: body.editionId,
    statutTacheId: body.statutTacheId,
    plateforme: body.plateforme,
    type_pub: body.type_pub,
    type_demarche: body.type_demarche,
    themePubId: body.themePubId,
    themeSponsoId: body.themeSponsoId,
    budget: body.budget ? parseFloat(body.budget) : null,
    audience: body.audience,
    format_video: body.format_video,
    duree_cible: body.duree_cible,
    type_visuel: body.type_visuel,
    quantite: body.quantite ? parseInt(body.quantite) : null,
    type_technique: body.type_technique,
    date_demande: body.date_demande ? new Date(body.date_demande) : null,
    date_resultat: body.date_resultat ? new Date(body.date_resultat) : null,
    outil_mailing: body.outil_mailing,
    demandeur: body.demandeur
  };
  if (body.id) {
    return await prisma.tache.update({
      where: { id: body.id },
      data
    });
  } else {
    console.log("--- CREATING TACHE ---");
    console.log(data);
    return await prisma.tache.create({ data });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post5.mjs.map
