---
version: alpha
name: Portfolio-Wladimir-Bigand
description: "Portfolio BTS SIO SISR présenté sur projecteur devant un jury (épreuve E5), puis consultable en ligne. Direction artistique à définir au prompt 1."

# Tokens à définir au prompt 1 (couleurs, typographie, rayons, espacements, motion).
colors: {}
typography: {}
rounded: {}
spacing: {}
motion:
  duration:
    ui: "150–300ms"          # interactions d'interface (hover, focus, toggle, menu)
    section: "400–700ms"     # entrées de section
  easing: {}                 # à définir en tokens au prompt 1
components: {}
---

# DESIGN.md — Portfolio Wladimir Bigand

> Squelette posé au prompt 0. Les sections marquées « À définir au prompt 1 » seront remplies après l'exploration des directions artistiques. Les **invariants** ci-dessous sont déjà décidés et s'imposent à toute DA.

## 1. Visual Theme & Atmosphere

À définir au prompt 1.

**Invariants :**
- **Pas de typographie monumentale** ni de photo plein écran. La photo reste discrète.
- **Deux thèmes**, clair et sombre, de qualité égale : aucun des deux n'est une déclinaison au rabais de l'autre.

## 2. Color Palette & Roles

À définir au prompt 1.

**Invariants :**
- Deux palettes complètes (clair / sombre), exprimées en tokens CSS dans `src/styles/index.css`, bascule par la classe `.dark` sur `<html>`.
- Contraste ≥ 4.5:1 pour le texte courant, ≥ 3:1 pour les éléments d'interface (bordures de champs, icônes porteuses de sens, focus). Viser plus haut : un projecteur écrase les contrastes.
- L'information ne passe jamais par la couleur seule (statut, niveau, état actif : toujours doublés d'un libellé, d'une icône ou d'une forme).

## 3. Typography Rules

À définir au prompt 1.

**Invariants :**
- Texte courant ≥ 18px (≥ 22px en mode Présentation), graisse ≥ 400.
- Pas de typographie monumentale : les titres restent au service de la lecture.

## 4. Component Stylings

À définir au prompt 1.

**Invariant — Navigation :** barre flottante en forme de **pilule**, détachée des bords, arrondie, avec le logo/nom à gauche, les liens au centre et un CTA à droite. Chaque DA l'interprète à sa façon (matière, ombre, comportement au scroll), mais la structure est fixe.

## 5. Layout Principles

À définir au prompt 1.

**Invariants :**
- Single page à ancres, sections dans l'ordre de `src/content/site.ts`.
- La photo reste discrète (jamais en plein écran ni en fond de hero).

## 6. Depth & Elevation

À définir au prompt 1.

**Invariant :** pas d'effets lourds en continu (canvas de particules, flous animés plein écran). Le PC de présentation n'est pas une machine de jeu.

## 7. Motion System

À définir au prompt 1 (chorégraphie, effets signature).

**Invariants :**
- **Durées courtes pour l'UI : 150–300 ms** (hover, focus, toggle, ouverture du menu, modale).
- **Durées plus longues pour les entrées de section : 400–700 ms.**
- **Easings définis en tokens** (pas de courbe ad hoc dans les composants).
- **Version `prefers-reduced-motion` obligatoire** pour chaque animation : suppression des déplacements, fondus courts ou état final immédiat.
- Motion (`motion/react`) uniquement ; aucune animation infinie décorative en continu.

## 8. Do's and Don'ts

À définir au prompt 1.

**Invariants — Do :**
- Tester en 1920×1080 et 1280×720 (projecteur), puis 390×844 (mobile).
- Doubler toute information colorée d'un texte ou d'une icône.

**Invariants — Don't :**
- Typographie monumentale, photo plein écran.
- Particules, flous animés plein écran, boucles d'animation permanentes.
- Texte courant < 18px ou graisse < 400.
- Copier l'identité d'une marque des références (`.reference/`) : s'en inspirer seulement.

## 9. Responsive Behavior

À définir au prompt 1.

**Invariants :**
- Cibles : 1920×1080 et 1280×720 (projecteur) en priorité, 390×844 (mobile).
- Menu mobile accessible (ARIA, fermeture à Échap, focus géré) ; son interprétation visuelle est à définir au prompt 1.
