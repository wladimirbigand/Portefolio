type Option<T extends string> = { valeur: T; libelle: string; titre?: string }

type Props<T extends string> = {
  nom: string
  legende: string
  options: readonly Option<T>[]
  valeur: T
  onChange: (valeur: T) => void
}

/** Groupe de boutons radio natifs (navigation aux flèches incluse). */
export function SelecteurAxe<T extends string>({
  nom,
  legende,
  options,
  valeur,
  onChange,
}: Props<T>) {
  return (
    <fieldset className="mx-axe">
      <legend>{legende}</legend>
      <div className="mx-options">
        {options.map((option) => (
          <label key={option.valeur} title={option.titre}>
            <input
              type="radio"
              name={nom}
              value={option.valeur}
              checked={valeur === option.valeur}
              onChange={() => onChange(option.valeur)}
            />
            <span>{option.libelle}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
