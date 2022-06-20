export const createTreksList = ({ api }) => {
  const trek = document.createElement('grw-treks-provider');
  trek.setAttribute('api', api);
  trek.appendChild(document.createElement('grw-treks-list'));
  return trek;
};
