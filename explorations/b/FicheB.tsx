import { realisations } from '@/content'
import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'
import { ancreFiche, ficheSamba, intituleCompetence } from '../partage/donnees'
import { BlocFicheB } from './BlocFicheB'
import { ListeB } from './ListeB'
import { PanneauB } from './PanneauB'
import { StatutB } from './StatutB'

const { libelles } = realisations
const r = ficheSamba
const ancre = ancreFiche(r.id)

const SOMMAIRE = [
  { id: `${ancre}-contexte`, titre: libelles.contexte },
  { id: `${ancre}-objectifs`, titre: libelles.objectifs },
  { id: `${ancre}-missions`, titre: libelles.missions },
  { id: `${ancre}-stack`, titre: libelles.stack },
  { id: `${ancre}-competences`, titre: libelles.competences },
  { id: `${ancre}-preuves`, titre: libelles.preuves },
] as const

/** Fiche détaillée : sommaire fixe à gauche, panneau principal à droite. */
export function FicheB() {
  const [contexte, objectifs, missions, stack, competences, preuves] = SOMMAIRE
  return (
    <article id={ancre} className="mx-auto max-w-[1320px] scroll-mt-24 px-3 pb-20 md:px-6">
      <div className="border-line bg-line grid gap-px border lg:grid-cols-[17rem_minmax(0,1fr)]">
        <PanneauB titre={libelles.ficheDetaillee} className="max-lg:hidden" corpsClassName="p-4">
          <nav aria-label={libelles.ficheDetaillee} className="lg:sticky lg:top-24">
            <ol className="font-ui text-ui grid gap-1">
              {SOMMAIRE.map((entree) => (
                <li key={entree.id}>
                  <a
                    href={`#${entree.id}`}
                    className="text-muted transition-ui hover:bg-surface-2 hover:text-fg block px-2 py-1.5"
                  >
                    {entree.titre}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </PanneauB>

        <PanneauB titre={`~/realisations/${r.id}`} corpsClassName="p-6 md:p-10">
          <h2 className="titre text-h2">{r.titre}</h2>
          {r.sousTitre && <p className="text-lead text-muted mt-2">{r.sousTitre}</p>}

          <dl className="meta border-rule bg-surface-2 mt-6 grid gap-x-8 gap-y-2 border p-4 sm:grid-cols-3">
            <div>
              <dt className="text-muted">{libelles.cadre}</dt>
              <dd className="text-fg">{libelles.cadres[r.cadre]}</dd>
            </div>
            <div>
              <dt className="text-muted">{libelles.statut}</dt>
              <dd>
                <StatutB statut={r.statut} />
              </dd>
            </div>
            <div>
              <dt className="text-muted">{libelles.periode}</dt>
              <dd>{estACompleter(r.periode) ? <ACompleter /> : r.periode}</dd>
            </div>
          </dl>

          <div className="mt-10 grid max-w-[75ch] gap-10">
            {contexte && (
              <BlocFicheB id={contexte.id} titre={contexte.titre}>
                <p data-capture="paragraphe-fiche">{r.contexte}</p>
              </BlocFicheB>
            )}
            {objectifs && (
              <BlocFicheB id={objectifs.id} titre={objectifs.titre}>
                <ListeB elements={r.objectifs} />
              </BlocFicheB>
            )}
            {missions && (
              <BlocFicheB id={missions.id} titre={missions.titre}>
                <ListeB elements={r.missions} />
              </BlocFicheB>
            )}
            {stack && (
              <BlocFicheB id={stack.id} titre={stack.titre}>
                <ul className="flex flex-wrap gap-2">
                  {r.stack.map((outil) => (
                    <li
                      key={outil}
                      translate="no"
                      className="border-line font-code text-meta border px-3 py-1"
                    >
                      {outil}
                    </li>
                  ))}
                </ul>
              </BlocFicheB>
            )}
            {competences && (
              <BlocFicheB id={competences.id} titre={competences.titre}>
                <ListeB elements={r.competences.map(intituleCompetence)} />
              </BlocFicheB>
            )}
            {preuves && (
              <BlocFicheB id={preuves.id} titre={preuves.titre}>
                <p className="text-muted">
                  {libelles.aucunePreuve} <ACompleter />
                </p>
              </BlocFicheB>
            )}
          </div>
        </PanneauB>
      </div>
    </article>
  )
}
