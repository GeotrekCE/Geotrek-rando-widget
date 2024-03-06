import { getDataInStore } from 'services/grw-db.service';
import state from 'store/store';
import { TouristicContents, TouristicContentsFilters, TouristicEvents, TouristicEventsFilters, TrekFilters, Treks } from 'types/types';

export function formatDuration(duration: number) {
  let formattedDuration = '';
  if (duration < 24) {
    if (Math.floor(duration) !== 0) {
      formattedDuration += `${Math.floor(duration)}h`;
    }
    if (duration % 1 > 0) {
      formattedDuration += `${Math.round(60 * (duration % 1))}min`;
    }
  } else {
    formattedDuration += `${Math.round(duration / 24)}j`;
  }
  return formattedDuration;
}

export function formatLength(length: number) {
  return `${Math.round(length / 1000)}km`;
}

export function formatAscent(ascent: number) {
  return `+${ascent}m`;
}

export function formatDescent(descent: number) {
  return `${descent}m`;
}

export const treksFilters: TrekFilters = [
  { property: 'practices', trekProperty: 'practice', trekPropertyIsArray: false, type: 'include', segment: 'selectedActivitiesFilters' },
  { property: 'difficulties', trekProperty: 'difficulty', trekPropertyIsArray: false, type: 'include', segment: 'selectedActivitiesFilters' },
  { property: 'durations', trekProperty: 'duration', trekPropertyIsArray: false, type: 'interval', segment: 'selectedActivitiesFilters' },
  { property: 'lengths', trekProperty: 'length_2d', trekPropertyIsArray: false, type: 'interval', segment: 'selectedActivitiesFilters' },
  { property: 'elevations', trekProperty: 'ascent', trekPropertyIsArray: false, type: 'interval', segment: 'selectedActivitiesFilters' },
  { property: 'routes', trekProperty: 'route', trekPropertyIsArray: false, type: 'include', segment: 'selectedActivitiesFilters' },
  { property: 'accessibilities', trekProperty: 'accessibilities', trekPropertyIsArray: true, type: 'include', segment: 'selectedActivitiesFilters' },
  { property: 'labels', trekProperty: 'labels', trekPropertyIsArray: true, type: 'include', segment: 'selectedActivitiesFilters' },
  { property: 'themes', trekProperty: 'themes', trekPropertyIsArray: true, type: 'include', segment: 'selectedThemesFilters' },
  { property: 'cities', trekProperty: 'cities', trekPropertyIsArray: true, type: 'include', segment: 'selectedLocationFilters' },
  { property: 'districts', trekProperty: 'districts', trekPropertyIsArray: true, type: 'include', segment: 'selectedLocationFilters' },
];

export const touristicContentsFilters: TouristicContentsFilters = [
  { property: 'touristicContentCategories', touristicContentProperty: 'category', touristicContentPropertyIsArray: false, type: 'include', segment: 'selectedActivitiesFilters' },
  { property: 'cities', touristicContentProperty: 'cities', touristicContentPropertyIsArray: true, type: 'include', segment: 'selectedLocationFilters' },
  { property: 'districts', touristicContentProperty: 'districts', touristicContentPropertyIsArray: true, type: 'include', segment: 'selectedLocationFilters' },
];

export const touristicEventsFilters: TouristicEventsFilters = [
  { property: 'touristicEventTypes', touristicEventProperty: 'type', touristicEventPropertyIsArray: false, type: 'include', segment: 'selectedActivitiesFilters' },
  { property: 'cities', touristicEventProperty: 'cities', touristicEventPropertyIsArray: true, type: 'include', segment: 'selectedLocationFilters' },
  { property: 'districts', touristicEventProperty: 'districts', touristicEventPropertyIsArray: true, type: 'include', segment: 'selectedLocationFilters' },
];

