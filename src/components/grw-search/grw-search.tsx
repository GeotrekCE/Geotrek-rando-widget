import { Component, Host, h } from '@stencil/core';
import state from 'store/store';
import { handleFiltersAndSearch } from 'utils/utils';

@Component({
  tag: 'grw-search',
  styleUrl: 'grw-search.scss',
  shadow: true,
})
export class GrwSearch {
  onSearchChange(event: InputEvent) {
    state.searchValue = (event.target as any).value;
    state.currentTreks = handleFiltersAndSearch();
  }

  render() {
    return (
      <Host>
        <span class="material-symbols-outlined">search</span>
        <input onInput={e => this.onSearchChange(e)} class="search-input" type="search" placeholder="Rechercher" value={state.searchValue}></input>
      </Host>
    );
  }
}
