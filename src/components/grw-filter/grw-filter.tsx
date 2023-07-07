import { Component, Host, h, Prop, Listen, forceUpdate } from '@stencil/core';
import state from 'store/store';
import { Filters } from 'types/types';

@Component({
  tag: 'grw-filter',
  styleUrl: 'grw-filter.scss',
  shadow: true,
})
export class GrwFilter {
  filterRef: HTMLElement;
  @Prop() filterType: string;
  @Prop() filterName: string;
  @Prop() filterNameProperty: string;
  filters: Filters = [
    { property: 'practices', trekProperty: 'practice', type: 'include' },
    { property: 'difficulties', trekProperty: 'difficulty', type: 'include' },
    { property: 'durations', trekProperty: 'duration', type: 'interval' },
  ];

  @Listen('resetFilter', { target: 'window' })
  onResetFilter() {
    this.resetFilter();
  }

  handleFilter(_event: MouseEvent, filterToHandle: any) {
    const filterFromState = [...state[this.filterType]];
    filterFromState.find(currentFilter => currentFilter.id === filterToHandle.id).selected = !filterFromState.find(currentFilter => currentFilter.id === filterToHandle.id)
      .selected;
    state[this.filterType] = filterFromState;
    let isUsingFilter = false;
    let filtersTreks = [];
    for (const filter of this.filters) {
      const currentFiltersId: number[] = state[filter.property].filter(currentFilter => currentFilter.selected).map(currentFilter => currentFilter.id);
      if (currentFiltersId.length > 0) {
        if (filtersTreks.length > 0) {
          if (filter.type === 'include') {
            filtersTreks = [...filtersTreks.filter(trek => currentFiltersId.includes(trek[filter.trekProperty]))];
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
            filtersTreks = [...state.treks.filter(trek => currentFiltersId.includes(trek[filter.trekProperty]))];
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
    state.currentTreks = isUsingFilter ? filtersTreks : state.treks;
  }

  resetFilter() {
    state[this.filterType].forEach(currentFilter => (currentFilter.selected = false));
    forceUpdate(this.filterRef);
  }

  render() {
    return (
      <Host ref={el => (this.filterRef = el)}>
        <div class="filter-name display-large">{this.filterName}</div>
        <div class="filter-button-container">
          {state[this.filterType].map(currentFilter => (
            <button onClick={event => this.handleFilter(event, currentFilter)} class={currentFilter.selected ? 'selected-filter-button' : 'filter-button'}>
              {currentFilter.selected && <span class="material-symbols-outlined">check</span>}
              {currentFilter[this.filterNameProperty]}
            </button>
          ))}
        </div>
      </Host>
    );
  }
}
