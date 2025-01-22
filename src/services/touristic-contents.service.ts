import { getAllPaginatedResults } from '../utils/utils';

export function getTouristicContents(api, language, init) {
  return fetch(
    `${api}touristiccontent/?language=${language}&published=true&fields=id,name,attachments,description,description_teaser,category,geometry,cities,pdf,practical_info,contact,email,website,districts`,
    init,
  );
}

export function getTouristicContent(api, language, touristicContentId, init) {
  return fetch(
    `${api}touristiccontent/${touristicContentId}/?language=${language}&published=true&fields=id,name,attachments,description,description_teaser,category,geometry,cities,pdf,practical_info,contact,email,website,districts`,
    init,
  );
}

export function getTouristicContentsNearTrek(api, language, trekId, init) {
  return getAllPaginatedResults(
    `${api}touristiccontent/?language=${language}&near_trek=${trekId}&published=true&fields=id,name,attachments,description,description_teaser,category,geometry,cities,pdf,practical_info,contact,email,website,districts`,
    init,
  );
}

export function getTouristicContentsNearOutdoorSite(api, language, outdoorSiteId, init) {
  return getAllPaginatedResults(
    `${api}touristiccontent/?language=${language}&near_outdoorsite=${outdoorSiteId}&published=true&fields=id,name,attachments,description,description_teaser,category,geometry,cities,pdf,practical_info,contact,email,website,districts`,
    init,
  );
}

export function getTouristicContentsNearOutdoorCourse(api, language, outdoorCourseId, init) {
  return getAllPaginatedResults(
    `${api}touristiccontent/?language=${language}&near_outdoorcourse=${outdoorCourseId}&published=true&fields=id,name,attachments,description,description_teaser,category,geometry,cities,pdf,practical_info,contact,email,website,districts`,
    init,
  );
}

export function getTouristicContentCategory(api, language, portals, init) {
  return getAllPaginatedResults(
    `${api}touristiccontent_category/?language=${language}${portals ? '&portals='.concat(portals) : ''}&published=true&fields=id,label,pictogram`,
    init,
  );
}

export function getTouristicContentsList(api, language, inBbox, cities, districts, structures, themes, portals, init) {
  let touristicContentsRequest = `${api}touristiccontent/?language=${language}&published=true`;

  inBbox && (touristicContentsRequest += `&in_bbox=${inBbox}`);
  cities && (touristicContentsRequest += `&cities=${cities}`);
  districts && (touristicContentsRequest += `&districts=${districts}`);
  structures && (touristicContentsRequest += `&structures=${structures}`);
  themes && (touristicContentsRequest += `&themes=${themes}`);
  portals && (touristicContentsRequest += `&portals=${portals}`);

  touristicContentsRequest += `&fields=id,name,attachments,category,geometry,cities,districts`;

  return getAllPaginatedResults(touristicContentsRequest, init);
}
