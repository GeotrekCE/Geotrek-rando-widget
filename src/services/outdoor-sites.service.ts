import { getDataInStore } from './grw-db.service';
import { getAllPaginatedResults, normalizeIds } from '../utils/utils';

export function getOutdoorSites(api, language, inBbox, cities, districts, structures, themes, portals, outdoorPractices, ids, init) {
  let outdoorSitesRequest = `${api}outdoor_site/?language=${language}&published=true`;
  const normalizedIds = normalizeIds(ids);

  if (normalizedIds) {
    outdoorSitesRequest += `&ids=${normalizedIds}`;
  } else {
    outdoorSitesRequest += `&root_sites_only=true`;
    inBbox && (outdoorSitesRequest += `&in_bbox=${inBbox}`);
    cities && (outdoorSitesRequest += `&cities=${cities}`);
    districts && (outdoorSitesRequest += `&districts=${districts}`);
    structures && (outdoorSitesRequest += `&structures=${structures}`);
    themes && (outdoorSitesRequest += `&themes=${themes}`);
    portals && (outdoorSitesRequest += `&portals=${portals}`);
    outdoorPractices && (outdoorSitesRequest += `&practices_in_hierarchy=${outdoorPractices}`);
  }

  outdoorSitesRequest += `&fields=id,name,geometry,accessibility,advice,ambiance,attachments,cities,children,description,description_teaser,districts,information_desks,labels,managers,orientation,pdf,period,parent,portal,practice,provider,ratings,sector,source,structure,themes,view_points,type,courses,web_links,wind`;
  return getAllPaginatedResults(outdoorSitesRequest, init);
}

export function getOutdoorSite(api, language, outdoorSiteId, init) {
  let outdoorSitesRequest = `${api}outdoor_site/${outdoorSiteId}/?language=${language}&published=true`;
  outdoorSitesRequest += `&fields=id,name,geometry,accessibility,advice,ambiance,attachments,cities,children,description,description_teaser,districts,information_desks,labels,managers,orientation,pdf,period,parent,portal,practice,provider,ratings,sector,source,structure,themes,view_points,type,courses,web_links,wind,parents`;
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
  return getAllPaginatedResults(`${api}poi/?language=${language}&sites=${siteId}&published=true&fields=id,name,description,attachments,type,geometry`, init);
}

export async function outdoorSiteIsAvailableOffline(outdoorSiteId) {
  const outdoorSites = await getDataInStore('outdoorSites', outdoorSiteId);
  return outdoorSites && outdoorSites.offline;
}

export function getOutdoorRatings(api: string, language: string, portals: string, init: RequestInit) {
  return getAllPaginatedResults(`${api}outdoor_rating/?language=${language}${portals ? '&portals='.concat(portals) : ''}&fields=id,name,scale`, init);
}

export function getOutdoorRatingsScale(api: string, language: string, init: RequestInit) {
  return getAllPaginatedResults(`${api}outdoor_ratingscale/?language=${language}&fields=id,name`, init);
}

