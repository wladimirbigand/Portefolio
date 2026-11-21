import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { contact, contactActions, contactLibelles, contactSection, moyensContact } from '../../content'
import { Bouton, Entete, RESSORT_VIF, Revele } from './atomes'
import { Pastille, Picto } from './Picto'

type EtatCopie = 'repos' | 'copie' | 'echec'

/** Durée d'affichage de la confirmation, en millisecondes. */
const DUREE_CONFIRMATION = 4000

/** Copie dans le presse-papiers ; repli sur une sélection temporaire si l'API moderne est refusée. */
async function copier(texte: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texte)
    return true
  } catch {
    const zone = document.createElement('textarea')
    zone.value = texte
    zone.setAttribute('readonly', '')
    zone.style.position = 'fixed'
    zone.style.opacity = '0'
    document.body.append(zone)
    zone.select()
    let fait = false
    try {
      fait = document.execCommand('copy')
    } catch {
      fait = false
    }
    zone.remove()
    return fait
  }
}

/**
 * Les deux actions de l'e-mail, sous l'accroche : le lien mailto et le bouton « copier ».
 * La confirmation s'affiche sous les boutons et est annoncée aux lecteurs d'écran (`role="status"`) ;
 * le focus reste sur le bouton.
 */
function ActionsEmail({ adresse, url }: { adresse: string; url: string }) {
  const [etat, setEtat] = useState<EtatCopie>('repos')
  const minuterie = useRef(0)

  useEffect(() => () => window.clearTimeout(minuterie.current), [])

  const surCopie = useCallback(async () => {
    const fait = await copier(adresse)
    setEtat(fait ? 'copie' : 'echec')
    window.clearTimeout(minuterie.current)
    minuterie.current = window.setTimeout(() => setEtat('repos'), DUREE_CONFIRMATION)
  }, [adresse])

  return (
      <div className="p-actions p-contact-actions">
        <Bouton plein picto="ecrire" href={url}>
          {contactActions.ecrire}
        </Bouton>
        <motion.button
          type="button"
          className="p-bouton"
          onClick={surCopie}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={RESSORT_VIF}
        >
          <Picto nom={etat === 'copie' ? 'fait' : 'copier'} />
          {contactActions.copier}
        </motion.button>
        {/* Zone d'annonce toujours présente : son texte change, les lecteurs d'écran le lisent. */}
        <p className="p-contact-confirmation" role="status">
          {etat !== 'repos' && (
            <motion.span
              key={etat}
              className={etat === 'copie' ? 'p-etat' : 'p-etat p-etat-attente'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={RESSORT_VIF}
            >
              <span className="p-etat-marque" aria-hidden="true" />
              {etat === 'copie' ? contactActions.copie : contactActions.echec}
            </motion.span>
          )}
        </p>
      </div>
  )
}

/**
 * Contact : à gauche la phrase d'accroche et les deux actions de l'e-mail ; à droite les moyens de
 * contact, chacun avec son picto (e-mail, LinkedIn, GitHub, lieu). Entre les deux, la figure de la
 * section : une liaison point à point. Pas de formulaire.
 */
export function Contact() {
  const email = moyensContact.find((moyen) => moyen.type === 'email')
  return (
    <section id={contactSection.id} className="p-section" aria-labelledby="p-contact-titre">
      <Entete section={contactSection} idTitre="p-contact-titre" />
      <div className="p-contact-corps">
        <Revele className="p-contact-appel">
          <p className="p-contact-accroche">{contact.accroche}</p>
          {email && <ActionsEmail adresse={email.valeur ?? email.label} url={email.url} />}
        </Revele>
        <div className="p-reserve p-reserve-contact" data-reserve={contactSection.id} aria-hidden="true" />
        <Revele className="p-fiche p-contact-moyens">
          <dl>
            {moyensContact.map((moyen, rang) => (
              <div key={moyen.type}>
                <Pastille nom={moyen.type} taille="m" rang={rang} />
                <dt>{contactLibelles.types[moyen.type]}</dt>
                <dd>
                  {moyen.type === 'email' ? (
                    // L'adresse en clair, sélectionnable.
                    <span className="p-contact-adresse" translate="no">
                      {moyen.valeur ?? moyen.label}
                    </span>
                  ) : (
                    <a className="p-lien" href={moyen.url} target="_blank" rel="noreferrer" translate="no">
                      {moyen.label}
                      <span className="sr-only"> ({contactLibelles.nouvelOnglet})</span>
                      <Picto nom="externe" />
                    </a>
                  )}
                </dd>
              </div>
            ))}
            <div>
              <Pastille nom="lieu" taille="m" rang={moyensContact.length} />
              <dt>{contactLibelles.lieu}</dt>
              <dd>{contact.lieu}</dd>
            </div>
          </dl>
        </Revele>
      </div>
    </section>
  )
}
