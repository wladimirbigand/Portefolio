import { useEffect, useState } from 'react'
import {
  categoriesRealisations,
  projetsAnterieurs,
  projetsSection,
  realisations,
  realisationsLibelles,
} from '../../content'
import type { CategorieRealisation, Realisation } from '../../content'
import { periodeCourte } from '../../lib/dates'
import { Entete } from './atomes'
import { Picto } from './Picto'
import { useFicheOuverte } from './Fiches'
import { ancreRealisation, deuxChiffres } from './realisations'

type Filtre = 'toutes' | CategorieRealisation

const categorieDe = (numero: number): CategorieRealisation | undefined =>
  realisations.find((realisation) => realisation.numero === numero)?.categorie

/**
 * Une réalisation : une ligne (numéro, titre court, état, période, contexte) qui est tout entière un
 * lien vers `#realisation-N`. Le clic ouvre la fiche descriptive dans la fenêtre superposée
 * (voir `Fiches.tsx`) ; la ligne, elle, reste dans la liste.
 */
function LigneRealisation({ realisation }: { realisation: Realisation }) {
  const { numero, statut } = realisation
  return (
    <li id={ancreRealisation(numero)} className="p-real">
      <h4 className="p-real-entete">
        <a className="p-real-bouton" href={`#${ancreRealisation(numero)}`} aria-haspopup="dialog">
          <span className="p-real-numero">
            <span className="sr-only">{realisationsLibelles.realisation(numero)} : </span>
            <span aria-hidden="true">{deuxChiffres(numero)}</span>
          </span>
          <span className="p-real-titre">
            {realisation.titreCourt}
            {/* L'état n'est rappelé que s'il n'est pas « terminée » : en cours (marque pleine), en suspens (creuse). */}
            {statut !== 'termine' && (
              <span className="p-real-statut" data-statut={statut}>
                <span className="p-etat-marque" aria-hidden="true" />
                {realisationsLibelles.statuts[statut]}
              </span>
            )}
          </span>
          <span className="p-real-meta">
            <span className="p-real-periode">
              {periodeCourte(realisation.debut, realisation.fin)}
            </span>
            <span className="p-real-contexte" translate="no">
              {realisation.contextes.map((contexte) => (
                <span key={contexte}>{contexte}</span>
              ))}
            </span>
          </span>
          <span className="sr-only">, {realisationsLibelles.ouvrirFiche}</span>
          <span className="p-real-signe" aria-hidden="true">
            <Picto nom="suivant" />
          </span>
        </a>
      </h4>
    </li>
  )
}

/**
 * Projets : les 16 réalisations du tableau de synthèse, dans son ordre, en trois groupes.
 * - Filtres par rubrique (boutons `aria-pressed`).
 * - Chaque ligne a son ancre (`#realisation-1` à `#realisation-16`) et ouvre la fiche de sa réalisation.
 *   Tant qu'une fiche est ouverte, sa ligne reste affichée, même si un filtre la masquait : fermer la
 *   fiche ramène sur elle.
 * - La figure occupe une réserve haute, à droite de la liste, qui accompagne la lecture.
 */
export function Projets() {
  const [filtre, setFiltre] = useState<Filtre>('toutes')
  const ficheOuverte = useFicheOuverte()

  // La ligne de la fiche ouverte doit exister : le filtre qui la masquerait est levé.
  useEffect(() => {
    if (ficheOuverte === null) return
    setFiltre((actuel) => (actuel === 'toutes' || actuel === categorieDe(ficheOuverte) ? actuel : 'toutes'))
  }, [ficheOuverte])

  const groupes = categoriesRealisations
    .filter((categorie) => filtre === 'toutes' || filtre === categorie.id)
    .map((categorie) => ({
      ...categorie,
      lignes: realisations.filter((realisation) => realisation.categorie === categorie.id),
    }))
  const affichees = groupes.reduce((somme, groupe) => somme + groupe.lignes.length, 0)

  const filtres: { id: Filtre; label: string }[] = [
    { id: 'toutes', label: realisationsLibelles.toutes },
    ...categoriesRealisations.map((categorie) => ({ id: categorie.id, label: categorie.filtre })),
  ]

  return (
    <section id={projetsSection.id} className="p-section" aria-labelledby="p-projets-titre">
      <Entete section={projetsSection} idTitre="p-projets-titre" className="p-entete-filtres">
        <div className="p-filtres" role="group" aria-label={realisationsLibelles.filtresTitre}>
          {filtres.map((bouton) => (
            <button
              key={bouton.id}
              type="button"
              className="p-bouton p-filtre"
              aria-pressed={filtre === bouton.id}
              onClick={() => setFiltre(bouton.id)}
            >
              {bouton.label}
            </button>
          ))}
        </div>
      </Entete>
      <p className="sr-only" role="status">
        {realisationsLibelles.compte(affichees)}
      </p>

      <div className="p-projets-corps">
        <div className="p-projets-liste">
          {groupes.map((groupe) => (
            <section key={groupe.id} className="p-groupe" aria-labelledby={`p-groupe-${groupe.id}`}>
              <h3 id={`p-groupe-${groupe.id}`} className="p-groupe-titre">
                <Picto nom={groupe.picto} taille="m" />
                {groupe.titre}
              </h3>
              <ul role="list">
                {groupe.lignes.map((realisation) => (
                  <LigneRealisation key={realisation.numero} realisation={realisation} />
                ))}
              </ul>
            </section>
          ))}

          <section className="p-avant" aria-labelledby="p-avant-titre">
            <h3 id="p-avant-titre" className="p-label">
              <Picto nom="avant" />
              {realisationsLibelles.anterieursTitre}
            </h3>
            <ul role="list">
              {projetsAnterieurs.map((projet) => {
                const precisions = [projet.contexte, projet.annees, projet.duree].filter(Boolean)
                return (
                  <li key={projet.nom}>
                    <h4 translate="no">{projet.nom}</h4>
                    {precisions.length > 0 && <p className="p-avant-precisions">{precisions.join(' · ')}</p>}
                    {projet.description && <p>{projet.description}</p>}
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
        {/* Réserve haute à droite : la figure accompagne la lecture de la liste. */}
        <div className="p-reserve p-reserve-projets" data-reserve={projetsSection.id} aria-hidden="true" />
      </div>
    </section>
  )
}
