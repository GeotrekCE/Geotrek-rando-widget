export const createTreksList = ({ api }) => {
  const treks = document.createElement('grw-treks-provider');
  treks.setAttribute('api', api);
  treks.appendChild(document.createElement('grw-treks-list'));
  return treks;
};
