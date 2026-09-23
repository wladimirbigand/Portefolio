import { realisations } from '@/content'
import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'
import { ancreFiche, ficheSamba, intituleCompetence } from '../partage/donnees'
import { ListeC } from './ListeC'
import { NoteMargeC } from './NoteMargeC'
import { PartieFicheC } from './PartieFicheC'

const { libelles } = realisations
const r = ficheSamba

/** Fiche détaillée en article : colonne de 68 caractères, métadonnées en notes de marge. */
export function FicheC() {
  return (
    <article id={ancreFiche(r.id)} className="border-rule border-t px-5 py-24 md:px-[8vw] md:py-32">
      <header className="max-w-[46rem]">
        <p className="meta text-muted">{libelles.ficheDetaillee}</p>
        <h2 className="titre text-h2 mt-4">{r.titre}</h2>
        {r.sousTitre && <p className="accent-style text-lead text-muted mt-4">{r.sousTitre}</p>}
      </header>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,68ch)_15rem] lg:gap-16">
        <aside className="lg:order-2">
          <dl className="border-rule grid gap-6 border-l pl-5 lg:sticky lg:top-24">
            <NoteMargeC titre={libelles.cadre}>{libelles.cadres[r.cadre]}</NoteMargeC>
            <NoteMargeC titre={libelles.statut}>{libelles.statuts[r.statut]}</NoteMargeC>
            <NoteMargeC titre={libelles.periode}>
              {estACompleter(r.periode) ? <ACompleter /> : r.periode}
            </NoteMargeC>
            <NoteMargeC titre={libelles.stack}>
              <ul className="grid gap-1">
                {r.stack.map((outil) => (
                  <li key={outil} translate="no">
                    {outil}
                  </li>
                ))}
              </ul>
            </NoteMargeC>
          </dl>
        </aside>

        <div className="grid gap-14 lg:order-1">
          <PartieFicheC titre={libelles.contexte}>
            <p data-capture="paragraphe-fiche">{r.contexte}</p>
          </PartieFicheC>
          <PartieFicheC titre={libelles.objectifs}>
            <ListeC elements={r.objectifs} />
          </PartieFicheC>
          <PartieFicheC titre={libelles.missions}>
            <ListeC elements={r.missions} />
          </PartieFicheC>
          <PartieFicheC titre={libelles.competences}>
            <ListeC elements={r.competences.map(intituleCompetence)} />
          </PartieFicheC>
          <PartieFicheC titre={libelles.preuves}>
            <p className="text-muted">
              {libelles.aucunePreuve} <ACompleter />
            </p>
          </PartieFicheC>
        </div>
      </div>
    </article>
  )
}
