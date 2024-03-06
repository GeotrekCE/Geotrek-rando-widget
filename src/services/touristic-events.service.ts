export function getTouristicEvent(api, language, touristicEventId, init) {
  fetch(
    `${api}touristicevent/${touristicEventId}/?language=${language}&fields=id,name,attachments,description,description_teaser,type,geometry,cities,pdf,practical_info,contact,email,website,begin_date,end_date&published=true`,
    init,
  );
}

export function getTouristicEventsNearTrek(api, language, trekId, init) {
  return fetch(`${api}touristicevent/?language=${language}&near_trek=${trekId}&published=true&fields=id,name,attachments,type,geometry&page_size=999`, init);
}
