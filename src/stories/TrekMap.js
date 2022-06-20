export const createTrekMap = ({ api, trekId, trekLineColor, departureIconColor, arrivalIconColor }) => {
  const trek = document.createElement('grw-trek-provider');
  trek.setAttribute('api', api);
  trek.setAttribute('trek-id', trekId);
  const trekMap = document.createElement('grw-map');
  trekMap.setAttribute('trek-line-color', trekLineColor);
  trekMap.setAttribute('departure-icon-color', departureIconColor);
  trekMap.setAttribute('arrival-icon-color', arrivalIconColor);
  trek.appendChild(trekMap);
  return trek;
};
