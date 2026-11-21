import { motion } from 'motion/react'
import {
  capturesRealisation,
  entreprise,
  entrepriseLibelles,
  entrepriseSection,
  missionsEnAvant,
  realisationsLibelles,
} from '../../content'
import { dateLongue, periodeCourte } from '../../lib/dates'
import { ImageCapture } from './Capture'
import { Entete, Plaque, RESSORT, RESSORT_VIF, Revele, VUE } from './atomes'
import { Picto, ton } from './Picto'
import { ancreRealisation, deuxChiffres } from './realisations'

/**
 * Entreprise : la fiche de l'alternance à gauche, et à droite une grille de six cases : les cinq
 * réalisations mises en avant, en cartes, et la réserve de la figure (une étoile) dans la sixième.
 * Les réalisations viennent de `projets.ts` ; chaque carte ouvre la fiche de la sienne.
 * Visuel d'une carte : un grand picto sur un aplat teinté, ou la première capture de la réalisation
 * dès qu'elle en a une.
 */
export function Entreprise() {
  return (
    <section id={entrepriseSection.id} className="p-section" aria-labelledby="p-entreprise-titre">
      <Entete
        section={entrepriseSection}
        idTitre="p-entreprise-titre"
        className="p-entete-logo"
        nom={entreprise.nom}
      >
        <Plaque logo={entreprise.logo} />
      </Entete>
      <div className="p-entreprise-corps">
        <Revele className="p-fiche">
          <dl>
            <div>
              <dt>
                <Picto nom="poste" />
                {entrepriseLibelles.poste}
              </dt>
              <dd>{entreprise.poste}</dd>
            </div>
            <div>
              <dt>
                <Picto nom="periode" />
                {entrepriseLibelles.periode}
              </dt>
              <dd>{entrepriseLibelles.duAu(dateLongue(entreprise.debut), dateLongue(entreprise.fin))}</dd>
            </div>
            <div>
              <dt>
                <Picto nom="environnement" />
                {entrepriseLibelles.environnement}
              </dt>
              <dd>
                <ul className="p-environnement" role="list">
                  {entreprise.environnement.map((outil, rang) => (
                    <li key={outil}>
                      {outil}
                      {/* Le point qui sépare deux outils est décoratif : il n'est pas lu. */}
                      {rang < entreprise.environnement.length - 1 && (
                        <span className="p-environnement-point" aria-hidden="true" />
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <a className="p-lien" href={entreprise.site.url} target="_blank" rel="noreferrer">
            {entreprise.site.label}
            <Picto nom="externe" />
          </a>
        </Revele>

        <div className="p-missions">
          <div className="p-missions-tete">
            <h3 className="p-label">{entrepriseLibelles.missions}</h3>
            <a className="p-lien" href={entrepriseLibelles.toutesLesRealisations.url}>
              {entrepriseLibelles.toutesLesRealisations.label}
              <Picto nom="suivant" />
            </a>
          </div>
          <ul className="p-cartes" role="list">
            {missionsEnAvant.map((realisation, rang) => {
              const capture = capturesRealisation(realisation.numero)[0]
              return (
                <motion.li
                  key={realisation.numero}
                  initial={{ opacity: 0.45, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VUE}
                  transition={{ ...RESSORT, delay: 0.05 * rang }}
                >
                  <motion.a
                    className="p-carte"
                    data-ton={ton(rang)}
                    href={`#${ancreRealisation(realisation.numero)}`}
                    aria-haspopup="dialog"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    transition={RESSORT_VIF}
                  >
                    <span className="p-carte-visuel">
                      {capture ? (
                        // La capture est décrite dans la fiche : ici, elle illustre seulement la carte.
                        <ImageCapture capture={capture} alt="" largeurs="(min-width: 44em) 16rem, 6.5rem" />
                      ) : (
                        realisation.picto && <Picto nom={realisation.picto} taille="xl" />
                      )}
                      {/* Le numéro a son propre aplat : il reste lisible sur une capture. */}
                      <span className="p-mission-numero">
                        <span className="sr-only">{realisationsLibelles.realisation(realisation.numero)} : </span>
                        <span aria-hidden="true">{deuxChiffres(realisation.numero)}</span>
                      </span>
                    </span>
                    <span className="p-carte-texte">
                      <span className="p-carte-titre">{realisation.titreCourt}</span>
                      <span className="p-carte-periode">{periodeCourte(realisation.debut, realisation.fin)}</span>
                      <span className="sr-only">, {realisationsLibelles.ouvrirFiche}</span>
                    </span>
                  </motion.a>
                </motion.li>
              )
            })}
            {/* Sixième case : la figure de la section s'y compose. */}
            <li className="p-reserve p-reserve-case" data-reserve={entrepriseSection.id} aria-hidden="true" />
          </ul>
        </div>
      </div>
    </section>
  )
}
