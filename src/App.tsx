// Page de vérification VOLONTAIREMENT BRUTE (prompt 0) : affiche tout src/content/ pour
// prouver que le contenu est complet et bien typé. Aucun travail de design ici.
import * as contenu from '@/content'

type Valeur = string | number | boolean | null | undefined | Valeur[] | { [cle: string]: Valeur }

function Arbre({ valeur }: { valeur: Valeur }) {
  if (Array.isArray(valeur)) {
    if (valeur.length === 0) return <em>[ ]</em>
    return (
      <ol>
        {valeur.map((v, i) => (
          <li key={i}>
            <Arbre valeur={v} />
          </li>
        ))}
      </ol>
    )
  }
  if (valeur !== null && typeof valeur === 'object') {
    return (
      <ul>
        {Object.entries(valeur).map(([cle, v]) => (
          <li key={cle}>
            <strong>{cle}</strong> : <Arbre valeur={v} />
          </li>
        ))}
      </ul>
    )
  }
  return <span>{String(valeur)}</span>
}

export default function App() {
  return (
    <main className="mx-auto max-w-5xl p-6 text-lg leading-relaxed [&_ol]:ml-6 [&_ol]:list-decimal [&_ul]:ml-6 [&_ul]:list-disc">
      {Object.entries(contenu).map(([nom, module]) => (
        <section key={nom} id={nom} className="mb-10 border-t pt-4">
          <h2 className="font-mono text-2xl font-bold">{nom}</h2>
          <Arbre valeur={module as Valeur} />
        </section>
      ))}
    </main>
  )
}
