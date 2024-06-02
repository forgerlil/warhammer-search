const puppeteer = require('puppeteer');

module.exports = async (url, query) => {
  let browser;
  try {
    console.log(url, query);
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    const inputId = '#search-header';
    await page.waitForSelector(inputId);
    await page.$eval(inputId, (el, query) => (el.value = query), query);
    await page.keyboard.press('Enter');

    // results wrapper
    const resultWrapper = await page.waitForSelector('#dfd-results-Dcm4b');
    console.log(resultWrapper);

    await browser.close();
  } catch (err) {
    console.log(err);
    if (browser) await browser.close();
  }
};
