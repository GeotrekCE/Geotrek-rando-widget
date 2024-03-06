import { Build } from '@stencil/core';
import state from 'store/store';
import { getDataInStore } from './grw-db.service';

export function getTrekGeometry(id: number) {
  return fetch(`${state.api}trek/${id}/?language=${state.language}&published=true&fields=geometry`, { cache: Build.isDev ? 'force-cache' : 'default' }).then(response =>
    response.json(),
  );
}

export function getTreksList(api, language, inBbox, cities, districts, structures, themes, portals, routes, practices, init) {
  let treksRequest = `${api}trek/?language=${language}&published=true`;

  inBbox && (treksRequest += `&in_bbox=${inBbox}`);
  cities && (treksRequest += `&cities=${cities}`);
  districts && (treksRequest += `&districts=${districts}`);
  structures && (treksRequest += `&structures=${structures}`);
  themes && (treksRequest += `&themes=${themes}`);
  portals && (treksRequest += `&portals=${portals}`);
  routes && (treksRequest += `&routes=${routes}`);
  practices && (treksRequest += `&practices=${practices}`);

  treksRequest += `&fields=id,name,attachments,description_teaser,difficulty,duration,ascent,length_2d,practice,themes,route,departure,departure_city,departure_geom,cities,accessibilities,labels,districts&page_size=999`;

  return fetch(treksRequest, init);
}

export function getTrek(api, language, trekId, init) {
  return fetch(
    `${api}trek/${trekId}/?language=${language}&published=true&fields=id,name,attachments,description,description_teaser,difficulty,duration,ascent,descent,length_2d,practice,themes,route,geometry,gpx,kml,pdf,parking_location,departure,departure_city,arrival,cities,ambiance,access,public_transport,advice,advised_parking,gear,labels,source,points_reference,disabled_infrastructure,accessibility_level,accessibility_slope,accessibility_width,accessibility_signage,accessibility_covering,accessibility_exposure,accessibility_advice,accessibilities,ratings,ratings_description,information_desks,children,networks,web_links,update_datetime,departure_geom,districts`,
    init,
  );
}

export function getDistricts(api, language, init) {
  return fetch(`${api}district/?language=${language}&fields=id,name&published=true&page_size=999`, init);
}

export async function trekIsAvailableOffline(trekId) {
  const trek = await getDataInStore('treks', trekId);
  return trek && trek.offline;
}
