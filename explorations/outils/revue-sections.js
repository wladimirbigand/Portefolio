// Script playwright-cli (run-code) : captures de revue des sections Réalisations et Fiche,
// piste pure, 1920×1080, thème clair. Sortie dans le dossier de travail (scratchpad).
async (page) => {
  const sortie =
    'C:/Users/scorp/AppData/Local/Temp/claude/c--Users-scorp-Documents-1Portefolio/776157b5-c1b3-4051-bd0c-ade09c76240e/scratchpad/revue'
  await page.setViewportSize({ width: 1920, height: 1080 })
  for (const piste of ['a', 'b', 'c', 'd']) {
    await page.goto(
      `http://localhost:5173/?explorations&layout=${piste}&palette=${piste}&type=${piste}&motion=${piste}&theme=light&mixeur=0`,
    )
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(1300)
    for (const [nom, selecteur] of [
      ['realisations', '#realisations'],
      ['fiche', '#realisation-samba-ad'],
    ]) {
      await page.locator(selecteur).scrollIntoViewIfNeeded()
      await page.evaluate(
        (s) => document.querySelector(s)?.scrollIntoView({ block: 'start', behavior: 'instant' }),
        selecteur,
      )
      await page.waitForTimeout(1500)
      await page.screenshot({ path: `${sortie}/${piste}-${nom}.png` })
    }
  }
  return 'ok'
}
