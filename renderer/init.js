export default (providers) => {
  const badgeDisplay = document.querySelector('#provider-list');

  providers.forEach((provider) => {
    const badge = document.createElement('div');
    badge.classList.add('badge', 'badge-accent');
    badge.textContent = provider.name;
    badgeDisplay.appendChild(badge);
  });
};
