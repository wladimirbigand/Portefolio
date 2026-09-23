// Génère screenshots/01-da/index.html : planche comparative des 4 pistes.
// Les contrastes sont mesurés sur les tokens réels (explorations/<piste>/palette.css).
// Usage : node explorations/outils/planche.mjs
import { readFileSync, writeFileSync } from 'node:fs'

const PISTES = {
  a: {
    nom: 'A · Précis',
    references: 'Linear, Vercel, Raycast',
    axes: [
      'Sombre',
      'Grotesque neutre (Hanken Grotesk) + mono (JetBrains Mono)',
      'Neutres froids + 1 accent bleu glacier',
      'Grille bento asymétrique',
      'Moyenne',
      'Rayons 8–12 px, filets 1 px, surfaces étagées',
      'Précise et rapide (≤ 250 ms, sans rebond)',
      'Pilule vitrée qui se contracte, fond actif glissant',
    ],
  },
  b: {
    nom: 'B · Infra',
    references: 'Warp, Supabase, VoltAgent',
    axes: [
      'Sombre',
      'Mono dominante (IBM Plex Mono) + IBM Plex Sans',
      'Ambre « néon » sur sombre + statuts',
      'Panneaux juxtaposés type terminal',
      'Compacte',
      'Angles vifs, bordures franches, aucune ombre',
      'Séquence de boot par paliers (≤ 1,2 s, interruptible)',
      'Barre d’état : chemin courant, uptime, sélecteur « cd »',
    ],
  },
  c: {
    nom: 'C · Éditorial',
    references: 'Notion, Mintlify, Claude',
    axes: [
      'Clair',
      'Serif éditorial (Newsreader) + Instrument Sans',
      'Neutres chauds + 1 accent vert sapin',
      'Colonne de lecture + notes en marge',
      'Aérée',
      'Plat : filets et espace, pas de conteneurs',
      'Fondus lents (≈ 700 ms)',
      'Pilule fine masquée au scroll (flag navAlwaysVisible)',
    ],
  },
  d: {
    nom: 'D · Signalétique',
    references: 'Carte blanche : signalétique de réseau',
    axes: [
      'Clair',
      'Grotesque condensée (Barlow Condensed) + Atkinson Hyperlegible Next',
      'Aplats vifs codés par cadre (doublés d’une lettre)',
      'Composition le long d’une ligne de réseau',
      'Moyenne',
      'Pastilles rondes, plaques à grands rayons, sans bordure ni ombre',
      'Ressorts physiques + ligne tracée au scroll',
      'Indicateur de ligne : station courante numérotée',
    ],
  },
}

const NOMS_AXES = [
  'Thème par défaut',
  'Typographie',
  'Couleur',
  'Mise en page',
  'Densité',
  'Forme et profondeur',
  'Animations',
  'Nav en pilule',
]

const PAIRES = [
  ['Texte / fond', '--c-text', '--c-bg', 4.5],
  ['Secondaire / fond', '--c-muted', '--c-bg', 4.5],
  ['Secondaire / surface', '--c-muted', '--c-surface', 4.5],
  ['Accent / fond', '--c-accent', '--c-bg', 4.5],
  ['Texte sur aplat accent', '--c-on-accent-fill', '--c-accent-fill', 4.5],
  ['Bordure UI / fond', '--c-border', '--c-bg', 3],
]

function luminance(hex) {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(h.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contraste = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

function tokens(piste) {
  const css = readFileSync(`explorations/${piste}/palette.css`, 'utf8')
  const blocs = [...css.matchAll(/:root(\.dark)?\[data-palette='\w'\]\s*\{([^}]*)\}/g)]
  const resultat = {}
  for (const [, sombre, corps] of blocs) {
    const vars = Object.fromEntries([...corps.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]))
    resultat[sombre ? 'sombre' : 'clair'] = vars
  }
  return resultat
}

const echapper = (texte) => texte.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function tableContrastes(piste) {
  const t = tokens(piste)
  const lignes = PAIRES.map(([libelle, avant, fond, seuil]) => {
    const cellules = ['clair', 'sombre'].map((theme) => {
      const r = contraste(t[theme][avant], t[theme][fond])
      const ok = r >= seuil
      return `<td class="${ok ? 'ok' : 'ko'}">${r.toFixed(2)}:1 <span>${ok ? '✓' : '⚠ sous'} ${seuil}</span></td>`
    })
    return `<tr><th scope="row">${libelle}</th>${cellules.join('')}</tr>`
  })
  return `<table class="contrastes"><caption>Contrastes mesurés (tokens réels)</caption><thead><tr><th></th><th scope="col">Clair</th><th scope="col">Sombre</th></tr></thead><tbody>${lignes.join('')}</tbody></table>`
}

function nuancier(piste) {
  const t = tokens(piste)
  const cles = ['--c-bg', '--c-surface', '--c-text', '--c-muted', '--c-accent', '--c-accent-fill', '--c-cadre-entreprise', '--c-cadre-formation', '--c-cadre-personnel']
  return ['clair', 'sombre']
    .map(
      (theme) =>
        `<div class="nuancier"><span class="nuancier-titre">${theme}</span>${cles
          .map((c) => `<span class="pastille" style="background:${t[theme][c]}" title="${c} ${t[theme][c]}"></span>`)
          .join('')}</div>`,
    )
    .join('')
}

const FORMATS = ['1920x1080', '1280x720', '390x844']

