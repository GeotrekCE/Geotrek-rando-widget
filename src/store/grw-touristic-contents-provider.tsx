import { Build, Component, h, Host, Prop } from '@stencil/core';
import { getTouristicContentCategory, getTouristicContentsList } from 'services/touristic-contents.service';
import { getCities, getDistricts } from 'services/treks.service';
import state from 'store/store';

@Component({
  tag: 'grw-touristic-contents-provider',
  shadow: true,
})
export class GrwTouristicContentsProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() inBbox: string;
  @Prop() cities: string;
  @Prop() districts: string;
  @Prop() structures: string;
  @Prop() themes: string;
  @Prop() portals: string;

  controller = new AbortController();
  signal = this.controller.signal;
  init: RequestInit = { cache: Build.isDev ? 'force-cache' : 'default', signal: this.signal };

  connectedCallback() {
    if (!state.api) {
      state.api = this.api;
      state.languages = this.languages.split(',');
      state.language = state.languages[0];
    }
    this.handleTouristicContents();
  }

  handleTouristicContents() {
    let touristicContentsRequest = getTouristicContentsList(
      state.api,
      state.language,
      this.inBbox,
      this.cities,
      this.districts,
      this.structures,
      this.themes,
      this.portals,
      this.init,
    );

    const requests = [];
    requests.push(!state.cities ? getCities(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.districts ? getDistricts(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.touristicContentCategories ? getTouristicContentCategory(state.api, state.language, this.portals, this.init) : new Response('null'));
    try {
      Promise.all([...requests, touristicContentsRequest])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([cities, districts, touristicContentCategory, touristicContents]) => {
          state.networkError = false;

          if (cities) {
            state.cities = cities.results;
          }
          if (districts) {
            state.districts = districts.results;
          }
          if (touristicContentCategory) {
            state.touristicContentCategories = touristicContentCategory.results;
          }
          state.touristicContents = touristicContents.results;
          state.currentTouristicContents = touristicContents.results;
        });
    } catch (error) {
      if (!(error.code === DOMException.ABORT_ERR)) {
        state.networkError = true;
      }
    }
  }

  disconnectedCallback() {
    this.controller.abort();
    state.networkError = false;
  }

  render() {
    return <Host></Host>;
  }
}
