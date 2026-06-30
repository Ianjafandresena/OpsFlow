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

-- ============================================================
-- Migration V3 : visibilité journal, droits édition, évaluations détaillées
-- ============================================================

ALTER TABLE "Journal"
  ADD COLUMN IF NOT EXISTS "visibiliteMode" TEXT NOT NULL DEFAULT 'TOUS';

CREATE TABLE IF NOT EXISTS "JournalAcces" (
  "id"         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "journalId"  TEXT NOT NULL,
  "employeId"  TEXT NOT NULL,
  "peutEditer" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "JournalAcces_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE,
  CONSTRAINT "JournalAcces_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "Employe"("id") ON DELETE CASCADE,
  CONSTRAINT "JournalAcces_journalId_employeId_key" UNIQUE ("journalId", "employeId")
);

ALTER TABLE "EntreeJournal"
  ADD COLUMN IF NOT EXISTS "editeurId" TEXT REFERENCES "Employe"("id") ON DELETE SET NULL;

ALTER TABLE "EntreeJournal"
  ADD COLUMN IF NOT EXISTS "reportee" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "tacheTerminee" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS "EvaluationSalaire" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "employeId" TEXT NOT NULL,
  "journalId" TEXT,
  "mois"      INTEGER NOT NULL,
  "annee"     INTEGER NOT NULL,
  "type"      TEXT NOT NULL,
  "montant"   DOUBLE PRECISION NOT NULL,
  "motif"     TEXT NOT NULL,
  "statut"    TEXT NOT NULL DEFAULT 'ACQUIS',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EvaluationSalaire_employeId_fkey" FOREIGN KEY ("employeId") REFERENCES "Employe"("id") ON DELETE CASCADE,
  CONSTRAINT "EvaluationSalaire_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE SET NULL
);

-- ============================================================
-- Migration V4 : mémos avec liens
-- ============================================================

CREATE TABLE IF NOT EXISTS "Memo" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "contenu"   TEXT NOT NULL,
  "liens"     TEXT,
  "auteurId"  TEXT NOT NULL,
  "journalId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Memo_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "Employe"("id") ON DELETE CASCADE,
  CONSTRAINT "Memo_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE
);

-- ============================================================
-- Migration V5 : fusion/groupes de journaux
-- ============================================================

CREATE TABLE IF NOT EXISTS "GroupeJournal" (
  "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "nom"       TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "Journal" ADD COLUMN IF NOT EXISTS "groupeId" TEXT REFERENCES "GroupeJournal"("id") ON DELETE SET NULL;

-- ============================================================
-- Migration V6 : vérification des tâches + liens importants
-- ============================================================

-- aVerifier flag sur Tache (l'employé soumet pour validation admin)
ALTER TABLE "Tache" ADD COLUMN IF NOT EXISTS "aVerifier" BOOLEAN NOT NULL DEFAULT false;
-- motifModification : motif de retour admin (À modifier flow)
ALTER TABLE "Tache" ADD COLUMN IF NOT EXISTS "motifModification" TEXT;

-- ============================================================
-- Migration V7 : aVerifier + motifModification sur EntreeJournal (entrées manuelles)
-- ============================================================
ALTER TABLE "EntreeJournal" ADD COLUMN IF NOT EXISTS "aVerifier" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "EntreeJournal" ADD COLUMN IF NOT EXISTS "motifModification" TEXT;

-- Table LienImportant (liens partagés par toute l'équipe)
CREATE TABLE IF NOT EXISTS "LienImportant" (
  "id"           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "titre"        TEXT NOT NULL,
  "description"  TEXT,
  "url"          TEXT NOT NULL,
  "auteurId"     TEXT NOT NULL,
  "modifieParId" TEXT,
  "modifieLeAt"  TIMESTAMP(3),
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LienImportant_auteurId_fkey"     FOREIGN KEY ("auteurId")     REFERENCES "Employe"("id") ON DELETE CASCADE,
  CONSTRAINT "LienImportant_modifieParId_fkey" FOREIGN KEY ("modifieParId") REFERENCES "Employe"("id") ON DELETE SET NULL
);
