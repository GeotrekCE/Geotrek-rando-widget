import { Build, Component, h, Host, Prop } from '@stencil/core';
import { getTouristicEventsList, getTouristicEventType } from 'services/touristic-events.service';
import { getCities, getDistricts } from 'services/treks.service';
import state from 'store/store';

@Component({
  tag: 'grw-touristic-events-provider',
  shadow: true,
})
export class GrwTouristicEventsProvider {
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
    this.handleTouristicEvents();
  }

  handleTouristicEvents() {
    let touristicEventsRequest = getTouristicEventsList(state.api, state.language, this.inBbox, this.cities, this.districts, this.structures, this.themes, this.portals, this.init);

    const requests = [];
    requests.push(!state.districts ? getDistricts(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.touristicEventTypes ? getTouristicEventType(state.api, state.language, this.portals, this.init) : new Response('null'));

    try {
      Promise.all([...requests, touristicEventsRequest])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(async ([districts, touristicEventTypes, touristicEvents]) => {
          state.networkError = false;

          if (districts) {
            state.districts = districts.results;
          }
          if (touristicEventTypes) {
            state.touristicEventTypes = touristicEventTypes.results;
          }
          state.touristicEvents = touristicEvents.results;
          state.currentTouristicEvents = touristicEvents.results;

          if (!state.cities || state.cities.length === 0) {
            const cityIds = new Set<number>();
            if (touristicEvents && touristicEvents.results) {
              touristicEvents.results.forEach(item => {
                if (item.cities) {
                  item.cities.forEach(c => cityIds.add(c));
                }
              });
            }
            if (cityIds.size > 0) {
              try {
                const citiesResponse = await getCities(state.api, state.language, this.init, Array.from(cityIds));
                const citiesData = await citiesResponse.json();
                state.cities = citiesData.results || [];
              } catch (e) {
                console.error('Failed to load cities', e);
              }
            }
          }
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
