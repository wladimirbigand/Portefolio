import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imagetools } from 'vite-imagetools'
import { epreuves, epreuvesActions } from './src/content/epreuves.ts'
import { liens, meta, page404, sansScript, urlSite } from './src/content/meta.ts'

const BASE = '/Portefolio/'

function echapper(texte: string): string {
  return texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/**
 * Pages statiques : écrit dans `index.html` et `404.html` les textes de `src/content/meta.ts`
 * (titre, description, aperçu de partage, données structurées, repli sans JavaScript, page 404),
 * puis ajoute `robots.txt` et `sitemap.xml` au dossier publié.
 * - `{{chemin.vers.un.texte}}` : le texte, échappé pour le HTML.
 * - `{{{nom}}}` : un fragment déjà prêt (JSON-LD, liste des documents).
 * Un nom inconnu arrête le build : aucune accolade ne peut partir en ligne.
 */
function pagesStatiques(): Plugin {
  const textes: Record<string, unknown> = {
    meta,
    page404,
    sansScript,
    liens,
    urlSite,
    urlApercu: urlSite + meta.apercu.fichier,
  }
  // Le site (son titre) et la personne qu'il présente.
  const donneesStructurees = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${urlSite}#site`,
        name: meta.titre,
        url: urlSite,
        inLanguage: meta.langue,
        author: { '@id': `${urlSite}#personne` },
      },
      {
        '@type': 'Person',
        '@id': `${urlSite}#personne`,
        name: meta.nom,
        jobTitle: meta.metier,
        url: urlSite,
        image: urlSite + meta.apercu.fichier,
        sameAs: [liens.linkedin, liens.github],
      },
    ],
  }
  const fragments: Record<string, string> = {
    // « < » échappé : le JSON ne peut pas refermer sa balise.
    donneesStructurees: JSON.stringify(donneesStructurees).replace(/</g, '\\u003c'),
    documentsSansScript: epreuves
      .flatMap((epreuve) =>
        epreuve.documents
          .filter((document) => document.fichier)
          .map(
            (document) =>
              `<li><a class="p-lien" href="${BASE}${document.fichier}">${echapper(
                `${epreuvesActions.titreApercu(epreuve.code, document.label)} (PDF)`,
              )}</a></li>`,
          ),
      )
      .join('\n            '),
  }
  const lire = (chemin: string): string => {
    let valeur: unknown = textes
    for (const cle of chemin.split('.')) {
      valeur = valeur !== null && typeof valeur === 'object' ? (valeur as Record<string, unknown>)[cle] : undefined
    }
    if (typeof valeur !== 'string' && typeof valeur !== 'number') {
      throw new Error(`Pages statiques : « {{${chemin}}} » ne correspond à aucun texte de src/content/meta.ts.`)
    }
    return echapper(String(valeur))
  }
  return {
    name: 'pages-statiques',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(/\{\{\{\s*([\w]+)\s*\}\}\}/g, (_, nom: string) => {
            const fragment = fragments[nom]
            if (fragment === undefined) throw new Error(`Pages statiques : fragment « ${nom} » inconnu.`)
            return fragment
          })
          .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, chemin: string) => lire(chemin))
      },
    },
    generateBundle() {
      // robots.txt n'est lu par les moteurs qu'à la racine du domaine : celui-ci documente l'intention,
      // et l'adresse du plan du site est aussi à déclarer à la racine (voir le compte rendu de l'étape 4a).
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${urlSite}sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          `  <url>\n    <loc>${urlSite}</loc>\n    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>\n  </url>\n` +
          '</urlset>\n',
      })
    },
  }
}

// Le site est servi sous https://wladimirbigand.fr/Portefolio/ (P majuscule) : ne pas changer `base`.
export default defineConfig({
  base: BASE,
  // imagetools : les captures de src/assets/captures/ sont converties et redimensionnées au build
  // (voir src/content/captures.ts).
  plugins: [pagesStatiques(), react(), tailwindcss(), imagetools()],
  build: {
    rollupOptions: {
      // Deux pages : le site, et la page 404 (à la racine du dossier publié, pour GitHub Pages).
      input: { index: 'index.html', '404': '404.html' },
    },
  },
})