const sections = Object.entries(PISTES)
  .map(([id, piste]) => {
    const matrice = piste.axes.map((valeur, i) => `<tr><th scope="row">${NOMS_AXES[i]}</th><td>${echapper(valeur)}</td></tr>`).join('')
    const vignettes = ['clair', 'sombre']
      .flatMap((theme) =>
        FORMATS.map(
          (format) => `<figure class="f-${format}">
            <a href="pleine/${id}-${theme}-${format}.png" title="Page entière"><img loading="lazy" src="${id}-${theme}-${format}.png" alt="Piste ${piste.nom}, thème ${theme}, ${format}"></a>
            <figcaption>${theme} · ${format.replace('x', '×')}</figcaption>
          </figure>`,
        ),
      )
      .join('')
    const extraC =
      id === 'c'
        ? `<div class="zoom"><h3>Contrôle 1280×720 : paragraphe de la fiche Samba</h3>
            <img src="c-zoom-paragraphe-clair-1280x720.png" alt="Paragraphe de la fiche Samba, thème clair, 1:1 en 1280×720">
            <img src="c-zoom-paragraphe-sombre-1280x720.png" alt="Paragraphe de la fiche Samba, thème sombre, 1:1 en 1280×720"></div>`
        : ''
    return `<section id="piste-${id}">
      <header><h2>${piste.nom}</h2><p>${piste.references} · <a href="http://localhost:5173/?explorations&amp;layout=${id}&amp;palette=${id}&amp;type=${id}&amp;motion=${id}">ouvrir la piste pure</a></p></header>
      <div class="infos">
        <table class="matrice"><caption>Matrice des 8 axes</caption><tbody>${matrice}</tbody></table>
        <div>${tableContrastes(id)}${nuancier(id)}</div>
      </div>
      <div class="vignettes">${vignettes}</div>
      ${extraC}
      <video src="video-${id}.webm" controls muted preload="metadata" width="960" height="540"></video>
    </section>`
  })
  .join('')

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Planche DA · 4 pistes</title>
<style>
  :root { --fond:#f4f4f5; --carte:#fff; --texte:#18181b; --doux:#52525b; --filet:#d4d4d8; --ok:#166534; --ko:#991b1b; color-scheme: light; }
  @media (prefers-color-scheme: dark) { :root { --fond:#18181b; --carte:#232327; --texte:#f4f4f5; --doux:#b4b4bb; --filet:#3f3f46; --ok:#86efac; --ko:#fca5a5; color-scheme: dark; } }
  * { box-sizing: border-box; }
  body { margin:0; font: 17px/1.5 ui-sans-serif, system-ui, 'Segoe UI', sans-serif; background: var(--fond); color: var(--texte); }
  main { max-width: 1500px; margin: 0 auto; padding: 32px 20px 80px; }
  h1 { margin: 0 0 4px; font-size: 1.8rem; }
  .intro { color: var(--doux); margin: 0 0 28px; }
  nav a { margin-right: 16px; color: inherit; }
  section { background: var(--carte); border: 1px solid var(--filet); border-radius: 14px; padding: 24px; margin-top: 28px; }
  section header { display:flex; flex-wrap:wrap; align-items:baseline; gap: 16px; }
  section h2 { margin: 0; font-size: 1.5rem; }
  section header p { margin: 0; color: var(--doux); }
  .infos { display: grid; gap: 24px; grid-template-columns: minmax(0,1.2fr) minmax(0,1fr); margin-top: 18px; }
  @media (max-width: 900px) { .infos { grid-template-columns: 1fr; } }
  table { width: 100%; border-collapse: collapse; font-size: 15px; }
  caption { text-align: left; font-weight: 600; padding-bottom: 6px; }
  th, td { text-align: left; padding: 6px 8px; border-top: 1px solid var(--filet); vertical-align: top; }
  th[scope=row] { color: var(--doux); font-weight: 500; width: 36%; }
  .contrastes td { font-variant-numeric: tabular-nums; white-space: nowrap; }
  .contrastes td span { color: var(--doux); font-size: 13px; }
  .contrastes td.ok { color: var(--ok); } .contrastes td.ko { color: var(--ko); font-weight: 700; }
  .nuancier { display:flex; align-items:center; gap:6px; margin-top: 10px; }
  .nuancier-titre { width: 56px; color: var(--doux); font-size: 14px; }
  .pastille { width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--filet); }
  .vignettes { display: grid; grid-template-columns: 1fr 1fr 0.4fr 1fr 1fr 0.4fr; gap: 10px; margin-top: 20px; align-items: start; }
  @media (max-width: 900px) { .vignettes { grid-template-columns: 1fr 1fr; } }
  figure { margin: 0; } figure img { width: 100%; height: auto; border: 1px solid var(--filet); border-radius: 6px; display: block; }
  figcaption { font-size: 13px; color: var(--doux); margin-top: 4px; }
  .zoom { margin-top: 20px; } .zoom h3 { font-size: 1.05rem; margin: 0 0 8px; }
  .zoom img { max-width: 100%; border: 1px solid var(--filet); border-radius: 6px; margin: 0 10px 10px 0; }
  video { display:block; max-width: 100%; height: auto; margin-top: 20px; border-radius: 8px; border: 1px solid var(--filet); }
  a:focus-visible { outline: 3px solid #eab308; outline-offset: 2px; }
</style>
</head>
<body>
<main>
  <h1>Planche comparative · 4 directions artistiques</h1>
  <p class="intro">Pistes pures × 2 thèmes × 3 formats. Cliquer une vignette ouvre la page entière. Contrastes calculés sur les tokens de <code>explorations/&lt;piste&gt;/palette.css</code>.</p>
  <nav aria-label="Pistes">${Object.entries(PISTES).map(([id, p]) => `<a href="#piste-${id}">${p.nom}</a>`).join('')}</nav>
  ${sections}
</main>
</body>
</html>
`

writeFileSync('screenshots/01-da/index.html', html)
console.log('screenshots/01-da/index.html généré')
