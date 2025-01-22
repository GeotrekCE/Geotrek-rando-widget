import { Build, Component, h, Host, Prop } from '@stencil/core';
import { TouristicEvent } from 'components';
import { getAllDataInStore, getDataInStore } from 'services/grw-db.service';
import { getTouristicEvent, getTouristicEventType } from 'services/touristic-events.service';
import { getCities } from 'services/treks.service';
import state from 'store/store';

@Component({
  tag: 'grw-touristic-event-provider',
  shadow: true,
})
export class GrwTouristicEventProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() touristicEventId: number;
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

  async handleTouristicEvent() {
    const touristicEventInStore: TouristicEvent = await getDataInStore('touristicEvents', this.touristicEventId);
    if (touristicEventInStore && touristicEventInStore.offline) {
      this.handleOfflineTouristicEvent(touristicEventInStore);
    } else {
      this.handleOnlineTouristicEvent();
    }
  }

  async handleOfflineTouristicEvent(touristicEvent: TouristicEvent) {
    if (!state.cities) {
      state.cities = await getAllDataInStore('cities');
    }
    if (!state.touristicEventTypes) {
      state.touristicEventTypes = await getAllDataInStore('touristicEventTypes');
    }
    state.currentTouristicEvent = touristicEvent;
  }

  handleOnlineTouristicEvent() {
    const requests = [];
    requests.push(!state.cities ? getCities(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.touristicEventTypes ? getTouristicEventType(state.api, state.language, this.portals, this.init) : new Response('null'));

    try {
      Promise.all([...requests, getTouristicEvent(state.api, state.language, this.touristicEventId, this.init)])
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
