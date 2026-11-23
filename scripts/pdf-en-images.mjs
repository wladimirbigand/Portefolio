// Aperçu des PDF : chaque page de chaque PDF de public/docs/ devient une image AVIF et une image WebP,
// en deux largeurs, et son texte est extrait (version texte de la visionneuse).
// Usage : node scripts/pdf-en-images.mjs (lancé tout seul avant `npm run dev` et `npm run build`).
//
// Sorties, jamais commitées :
// - public/docs-apercu/<nom>/<page>-<largeur>.avif et .webp : les pages ;
// - public/docs-apercu/<nom>/texte.json : le texte de chaque page (chargé à la demande) ;
// - src/generes/documents.json : le manifeste (pages, dimensions, largeurs), lu par la visionneuse.
// Un PDF déjà converti (même contenu, mêmes réglages) n'est pas refait.
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import sharp from 'sharp'

const SOURCE = 'public/docs'
const SORTIE = 'public/docs-apercu'
const MANIFESTE = 'src/generes/documents.json'
/** Largeurs des images, en pixels : un écran courant, puis le zoom et les écrans denses. */
const LARGEURS = [900, 1800]
/** À changer quand les réglages changent : tous les PDF sont alors reconvertis. */
const VERSION = 1

// Polices et tables de caractères fournies avec pdfjs-dist (PDF sans polices incorporées).
const racinePdfjs = dirname(createRequire(import.meta.url).resolve('pdfjs-dist/package.json'))
const dossierPdfjs = (nom) => pathToFileURL(join(racinePdfjs, nom)).href + '/'

/** Texte d'une page : une ligne du PDF par ligne, les espaces en trop retirées. */
async function texteDePage(page) {
  const contenu = await page.getTextContent()
  let texte = ''
  for (const element of contenu.items) {
    if (typeof element.str !== 'string') continue
    texte += element.str
    if (element.hasEOL) texte += '\n'
  }
  return texte
    .split('\n')
    .map((ligne) => ligne.replace(/\s+/g, ' ').trim())
    .filter((ligne, rang, lignes) => ligne !== '' || (rang > 0 && lignes[rang - 1] !== ''))
    .join('\n')
    .trim()
}

async function convertir(fichier) {
  const nom = fichier.replace(/\.pdf$/i, '')
  const donnees = await readFile(join(SOURCE, fichier))
  const empreinte = createHash('sha256').update(donnees).update(`v${VERSION}:${LARGEURS.join(',')}`).digest('hex')
  const dossier = join(SORTIE, nom)
  const fichierEtat = join(dossier, 'etat.json')
  if (existsSync(fichierEtat)) {
    const etat = JSON.parse(await readFile(fichierEtat, 'utf8'))
    if (etat.empreinte === empreinte) return { entree: etat.entree, refait: false }
  }
  await rm(dossier, { recursive: true, force: true })
  await mkdir(dossier, { recursive: true })

  const pdf = await getDocument({
    data: new Uint8Array(donnees),
    standardFontDataUrl: dossierPdfjs('standard_fonts'),
    cMapUrl: dossierPdfjs('cmaps'),
    cMapPacked: true,
    verbosity: 0,
  }).promise
  const pages = []
  const textes = []
  const plusLarge = Math.max(...LARGEURS)
  for (let numero = 1; numero <= pdf.numPages; numero++) {
    const page = await pdf.getPage(numero)
    const base = page.getViewport({ scale: 1 })
    const vue = page.getViewport({ scale: plusLarge / base.width })
    const toile = pdf.canvasFactory.create(Math.round(vue.width), Math.round(vue.height))
    // Fond blanc : une page sans fond resterait transparente.
    toile.context.fillStyle = '#ffffff'
    toile.context.fillRect(0, 0, toile.canvas.width, toile.canvas.height)
    await page.render({ canvas: toile.canvas, canvasContext: toile.context, viewport: vue }).promise
    const png = toile.canvas.toBuffer('image/png')
    for (const largeur of LARGEURS) {
      const image = sharp(png).resize({ width: largeur })
      await image.clone().avif({ quality: 55, effort: 5 }).toFile(join(dossier, `${numero}-${largeur}.avif`))
      await image.clone().webp({ quality: 78, effort: 5 }).toFile(join(dossier, `${numero}-${largeur}.webp`))
    }
    // Dimensions de la plus grande image : elles donnent le rapport largeur / hauteur de la page.
    pages.push({ largeur: toile.canvas.width, hauteur: toile.canvas.height })
    textes.push(await texteDePage(page))
    page.cleanup()
  }
  await pdf.loadingTask.destroy()
  await writeFile(join(dossier, 'texte.json'), JSON.stringify(textes))
  const entree = { dossier: `docs-apercu/${nom}`, largeurs: LARGEURS, pages }
  await writeFile(fichierEtat, JSON.stringify({ empreinte, entree }))
  return { entree, refait: true }
}

const fichiers = existsSync(SOURCE) ? (await readdir(SOURCE)).filter((nom) => /\.pdf$/i.test(nom)).sort() : []
const manifeste = {}
for (const fichier of fichiers) {
  const { entree, refait } = await convertir(fichier)
  // Clé : le chemin du PDF dans public/, celui qu'écrit le contenu (`docs/e6-neoretail.pdf`).
  manifeste[`docs/${fichier}`] = entree
  console.log(`Aperçu PDF : ${fichier}, ${entree.pages.length} page(s)${refait ? '' : ' (déjà à jour)'}`)
}
// Un PDF retiré de public/docs/ : ses images partent aussi.
if (existsSync(SORTIE)) {
  const gardes = new Set(fichiers.map((fichier) => fichier.replace(/\.pdf$/i, '')))
  for (const nom of await readdir(SORTIE)) {
    if (!gardes.has(nom)) await rm(join(SORTIE, nom), { recursive: true, force: true })
  }
}
await mkdir(dirname(MANIFESTE), { recursive: true })
await writeFile(MANIFESTE, JSON.stringify(manifeste, null, 2) + '\n')
