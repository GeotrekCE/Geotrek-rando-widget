import { Build, Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-touristic-content-provider',
  shadow: true,
})
export class GrwTouristicContentProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() touristicContentId: string;
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

  handleTouristicContent() {
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
      Promise.all([
        ...requests,
        fetch(
          `${state.api}touristiccontent/${this.touristicContentId}/?language=${state.language}&published=true&fields=id,name,attachments,description,description_teaser,category,geometry,cities,pdf,practical_info,contact,email,website`,
          this.init,
        ),
      ])
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
