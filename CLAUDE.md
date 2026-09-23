# Portfolio BTS SIO SISR — Wladimir Bigand

## Avant chaque itération
1. Relire CLAUDE.md et DESIGN.md en entier.
2. Présenter un plan court, attendre la validation, puis exécuter.
3. S'arrêter à la fin de l'étape demandée, sans enchaîner sur la suivante.

## Contexte d'usage
- Portfolio présenté oralement devant un jury (épreuve E5) **sur un projecteur**, puis consultable en ligne.
- Objectif : une vraie expérience utilisateur (animations, composants custom), jamais au détriment de la lisibilité.

## Stack
- Vite + React + TypeScript (strict), Tailwind CSS v4 (config CSS-first), Motion (`motion/react`), lucide-react.
- Site statique single page à ancres, sans router. `base: './'`.
- Hébergement : GitHub Pages (GitHub Action). Option future : VPS + Caddy.
- Formulaire : Formspree (aucun backend).

## Règles
- Tout le texte vit dans `src/content/`, typé. Aucun texte en dur dans les composants.
- Interface en français.
- Aucune nouvelle dépendance sans validation explicite.
- Ne jamais inventer de détail technique sur les réalisations : utiliser `TODO(wladimir)`.
- Portfolio public : aucune donnée d'infrastructure réelle de l'employeur (IP, VLAN IDs, noms d'hôtes, domaines internes) dans le contenu ou les images. Toute capture/schéma doit être anonymisé.
- Numérotation des sections : jamais stockée dans `src/content/`. Chaque layout l'affiche ou non, calculée depuis l'ordre de `site.navigation` (`src/lib/sections.ts`).
- Tiret cadratin (—) : autorisé dans le texte courant (incises, typographie française), interdit comme séparateur décoratif dans les libellés, la nav, les titres courts et le footer (utiliser `·`, `:`, une virgule ou une mise en page). Plages de dates : tiret demi-cadratin (`2023 – 2025`).
- Durée du mode Présentation : uniquement `site.presentation.dureeMinutes` (`src/content/site.ts`), jamais codée en dur ailleurs.
- Icônes : lucide-react uniquement. Animations : Motion uniquement (pas de lib d'animation CSS tierce).
- Composants : un composant par fichier, props typées, pas de `any`.

## Fonctionnalités à préserver
- Chrono de session (qui deviendra un compte à rebours en mode Présentation).
- Thème clair/sombre (préférence système par défaut, bascule manuelle mémorisée).
- Texte « typing » dans le hero.
- Épreuves : modale PDF avec « Aperçu » et « Télécharger ».
- Barre de progression du scroll, menu mobile.
- Formulaire de contact fonctionnel.

## Contraintes projecteur (non négociables)
- Texte courant ≥ 18px (≥ 22px en mode Présentation), graisse ≥ 400.
- Contraste ≥ 4.5:1 pour le texte courant, ≥ 3:1 pour les éléments d'interface. Viser plus haut.
- L'information ne passe jamais par la couleur seule.
- Pas d'effets lourds en continu (canvas de particules, flous animés plein écran) : le PC de présentation n'est pas une machine de jeu.
- Tester en 1920×1080 et 1280×720.

## Accessibilité & motion
- Navigable au clavier, focus visible, ARIA correct pour la modale et le menu.
- `prefers-reduced-motion` respecté : chaque animation a une version réduite.

## Skills à utiliser
- taste-skill : `.claude/skills/design-taste-frontend/SKILL.md` (skill principal du dépôt Leonxlnx/taste-skill ; skills complémentaires du même dépôt listés ci-dessous) — décisions esthétiques, éviter le rendu « template générique ».
  - `design-taste-frontend` : lecture du brief, réglage des « dials », discipline anti-template → à chaque décision esthétique, en priorité au prompt 1.
  - `high-end-visual-design` : règles de polices, espacements, ombres et cartes « haut de gamme » → en complément pendant l'exploration des DA, toujours filtré par les contraintes projecteur.
  - `minimalist-ui` : esthétique éditoriale monochrome, bento plat, sans dégradés → uniquement si une piste de DA va dans ce sens.
  - `industrial-brutalist-ui` : esthétique brutaliste suisse / terminal → uniquement si une piste de DA va dans ce sens ; ses effets de dégradation analogique sont exclus (contraintes projecteur).
  - `redesign-existing-projects` : audit d'un existant et montée en gamme → pour auditer `_legacy/` et relire les itérations.
  - `full-output-enforcement` : interdit le code tronqué et les placeholders → lors de la génération de composants complets ; les `TODO(wladimir)` restent obligatoires (la règle du projet prime).
- web-design-guidelines : `.claude/skills/web-design-guidelines/SKILL.md` — relecture UI/UX à chaque fin d'itération.
- Motion / framer-motion : `framer-motion:framer-motion` (plugin utilisateur), `~/.claude/plugins/cache/framer-motion-skill/framer-motion/1.0.1/skills/framer-motion/SKILL.md` — toute animation.
- playwright-cli : `.claude/skills/playwright-cli/SKILL.md` (CLI globale `playwright-cli` v0.1.21, navigateur : Chrome local) — captures et vérifications visuelles.
- Références de design : `.reference/` (awesome-design-md). S'en inspirer, ne jamais copier une identité de marque.

## Checklist de fin d'itération
- [ ] `npm run build` sans erreur ni warning TypeScript
- [ ] Captures Playwright 1920×1080, 1280×720 et 390×844, en clair et en sombre, dans `screenshots/<iteration>/`
- [ ] Relecture avec web-design-guidelines, points corrigés ou listés
- [ ] Contrastes vérifiés
- [ ] Commit git clair
- [ ] Rapport : fait / reste à faire / TODO(wladimir) nouveaux

## Commandes
- `npm run dev` — serveur de développement Vite (http://localhost:5173)
- `npm run build` — vérification TypeScript (`tsc -b`) puis build de production dans `dist/`
- `npm run preview` — sert le build de `dist/` en local
- `npm run lint` — lint avec oxlint
- `npm run format` — formate avec Prettier (+ tri des classes Tailwind) ; `npm run format:check` pour vérifier sans modifier
