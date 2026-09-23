import { realisations } from '@/content'
import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'
import { ancreFiche, ficheSamba, intituleCompetence } from '../partage/donnees'
import { IconeStatut } from '../partage/IconeStatut'
import { ArretFicheD } from './ArretFicheD'
import { ListeD } from './ListeD'
import { PastilleCadreD } from './PastilleCadreD'
import { LIGNE_CADRE } from './teintesCadre'

const { libelles } = realisations
const r = ficheSamba

/** Fiche détaillée : Contexte → Objectifs → Missions → Stack → Compétences → Preuves, en arrêts. */
export function FicheD() {
  return (
    <article id={ancreFiche(r.id)} className="pb-24">
      <div className="bg-surface rounded-[20px] p-6 md:p-12">
        <header className="flex flex-wrap items-start gap-5">
          <PastilleCadreD cadre={r.cadre} taille="grande" />
          <div className="min-w-0 flex-1">
            <p className="meta text-muted">{libelles.ficheDetaillee}</p>
            <h2 className="titre text-h2 mt-1">{r.titre}</h2>
            {r.sousTitre && <p className="text-lead text-muted mt-2">{r.sousTitre}</p>}
          </div>
        </header>

        <dl className="mt-8 flex flex-wrap gap-3">
          <div className="bg-surface-2 rounded-full px-5 py-2.5">
            <dt className="sr-only">{libelles.cadre}</dt>
            <dd className="meta fort">{libelles.cadres[r.cadre]}</dd>
          </div>
          <div className="bg-surface-2 rounded-full px-5 py-2.5">
            <dt className="sr-only">{libelles.statut}</dt>
            <dd className="meta fort inline-flex items-center gap-2">
              <IconeStatut statut={r.statut} size={18} />
              {libelles.statuts[r.statut]}
            </dd>
          </div>
          <div className="bg-surface-2 rounded-full px-5 py-2.5">
            <dt className="meta text-muted inline">{libelles.periode} </dt>
            <dd className="meta fort inline">
              {estACompleter(r.periode) ? <ACompleter /> : r.periode}
            </dd>
          </div>
        </dl>

        <div className="relative mt-12">
          <span
            aria-hidden="true"
            className={`absolute top-4 bottom-4 left-5 w-1 -translate-x-1/2 rounded-full ${LIGNE_CADRE[r.cadre]}`}
          />
          <div className="relative grid max-w-[72ch] gap-10">
            <ArretFicheD cadre={r.cadre} titre={libelles.contexte}>
              <p data-capture="paragraphe-fiche">{r.contexte}</p>
            </ArretFicheD>
            <ArretFicheD cadre={r.cadre} titre={libelles.objectifs}>
              <ListeD elements={r.objectifs} />
            </ArretFicheD>
            <ArretFicheD cadre={r.cadre} titre={libelles.missions}>
              <ListeD elements={r.missions} />
            </ArretFicheD>
            <ArretFicheD cadre={r.cadre} titre={libelles.stack}>
              <ul className="flex flex-wrap gap-2">
                {r.stack.map((outil) => (
                  <li
                    key={outil}
                    translate="no"
                    className="bg-surface-2 font-ui text-ui fort rounded-full px-4 py-1.5"
                  >
                    {outil}
                  </li>
                ))}
              </ul>
            </ArretFicheD>
            <ArretFicheD cadre={r.cadre} titre={libelles.competences}>
              <ListeD elements={r.competences.map(intituleCompetence)} />
            </ArretFicheD>
            <ArretFicheD cadre={r.cadre} titre={libelles.preuves}>
              <p className="text-muted">
                {libelles.aucunePreuve} <ACompleter />
              </p>
            </ArretFicheD>
          </div>
        </div>
      </div>
    </article>
  )
}
