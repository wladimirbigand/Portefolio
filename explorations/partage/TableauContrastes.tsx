import { useEffect, useState } from 'react'
import { ratioContraste } from './contraste'
import { libellesExploration } from './libelles'
import type { Combinaison } from './types'

type Mesure = { libelle: string; ratio: number | null; seuil: number }

const PAIRES = [
  { libelle: libellesExploration.mixeur.texteFond, avant: '--c-text', fond: '--c-bg', seuil: 4.5 },
  {
    libelle: libellesExploration.mixeur.secondaireFond,
    avant: '--c-muted',
    fond: '--c-bg',
    seuil: 4.5,
  },
  {
    libelle: libellesExploration.mixeur.secondaireSurface,
    avant: '--c-muted',
    fond: '--c-surface',
    seuil: 4.5,
  },
  {
    libelle: libellesExploration.mixeur.accentFond,
    avant: '--c-accent',
    fond: '--c-bg',
    seuil: 4.5,
  },
  {
    libelle: libellesExploration.mixeur.bordureFond,
    avant: '--c-border',
    fond: '--c-bg',
    seuil: 3,
  },
] as const

type Props = { combinaison: Combinaison }

/** Contrastes mesurés en direct sur les tokens de la palette active. */
export function TableauContrastes({ combinaison }: Props) {
  const [mesures, setMesures] = useState<Mesure[]>([])

  useEffect(() => {
    const style = getComputedStyle(document.documentElement)
    // Lecture des tokens appliqués au DOM (système externe) après chaque changement de palette.
    // oxlint-disable-next-line react/set-state-in-effect
    setMesures(
      PAIRES.map((paire) => ({
        libelle: paire.libelle,
        seuil: paire.seuil,
        ratio: ratioContraste(
          style.getPropertyValue(paire.avant),
          style.getPropertyValue(paire.fond),
        ),
      })),
    )
  }, [combinaison.palette, combinaison.theme])

  return (
    <table className="mx-contrastes">
      <caption>{libellesExploration.mixeur.contrastes}</caption>
      <tbody>
        {mesures.map((mesure) => {
          const ok = mesure.ratio !== null && mesure.ratio >= mesure.seuil
          return (
            <tr key={mesure.libelle} data-ok={ok}>
              <th scope="row">{mesure.libelle}</th>
              <td>{mesure.ratio === null ? '?' : `${mesure.ratio.toFixed(2)}:1`}</td>
              <td>
                {ok ? '✓ ' : '⚠ '}
                {ok
                  ? libellesExploration.mixeur.conforme
                  : libellesExploration.mixeur.avertissement}
                {` (${mesure.seuil}:1)`}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
