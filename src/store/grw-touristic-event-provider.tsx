import { Build, Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-touristic-event-provider',
  shadow: true,
})
export class GrwTouristicEventProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() touristicEventId: string;
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
    this.handleTouristicEvent();
  }

  handleTouristicEvent() {
    const requests = [];
    requests.push(!state.cities ? fetch(`${state.api}city/?language=${state.language}&fields=id,name&published=true&page_size=999`, this.init) : new Response('null'));
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
      Promise.all([
        ...requests,
        fetch(
          `${state.api}touristicevent/${this.touristicEventId}/?language=${state.language}&fields=id,name,attachments,description,description_teaser,type,geometry,cities,pdf,practical_info,contact,email,website,begin_date,end_date&published=true`,
          this.init,
        ),
      ])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([cities, touristicEventTypes, touristicEvent]) => {
          state.networkError = false;

          if (cities) {
            state.cities = cities.results;
          }
          if (touristicEventTypes) {
            state.touristicEventTypes = touristicEventTypes.results;
          }
          state.currentTouristicEvent = touristicEvent;
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
