export function getTouristicContent(api, language, touristicContentId, init) {
  return fetch(
    `${api}touristiccontent/${touristicContentId}/?language=${language}&published=true&fields=id,name,attachments,description,description_teaser,category,geometry,cities,pdf,practical_info,contact,email,website,districts`,
    init,
  );
}

export function getTouristicContentsNearTrek(api, language, trekId, init) {
  return fetch(
    `${api}touristiccontent/?language=${language}&near_trek=${trekId}&published=true&fields=id,name,attachments,description,description_teaser,category,geometry,cities,pdf,practical_info,contact,email,website,districts&page_size=999`,
    init,
  );
}

export function getTouristicContentsNearOutdoorSite(api, language, outdoorSiteId, init) {
  return fetch(
    `${api}touristiccontent/?language=${language}&near_outdoorsite=${outdoorSiteId}&published=true&fields=id,name,attachments,description,description_teaser,category,geometry,cities,pdf,practical_info,contact,email,website,districts&page_size=999`,
    init,
  );
}

export function getTouristicContentsNearOutdoorCourse(api, language, outdoorCourseId, init) {
  return fetch(
    `${api}touristiccontent/?language=${language}&near_outdoorcourse=${outdoorCourseId}&published=true&fields=id,name,attachments,description,description_teaser,category,geometry,cities,pdf,practical_info,contact,email,website,districts&page_size=999`,
    init,
  );
}
