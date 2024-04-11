import { Build, Component, h, Host, Prop } from '@stencil/core';
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
    let touristicEventsRequest = `${state.api}touristicevent/?language=${state.language}&published=true`;
    this.inBbox && (touristicEventsRequest += `&in_bbox=${this.inBbox}`);
    this.cities && (touristicEventsRequest += `&cities=${this.cities}`);
    this.districts && (touristicEventsRequest += `&districts=${this.districts}`);
    this.structures && (touristicEventsRequest += `&structures=${this.structures}`);
    this.themes && (touristicEventsRequest += `&themes=${this.themes}`);
    this.portals && (touristicEventsRequest += `&portals=${this.portals}`);

    touristicEventsRequest += `&fields=id,name,attachments,category,geometry,cities,districts,type,begin_date,end_date&page_size=999`;

    const requests = [];
    requests.push(!state.cities ? fetch(`${state.api}city/?language=${state.language}&fields=id,name&published=true&page_size=999`, this.init) : new Response('null'));
    requests.push(!state.districts ? fetch(`${state.api}district/?language=${state.language}&fields=id,name&published=true&page_size=999`, this.init) : new Response('null'));
    requests.push(
      !state.touristicEventTypes
        ? fetch(
            `${state.api}touristicevent_type/?language=${state.language}${
              this.portals ? '&portals='.concat(this.portals) : ''
            }&published=true&fields=id,type,pictogram&page_size=999`,
            this.init,
          )
        : new Response('null'),
    );

    try {
      Promise.all([...requests, fetch(touristicEventsRequest, this.init)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([cities, districts, touristicEventTypes, touristicEvents]) => {
          state.networkError = false;

          if (cities) {
            state.cities = cities.results;
          }
          if (districts) {
            state.districts = districts.results;
          }
          if (touristicEventTypes) {
            state.touristicEventTypes = touristicEventTypes.results;
          }
          state.touristicEvents = touristicEvents.results;
          state.currentTouristicEvents = touristicEvents.results;
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
