// Séquence de boot de la piste B : jouée une seule fois par session (sessionStorage).

const CLE_BOOT = 'exploration-boot-b-joue'

/** Durée totale maximale de la séquence, en secondes : le jury ne doit jamais attendre. */
export const DUREE_MAX_BOOT = 1.2

export function bootDejaJoue(): boolean {
  try {
    return window.sessionStorage.getItem(CLE_BOOT) === '1'
  } catch {
    return false
  }
}

export function marquerBootJoue(): void {
  try {
    window.sessionStorage.setItem(CLE_BOOT, '1')
  } catch {
    /* stockage indisponible : la séquence pourra se rejouer, sans conséquence */
  }
}

/** Utilisé par « Rejouer les animations ». */
export function effacerBootJoue(): void {
  try {
    window.sessionStorage.removeItem(CLE_BOOT)
  } catch {
    /* rien à effacer */
  }
}
