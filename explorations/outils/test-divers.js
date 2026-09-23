// Script playwright-cli (run-code) : mouvement réduit, nav C (masquage + navAlwaysVisible), URL du mixeur.
async (page) => {
  const r = {}
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('http://localhost:5173/?explorations&layout=b&theme=dark&mixeur=0')
  await page.evaluate(() => sessionStorage.clear())
  await page.reload()
  await page.waitForSelector('[data-boot-etat]')
  r.bootReduit = await page.evaluate(() => document.querySelector('[data-boot-etat]').getAttribute('data-boot-etat'))
  await page.goto('http://localhost:5173/?explorations&layout=d&theme=light&mixeur=0')
  await page.waitForTimeout(600)
  r.ligneDReduite = await page.evaluate(() => document.querySelector('main [aria-hidden="true"] > div')?.style.transform)
  await page.emulateMedia({ reducedMotion: 'no-preference' })

  const navC = async (url) => {
    await page.goto(url)
    await page.waitForTimeout(600)
    for (let y = 0; y <= 1500; y += 150) {
      await page.mouse.wheel(0, 150)
      await page.waitForTimeout(60)
    }
    await page.waitForTimeout(700)
    return page.evaluate(() => getComputedStyle(document.querySelector('header')).opacity)
  }
  r.navCMasqueeAuScroll = (await navC('http://localhost:5173/?explorations&layout=c&theme=light&mixeur=0')) === '0'
  r.navCToujoursVisible = (await navC('http://localhost:5173/?explorations&layout=c&theme=light&mixeur=0&nav=fixe')) === '1'

  await page.goto('http://localhost:5173/?explorations&layout=c&palette=b&type=a&motion=d&theme=dark')
  await page.waitForTimeout(600)
  await page.getByRole('radio', { name: 'D' }).first().check()
  await page.waitForTimeout(200)
  r.urlApresChangementLayout = page.url().replace('http://localhost:5173/', '')
  await page.getByRole('button', { name: /Aligner tous les axes sur la piste : C/ }).click()
  await page.waitForTimeout(200)
  r.urlPistePureC = page.url().replace('http://localhost:5173/', '')
  r.contrastesAffiches = await page.evaluate(() => [...document.querySelectorAll('.mx-contrastes tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ')))
  return JSON.stringify(r, null, 1)
}
