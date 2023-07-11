import state from 'store/store';
import { Filters, Treks } from 'types/types';

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

export function handleFiltersAndSearch(): Treks {
  const filters: Filters = [
    { property: 'practices', trekProperty: 'practice', trekPropertyIsArray: false, type: 'include' },
    { property: 'difficulties', trekProperty: 'difficulty', trekPropertyIsArray: false, type: 'include' },
    { property: 'durations', trekProperty: 'duration', trekPropertyIsArray: false, type: 'interval' },
    { property: 'lengths', trekProperty: 'length_2d', trekPropertyIsArray: false, type: 'interval' },
    { property: 'elevations', trekProperty: 'ascent', trekPropertyIsArray: false, type: 'interval' },
    { property: 'themes', trekProperty: 'themes', trekPropertyIsArray: true, type: 'include' },
    { property: 'routes', trekProperty: 'route', trekPropertyIsArray: false, type: 'include' },
    { property: 'accessibilities', trekProperty: 'accessibilities', trekPropertyIsArray: true, type: 'include' },
    { property: 'cities', trekProperty: 'cities', trekPropertyIsArray: true, type: 'include' },
    { property: 'labels', trekProperty: 'labels', trekPropertyIsArray: true, type: 'include' },
  ];

  let isUsingFilter = false;
  let filtersTreks = [];
  for (const filter of filters) {
    const currentFiltersId: number[] = state[filter.property].filter(currentFilter => currentFilter.selected).map(currentFilter => currentFilter.id);
    if (currentFiltersId.length > 0) {
      if (filtersTreks.length > 0) {
        if (filter.type === 'include') {
          if (filter.trekPropertyIsArray) {
            filtersTreks = [...state.treks.filter(trek => trek[filter.trekProperty].some(trekProperty => currentFiltersId.includes(trekProperty)))];
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
