export const createTrekCard = ({ api, trekId }) => {
  const trek = document.createElement('grw-trek-provider');
  trek.setAttribute('api', api);
  trek.setAttribute('trek-id', trekId);
  trek.appendChild(document.createElement('grw-trek-card'));
  return trek;
};
