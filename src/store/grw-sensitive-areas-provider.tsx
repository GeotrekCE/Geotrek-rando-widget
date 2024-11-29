import { Build, Component, h, Host, Prop } from '@stencil/core';
import { getAllDataInStore, handleOfflineProperty } from 'services/grw-db.service';
import { getSensitiveAreas, getSensitivePractices, getSensitiveSpecies, sensitiveAreaIsAvailableOffline } from 'services/sensitive-areas.service';
import state from 'store/store';
import { SensitiveAreas } from 'types/types';

@Component({
  tag: 'grw-sensitive-areas-provider',
  shadow: true,
})
export class GrwSensitiveAreasProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() inBbox: string;
  @Prop() practices: string;
  @Prop() species: string;
  @Prop() structures: string;
  @Prop() period: string;
  @Prop() offline = false;

  controller = new AbortController();
  signal = this.controller.signal;
  init: RequestInit = { cache: Build.isDev ? 'force-cache' : 'default', signal: this.signal };

  connectedCallback() {
    if (!state.api) {
      state.api = this.api;
      state.languages = this.languages.split(',');
      state.language = state.languages[0];
    }

    state.inBboxFromProviders = this.inBbox;
    state.structuresFromProviders = this.structures;

    this.handleSensitiveAreas();
  }

  async handleSensitiveAreas() {
    if (this.offline) {
      this.handleOfflineSensitiveAreas();
    } else {
      this.handleOnlineSensitiveAreas();
    }
  }

  async handleOfflineSensitiveAreas() {
    let sensitiveAreasInStore: SensitiveAreas = await getAllDataInStore('sensitiveAreas');
    console.log('sensitiveAreasInStore',sensitiveAreasInStore)
    if (sensitiveAreasInStore && sensitiveAreasInStore.length > 0) {
      state.sensitiveAreaPractices = await handleOfflineProperty('sensitiveAreaPractices');
      sensitiveAreasInStore = await handleOfflineProperty('sensitiveAreas');
      state.sensitiveAreas = sensitiveAreasInStore;
      state.currentSensitiveAreas = sensitiveAreasInStore;
    } else {
      state.networkError = true;
    }
  }

  handleOnlineSensitiveAreas() {
    const requests = [];
    requests.push(!state.sensitiveAreaPractices ? getSensitivePractices(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.sensitiveAreaSpecies ? getSensitiveSpecies(state.api, state.language, this.init) : new Response('null'));
    requests.push(getSensitiveAreas(state.api, state.language, this.inBbox, this.period, this.practices, this.structures, this.init));
    Promise.all([...requests])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(async ([sensitiveAreaPractices, sensitiveAreaSpecies, sensitiveAreas]) => {
        state.networkError = false;

        if (sensitiveAreaPractices) {
          state.sensitiveAreaPractices = sensitiveAreaPractices.results;
        }
        if (sensitiveAreaSpecies) {
          state.sensitiveAreaSpecies = sensitiveAreaSpecies.results;
        }

        const sensitiveAreasWithOfflineValue = [];
        for (let index = 0; index < sensitiveAreas.results.length; index++) {
          const offline = await sensitiveAreaIsAvailableOffline(sensitiveAreas.results[index].id);
          sensitiveAreasWithOfflineValue.push({ ...sensitiveAreas.results[index], offline });
        }
        state.sensitiveAreas = sensitiveAreasWithOfflineValue;
        state.currentSensitiveAreas = sensitiveAreasWithOfflineValue;
      })
      .catch(async () => {
        await this.handleOfflineSensitiveAreas();
      });
  }

  disconnectedCallback() {
    this.controller.abort();
    state.networkError = false;
  }

  render() {
    return <Host></Host>;
  }
}
