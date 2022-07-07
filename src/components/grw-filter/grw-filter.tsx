import { Component, Host, h, Prop } from '@stencil/core';
import state from 'store/store';
import { Filters } from 'types/types';

@Component({
  tag: 'grw-filter',
  styleUrl: 'grw-filter.scss',
  shadow: true,
})
export class GrwFilter {
  @Prop() filterType: string;
  @Prop() filterName: string;
  @Prop() filterNameProperty: string;
  filters: Filters = [
    { property: 'practices', trekProperty: 'practice', type: 'include' },
    { property: 'difficulties', trekProperty: 'difficulty', type: 'include' },
    { property: 'durations', trekProperty: 'duration', type: 'interval' },
  ];

  handleFilter(_event: any, filterToHandle: any) {
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
            for (const currentFilterId of currentFiltersId) {
              const currentFilter = state[filter.property].find(property => property.id === currentFilterId);
              filtersTreks = [...filtersTreks.filter(trek => trek[filter.trekProperty] >= currentFilter.minValue && trek[filter.trekProperty] <= currentFilter.maxValue)];
            }
          }
        } else {
          if (!isUsingFilter) {
            isUsingFilter = true;
          }
          if (filter.type === 'include') {
            filtersTreks = [...state.treks.filter(trek => currentFiltersId.includes(trek[filter.trekProperty]))];
          } else if (filter.type === 'interval') {
            for (const currentFilterId of currentFiltersId) {
              const currentFilter = state[filter.property].find(property => property.id === currentFilterId);
              filtersTreks = [...state.treks.filter(trek => trek[filter.trekProperty] >= currentFilter.minValue && trek[filter.trekProperty] <= currentFilter.maxValue)];
            }
          }
        }
      }
    }
    state.currentTreks = isUsingFilter ? filtersTreks : state.treks;
  }

  render() {
    return (
      <Host>
        <div class="filter-name">{this.filterName}</div>
        <div class="filter-button-container">
          {state[this.filterType].map(currentFilter => (
            <div onClick={event => this.handleFilter(event, currentFilter)} class={currentFilter.selected ? 'selected-filter-button' : 'filter-button'}>
              {currentFilter[this.filterNameProperty]}
            </div>
          ))}
        </div>
      </Host>
    );
  }
}
