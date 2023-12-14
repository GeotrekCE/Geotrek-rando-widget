import { Build, Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-touristic-contents-provider',
  shadow: true,
})
export class GrwTouristicContentsProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() touristicContentId: string;
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
    let touristicContentsRequest = `${state.api}touristiccontent/?language=${state.language}&published=true`;
    this.inBbox && (touristicContentsRequest += `&in_bbox=${this.inBbox}`);
    this.cities && (touristicContentsRequest += `&cities=${this.cities}`);
    this.districts && (touristicContentsRequest += `&districts=${this.districts}`);
    this.structures && (touristicContentsRequest += `&structures=${this.structures}`);
    this.themes && (touristicContentsRequest += `&themes=${this.themes}`);
    this.portals && (touristicContentsRequest += `&portals=${this.portals}`);

    touristicContentsRequest += `&fields=id,name,attachments,category,geometry,cities,districts&page_size=999`;

    const requests = [];
    requests.push(!state.cities ? fetch(`${state.api}city/?language=${state.language}&fields=id,name&published=true&page_size=999`, this.init) : new Response('null'));
    requests.push(!state.districts ? fetch(`${state.api}district/?language=${state.language}&fields=id,name&published=true&page_size=999`, this.init) : new Response('null')),
      requests.push(
        !state.touristicContentCategories
          ? fetch(`${state.api}touristiccontent_category/?language=${state.language}&published=true&fields=id,label,pictogram&page_size=999`, this.init)
          : new Response('null'),
      );

    Promise.all([...requests, fetch(touristicContentsRequest, this.init)])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(([cities, districts, touristicContentCategory, touristicContents]) => {
        state.trekNetworkError = false;

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
