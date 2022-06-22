export const createTreksMap = ({ api }) => {
  const treks = document.createElement('grw-treks-provider');
  treks.setAttribute('api', api);
  const treksMap = document.createElement('grw-map');
  treks.appendChild(treksMap);
  return treks;
};
