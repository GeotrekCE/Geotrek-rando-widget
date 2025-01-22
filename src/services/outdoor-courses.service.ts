import { getAllPaginatedResults } from '../utils/utils';

export function getOutdoorCourses(api, language, inBbox, cities, districts, structures, themes, portals, init) {
  let outdoorCoursesRequest = `${api}outdoor_course/?language=${language}&published=true`;
  inBbox && (outdoorCoursesRequest += `&in_bbox=${inBbox}`);
  cities && (outdoorCoursesRequest += `&cities=${cities}`);
  districts && (outdoorCoursesRequest += `&districts=${districts}`);
  structures && (outdoorCoursesRequest += `&structures=${structures}`);
  themes && (outdoorCoursesRequest += `&themes=${themes}`);
  portals && (outdoorCoursesRequest += `&portals=${portals}`);

  outdoorCoursesRequest += `&fields=id,name,geometry,accessibility,advice,attachments,children,cities,description,districts,duration,equipment,gear,height,length,max_elevation,min_elevation,parents,pdf,points_reference,provider,ratings,ratings_description,sites,structure,type&page_size=999`;
  return getAllPaginatedResults(outdoorCoursesRequest, init);
}

export function getOutdoorCourse(api, language, outdoorCourseId, init) {
  let outdoorCoursesRequest = `${api}outdoor_course/${outdoorCourseId}/?language=${language}&published=true`;
  outdoorCoursesRequest += `&fields=id,name,geometry,accessibility,advice,attachments,children,cities,description,districts,duration,equipment,gear,height,length,max_elevation,min_elevation,parents,pdf,points_reference,provider,ratings,ratings_description,sites,structure,type`;
  return fetch(outdoorCoursesRequest, init);
}

export function getOutdoorCourseTypes(api, language, init) {
  let outdoorCoursesTypeRequest = `${api}outdoor_coursetype/?language=${language}&published=true`;
  return fetch(outdoorCoursesTypeRequest, init);
}

export function getPoisNearCourse(api, language, courseId, init) {
  return getAllPaginatedResults(`${api}poi/?language=${language}&courses=${courseId}&published=true&fields=id,name,description,attachments,type,geometry&page_size=999`, init);
}
