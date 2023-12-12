import { Component, Host, h } from '@stencil/core';
import state from 'store/store';
import { handleTouristicContentsFiltersAndSearch, handleTreksFiltersAndSearch } from 'utils/utils';

@Component({
  tag: 'grw-search',
  styleUrl: 'grw-search.scss',
  shadow: true,
})
export class GrwSearch {
  onSearchChange(event: InputEvent) {
    state.searchValue = (event.target as any).value;
    if (state.mode === 'treks') {
      state.currentTreks = handleTreksFiltersAndSearch();
    } else if (state.mode === 'touristicContents') {
      state.currentTouristicContents = handleTouristicContentsFiltersAndSearch();
    }
  }

  render() {
    return (
      <Host>
        {/* @ts-ignore */}
        <span translate={false} class="material-symbols material-symbols-outlined">
          search
        </span>
        <input onInput={e => this.onSearchChange(e)} class="search-input" type="search" placeholder="Rechercher" value={state.searchValue}></input>
      </Host>
    );
  }
}
