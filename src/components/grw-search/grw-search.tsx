import { Component, Host, Prop, h } from '@stencil/core';
import state from 'store/store';
import { handleTouristicContentsFiltersAndSearch, handleTouristicEventsFiltersAndSearch, handleTreksFiltersAndSearch } from 'utils/utils';

@Component({
  tag: 'grw-search',
  styleUrl: 'grw-search.scss',
  shadow: true,
})
export class GrwSearch {
  @Prop() fontFamily = 'Roboto';

  onSearchChange(event: InputEvent) {
    state.searchValue = (event.target as any).value;
    if (state.mode === 'treks') {
      state.currentTreks = handleTreksFiltersAndSearch();
    } else if (state.mode === 'touristicContents') {
      state.currentTouristicContents = handleTouristicContentsFiltersAndSearch();
    } else if (state.mode === 'touristicEvents') {
      state.currentTouristicEvents = handleTouristicEventsFiltersAndSearch();
    }
  }

  render() {
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
        }}
      >
        {/* @ts-ignore */}
        <span part="icon" class="material-symbols material-symbols-outlined icon" translate={false}>
          search
        </span>
        <input part="search-input" class="search-input" onInput={e => this.onSearchChange(e)} type="search" placeholder="Rechercher" value={state.searchValue}></input>
      </Host>
    );
  }
}
