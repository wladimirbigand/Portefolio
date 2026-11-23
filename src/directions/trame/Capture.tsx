import type { Capture } from '../../content'

/**
 * Une capture d'écran : formats modernes et plusieurs largeurs (le navigateur choisit), dimensions
 * connues d'avance (aucun saut de mise en page), chargement différé.
 * `largeurs` est l'attribut `sizes` : la largeur d'affichage de l'image, selon l'écran.
 * `alt` vide : l'image est décorative ici (elle est décrite ailleurs, dans la fiche).
 * `immediat` : l'image est chargée tout de suite (capture ouverte en grand, déjà à l'écran).
 */
export function ImageCapture({
  capture,
  largeurs,
  alt,
  immediat,
}: {
  capture: Capture
  largeurs: string
  alt?: string
  immediat?: boolean
}) {
  return (
    <picture>
      {capture.sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcset} sizes={largeurs} />
      ))}
      <img
        src={capture.src}
        alt={alt ?? capture.alt}
        width={capture.largeur}
        height={capture.hauteur}
        loading={immediat ? 'eager' : 'lazy'}
        decoding="async"
        draggable={immediat ? false : undefined}
      />
    </picture>
  )
}