export function handleTreksFiltersAndSearch(): Treks {
  let isUsingFilter = false;
  let filtersTreks = [];
  for (const filter of treksFilters) {
    const currentFiltersId: number[] = state[filter.property].filter(currentFilter => currentFilter.selected).map(currentFilter => currentFilter.id);
    if (currentFiltersId.length > 0) {
      if (filtersTreks.length > 0) {
        if (filter.type === 'include') {
          if (filter.trekPropertyIsArray) {
            filtersTreks = [...filtersTreks.filter(trek => trek[filter.trekProperty].some(trekProperty => currentFiltersId.includes(trekProperty)))];
          } else {
            filtersTreks = [...filtersTreks.filter(trek => currentFiltersId.includes(trek[filter.trekProperty]))];
          }
        } else if (filter.type === 'interval') {
          filtersTreks = [
            ...filtersTreks.filter(trek => {
              for (const currentFilterId of currentFiltersId) {
                const currentFilter = state[filter.property].find(property => property.id === currentFilterId);
                if (trek[filter.trekProperty] >= currentFilter.minValue && trek[filter.trekProperty] <= currentFilter.maxValue) {
                  return true;
                }
              }
              return false;
            }),
          ];
        }
      } else {
        if (!isUsingFilter) {
          isUsingFilter = true;
        }
        if (filter.type === 'include') {
          if (filter.trekPropertyIsArray) {
            filtersTreks = [...state.treks.filter(trek => trek[filter.trekProperty].some(trekProperty => currentFiltersId.includes(trekProperty)))];
          } else {
            filtersTreks = [...state.treks.filter(trek => currentFiltersId.includes(trek[filter.trekProperty]))];
          }
        } else if (filter.type === 'interval') {
          let minValue: number;
          let maxValue: number;
          for (const currentFilterId of currentFiltersId) {
            const currentFilter = state[filter.property].find(property => property.id === currentFilterId);
            if (isNaN(minValue) || currentFilter.minValue < minValue) {
              minValue = currentFilter.minValue;
            }
            if (isNaN(maxValue) || currentFilter.maxValue > maxValue) {
              maxValue = currentFilter.maxValue;
            }
          }
          filtersTreks = [...state.treks.filter(trek => trek[filter.trekProperty] >= minValue && trek[filter.trekProperty] <= maxValue)];
        }
      }
    }
  }

  let searchTreks = isUsingFilter ? filtersTreks : state.treks;
  searchTreks = searchTreks.filter(trek => !state.offlineTreks || (state.offlineTreks && trek.offline));

  return Boolean(state.searchValue) ? searchTreks.filter(currentTrek => currentTrek.name.toLowerCase().includes(state.searchValue.toLowerCase())) : searchTreks;
}

