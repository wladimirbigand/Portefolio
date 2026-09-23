// Script playwright-cli (run-code) : vérifie la séquence de boot de la piste B.
async (page) => {
  const url = 'http://localhost:5173/?explorations&layout=b&theme=dark&mixeur=0'
  const etat = () => page.evaluate(() => document.querySelector('[data-boot-etat]')?.getAttribute('data-boot-etat'))
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto(url)
  await page.evaluate(() => sessionStorage.clear())
  await page.goto(url)
  const t0 = Date.now()
  const premier = await etat()
  let fin = null
  while (Date.now() - t0 < 3000) {
    if ((await etat()) === 'termine') { fin = Date.now() - t0; break }
    await page.waitForTimeout(40)
  }
  await page.evaluate(() => sessionStorage.clear())
  await page.goto(url)
  await page.waitForTimeout(150)
  const avant = await etat()
  await page.keyboard.press('Shift')
  await page.waitForTimeout(40)
  const apres = await etat()
  const opaciteH1 = await page.evaluate(() => getComputedStyle(document.querySelector('h1')).opacity)
  await page.reload()
  await page.waitForSelector("[data-boot-etat]")
  const rechargement = await etat()
  return JSON.stringify({ premier, dureeNaturelleMs: fin, avantInterruption: avant, apresTouche: apres, opaciteH1, apresRechargement: rechargement })
}
