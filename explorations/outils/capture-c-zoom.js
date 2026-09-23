// Script playwright-cli (run-code) : capture de contrôle de la piste C en 1280×720,
// cadrée sur un paragraphe de la fiche Samba (rendu 1:1, comme sur un projecteur 720p).
async (page) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  for (const theme of ['light', 'dark']) {
    await page.goto(`http://localhost:5173/?explorations&layout=c&palette=c&type=c&motion=c&theme=${theme}&mixeur=0`)
    await page.evaluate(() => document.fonts.ready)
    await page.waitForSelector('[data-capture="paragraphe-fiche"]')
    await page.evaluate(() => document.fonts.ready)
    const paragraphe = page.locator('[data-capture="paragraphe-fiche"]')
    await page.evaluate(() => document.querySelector('[data-capture="paragraphe-fiche"]').scrollIntoView({ block: 'center', behavior: 'instant' }))
    await page.waitForTimeout(1500)
    const boite = await paragraphe.boundingBox()
    const marge = 32
    await page.screenshot({
      path: `screenshots/01-da/c-zoom-paragraphe-${theme === 'dark' ? 'sombre' : 'clair'}-1280x720.png`,
      clip: { x: Math.max(0, boite.x - marge), y: Math.max(0, boite.y - marge - 60), width: Math.min(1280, boite.width + marge * 2), height: boite.height + marge * 2 + 60 },
    })
    await page.screenshot({ path: `screenshots/01-da/c-fiche-${theme === 'dark' ? 'sombre' : 'clair'}-1280x720.png` })
  }
  const mesures = await page.evaluate(() => {
    const p = document.querySelector('[data-capture="paragraphe-fiche"]')
    const s = getComputedStyle(p)
    return { police: s.fontFamily, taille: s.fontSize, interligne: s.lineHeight, graisse: s.fontWeight, largeurPx: Math.round(p.getBoundingClientRect().width) }
  })
  return JSON.stringify(mesures)
}