export function handleTouristicContentsFiltersAndSearch(): TouristicContents {
  let isUsingFilter = false;
  let filtersTouristicContents = [];
  for (const filter of touristicContentsFilters) {
    const currentFiltersId: number[] = state[filter.property].filter(currentFilter => currentFilter.selected).map(currentFilter => currentFilter.id);

    if (currentFiltersId.length > 0) {
      if (filtersTouristicContents.length > 0) {
        if (filter.type === 'include') {
          if (filter.touristicContentPropertyIsArray) {
            filtersTouristicContents = [
              ...filtersTouristicContents.filter(touristicContent =>
                touristicContent[filter.touristicContentProperty].some(touristicContentProperty => currentFiltersId.includes(touristicContentProperty)),
              ),
            ];
          } else {
            filtersTouristicContents = [...filtersTouristicContents.filter(touristicContent => currentFiltersId.includes(touristicContent[filter.touristicContentProperty]))];
          }
        } else if (filter.type === 'interval') {
          filtersTouristicContents = [
            ...filtersTouristicContents.filter(touristicContent => {
              for (const currentFilterId of currentFiltersId) {
                const currentFilter = state[filter.property].find(property => property.id === currentFilterId);
                if (touristicContent[filter.touristicContentProperty] >= currentFilter.minValue && touristicContent[filter.touristicContentProperty] <= currentFilter.maxValue) {
                  return true;
                }
              }
              return false;
            }),
          ];
        }
      } else {
        if (!isUsingFilter) {
          isUsingFilter = true;
        }
        if (filter.type === 'include') {
          if (filter.touristicContentPropertyIsArray) {
            filtersTouristicContents = [
              ...state.touristicContents.filter(touristicContent =>
                touristicContent[filter.touristicContentProperty].some(touristicContentProperty => currentFiltersId.includes(touristicContentProperty)),
              ),
            ];
          } else {
            filtersTouristicContents = [...state.touristicContents.filter(touristicContent => currentFiltersId.includes(touristicContent[filter.touristicContentProperty]))];
          }
        } else if (filter.type === 'interval') {
          let minValue: number;
          let maxValue: number;
          for (const currentFilterId of currentFiltersId) {
            const currentFilter = state[filter.property].find(property => property.id === currentFilterId);
            if (isNaN(minValue) || currentFilter.minValue < minValue) {
              minValue = currentFilter.minValue;
            }
            if (isNaN(maxValue) || currentFilter.maxValue > maxValue) {
              maxValue = currentFilter.maxValue;
            }
          }
          filtersTouristicContents = [
            ...state.touristicContents.filter(
              touristicContent => touristicContent[filter.touristicContentProperty] >= minValue && touristicContent[filter.touristicContentProperty] <= maxValue,
            ),
          ];
        }
      }
    }
  }
  const searchTouristicContents = isUsingFilter ? filtersTouristicContents : state.touristicContents;
  return Boolean(state.searchValue)
    ? searchTouristicContents.filter(currentTouristicContents => currentTouristicContents.name.toLowerCase().includes(state.searchValue.toLowerCase()))
    : searchTouristicContents;
}

export function handleTouristicEventsFiltersAndSearch(): TouristicEvents {
  let isUsingFilter = false;
  let filtersTouristicEvents = [];
  for (const filter of touristicEventsFilters) {
    const currentFiltersId: number[] = state[filter.property].filter(currentFilter => currentFilter.selected).map(currentFilter => currentFilter.id);

    if (currentFiltersId.length > 0) {
      if (filtersTouristicEvents.length > 0) {
        if (filter.type === 'include') {
          if (filter.touristicEventPropertyIsArray) {
            filtersTouristicEvents = [
              ...filtersTouristicEvents.filter(touristicEvent =>
                touristicEvent[filter.touristicEventProperty].some(touristicEventProperty => currentFiltersId.includes(touristicEventProperty)),
              ),
            ];
          } else {
            filtersTouristicEvents = [...filtersTouristicEvents.filter(touristicEvent => currentFiltersId.includes(touristicEvent[filter.touristicEventProperty]))];
          }
        } else if (filter.type === 'interval') {
          filtersTouristicEvents = [
            ...filtersTouristicEvents.filter(touristicEvent => {
              for (const currentFilterId of currentFiltersId) {
                const currentFilter = state[filter.property].find(property => property.id === currentFilterId);
                if (touristicEvent[filter.touristicEventProperty] >= currentFilter.minValue && touristicEvent[filter.touristicEventProperty] <= currentFilter.maxValue) {
                  return true;
                }
              }
              return false;
            }),
          ];
        }
      } else {
        if (!isUsingFilter) {
          isUsingFilter = true;
        }
        if (filter.type === 'include') {
          if (filter.touristicEventPropertyIsArray) {
            filtersTouristicEvents = [
              ...state.touristicEvents.filter(touristicEvent =>
                touristicEvent[filter.touristicEventProperty].some(touristicEventProperty => currentFiltersId.includes(touristicEventProperty)),
              ),
            ];
          } else {
            filtersTouristicEvents = [...state.touristicEvents.filter(touristicEvent => currentFiltersId.includes(touristicEvent[filter.touristicEventProperty]))];
          }
        } else if (filter.type === 'interval') {
          let minValue: number;
          let maxValue: number;
          for (const currentFilterId of currentFiltersId) {
            const currentFilter = state[filter.property].find(property => property.id === currentFilterId);
            if (isNaN(minValue) || currentFilter.minValue < minValue) {
              minValue = currentFilter.minValue;
            }
            if (isNaN(maxValue) || currentFilter.maxValue > maxValue) {
              maxValue = currentFilter.maxValue;
            }
          }
          filtersTouristicEvents = [
            ...state.touristicEvents.filter(
              touristicEvent => touristicEvent[filter.touristicEventProperty] >= minValue && touristicEvent[filter.touristicEventProperty] <= maxValue,
            ),
          ];
        }
      }
    }
  }

  const searchTouristicEvents = isUsingFilter ? filtersTouristicEvents : state.touristicEvents;
  return Boolean(state.searchValue)
    ? searchTouristicEvents.filter(currentTouristicEvent => currentTouristicEvent.name.toLowerCase().includes(state.searchValue.toLowerCase()))
    : searchTouristicEvents;
}

