import init from './init.js';
import providerData from '../providers.json' assert { type: 'json' };
import * as sanitize from '../utils/sanitize.js';

const logEl = document.getElementById('logger');
document.getElementById('logger-clear').addEventListener('click', () => {
  logEl.textContent = '';
});

const log = (logged) => {
  logEl.innerHTML += `${logged}<br>`;
};

const providers = async () => providerData;

providers().then((data) => init(data));

const search = async (e) => {
  e.preventDefault();
  const input = e.target.children[0].value.trim();
  const results = document.querySelector('#results');

  // console.log(sanitize(input));

  if (!input) {
    const dialog = document.querySelector('dialog');
    const dialogTitle = document.querySelector('#modal-title');
    dialogTitle.textContent = 'Invalid input';
    const dialogMsg = document.querySelector('#modal-msg');
    dialogMsg.textContent = 'Please add something to search for';
    dialog.showModal();
    return;
  }

  results.innerHTML =
    '<span class="loading loading-dots loading-lg mx-auto"></span>';

  log(input);

  const data = await window.scrape.search(input);
  // const data = await providers();
  console.log('what renderer received', data);

  results.innerHTML = '';
  data.forEach((provider) => {
    const a = document.createElement('a');
    a.href = provider.itemUrl;
    a.target = '_blank';
    a.classList.add(
      'card',
      'card-side',
      'w-full',
      'max-h-[150px]',
      'bg-base-100',
      'shadow-xl',
      'transition-all',
      'hover:scale-[1.02]',
      'relative'
    );

    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = provider.src;
    img.alt = provider.alt;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('div');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = provider.name;

    const itemTitle = document.createElement('p');
    // TODO: Swap this value for scraped title from platform
    itemTitle.textContent = provider.itemTitle;

    const itemPrice = document.createElement('p');
    // TODO: Swap this value for scraped price from platform
    itemPrice.textContent = `€${provider.price}`;

    figure.appendChild(img);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(itemTitle);
    cardBody.appendChild(itemPrice);
    a.appendChild(figure);

    if (!provider.inStock) {
      const badge = document.createElement('div');
      badge.classList.add(
        'badge',
        'badge-error',
        'absolute',
        'top-4',
        'right-4'
      );
      badge.textContent = 'Not in stock';
      a.appendChild(badge);
    }

    a.appendChild(cardBody);
    results.appendChild(a);
  });
};

document.querySelector('form').addEventListener('submit', search);
