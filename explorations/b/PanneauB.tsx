import type { ReactNode } from 'react'

type Props = {
  titre: ReactNode
  /** Rang dans la séquence de boot (en-tête, puis contenu, puis statut). */
  boot?: number
  statut?: ReactNode
  className?: string
  corpsClassName?: string
  children: ReactNode
}

/** Panneau étiqueté à bordures franches, sans ombre ni rayon. */
export function PanneauB({
  titre,
  boot,
  statut,
  className = '',
  corpsClassName = '',
  children,
}: Props) {
  return (
    <div className={`bg-surface flex flex-col ${className}`}>
      <div
        data-boot={boot}
        className="meta border-line bg-surface-2 text-muted flex items-center justify-between gap-4 border-b px-4 py-2"
      >
        <span className="truncate">{titre}</span>
        {statut && (
          <span data-boot={boot === undefined ? undefined : boot + 2} className="text-ok shrink-0">
            {statut}
          </span>
        )}
      </div>
      <div
        data-boot={boot === undefined ? undefined : boot + 1}
        className={`flex-1 ${corpsClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
