// Contraste WCAG 2.x entre deux couleurs hexadécimales (#rrggbb ou #rgb).

function canal(valeur: number): number {
  const v = valeur / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string): number | null {
  let h = hex.trim().replace('#', '')
  if (h.length === 3) h = h.replace(/./g, (c) => c + c)
  if (!/^[0-9a-f]{6}$/i.test(h)) return null
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  if (r === undefined || g === undefined || b === undefined) return null
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
}

/** Ratio de contraste (1 à 21), ou null si une couleur n'est pas lisible en hexadécimal. */
export function ratioContraste(a: string, b: string): number | null {
  const la = luminance(a)
  const lb = luminance(b)
  if (la === null || lb === null) return null
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}
