-- Migration OpsFlow : multi-employés, évaluation, statut villes, messages, éditions, recherches
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

-- 4. Ajout recherches et heure_affichage dans EntreeJournal
ALTER TABLE "EntreeJournal"
  ADD COLUMN IF NOT EXISTS "recherches" TEXT,
  ADD COLUMN IF NOT EXISTS "heure_affichage" TEXT;

-- 5. Table CommentaireJournal (système de messages réels)
CREATE TABLE IF NOT EXISTS "CommentaireJournal" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "contenu"   TEXT NOT NULL,
  "isAdmin"   BOOLEAN NOT NULL DEFAULT false,
  "auteur"    TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "entreeId"  TEXT NOT NULL,
  CONSTRAINT "CommentaireJournal_entreeId_fkey"
    FOREIGN KEY ("entreeId") REFERENCES "EntreeJournal"("id") ON DELETE CASCADE
);

-- 6. Table JournalEdition (liaison Journal ↔ EditionPage)
CREATE TABLE IF NOT EXISTS "JournalEdition" (
  "journalId" TEXT NOT NULL,
  "editionId" TEXT NOT NULL,
  CONSTRAINT "JournalEdition_pkey" PRIMARY KEY ("journalId", "editionId"),
  CONSTRAINT "JournalEdition_journalId_fkey"
    FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE,
  CONSTRAINT "JournalEdition_editionId_fkey"
    FOREIGN KEY ("editionId") REFERENCES "EditionPage"("id") ON DELETE CASCADE
);

-- ============================================================
-- Migration V2 : salaire_base, règlements, tache lue, notifications
-- ============================================================

-- 7. Salaire de base pour Employe
ALTER TABLE "Employe"
  ADD COLUMN IF NOT EXISTS "salaire_base" DOUBLE PRECISION;

-- 8. Table Reglement
CREATE TABLE IF NOT EXISTS "Reglement" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "titre"     TEXT NOT NULL,
  "contenu"   TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Table ReglementEmploye (pivot)
CREATE TABLE IF NOT EXISTS "ReglementEmploye" (
  "reglementId" TEXT NOT NULL,
  "employeId"   TEXT NOT NULL,
  CONSTRAINT "ReglementEmploye_pkey" PRIMARY KEY ("reglementId", "employeId"),
  CONSTRAINT "ReglementEmploye_reglementId_fkey"
    FOREIGN KEY ("reglementId") REFERENCES "Reglement"("id") ON DELETE CASCADE,
  CONSTRAINT "ReglementEmploye_employeId_fkey"
    FOREIGN KEY ("employeId") REFERENCES "Employe"("id") ON DELETE CASCADE
);

-- 10. Table TacheLue
CREATE TABLE IF NOT EXISTS "TacheLue" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tacheId"   TEXT NOT NULL,
  "employeId" TEXT NOT NULL,
  "luAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TacheLue_tacheId_fkey"
    FOREIGN KEY ("tacheId") REFERENCES "Tache"("id") ON DELETE CASCADE,
  CONSTRAINT "TacheLue_employeId_fkey"
    FOREIGN KEY ("employeId") REFERENCES "Employe"("id") ON DELETE CASCADE,
  CONSTRAINT "TacheLue_tacheId_employeId_key" UNIQUE ("tacheId", "employeId")
);

-- 11. Table NotificationEmploye
CREATE TABLE IF NOT EXISTS "NotificationEmploye" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "type"      TEXT NOT NULL,
  "message"   TEXT NOT NULL,
  "lue"       BOOLEAN NOT NULL DEFAULT false,
  "refId"     TEXT,
  "employeId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NotificationEmploye_employeId_fkey"
    FOREIGN KEY ("employeId") REFERENCES "Employe"("id") ON DELETE CASCADE
);
