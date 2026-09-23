// Script playwright-cli (run-code) : parcours filmé d'une piste (entrée du hero, puis scroll
// progressif jusqu'à la fiche Samba). La piste est lue dans le hash : #piste=a|b|c|d.
async (page) => {
  const piste = (await page.evaluate(() => sessionStorage.getItem('video-piste'))) ?? 'a'
  await page.evaluate(() => sessionStorage.clear())
  await page.goto(`http://localhost:5173/?explorations&layout=${piste}&palette=${piste}&type=${piste}&motion=${piste}&mixeur=0`)
  await page.waitForSelector('#realisation-samba-ad')
  await page.waitForTimeout(2500)
  const cible = await page.evaluate(() => document.querySelector('#realisation-samba-ad').getBoundingClientRect().top + window.scrollY - 90)
  let y = 0
  while (y < cible) {
    const pas = Math.min(90, cible - y)
    await page.mouse.wheel(0, pas)
    y += pas
    await page.waitForTimeout(28)
  }
  await page.waitForTimeout(2500)
  return `${piste}: ${Math.round(cible)} px`
}
