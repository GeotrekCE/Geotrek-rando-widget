import { Component, Host, Prop, h } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state from 'store/store';
import { Mode } from 'types/types';

import {
  handleTouristicContentsFiltersAndSearch,
  handleTouristicEventsFiltersAndSearch,
  handleTreksFiltersAndSearch,
  touristicContentsFilters,
  touristicEventsFilters,
  treksFilters,
} from 'utils/utils';

@Component({
  tag: 'grw-segmented-segment',
  styleUrl: 'grw-segmented-segment.scss',
  shadow: true,
})
export class GrwSegmentedSegment {
  @Prop() treks = true;
  @Prop() touristicContents = false;
  @Prop() touristicEvents = false;

  @Prop() fontFamily = 'Roboto';

  changeMode(mode: Mode) {
    state.searchValue = '';
    if (mode === 'treks' && state.currentTreks) {
      treksFilters.forEach(filter => {
        state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
      });
      state.selectedActivitiesFilters = 0;
      state.selectedThemesFilters = 0;
      state.selectedLocationFilters = 0;
      state.currentTreks = handleTreksFiltersAndSearch();
    } else if (mode === 'touristicContents' && state.currentTouristicContents) {
      touristicContentsFilters.forEach(filter => {
        state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
      });
      state.selectedActivitiesFilters = 0;
      state.selectedLocationFilters = 0;
      state.currentTouristicContents = handleTouristicContentsFiltersAndSearch();
    } else if (mode === 'touristicEvents' && state.currentTouristicEvents) {
      touristicEventsFilters.forEach(filter => {
        state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
      });
      state.selectedActivitiesFilters = 0;
      state.selectedLocationFilters = 0;
      state.currentTouristicEvents = handleTouristicEventsFiltersAndSearch();
    }
    state.mode = mode;
  }

  render() {
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
        }}
      >
        <div class="segmented-buttons-container">
          {this.treks && (
            <label class={`segment${state.mode === 'treks' ? ' selected-segment' : ''}`} onClick={() => this.changeMode('treks')}>
              {translate[state.language].home.segment.treks}
            </label>
          )}
          {this.touristicContents && (
            <label class={`segment${state.mode === 'touristicContents' ? ' selected-segment' : ''}`} onClick={() => this.changeMode('touristicContents')}>
              {translate[state.language].home.segment.touristicContents}
            </label>
          )}
          {this.touristicEvents && (
            <label class={`segment${state.mode === 'touristicEvents' ? ' selected-segment' : ''}`} onClick={() => this.changeMode('touristicEvents')}>
              {translate[state.language].home.segment.touristicEvents}
            </label>
          )}
        </div>
      </Host>
    );
  }
}
