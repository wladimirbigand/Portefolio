// Script playwright-cli (run-code) : captures des explorations de DA.
// Usage : playwright-cli run-code --filename=explorations/outils/captures.js
// Sortie : screenshots/01-da/ (viewport) et screenshots/01-da/pleine/ (page entière).
async (page) => {
  const racine = 'http://localhost:5173/'
  const config = globalThis.__capturesConfig ?? {}
  const dossier = config.dossier ?? 'screenshots/01-da'
  const pistes = config.pistes ?? ['a', 'b', 'c', 'd']
  const themes = config.themes ?? ['light', 'dark']
  const formats = config.formats ?? [
    [1920, 1080],
    [1280, 720],
    [390, 844],
  ]
  const pageEntiere = config.pageEntiere ?? true
  const resultats = []

  for (const piste of pistes) {
    for (const theme of themes) {
      for (const [largeur, hauteur] of formats) {
        await page.setViewportSize({ width: largeur, height: hauteur })
        const url = `${racine}?explorations&layout=${piste}&palette=${piste}&type=${piste}&motion=${piste}&theme=${theme}&mixeur=0`
        await page.goto(url)
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(1500)
        const nom = `${piste}-${theme === 'dark' ? 'sombre' : 'clair'}-${largeur}x${hauteur}`
        await page.screenshot({ path: `${dossier}/${nom}.png` })
        if (pageEntiere) {
          // Défilement progressif pour déclencher les entrées « whileInView » (once).
          const total = await page.evaluate(() => document.documentElement.scrollHeight)
          for (let y = 0; y < total; y += Math.round(hauteur * 0.6)) {
            await page.evaluate(
              (valeur) => window.scrollTo({ top: valeur, behavior: 'instant' }),
              y,
            )
            await page.waitForTimeout(120)
          }
          await page.waitForTimeout(900)
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
          await page.waitForTimeout(400)
          await page.screenshot({ path: `${dossier}/pleine/${nom}.png`, fullPage: true })
        }
        resultats.push(nom)
      }
    }
  }
  return resultats.join('\n')
}
