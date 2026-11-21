import { motion } from 'motion/react'
import { captureVeille, dispositifVeille, themesVeille, veilleLibelles, veilleSection } from '../../content'
import { ImageCapture } from './Capture'
import { Entete, RESSORT, Revele, VUE } from './atomes'
import { Pastille, Picto, ton } from './Picto'
import { ancreRealisation } from './realisations'

/**
 * Veille : le dispositif en trois cartes illustrées, puis la ligne des thèmes suivis. Visuel d'une
 * carte : le logo de l'outil ou un picto ; dès que sa capture est déposée (`veille-agregateur`,
 * `veille-bot`), elle s'affiche en grand, le logo en petit dans un coin.
 * La carte de l'agrégateur RSS renvoie vers la fiche de sa réalisation ; celle du bot écrit qu'il est
 * en pause. La figure de la section (un maillage) se compose dans la bande libre à droite du titre.
 */
export function Veille() {
  return (
    <section id={veilleSection.id} className="p-section" aria-labelledby="p-veille-titre">
      <Entete section={veilleSection} idTitre="p-veille-titre" className="p-entete-figure">
        <div className="p-reserve p-reserve-bande" data-reserve={veilleSection.id} aria-hidden="true" />
      </Entete>
      <h3 id="p-veille-dispositif" className="p-label">
        {dispositifVeille.titre}
      </h3>
      <ul className="p-veille-outils" role="list" aria-labelledby="p-veille-dispositif">
        {dispositifVeille.outils.map((outil, rang) => {
          const capture = outil.capture ? captureVeille(outil.capture) : undefined
          return (
          <motion.li
            key={outil.nom}
            className="p-carte p-carte-outil"
            data-ton={ton(rang)}
            data-capture={capture ? '' : undefined}
            initial={{ opacity: 0.45, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VUE}
            transition={{ ...RESSORT, delay: 0.05 * rang }}
          >
            <span className="p-carte-visuel">
              {capture ? (
                <>
                  <ImageCapture capture={capture} largeurs="(min-width: 64em) 32rem, 92vw" />
                  {/* Le logo de l'outil, en petit, sur son propre aplat : il reste lisible sur la capture. */}
                  <span className="p-carte-logo">
                    <Picto nom={outil.picto} taille="m" />
                  </span>
                </>
              ) : (
                <Picto nom={outil.picto} taille="xl" />
              )}
            </span>
            <div className="p-carte-texte">
              <h4 className="p-carte-titre" translate="no">
                {outil.nom}
              </h4>
              {outil.pause && (
                <p className="p-etat p-etat-attente p-carte-etat">
                  <Picto nom="pause" />
                  <span>
                    {veilleLibelles.enPause}
                    <span className="p-etat-detail">{outil.pause}</span>
                  </span>
                </p>
              )}
              <p>{outil.description}</p>
              {outil.realisation !== undefined && (
                <a className="p-lien" href={`#${ancreRealisation(outil.realisation)}`} aria-haspopup="dialog">
                  {veilleLibelles.voirFiche(outil.realisation)}
                  <Picto nom="suivant" />
                </a>
              )}
            </div>
          </motion.li>
          )
        })}
      </ul>

      <Revele className="p-veille-themes">
        <h3 id="p-veille-themes" className="p-label">
          {themesVeille.titre}
        </h3>
        <ul role="list" aria-labelledby="p-veille-themes">
          {themesVeille.themes.map((theme, rang) => (
            <li key={theme.nom}>
              <Pastille nom={theme.picto} taille="m" rang={rang} />
              {theme.nom}
            </li>
          ))}
        </ul>
      </Revele>
    </section>
  )
}
