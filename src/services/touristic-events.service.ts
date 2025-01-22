import { getAllPaginatedResults } from '../utils/utils';

export function getTouristicEvent(api, language, touristicEventId, init) {
  return fetch(
    `${api}touristicevent/${touristicEventId}/?language=${language}&fields=id,name,attachments,description,description_teaser,type,geometry,cities,pdf,practical_info,contact,email,website,begin_date,end_date&published=true`,
    init,
  );
}

export function getTouristicEventsNearTrek(api, language, trekId, init) {
  return getAllPaginatedResults(`${api}touristicevent/?language=${language}&near_trek=${trekId}&published=true&fields=id,name,attachments,type,geometry`, init);
}

export function getTouristicEventsNearOutdoorSite(api, language, outdoorSiteId, init) {
  return getAllPaginatedResults(`${api}touristicevent/?language=${language}&near_outdoorsite=${outdoorSiteId}&published=true&fields=id,name,attachments,type,geometry`, init);
}

export function getTouristicEventsNearOutdoorCourse(api, language, outdoorCourseId, init) {
  return getAllPaginatedResults(`${api}touristicevent/?language=${language}&near_outdoorcourse=${outdoorCourseId}&published=true&fields=id,name,attachments,type,geometry`, init);
}

export function getTouristicEventType(api, language, portals, init) {
  return getAllPaginatedResults(`${api}touristicevent_type/?language=${language}${portals ? '&portals='.concat(portals) : ''}&published=true&fields=id,type,pictogram`, init);
}

export function getTouristicEventsList(api, language, inBbox, cities, districts, structures, themes, portals, init) {
  let touristicEventsRequest = `${api}touristicevent/?language=${language}&published=true`;

  this.inBbox && (touristicEventsRequest += `&in_bbox=${inBbox}`);
  this.cities && (touristicEventsRequest += `&cities=${cities}`);
  this.districts && (touristicEventsRequest += `&districts=${districts}`);
  this.structures && (touristicEventsRequest += `&structures=${structures}`);
  this.themes && (touristicEventsRequest += `&themes=${themes}`);
  this.portals && (touristicEventsRequest += `&portals=${portals}`);

  touristicEventsRequest += `&fields=id,name,attachments,category,geometry,cities,districts,type,begin_date,end_date`;

  return getAllPaginatedResults(touristicEventsRequest, init);
}
