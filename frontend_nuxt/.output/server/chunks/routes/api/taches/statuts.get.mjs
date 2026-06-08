import { b as defineEventHandler } from '../../../_/nitro.mjs';
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

const statuts_get = defineEventHandler(async (event) => {
  const statuts = await prisma.statutTache.findMany();
  const details = {
    "\xC0 faire": { couleur: "#64748b", niveau_progression: 0 },
    "En cours": { couleur: "#3b82f6", niveau_progression: 1 },
    "En attente": { couleur: "#f59e0b", niveau_progression: 2 },
    "Termin\xE9": { couleur: "#10b981", niveau_progression: 3 },
    "Publi\xE9": { couleur: "#8b5cf6", niveau_progression: 4 }
  };
  return statuts.map((s) => {
    var _a, _b;
    return {
      ...s,
      nom: s.libelle,
      // Alias pour le frontend
      couleur: ((_a = details[s.libelle]) == null ? void 0 : _a.couleur) || "#64748b",
      niveau_progression: ((_b = details[s.libelle]) == null ? void 0 : _b.niveau_progression) || 0
    };
  }).sort((a, b) => a.niveau_progression - b.niveau_progression);
});

export { statuts_get as default };
//# sourceMappingURL=statuts.get.mjs.map
