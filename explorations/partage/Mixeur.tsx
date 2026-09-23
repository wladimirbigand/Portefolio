import { useState } from 'react'
import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { THEME_PAR_DEFAUT } from './combinaison'
import { useExploration } from './ExplorationContext'
import { libellesExploration as L } from './libelles'
import { SelecteurAxe } from './SelecteurAxe'
import { TableauContrastes } from './TableauContrastes'
import { PISTES, type PisteId, type Theme } from './types'

const CLE_REPLIE = 'exploration-mixeur-replie'

function lireReplie(): boolean {
  try {
    return window.localStorage.getItem(CLE_REPLIE) === '1'
  } catch {
    return false
  }
}

const OPTIONS_PISTES = PISTES.map((piste) => ({
  valeur: piste,
  libelle: piste.toUpperCase(),
  titre: L.nomsPistes[piste],
}))

const OPTIONS_THEMES: readonly { valeur: Theme; libelle: string }[] = [
  { valeur: 'clair', libelle: L.themes.clair },
  { valeur: 'sombre', libelle: L.themes.sombre },
]

type Props = {
  navAlwaysVisible: boolean
  onNavAlwaysVisible: (valeur: boolean) => void
}

/** Panneau flottant du comparateur / mixeur de DA. */
export function Mixeur({ navAlwaysVisible, onNavAlwaysVisible }: Props) {
  const { combinaison, modifier, rejouer } = useExploration()
  const [replie, setReplie] = useState(lireReplie)
  const [copie, setCopie] = useState(false)

  const changerReplie = (valeur: boolean) => {
    setReplie(valeur)
    try {
      window.localStorage.setItem(CLE_REPLIE, valeur ? '1' : '0')
    } catch {
      /* stockage indisponible : l'état reste en mémoire */
    }
  }

  const pistePure = (piste: PisteId) =>
    modifier({
      layout: piste,
      palette: piste,
      type: piste,
      motion: piste,
      theme: THEME_PAR_DEFAUT[piste],
    })

  const copierLien = () => {
    void navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopie(true)
      window.setTimeout(() => setCopie(false), 1500)
    })
  }

  if (replie) {
    return (
      <button
        type="button"
        className="mx-bouton-flottant"
        aria-expanded="false"
        aria-controls="mixeur-panneau"
        onClick={() => changerReplie(false)}
      >
        <SlidersHorizontal aria-hidden="true" size={18} />
        {L.mixeur.ouvrir}
      </button>
    )
  }

  return (
    <aside id="mixeur-panneau" className="mx-panneau" aria-label={L.mixeur.titre}>
      <div className="mx-entete">
        <h2>{L.mixeur.titre}</h2>
        <button
          type="button"
          className="mx-icone"
          aria-expanded="true"
          aria-controls="mixeur-panneau"
          aria-label={L.mixeur.replier}
          onClick={() => changerReplie(true)}
        >
          <X aria-hidden="true" size={18} />
        </button>
      </div>

      <SelecteurAxe
        nom="mx-layout"
        legende={L.mixeur.layout}
        options={OPTIONS_PISTES}
        valeur={combinaison.layout}
        onChange={(layout) => modifier({ layout })}
      />
      <SelecteurAxe
        nom="mx-palette"
        legende={L.mixeur.palette}
        options={OPTIONS_PISTES}
        valeur={combinaison.palette}
        onChange={(palette) => modifier({ palette })}
      />
      <SelecteurAxe
        nom="mx-type"
        legende={L.mixeur.type}
        options={OPTIONS_PISTES}
        valeur={combinaison.type}
        onChange={(type) => modifier({ type })}
      />
      <SelecteurAxe
        nom="mx-motion"
        legende={L.mixeur.motion}
        options={OPTIONS_PISTES}
        valeur={combinaison.motion}
        onChange={(motion) => modifier({ motion })}
      />
      <SelecteurAxe
        nom="mx-theme"
        legende={L.mixeur.theme}
        options={OPTIONS_THEMES}
        valeur={combinaison.theme}
        onChange={(theme) => modifier({ theme })}
      />

      <div className="mx-axe">
        <p className="mx-legende">{L.mixeur.pistePure}</p>
        <div className="mx-options">
          {PISTES.map((piste) => (
            <button
              key={piste}
              type="button"
              className="mx-pur"
              aria-label={`${L.mixeur.pistePureAide} ${L.nomsPistes[piste]}`}
              title={L.nomsPistes[piste]}
              onClick={() => pistePure(piste)}
            >
              {piste.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <label className="mx-case">
        <input
          type="checkbox"
          checked={navAlwaysVisible}
          onChange={(evenement) => onNavAlwaysVisible(evenement.target.checked)}
        />
        {L.mixeur.navToujoursVisible}
      </label>

      <div className="mx-actions">
        <button type="button" className="mx-action" onClick={rejouer}>
          <RotateCcw aria-hidden="true" size={16} />
          {L.mixeur.rejouer}
        </button>
        <button type="button" className="mx-action" onClick={copierLien}>
          {copie ? L.mixeur.lienCopie : L.mixeur.copierLien}
        </button>
      </div>

      <TableauContrastes combinaison={combinaison} />
    </aside>
  )
}
