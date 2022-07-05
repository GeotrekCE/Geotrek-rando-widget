import { Component, Host, h, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-filter',
  styleUrl: 'grw-filter.scss',
  shadow: true,
})
export class GrwFilter {
  @Prop() filterType: string;
  @Prop() trekProperty: string;
  @Prop() filterName: string;
  @Prop() filterNameProperty: string;

  handleFilter(_event: any, filterToHandle: any) {
    const filter = state[this.filterType];
    filter.find(filter => filter.id === filterToHandle.id).selected = !filter.find(filter => filter.id === filterToHandle.id).selected;
    state[this.filterType] = [...filter];
    const currentFiltersId: number[] = state[this.filterType].filter(currentFilter => currentFilter.selected).map(currentFilter => currentFilter.id);
    state.currentTreks = currentFiltersId.length > 0 ? state.treks.filter(trek => currentFiltersId.includes(trek[this.trekProperty])) : state.treks;
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
