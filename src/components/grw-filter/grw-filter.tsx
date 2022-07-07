import { Component, Host, h, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-filter',
  styleUrl: 'grw-filter.scss',
  shadow: true,
})
export class GrwFilter {
  @Prop() filterType: string;
  @Prop() filterName: string;
  @Prop() filterNameProperty: string;
  filters = [
    { filterType: 'practices', trekProperty: 'practice' },
    { filterType: 'difficulties', trekProperty: 'difficulty' },
  ];

  handleFilter(_event: any, filterToHandle: any) {
    const filterFromState = [...state[this.filterType]];
    filterFromState.find(currentFilter => currentFilter.id === filterToHandle.id).selected = !filterFromState.find(currentFilter => currentFilter.id === filterToHandle.id)
      .selected;
    state[this.filterType] = filterFromState;
    let isUsingFilter = false;
    let filtersTreks = [];
    for (const filter of this.filters) {
      const currentFiltersId: number[] = state[filter.filterType].filter(currentFilter => currentFilter.selected).map(currentFilter => currentFilter.id);
      if (currentFiltersId.length > 0) {
        if (filtersTreks.length > 0) {
          filtersTreks = [...filtersTreks.filter(trek => currentFiltersId.includes(trek[filter.trekProperty]))];
        } else {
          if (!isUsingFilter) {
            isUsingFilter = true;
            filtersTreks = [...state.treks.filter(trek => currentFiltersId.includes(trek[filter.trekProperty]))];
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
