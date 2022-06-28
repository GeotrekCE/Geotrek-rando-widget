export const createTrekCard = ({ api, trekId, colorPrimary, colorPrimaryTint }) => {
  const container = document.createElement('div');
  const trek = document.createElement('grw-trek-provider');
  trek.setAttribute('api', api);
  trek.setAttribute('trek-id', trekId);
  container.appendChild(trek);
  const card = document.createElement('grw-trek-card');
  card.setAttribute('color-primary', colorPrimary);
  card.setAttribute('color-primary-tint', colorPrimaryTint);
  container.appendChild(card);
  return container;
};
