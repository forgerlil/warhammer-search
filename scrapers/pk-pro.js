const puppeteer = require('puppeteer');

module.exports = async (url, query) => {
  let browser;
  try {
    console.log(url, query);
    const formatQuery = query.trim().toLowerCase().replaceAll(' ', '+');
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.pk-pro.de/search/?qs=${formatQuery}`);
    await page.setViewport({ width: 1080, height: 1024 });

    // const inputId = '#search-header-mobile-top';
    // await page.waitForSelector(inputId);
    // const input = await page.$(inputId);
    // await page.$eval(inputId, (el, query) => (el.value = query), query);
    // await input.evaluate((el) => el.nextElementSibling.children[0]?.click());

    let itemUrl = page.url();

    if (itemUrl.includes('search/?qs')) {
      const resultWrapper = await page.waitForSelector('#product-list');
      await resultWrapper.evaluate((el) => {
        const isRibbon =
          el.children[0]?.children[0]?.children[1]?.children[2]?.children[0]
            ?.children[0]?.children[0]?.children[0];
        if (isRibbon.classList.contains('ribbon')) {
          isRibbon.nextElementSibling.children[0].click();
        } else {
          isRibbon.children[0].click();
        }
      });
    }

    await page.waitForSelector('h1');
    itemUrl = page.url();
    const titleEl = await page.$('h1');
    const itemTitle = await titleEl.evaluate((el) => el.innerHTML);
    // console.log(itemTitle);

    const img = await page.$('.product-image');
    const imgSrc = await img.evaluate((el) => ({ src: el.src, alt: el.alt }));
    const priceEl = await page.$('.price > span');
    const price = await priceEl.evaluate((el) =>
      el.textContent.trim().slice(0, 5).trim()
    );
    const stockEl = await page.$('.status');
    const oos = await stockEl.evaluate((el) =>
      el.classList.contains('status-0')
    );

    await browser.close();
    return {
      name: 'PK-Pro',
      itemUrl,
      itemTitle,
      ...imgSrc,
      price,
      inStock: !oos,
    };
  } catch (err) {
    console.log(err);
    if (browser) await browser.close();
  }
};
