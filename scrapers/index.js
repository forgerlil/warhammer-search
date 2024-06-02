const providers = require('../providers.json');

const scraperResult = async (query) => {
  const searchResults = [];

  const pkModule = require('./pk-pro.js');
  const scrapeResults = await pkModule(query);
  searchResults.push(scrapeResults);

  // for (let provider of providers) {
  //   const fileName =
  //     './' + provider.name.toLowerCase().replaceAll(' ', '-') + '.js';
  //   const scraperModule = require(fileName);

  //   const scrapeResults = await scraperModule(provider.url, query);
  //   searchResults.push(scrapeResults);
  // }

  // Sort results from cheapest to most expensive
  // searchResults.sort((a, b) => {
  //   a.price > b.price ? a : b;
  // });

  return searchResults;
};

module.exports = (e, query) => {
  console.log('Hello from the scraper starter');
  return scraperResult(query);
};
