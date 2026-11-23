# Captures d'écran

Dépose ici les captures, en PNG, en JPEG (`.jpg`, `.jpeg`) ou en WebP. Le nom du fichier décide de l'endroit
où la capture s'affiche : il n'y a rien d'autre à brancher.

| Nom du fichier | Où elle s'affiche |
|---|---|
| `realisation-<n>-<ordre>.png` (ex. `realisation-13-1.png`) | Galerie de la fiche de la réalisation `n`, dans l'ordre. Si la réalisation est une carte d'Entreprise, sa capture n° 1 remplace le picto de la carte. |
| `veille-agregateur.png` | Carte « Agrégateur de flux RSS » (Veille), en grand, le picto en petit dans un coin. |
| `veille-bot.png` | Carte « Bot Discord » (Veille), en grand, le logo en petit dans un coin. |

- Au build, chaque capture est convertie en AVIF et en WebP, en 480, 960 et 1600 px de large (jamais
  agrandie). Dépose le fichier d'origine, sans le réduire.
- La légende s'écrit dans `src/content/captures.ts` (`legendes`), sous le nom du fichier (sans
  l'extension) : elle s'affiche sous la capture et sert aussi de texte alternatif. Sans légende, un texte
  provisoire est tiré du nom du fichier.
- Dans une fiche, un clic sur une capture l'ouvre en grand.
- Un fichier dont le nom ne suit pas la convention n'est pas affiché (un avertissement s'écrit dans la
  console pendant le développement).
