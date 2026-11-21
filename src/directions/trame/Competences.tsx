import { Fragment } from 'react'
import { motion } from 'motion/react'
import { competences, competencesSection, groupeDuCode } from '../../content'
import { Entete, RESSORT, VUE } from './atomes'
import { CodeParticules } from './Effets'
import { Pastille } from './Picto'

/**
 * Compétences : sept groupes par catégorie, sans pourcentage ni contexte. Une grille : chaque groupe
 * est un filet, son intitulé, puis ses outils en ligne. Le bloc de code HAProxy (en particules) occupe
 * l'espace libre à côté du groupe « Réseau et sécurité périmétrique » ; la figure de la section (un
 * pare-feu) se compose dans la dernière case.
 */
export function Competences() {
  return (
    <section
      id={competencesSection.id}
      className="p-section"
      aria-labelledby="p-competences-titre"
    >
      <Entete section={competencesSection} idTitre="p-competences-titre" className="p-entete-large" />
      <div className="p-competences">
        {competences.map((groupe, rang) => (
          <Fragment key={groupe.titre}>
            <motion.section
              className="p-competence"
              aria-labelledby={`p-competence-${rang}`}
              initial={{ opacity: 0.45, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VUE}
              transition={{ ...RESSORT, delay: 0.04 * rang }}
            >
              <div className="p-competence-tete">
                <Pastille nom={groupe.picto} taille="s" rang={rang} />
                <h3 id={`p-competence-${rang}`} className="p-competence-titre">
                  {groupe.titre}
                </h3>
              </div>
              <ul className="p-environnement" role="list">
                {groupe.competences.map((outil, place) => (
                  <li key={outil} translate="no">
                    {outil}
                    {/* Le point qui sépare deux outils est décoratif : il n'est pas lu. */}
                    {place < groupe.competences.length - 1 && (
                      <span className="p-environnement-point" aria-hidden="true" />
                    )}
                  </li>
                ))}
              </ul>
            </motion.section>
            {groupe.titre === groupeDuCode && <CodeParticules />}
          </Fragment>
        ))}
        {/* Dernière case : la figure de la section s'y compose. */}
        <div className="p-reserve p-reserve-competences" data-reserve={competencesSection.id} aria-hidden="true" />
      </div>
    </section>
  )
}
