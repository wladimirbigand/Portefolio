// Script playwright-cli (run-code) : menu mobile au clavier pour les 4 layouts (390×844).
async (page) => {
  const r = {}
  await page.setViewportSize({ width: 390, height: 844 })
  for (const piste of ['a', 'b', 'c', 'd']) {
    await page.goto(`http://localhost:5173/?explorations&layout=${piste}&theme=light&mixeur=0`)
    const bouton = page.locator('header button[aria-controls]')
    await bouton.waitFor()
    await bouton.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(400)
    const ouvert = await bouton.getAttribute('aria-expanded')
    const focusPremier = await page.evaluate(() => document.activeElement?.textContent?.trim())
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
    const ferme = await bouton.getAttribute('aria-expanded')
    const focusRetour = await page.evaluate(() => document.activeElement?.getAttribute('aria-controls'))
    r[piste] = { ouvert, focusPremier, ferme, focusRetour }
  }
  return JSON.stringify(r)
}
