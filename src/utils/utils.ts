import state from 'store/store';
import { TouristicContents, TouristicContentsFilters, TrekFilters, Treks } from 'types/types';

export function formatDuration(duration: number) {
  let formattedDuration;
  if (duration < 24) {
    formattedDuration = `${Math.floor(duration)}h`;
    if (duration % 1 > 0) {
      formattedDuration += `${Math.round(60 * (duration % 1))}min`;
    }
  } else {
    formattedDuration = `${duration / 24}j`;
  }
  return formattedDuration;
}

export function formatLength(length: number) {
  return `${Math.round(length / 1000)}km`;
}

export function formatAscent(ascent: number) {
  return `${ascent}m`;
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

  const searchTreks = isUsingFilter ? filtersTreks : state.treks;
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
