import { Component, Host, h, Prop, Listen, forceUpdate } from '@stencil/core';
import state from 'store/store';
import { handleFiltersAndSearch } from 'utils/utils';

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
  @Listen('resetFilter', { target: 'window' })
  onResetFilter() {
    this.resetFilter();
  }

  handleFilter(_event: MouseEvent, filterToHandle: any) {
    const filterFromState = [...state[this.filterType]];
    filterFromState.find(currentFilter => currentFilter.id === filterToHandle.id).selected = !filterFromState.find(currentFilter => currentFilter.id === filterToHandle.id)
      .selected;
    state[this.filterType] = filterFromState;
    state.currentTreks = handleFiltersAndSearch();
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
              {currentFilter.selected && <span class="material-symbols material-symbols-outlined">check</span>}
              {currentFilter[this.filterNameProperty]}
            </button>
          ))}
        </div>
      </Host>
    );
  }
}
