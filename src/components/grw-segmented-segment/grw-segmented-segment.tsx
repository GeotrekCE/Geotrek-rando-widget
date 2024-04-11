import { Component, Host, Prop, h } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state from 'store/store';
import { Mode } from 'types/types';

import {
  handleOutdoorSitesFiltersAndSearch,
  handleTouristicContentsFiltersAndSearch,
  handleTouristicEventsFiltersAndSearch,
  handleTreksFiltersAndSearch,
  outdoorSitesFilters,
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
  @Prop() outdoor = false;

  @Prop() fontFamily = 'Roboto';

  changeMode(mode: Mode) {
    state.searchValue = '';
    if (mode === 'treks') {
      treksFilters.forEach(filter => {
        state[filter.property] && state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
      });
      state.selectedActivitiesFilters = 0;
      state.selectedThemesFilters = 0;
      state.selectedLocationFilters = 0;
      if (state.treks) {
        state.currentTreks = [...handleTreksFiltersAndSearch()];
      }
    } else if (mode === 'touristicContents') {
      touristicContentsFilters.forEach(filter => {
        state[filter.property] && state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
      });
      state.selectedActivitiesFilters = 0;
      state.selectedThemesFilters = 0;
      state.selectedLocationFilters = 0;
      if (state.touristicContents) {
        state.currentTouristicContents = [...handleTouristicContentsFiltersAndSearch()];
      }
    } else if (mode === 'touristicEvents') {
      touristicEventsFilters.forEach(filter => {
        state[filter.property] && state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
      });
      state.selectedActivitiesFilters = 0;
      state.selectedThemesFilters = 0;
      state.selectedLocationFilters = 0;
      if (state.touristicEvents) {
        state.currentTouristicEvents = [...handleTouristicEventsFiltersAndSearch()];
      }
    } else if (mode === 'outdoor') {
      outdoorSitesFilters.forEach(filter => {
        state[filter.property] && state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
      });
      state.selectedActivitiesFilters = 0;
      state.selectedThemesFilters = 0;
      state.selectedLocationFilters = 0;
      if (state.outdoorSites) {
        state.currentOutdoorSites = [...handleOutdoorSitesFiltersAndSearch()];
      }
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
        <div part="segmented-buttons-container" class="segmented-buttons-container">
          {this.treks && (
            <label part="segment" class={`segment${state.mode === 'treks' ? ' selected-segment' : ''}`} onClick={() => this.changeMode('treks')}>
              {translate[state.language].home.segment.treks}
            </label>
          )}
          {this.touristicContents && (
            <label part="segment" class={`segment${state.mode === 'touristicContents' ? ' selected-segment' : ''}`} onClick={() => this.changeMode('touristicContents')}>
              {translate[state.language].home.segment.touristicContents}
            </label>
          )}
          {this.touristicEvents && (
            <label part="segment" class={`segment${state.mode === 'touristicEvents' ? ' selected-segment' : ''}`} onClick={() => this.changeMode('touristicEvents')}>
              {translate[state.language].home.segment.touristicEvents}
            </label>
          )}
          {this.outdoor && (
            <label part="segment" class={`segment${state.mode === 'outdoor' ? ' selected-segment' : ''}`} onClick={() => this.changeMode('outdoor')}>
              {translate[state.language].home.segment.outdoorSites}
            </label>
          )}
        </div>
      </Host>
    );
  }
}
