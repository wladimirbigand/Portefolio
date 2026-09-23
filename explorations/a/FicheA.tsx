import { realisations } from '@/content'
import { estACompleter } from '@/lib/aCompleter'
import { ACompleter } from '../partage/ACompleter'
import { ancreFiche, ficheSamba, intituleCompetence } from '../partage/donnees'
import { IconeStatut } from '../partage/IconeStatut'
import { BlocA } from './BlocA'
import { ListeA } from './ListeA'

const { libelles } = realisations
const r = ficheSamba

/** Fiche détaillée : contenu long à gauche, métadonnées fixes à droite. */
export function FicheA() {
  return (
    <article id={ancreFiche(r.id)} className="mx-auto max-w-[1200px] px-5 pb-28 md:px-10">
      <div className="border-rule bg-surface rounded-2xl border p-6 shadow-[inset_0_1px_0_var(--c-surface-2)] md:p-12">
        <header className="max-w-[62ch]">
          <p className="meta text-muted">{libelles.ficheDetaillee}</p>
          <h2 className="titre text-h2 mt-3">{r.titre}</h2>
          {r.sousTitre && <p className="text-lead text-muted mt-3">{r.sousTitre}</p>}
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="grid gap-10 lg:col-span-8">
            <BlocA titre={libelles.contexte}>
              <p className="max-w-[65ch]" data-capture="paragraphe-fiche">
                {r.contexte}
              </p>
            </BlocA>
            <BlocA titre={libelles.objectifs}>
              <ListeA elements={r.objectifs} />
            </BlocA>
            <BlocA titre={libelles.missions}>
              <ListeA elements={r.missions} />
            </BlocA>
            <BlocA titre={libelles.preuves}>
              {r.preuves.length === 0 ? (
                <p className="border-line text-muted rounded-lg border border-dashed px-5 py-4">
                  {libelles.aucunePreuve} <ACompleter />
                </p>
              ) : null}
            </BlocA>
          </div>

          <aside className="lg:col-span-4">
            <dl className="bg-surface-2 grid gap-5 rounded-xl p-6 lg:sticky lg:top-28">
              <div>
                <dt className="meta text-muted">{libelles.cadre}</dt>
                <dd className="fort mt-1">{libelles.cadres[r.cadre]}</dd>
              </div>
              <div>
                <dt className="meta text-muted">{libelles.statut}</dt>
                <dd className="fort mt-1 inline-flex items-center gap-2">
                  <IconeStatut statut={r.statut} size={18} />
                  {libelles.statuts[r.statut]}
                </dd>
              </div>
              <div>
                <dt className="meta text-muted">{libelles.periode}</dt>
                <dd className="mt-1">{estACompleter(r.periode) ? <ACompleter /> : r.periode}</dd>
              </div>
              <div>
                <dt className="meta text-muted">{libelles.stack}</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {r.stack.map((outil) => (
                    <span
                      key={outil}
                      translate="no"
                      className="border-rule bg-surface font-code text-meta rounded-md border px-2.5 py-1"
                    >
                      {outil}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="meta text-muted">{libelles.competences}</dt>
                <dd className="mt-2">
                  <ul className="grid gap-2">
                    {r.competences.map((id) => (
                      <li key={id}>{intituleCompetence(id)}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </article>
  )
}
