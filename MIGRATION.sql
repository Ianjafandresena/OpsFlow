-- Migration OpsFlow : multi-employés, évaluation, statut villes
-- À exécuter dans la console SQL de Neon (https://console.neon.tech)

-- 1. Ajout des colonnes employe3 et employe4 dans Journal
ALTER TABLE "Journal"
  ADD COLUMN IF NOT EXISTS "employe3Id" TEXT REFERENCES "Employe"("id") ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS "employe4Id" TEXT REFERENCES "Employe"("id") ON DELETE SET NULL;

-- 2. Ajout des colonnes évaluation dans EntreeJournal
ALTER TABLE "EntreeJournal"
  ADD COLUMN IF NOT EXISTS "evaluation_type" TEXT,
  ADD COLUMN IF NOT EXISTS "evaluation_montant" DOUBLE PRECISION;

-- 3. Ajout des colonnes statut dans Ville
ALTER TABLE "Ville"
  ADD COLUMN IF NOT EXISTS "statut" TEXT DEFAULT 'NEUTRE',
  ADD COLUMN IF NOT EXISTS "statut_commentaire" TEXT;
