import { getDataInStore } from './grw-db.service';
import { SearchParams } from 'types/types';
import { toUrlSearchParams } from 'utils/utils';

const fields : string[] = ['id', 'name', 'geometry', 'period', 'contact', 'practices', 'info_url', 'structure', 'elevation', 'geometry', 'species_id', 'kml_url', 'openair_url', 'attachment', 'rules']

export function getSensitiveAreas(api: string, language: string, inBbox : string, period : string, practices: string, structures: string, init) {
  let requestUrl = `${api}sensitivearea/`;
  const params: SearchParams = {
    language: language,
    no_page: 1,
    fields: fields.toString()
  }
  inBbox && (params.in_bbox = inBbox);
  period && (params.period = period);
  practices && (params.practices = practices);
  structures && (params.structures = structures);

  return fetch(`${requestUrl}?${new URLSearchParams(toUrlSearchParams(params)).toString()}`, init);
}

export function getSensitiveArea(api: string, language: string, itemId: number, init) {
  let requestUrl = `${api}sensitivearea/${itemId}/`;
  const params: SearchParams = {
    language: language,
    no_page: 1,
    published: true,
    fields: fields.toString(),
  }
  return fetch(`${requestUrl}?${new URLSearchParams(toUrlSearchParams(params)).toString()}`, init);
}

export function getSensitivePractices(api: string, language: string, init) {
  let requestUrl = `${api}sensitivearea_practice/`;
  const params: SearchParams = {
    language: language,
  }
  return fetch(`${requestUrl}?${new URLSearchParams(toUrlSearchParams(params)).toString()}`, init);
}

export function getSensitiveSpecies(api: string, language: string, init) {
  let requestUrl = `${api}sensitivearea_species/`;
  const params: SearchParams = {
    language: language,
  }
  return fetch(`${requestUrl}?${new URLSearchParams(toUrlSearchParams(params)).toString()}`, init);
}

export async function sensitiveAreaIsAvailableOffline(itemId) {
  const sensitiveAreas = await getDataInStore('sensitiveAreas', itemId);
  return sensitiveAreas && sensitiveAreas.offline;
}
