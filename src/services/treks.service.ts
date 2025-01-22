import { Build } from '@stencil/core';
import state from 'store/store';
import { getDataInStore } from './grw-db.service';
import { getAllPaginatedResults } from '../utils/utils';

export function getTrekGeometry(id: number) {
  return fetch(`${state.api}trek/${id}/?language=${state.language}&published=true&fields=geometry`, { cache: Build.isDev ? 'force-cache' : 'default' }).then(response =>
    response.json(),
  );
}

export function getTreksList(api, language, inBbox, cities, districts, structures, themes, portals, routes, practices, labels, init) {
  let treksRequest = `${api}trek/?language=${language}&published=true`;

  inBbox && (treksRequest += `&in_bbox=${inBbox}`);
  cities && (treksRequest += `&cities=${cities}`);
  districts && (treksRequest += `&districts=${districts}`);
  structures && (treksRequest += `&structures=${structures}`);
  themes && (treksRequest += `&themes=${themes}`);
  portals && (treksRequest += `&portals=${portals}`);
  routes && (treksRequest += `&routes=${routes}`);
  practices && (treksRequest += `&practices=${practices}`);
  labels && (treksRequest += `&labels=${labels}`);

  treksRequest += `&fields=id,name,attachments,description_teaser,difficulty,duration,ascent,length_2d,practice,themes,route,departure,departure_city,departure_geom,cities,accessibilities,labels,districts`;

  return getAllPaginatedResults(treksRequest, init);
}

export function getTrek(api, language, trekId, init) {
  return fetch(
    `${api}trek/${trekId}/?language=${language}&published=true&fields=id,name,attachments,description,description_teaser,difficulty,duration,ascent,descent,length_2d,practice,themes,route,geometry,gpx,kml,pdf,parking_location,departure,departure_city,arrival,cities,ambiance,access,public_transport,advice,advised_parking,gear,labels,source,points_reference,disabled_infrastructure,accessibility_level,accessibility_slope,accessibility_width,accessibility_signage,accessibility_covering,accessibility_exposure,accessibility_advice,accessibilities,ratings,ratings_description,information_desks,children,networks,web_links,update_datetime,departure_geom,districts,parents`,
    init,
  );
}

export function getDistricts(api, language, init) {
  return getAllPaginatedResults(`${api}district/?language=${language}&fields=id,name&published=true`, init);
}

export async function trekIsAvailableOffline(trekId) {
  const trek = await getDataInStore('treks', trekId);
  return trek && trek.offline;
}

export function getPoisNearTrek(api, language, trekId, init) {
  return getAllPaginatedResults(`${api}poi/?language=${language}&trek=${trekId}&published=true&fields=id,name,description,attachments,type,geometry`, init);
}

export function getSensitiveAreasNearTrek(api, language, trekId, init) {
  return fetch(`${api}sensitivearea/?language=${language}&published=true&trek=${trekId}&period=ignore&fields=id,geometry,name,description,contact,info_url,period,practices`, init);
}

export function getCities(api, language, init) {
  return getAllPaginatedResults(`${api}city/?language=${language}&fields=id,name&published=true`, init);
}

export function getThemes(api, language, portals, init) {
  return fetch(`${api}theme/?language=${language}${portals ? '&portals='.concat(portals) : ''}&fields=id,label,pictogram`, init);
}

export function getInformationsDesks(api, language, init) {
  return getAllPaginatedResults(
    `${api}informationdesk/?language=${language}&fields=id,name,description,type,phone,email,website,municipality,postal_code,street,photo_url,latitude,longitude`,
    init,
  );
}

export function getSources(api, language, init) {
  return fetch(`${api}source/?language=${language}&fields=id,name,website,pictogram`, init);
}

export function getSignages(api, language, trekId, init) {
  return getAllPaginatedResults(`${api}signage/?language=${language}&near_trek=${trekId}&fields=id,geometry,name&published=true`, init);
}

export function getTrekNetwork(api, language, init) {
  return getAllPaginatedResults(`${api}trek_network/?language=${language}&published=true&fields=id,label,pictogram`, init);
}

export function getTrekAccessibility(api: string, language: string, portals: string, init: RequestInit): any {
  return getAllPaginatedResults(`${api}trek_accessibility/?language=${language}${portals ? '&portals='.concat(portals) : ''}&fields=id,name,pictogram&published=true`, init);
}

export function getLabel(api: string, language: string, portals: string, init: RequestInit) {
  return getAllPaginatedResults(`${api}label/?language=${language}${portals ? '&portals='.concat(portals) : ''}&fields=id,name,advice,pictogram,filter&published=true`, init);
}
