import type { Capture } from '../../content'

/**
 * Une capture d'écran : formats modernes et plusieurs largeurs (le navigateur choisit), dimensions
 * connues d'avance (aucun saut de mise en page), chargement différé.
 * `largeurs` est l'attribut `sizes` : la largeur d'affichage de l'image, selon l'écran.
 * `alt` vide : l'image est décorative ici (elle est décrite ailleurs, dans la fiche).
 */
export function ImageCapture({ capture, largeurs, alt }: { capture: Capture; largeurs: string; alt?: string }) {
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
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}
