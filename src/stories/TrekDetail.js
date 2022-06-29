export const createTrekDetail = ({ api, language, trekId, colorPrimary, colorPrimaryShade, colorPrimaryTint }) => {
  const container = document.createElement('div');
  const trek = document.createElement('grw-trek-provider');
  trek.setAttribute('api', api);
  trek.setAttribute('language', language);
  trek.setAttribute('trek-id', trekId);
  container.appendChild(trek);
  const detail = document.createElement('grw-trek-detail');
  detail.setAttribute('color-primary', colorPrimary);
  detail.setAttribute('color-primary-shade', colorPrimaryShade);
  detail.setAttribute('color-primary-tint', colorPrimaryTint);
  container.appendChild(detail);
  return container;
};
