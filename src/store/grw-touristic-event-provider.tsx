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
      !state.touristicContentCategories
        ? fetch(`${state.api}touristicevent_type/?language=${state.language}&published=true&fields=id,type,pictogram&page_size=999`, this.init)
        : new Response('null'),
    );

    Promise.all([
      ...requests,
      fetch(
        `${state.api}touristicevent/${this.touristicEventId}/?language=${state.language}&fields=id,name,attachments,description,description_teaser,type,geometry,cities,pdf,practical_info,contact,email,website&published=true`,
        this.init,
      ),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(async ([cities, touristicContentTypes, touristicEvent]) => {
        state.trekNetworkError = false;

        if (cities) {
          state.cities = cities.results;
        }
        if (touristicContentTypes) {
          state.touristicEventTypes = touristicContentTypes.results;
        }
        state.currentTouristicEvent = touristicEvent;
      })
      .catch(() => {
        state.trekNetworkError = true;
      });
  }

  disconnectedCallback() {
    this.controller.abort();
    state.trekNetworkError = false;
  }

  render() {
    return <Host></Host>;
  }
}
