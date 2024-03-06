import { Build, Component, h, Host, Prop } from '@stencil/core';
import { getAllDataInStore, getDataInStore } from 'services/grw-db.service';
import { getTouristicContent } from 'services/touristic-contents.service';
import state from 'store/store';
import { TouristicContent } from 'types/types';
import { imagesRegExp, setFilesFromStore } from 'utils/utils';

@Component({
  tag: 'grw-touristic-content-provider',
  shadow: true,
})
export class GrwTouristicContentProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() touristicContentId: number;
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
    this.handleTouristicContent();
  }

  async handleTouristicContent() {
    const touristicContentInStore: TouristicContent = await getDataInStore('touristicContents', this.touristicContentId);
    if (touristicContentInStore && touristicContentInStore.offline) {
      this.handleOfflineTouristicContent(touristicContentInStore);
    } else {
      this.handleOnlineTouristicContent();
    }
  }

  async handleOfflineTouristicContent(touristicContent: TouristicContent) {
    if (!state.cities) {
      state.cities = await getAllDataInStore('cities');
    }
    if (!state.touristicContentCategories) {
      state.touristicContentCategories = await getAllDataInStore('touristicContentCategories');
    }
    setFilesFromStore(touristicContent, imagesRegExp);
    state.currentTouristicContent = touristicContent;
  }

  handleOnlineTouristicContent() {
    const requests = [];
    requests.push(!state.cities ? fetch(`${state.api}city/?language=${state.language}&fields=id,name&published=true&page_size=999`, this.init) : new Response('null'));
    requests.push(
      !state.touristicContentCategories
        ? fetch(
            `${state.api}touristiccontent_category/?language=${state.language}${
              this.portals ? '&portals='.concat(this.portals) : ''
            }&published=true&fields=id,label,pictogram&page_size=999`,
            this.init,
          )
        : new Response('null'),
    );
    try {
      Promise.all([...requests, getTouristicContent(state.api, state.language, this.touristicContentId, this.init)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([cities, touristicContentCategory, touristicContent]) => {
          state.networkError = false;

          if (cities) {
            state.cities = cities.results;
          }
          if (touristicContentCategory) {
            state.touristicContentCategories = touristicContentCategory.results;
          }
          state.currentTouristicContent = touristicContent;
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
