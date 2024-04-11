export function getOutdoorSites(api, language, inBbox, cities, districts, structures, themes, portals, init) {
  let outdoorSitesRequest = `${api}outdoor_site/?language=${language}&root_sites_only=true&published=true`;
  inBbox && (outdoorSitesRequest += `&in_bbox=${inBbox}`);
  cities && (outdoorSitesRequest += `&cities=${cities}`);
  districts && (outdoorSitesRequest += `&districts=${districts}`);
  structures && (outdoorSitesRequest += `&structures=${structures}`);
  themes && (outdoorSitesRequest += `&themes=${themes}`);
  portals && (outdoorSitesRequest += `&portals=${portals}`);

  outdoorSitesRequest += `&fields=id,name,geometry,accessibility,advice,ambiance,attachments,cities,children,description,description_teaser,districts,information_desks,labels,managers,orientation,pdf,period,parent,portal,practice,provider,ratings,sector,source,structure,themes,view_points,type,courses,web_links,wind&page_size=999`;
  return fetch(outdoorSitesRequest, init);
}

export function getOutdoorSite(api, language, outdoorSiteId, init) {
  let outdoorSitesRequest = `${api}outdoor_site/${outdoorSiteId}/?language=${language}&published=true`;
  outdoorSitesRequest += `&fields=id,name,geometry,accessibility,advice,ambiance,attachments,cities,children,description,description_teaser,districts,information_desks,labels,managers,orientation,pdf,period,parent,portal,practice,provider,ratings,sector,source,structure,themes,view_points,type,courses,web_links,wind&page_size=999`;
  return fetch(outdoorSitesRequest, init);
}

export function getOutdoorSiteTypes(api, language, init) {
  let outdoorSitesTypeRequest = `${api}outdoor_sitetype/?language=${language}&published=true`;
  return fetch(outdoorSitesTypeRequest, init);
}

export function getOutdoorPractices(api, language, init) {
  let outdoorPracticesRequest = `${api}outdoor_practice/?language=${language}&published=true`;
  return fetch(outdoorPracticesRequest, init);
}

export function getPoisNearSite(api, language, siteId, init) {
  return fetch(`${api}poi/?language=${language}&sites=${siteId}&published=true&fields=id,name,description,attachments,type,geometry&page_size=999`, init);
}