export const durations = [
  { id: 1, name: '0 - 1h', minValue: 0, maxValue: 1, selected: false },
  { id: 2, name: '1 - 2h', minValue: 1, maxValue: 2, selected: false },
  { id: 3, name: '2 - 5h', minValue: 2, maxValue: 5, selected: false },
  { id: 4, name: '5 - 10h', minValue: 5, maxValue: 10, selected: false },
];

export const lengths = [
  { id: 1, name: '0 - 5km', minValue: 0, maxValue: 5000, selected: false },
  { id: 2, name: '5 - 10km', minValue: 5000, maxValue: 10000, selected: false },
  { id: 3, name: '10 - 15km', minValue: 10000, maxValue: 15000, selected: false },
  { id: 4, name: '15 - 50km', minValue: 15000, maxValue: 50000, selected: false },
];

export const elevations = [
  { id: 1, name: '0 - 500m', minValue: 0, maxValue: 500, selected: false },
  { id: 2, name: '500m - 1km', minValue: 500, maxValue: 1000, selected: false },
];

export function blobToArrayBuffer(blob): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', () => {
      resolve(reader.result);
    });
    reader.addEventListener('error', reject);
    reader.readAsArrayBuffer(blob);
  });
}

export function arrayBufferToBlob(buffer, type) {
  return new Blob([buffer], { type: type });
}

export function getFilesToStore(value: Object, regExp: RegExp, onlyFirstArrayFile = false): string[] {
  const filesToStore: any[] = [];
  for (const keyValue of Object.keys(value)) {
    if (value[keyValue]) {
      if (typeof value[keyValue] === 'object' && (!Array.isArray(value[keyValue]) || !onlyFirstArrayFile)) {
        filesToStore.push(...getFilesToStore(value[keyValue], regExp));
      } else if (typeof value[keyValue] === 'string' && regExp.test(value[keyValue].toLowerCase())) {
        filesToStore.push(value[keyValue]);
      } else if (typeof value[keyValue] === 'object' && Array.isArray(value[keyValue]) && onlyFirstArrayFile && value[keyValue].length > 0) {
        filesToStore.push(...getFilesToStore(value[keyValue][0], regExp));
      }
    }
  }

  return [...new Set(filesToStore)];
}

export async function setFilesFromStore(value: Object, regExp: RegExp) {
  for (const keyValue of Object.keys(value)) {
    if (value[keyValue]) {
      if (typeof value[keyValue] === 'object') {
        setFilesFromStore(value[keyValue], regExp);
      } else if (typeof value[keyValue] === 'string' && regExp.test(value[keyValue].toLowerCase())) {
        const image = await getDataInStore('images', value[keyValue]);
        if (image) {
          value[keyValue] = window.URL.createObjectURL(arrayBufferToBlob(image.data, image.type));
        }
      }
    }
  }
}

export const imagesRegExp = new RegExp('^(http(s)?://|www.).*(.png|.jpg|.jpeg|.svg)$');
