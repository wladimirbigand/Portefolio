import type { Capture, CleCaptureVeille } from './types'

/**
 * Captures d’écran : elles sont déposées dans `src/assets/captures/`, et c’est leur nom qui décide de
 * l’endroit où elles s’affichent (convention : `src/assets/captures/LISEZ-MOI.md` et `CLAUDE.md`).
 *
 * - `realisation-<n>-<ordre>.png` : galerie de la fiche de la réalisation `n` ; la première remplace
 *   le picto de sa carte, si la réalisation figure parmi les cartes d’Entreprise.
 * - `veille-agregateur.png`, `veille-bot.png` : visuel de la carte de l’outil de veille.
 *
 * Au build, chaque fichier est converti en AVIF et en WebP, en plusieurs largeurs (vite-imagetools) :
 * le navigateur choisit. Les dimensions viennent du fichier ; rien n’est à saisir ici, sauf les légendes.
 * Formats acceptés : PNG, JPEG (.jpg, .jpeg) et WebP.
 */

/**
 * Légende de chaque capture, par nom de fichier (sans l’extension). Fournies par Wladimir (étape 5) :
 * chacune sert à la fois de légende visible et de texte alternatif.
 * Une capture sans entrée ici n’a pas de légende, et son texte alternatif est tiré du nom du fichier
 * (`altProvisoire`) : c’est le cas de `realisation-6-1`. // À VÉRIFIER : légende à fournir.
 */
export const legendes: Record<string, string> = {
  'realisation-2-1': 'Schéma du TP, deux VLAN routés par un routeur MikroTik',
  'realisation-3-1': 'Architecture 3-tiers haute disponibilité déployée sous Hyper-V (cluster pfSense, HAProxy, deux serveurs web, MariaDB répliquée)',
  'realisation-3-2': 'Test de panne, HAProxy détecte web-01 hors service et sert tout le trafic par web-02',
  'realisation-3-3': 'Cluster CARP, pfSense-01 porte les cinq adresses virtuelles (MASTER) et pfSense-02 attend (BACKUP)',
  'realisation-3-4': 'Test de répartition, 100 requêtes réparties exactement à 50/50 entre web-01 et web-02',
  'realisation-4-1': 'Page d’accueil du portail de données du Lot-et-Garonne',
  'realisation-4-2': 'Carte des lieux culturels du département, filtrable par commune et par type (théâtres)',
  'realisation-4-3': 'La même carte filtrée sur les cinémas',
  'realisation-4-4': 'La même carte filtrée sur les bibliothèques et boîtes à lire',
  'realisation-7-1': 'Maquette physique, deux postes Ubuntu dont le client qui sert de passerelle vers le sous-réseau isolé',
  'realisation-7-2': 'Poste client avec deux cartes réseau, l’une vers l’entreprise (masquée), l’autre vers la maquette (192.168.100.1)',
  'realisation-7-3': 'Serveur Samba AD sur le sous-réseau isolé de la maquette (192.168.100.2)',
  'realisation-7-4': 'Domaine Active Directory de la maquette, créé avec Samba (samba-tool domain info)',
  'realisation-7-5': 'Service samba-ad-dc actif sur le serveur de la maquette',
  'realisation-9-1': 'Carnet d’adresses du copieur, configuré pour la numérisation vers e-mail et vers dossier (données masquées)',
  'realisation-12-1': 'Agrégateur de veille, articles collectés depuis plusieurs flux RSS et triés par catégorie',
  'realisation-12-2': 'Filtre par catégorie, les articles de cybersécurité',
  'realisation-13-1': 'Accueil de Jitsi Meet, déployé sur un sous-domaine de l’organisation',
  'realisation-13-2': 'Site de rediffusion des webinaires pour les adhérents',
  'realisation-13-3': 'Lecture d’une rediffusion enregistrée par Jibri (participants masqués)',
  'realisation-14-1': 'Tableau de bord de Dolibarr en production, indicateurs par module',
  'realisation-15-1': 'Les trois workflows n8n (tickets, congés, devis)',
  'realisation-15-2': 'Workflow de validation des congés, du webhook aux notifications par e-mail selon le statut',
  'realisation-16-1': 'Tableau de bord de l’outil de suivi des dossiers fibre',
  'realisation-16-2': 'Liste des dossiers avec filtres par type, statut, priorité et EPCI (clients masqués)',
  'realisation-16-3': 'Gestion des utilisateurs par rôles (noms et identifiants masqués)',
  'veille-agregateur': 'Agrégateur de flux RSS de veille technologique, articles triés par catégorie',
  'veille-bot': 'Synthèses quotidiennes envoyées par le bot Discord de veille (septembre 2026)',
}

/** Sortie de vite-imagetools (`as=picture`) : une liste de sources par format, et l’image de repli. */
interface Picture {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

const fichiers = import.meta.glob<Picture>('../assets/captures/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: { w: '480;960;1600', format: 'avif;webp', as: 'picture', withoutEnlargement: '' },
})

const NOMS_VEILLE: Record<CleCaptureVeille, string> = {
  agregateur: 'l’agrégateur de flux RSS',
  bot: 'le bot Discord',
}

/** Texte alternatif d’une capture sans légende, tiré du nom du fichier. */
function altProvisoire(nom: string): string {
  const realisation = /^realisation-(\d+)-(\d+)$/.exec(nom)
  if (realisation) return `Capture d’écran ${Number(realisation[2])} de la réalisation ${Number(realisation[1])}`
  const veille = /^veille-(agregateur|bot)$/.exec(nom)
  if (veille) return `Capture d’écran : ${NOMS_VEILLE[veille[1] as CleCaptureVeille]}`
  return 'Capture d’écran'
}

const parRealisation = new Map<number, { ordre: number; capture: Capture }[]>()
const parOutil = new Map<string, Capture>()

for (const [chemin, image] of Object.entries(fichiers)) {
  const nom = chemin.slice(chemin.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '')
  const capture: Capture = {
    nom,
    src: image.img.src,
    largeur: image.img.w,
    hauteur: image.img.h,
    sources: Object.entries(image.sources).map(([format, srcset]) => ({ type: `image/${format}`, srcset })),
    alt: legendes[nom] ?? altProvisoire(nom),
    legende: legendes[nom],
  }
  const realisation = /^realisation-(\d+)-(\d+)$/.exec(nom)
  const veille = /^veille-(agregateur|bot)$/.exec(nom)
  if (realisation) {
    const numero = Number(realisation[1])
    parRealisation.set(numero, [...(parRealisation.get(numero) ?? []), { ordre: Number(realisation[2]), capture }])
  } else if (veille) parOutil.set(veille[1]!, capture)
  else if (import.meta.env.DEV) {
    console.warn(`Capture ignorée : « ${nom} » ne suit pas la convention (src/assets/captures/LISEZ-MOI.md).`)
  }
}

/** Captures d’une réalisation, dans l’ordre de leur numéro (`realisation-<n>-<ordre>`). */
export function capturesRealisation(numero: number): Capture[] {
  return [...(parRealisation.get(numero) ?? [])].sort((a, b) => a.ordre - b.ordre).map((entree) => entree.capture)
}

/** Capture d’un outil de veille (`veille-agregateur`, `veille-bot`), si elle a été déposée. */
export function captureVeille(cle: CleCaptureVeille): Capture | undefined {
  return parOutil.get(cle)
}
