import { ecole, formationLibelles, formations, formationSection } from '../../content'
import { Entete, Plaque, Revele } from './atomes'
import { Picto } from './Picto'

/**
 * Formation : le Campus Ermitage. Son logo à droite du titre, ce que Wladimir y prépare, puis les
 * formations proposées. La figure (un anneau) occupe un rail à gauche de cette liste : chaque poste
 * est à la hauteur de sa formation (`data-arret`, mesuré par la trame).
 */
export function Formation() {
  return (
    <section
      id={formationSection.id}
      className="p-section"
      aria-labelledby="p-formation-titre"
    >
      <Entete section={formationSection} idTitre="p-formation-titre" className="p-entete-logo" nom={ecole.nom}>
        <Plaque logo={ecole.logo} />
      </Entete>
      <div className="p-formation-corps">
        <Revele className="p-fiche p-formation-fiche">
          <dl>
            <div>
              <dt>
                <Picto nom="formation" />
                {formationLibelles.diplome}
              </dt>
              <dd>{ecole.diplome}</dd>
            </div>
            <div>
              <dt>
                <Picto nom="periode" />
                {formationLibelles.periode}
              </dt>
              <dd>{ecole.periode}</dd>
            </div>
            <div>
              <dt>
                <Picto nom="lieu" />
                {formationLibelles.lieu}
              </dt>
              <dd>
                <span translate="no">{ecole.nom}</span> · {ecole.lieu}
              </dd>
            </div>
          </dl>
          <a className="p-lien" href={ecole.site.url} target="_blank" rel="noreferrer">
            {ecole.site.label}
            <Picto nom="externe" />
          </a>
        </Revele>

        <Revele className="p-formations">
          <h3 className="p-label">{formationLibelles.formations}</h3>
          <div className="p-formations-corps">
            <div className="p-reserve p-reserve-formation" data-reserve={formationSection.id} aria-hidden="true" />
            <ul role="list">
            {formations.map((formation) => (
              <li key={formation.sigle} data-etat={formation.etat}>
                <span className="p-formation-sigle" data-arret={formationSection.id}>
                  {formation.sigle}
                </span>
                <span className="p-formation-nom">
                  {formation.nom}
                  {formation.precision && <span className="p-formation-precision"> · {formation.precision}</span>}
                </span>
                {formation.etat && (
                  <span className={formation.etat === 'suivie' ? 'p-etat' : 'p-etat p-etat-attente'}>
                    <span className="p-etat-marque" aria-hidden="true" />
                    {formationLibelles.etats[formation.etat]}
                  </span>
                )}
              </li>
            ))}
            </ul>
          </div>
        </Revele>
      </div>
    </section>
  )
}
