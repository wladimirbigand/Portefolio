import { motion } from 'motion/react'
import { certifications, certificationsLibelles, certificationsSection } from '../../content'
import type { Certification } from '../../content'
import { REQUETE_MOBILE, useMedia } from '../../lib/media'
import { fichierPublic } from '../../lib/url'
import { useApercu } from './Apercu'
import { Entete, RESSORT, VUE } from './atomes'
import { EmblemeParticules } from './Effets'
import { Picto, ton } from './Picto'

/**
 * Attestation d'une certification : elle s'ouvre dans la fenêtre superposée (image ou PDF).
 * Sous 768 px, un PDF s'ouvre dans un nouvel onglet, comme les documents des épreuves.
 */
function BoutonAttestation({ certification }: { certification: Certification }) {
  const { ouvrir } = useApercu()
  const mobile = useMedia(REQUETE_MOBILE)
  const { attestation, nom } = certification
  if (!attestation) return null
  const url = fichierPublic(attestation.fichier)
  const titre = certificationsLibelles.attestationDe(nom)
  if (mobile && attestation.type === 'pdf') {
    return (
      <a className="p-bouton" href={url} target="_blank" rel="noreferrer" aria-label={titre}>
        <Picto nom="apercu" />
        {certificationsLibelles.attestation}
      </a>
    )
  }
  return (
    <button
      type="button"
      className="p-bouton"
      aria-haspopup="dialog"
      aria-label={titre}
      onClick={() =>
        ouvrir({
          url,
          titre,
          image:
            attestation.type === 'image'
              ? { alt: attestation.alt ?? titre, largeur: attestation.largeur, hauteur: attestation.hauteur }
              : undefined,
        })
      }
    >
      <Picto nom="apercu" />
      {certificationsLibelles.attestation}
    </button>
  )
}

/**
 * Certifications : une liste sobre. Chaque ligne : l'emblème en particules (le sigle), le nom,
 * l'organisme, puis le statut écrit en toutes lettres (« Obtenu » ou « En cours »). La figure de la
 * section (un arbre) occupe une réserve haute à droite de la liste.
 */
export function Certifications() {
  return (
    <section
      id={certificationsSection.id}
      className="p-section"
      aria-labelledby="p-certifications-titre"
    >
      <Entete section={certificationsSection} idTitre="p-certifications-titre" />
      <div className="p-certifications-corps">
        <ul className="p-certifications" role="list">
          {certifications.map((certification, rang) => (
            <motion.li
              key={certification.nom}
              className="p-certification"
              data-ton={ton(rang)}
              initial={{ opacity: 0.45, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VUE}
              transition={{ ...RESSORT, delay: 0.04 * rang }}
            >
              <EmblemeParticules sigle={certification.sigle} />
              <div className="p-certification-texte">
                <h3 className="p-certification-nom">
                  {certification.nom}
                  {certification.score && <span className="p-certification-score"> · {certification.score}</span>}
                </h3>
                {certification.organisme && (
                  <p className="p-certification-organisme" translate="no">
                    {certification.organisme}
                  </p>
                )}
              </div>
              {/* Obtenu : marque pleine en encre. En cours : marque pleine en accent. */}
              <p className={certification.statut === 'obtenu' ? 'p-etat p-etat-fait' : 'p-etat'}>
                <span className="p-etat-marque" aria-hidden="true" />
                {certificationsLibelles.statuts[certification.statut]}
              </p>
              <BoutonAttestation certification={certification} />
            </motion.li>
          ))}
        </ul>
        {/* Réserve haute à droite : l'arbre de la section. */}
        <div
          className="p-reserve p-reserve-certifications"
          data-reserve={certificationsSection.id}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
