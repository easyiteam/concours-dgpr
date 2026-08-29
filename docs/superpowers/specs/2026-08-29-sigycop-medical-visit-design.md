# Phase SIGYCOP (visite médicale) — Design (concours-dgpr)

## Contexte

Le concours DGPR comporte aujourd'hui plusieurs phases par examen, modélisées par un `Step` simple (`label`, `order`, `active`, `status: StepStatus`) lié à l'`Exam`, avec `Candidature.stepId` pointant vers l'étape en cours. Deux phases scorées existent déjà : sportive (`sport`, module `SportProfile`) et écrite (`writing`, module `WritingProfile`).

On ajoute une phase **SIGYCOP** (visite médicale d'aptitude), positionnée en **dernière étape**, après la phase écrite — même position que sur le projet frère dgefc-recrutement. SIGYCOP est une cotation médico-physique à 7 axes (S, I, G, Y, C, O, P), chacun noté de 1 (excellent) à 6, comparée à un seuil maximum par axe configuré par concours. Un candidat est apte seulement si chacune de ses 7 notes respecte le seuil.

Ce document adapte le design déjà validé et implémenté sur dgefc-recrutement à l'architecture réelle de concours-dgpr, qui diffère sur plusieurs points structurants (détaillés ci-dessous) — ce n'est pas un portage à l'identique.

## Différences structurantes avec dgefc-recrutement (pourquoi le design diffère)

- **Pas de `StepConfig` par examen avec JSON de config** : `Step` est un modèle plat, sans champ de configuration existant. Les seuils SIGYCOP seront stockés dans un nouveau champ `Step.evaluationConfig Json?`, ajouté directement à ce modèle (au lieu d'un modèle de config séparé).
- **Pas de notion de suppléant** : `CandidatureStatus` n'a que `INDETERMINATE | ACCEPTED | REJECTED` (pas de `RECLAMATION`). L'éligibilité SIGYCOP est donc simplement `WritingProfile.status === ACCEPTED`, sans cas suppléant à gérer.
- **Délibération globale, pas par phase** : le modèle `Validation` de DGPR n'a pas de rattachement à un `Step` — c'est un processus unique par examen. Décision validée : **SIGYCOP n'a pas de délibération** ; le résultat apte/inapte est calculé et visible immédiatement à la saisie, sans étape de confirmation jury.
- **Rôles plats** : DGPR n'a que `USER | EXAM_MANAGER | ADMIN`, sans rôle spécialisé par phase (contrairement à `SPORT_MONITOR`/`WRITING_MONITOR` chez dgefc). Décision validée : on introduit `MEDICAL_MONITOR` comme premier rôle spécialisé par phase dans ce projet.
- **`Center` est déjà générique** (pas de `WritingCenter` dédié — juste `Center`, actuellement lié à `WritingProfile`). On l'étend avec une relation vers `SigycopProfile` plutôt que de créer un `SigycopCenter` séparé.
- **Frontends en React**, pas Vue : le dashboard admin (`dashboard/`) et l'app de saisie mobile (`scorer/`, React + Ionic + Capacitor) utilisent React, pas Vue — tout le code d'interface doit être écrit en React/JSX, pas transposé depuis les composants Vue de dgefc.
- **Pas de garde-fou phase-active existant** : ni `sport` ni `writing` ne vérifient aujourd'hui que le `Step` correspondant est `IN_PROGRESS` avant d'accepter une saisie côté serveur — c'est un vrai trou déjà identifié sur dgefc-recrutement et corrigé là-bas. On l'introduit pour SIGYCOP (nouveau module, aucun risque de régression), sans toucher aux modules `sport`/`writing` existants (hors scope de cette tâche).
- **App mobile dédiée** : décision validée de créer une nouvelle app `sigycop-scorer/` (clone structurel de `scorer/`), plutôt que d'ajouter un écran à `scorer/` existant — même choix que dgefc-recrutement.

## Portée

Inclus :
- Nouveau modèle `SigycopProfile`, nouveau champ `Step.evaluationConfig`, nouveau rôle `MEDICAL_MONITOR`.
- Nouveau module NestJS `sigycop` (miroir structurel de `sport`) : enregistrement, seuils, liste, export Excel, recherche par référence.
- Nouvel écran dashboard (React) : liste/résultats + configuration des seuils.
- Nouvelle app mobile `sigycop-scorer/` (React + Ionic + Capacitor, clone de `scorer/`) : recherche candidat + saisie des 7 notes.
- Correctif ciblé du bug `CurrentHost()` (host de production codé en dur sur `api-concours.dgefc.bj`), découvert pendant l'exploration — nécessaire pour que la nouvelle app fonctionne correctement en production, et corrige un bug déjà réel sur `ValidatorController`.

Exclus (hors périmètre) :
- Ajout d'un garde-fou phase-active pour `sport`/`writing` existants.
- Refonte du modèle de délibération pour le rendre par-phase.
- Tout changement au calcul de classement des autres phases.

## Modèle de données

### `BasicRole` (enum)
Ajout de `MEDICAL_MONITOR`.

### `Step` (modification)
Ajout d'un champ optionnel :
```prisma
model Step {
  // ... champs existants inchangés ...
  evaluationConfig Json?
}
```
Forme attendue pour SIGYCOP : `{ "s": 3, "i": 3, "g": 4, "y": 4, "c": 2, "o": 3, "p": 4 }`.

### `Center` (modification)
Ajout de la relation inverse :
```prisma
model Center {
  // ... champs existants inchangés ...
  sigycopProfiles SigycopProfile[]
}
```

### `SigycopProfile` (nouveau modèle)
```prisma
model SigycopProfile {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  enabled   Boolean  @default(true)

  candidature   Candidature @relation(fields: [candidatureId], references: [id])
  candidatureId String      @unique

  center   Center @relation(fields: [centerId], references: [id])
  centerId String

  s Int
  i Int
  g Int
  y Int
  c Int
  o Int
  p Int

  apte       Boolean
  failedAxes String[]

  status CandidatureStatus @default(INDETERMINATE)
}
```
Un seul profil par candidature (`@unique` sur `candidatureId`) — une ré-saisie met à jour le profil existant (upsert), pas de doublon.

## Logique métier

### Éligibilité à la saisie
1. Le `Step` SIGYCOP de l'examen doit être `status === IN_PROGRESS`.
2. La candidature doit avoir un `WritingProfile.status === ACCEPTED`.

### Calcul d'aptitude
1. Charger `Step.evaluationConfig` (seuils) ; 400 explicite si absent.
2. Pour chacun des 7 axes, si la note dépasse le seuil, l'axe est ajouté à `failedAxes`.
3. `apte = failedAxes.length === 0`.
4. `status = apte ? ACCEPTED : REJECTED` sur le `SigycopProfile`.

Pas de notion de suppléant ni de classement — contrôle d'aptitude binaire par candidat.

### Délibération
Aucune — décision validée. Le résultat est visible immédiatement sur le dashboard après saisie.

## API (nouveau module `sigycop`, miroir de `sport`)

- `POST /sigycop` — `{ reference, centerId, s, i, g, y, c, o, p }`. Rôles `ADMIN, MEDICAL_MONITOR`. Vérifie éligibilité + phase active, calcule l'aptitude, upsert.
- `GET /sigycop/exam/:id` — liste paginée par examen (miroir de `SportController.findAllByExam`).
- `GET /sigycop/exam/:id/download` — export Excel (`aoo_to_xlsx`/`convertToSheet`, même lib que sport/écrit). Nom de fichier : `Visite_medicale_sigycop_{examen}.xlsx`.
- `GET /sigycop/:id/info` — recherche candidat par référence, pour l'app mobile.
- `PATCH /sigycop/thresholds/:stepId` — `{ s, i, g, y, c, o, p }` (les 7 seuils), écrit dans `Step.evaluationConfig`. Rôle `ADMIN` uniquement.
- `sendPushEvent({ event: 'sigycop.update' })` après chaque mutation (cohérent avec `sports.update`/`writing.update`).

Erreurs :
- Phase pas `IN_PROGRESS` → 403, message lisible (jamais de clé technique brute).
- Candidat non accepté à l'écrit → 403, message lisible.
- Seuils non configurés → 400, message lisible.
- Notes hors plage 1-6 → validation `class-validator` (`@Min(1) @Max(6)`) sur le DTO.

## Interfaces

### Dashboard (React)
Nouvelle page `pages/admin/Sigycop.tsx`, miroir de `Writing.tsx` :
- `components/views/sigycop/SigycopCandidates.tsx` — liste + résultats (colonnes N°, candidat, référence, S/I/G/Y/C/O/P, Apte/Inapte + axes en échec), bouton téléchargement Excel.
- `components/views/sigycop/SigycopThresholds.tsx` — formulaire à 7 champs numériques, écrit via `PATCH /sigycop/thresholds/:stepId`.
- `api/sigycop.api.ts` — miroir de `sport.api.ts`.
- Entrée de navigation ajoutée au menu existant, visible pour `ADMIN`/`MEDICAL_MONITOR`.
- Ajouts mineurs : option de rôle "Moniteur visite médicale" dans la création d'utilisateur ; option d'étape "SIGYCOP" dans la création de step.

### App mobile `sigycop-scorer/` (nouvelle, React + Ionic + Capacitor)
Clone structurel de `scorer/` (mêmes patterns d'auth, de build, de config Capacitor), réduit à un seul écran :
- Recherche candidat par référence (réutilise le composant de recherche déjà présent dans `scorer/`).
- Formulaire à 7 champs numériques (1-6).
- Bouton "Enregistrer" → résultat apte/inapte affiché immédiatement.
- `capacitor.config.ts` proprement configuré pour DGPR (pas de copie non renommée, contrairement au bug constaté sur `mobile`/`mobile-scorer` pendant l'exploration).
- Corrige le bug `CurrentHost()` (`libs/decorators/src/current-host.decorator.ts`) qui renvoie en dur `https://api-concours.dgefc.bj` en production, quel que soit le projet — nécessaire pour que les éventuels liens générés par cette nouvelle app (et par `ValidatorController`, déjà affecté) pointent vers le bon serveur.

## Tests / vérification

Suivant la méthode déjà employée sur dgefc-recrutement : vérification bout en bout via appels API directs (création de seuils, saisie d'un profil sous et au-dessus des seuils, vérification du calcul d'aptitude, vérification du blocage hors phase active et hors éligibilité écrite), puis vérification visuelle du dashboard et de l'app mobile.
