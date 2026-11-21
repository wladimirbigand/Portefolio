import { motion } from 'motion/react'
import { parcours, parcoursLibelles, parcoursSection } from '../../content'
import type { EtapeParcours } from '../../content'
import { Entete, RESSORT, VUE } from './atomes'
import { Picto } from './Picto'

/** Marque d'une étape : creuse (projet), pleine en accent (en cours), pleine en encre (passée). */
const CLASSE_ETAT: Record<EtapeParcours['etat'], string> = {
  projet: 'p-etat p-etat-attente',
  actuel: 'p-etat',
  passe: 'p-etat p-etat-fait',
}

/**
 * Parcours : quatre étapes empilées, une par ligne, de la plus récente à la plus ancienne.
 * La figure (une route à quatre sauts) occupe un rail à gauche des étapes, à toutes les largeurs :
 * chaque saut est à la hauteur du repère de son étape (`data-arret`, mesuré par la trame).
 * L'étape BTS renvoie vers la section Formation, sans répéter sa description.
 */
export function Parcours() {
  return (
    <section
      id={parcoursSection.id}
      className="p-section"
      aria-labelledby="p-parcours-titre"
    >
      <Entete section={parcoursSection} idTitre="p-parcours-titre" />
      <div className="p-parcours-corps">
        <div className="p-reserve p-reserve-parcours" data-reserve={parcoursSection.id} aria-hidden="true" />
        {/* `role="list"` : sans puces, certains lecteurs d'écran n'annoncent plus la liste. */}
        <ol className="p-etapes" role="list">
          {parcours.map((etape, rang) => (
            <motion.li
              key={etape.titre}
              className="p-etape"
              initial={{ opacity: 0.45, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VUE}
              transition={{ ...RESSORT, delay: 0.06 * rang }}
            >
              <div className="p-etape-repere" data-arret={parcoursSection.id}>
                <p className="p-etape-periode">{etape.periode}</p>
                {etape.etat !== 'passe' && (
                  <p className={`${CLASSE_ETAT[etape.etat]} p-etape-etat`}>
                    <span className="p-etat-marque" aria-hidden="true" />
                    {parcoursLibelles[etape.etat]}
                  </p>
                )}
              </div>
              <div className="p-etape-texte">
                <h3 className="p-etape-titre">{etape.titre}</h3>
                <p className="p-etape-lieu">
                  <span className="p-ecole-nom" translate="no">
                    {etape.organisme}
                  </span>{' '}
                  · {etape.lieu}
                </p>
                {etape.description && <p className="p-etape-description">{etape.description}</p>}
                {etape.renvois && (
                  <ul className="p-etape-liens" role="list">
                    {etape.renvois.map((renvoi) => (
                      <li key={renvoi.url}>
                        <a className="p-lien" href={renvoi.url}>
                          {renvoi.label}
                          <Picto nom="suivant" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
