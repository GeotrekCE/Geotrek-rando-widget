import { Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-trek-provider',
  shadow: true,
})
export class GrwTrekProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() trekId: string;
  controller = new AbortController();
  signal = this.controller.signal;

  connectedCallback() {
    if (!state.api) {
      state.api = this.api;
      state.languages = this.languages.split(',');
      state.language = state.languages[0];
    }
    this.handleTrek();
  }

  handleTrek() {
    const requests = [];
    requests.push(!state.difficulties ? fetch(`${state.api}trek_difficulty/?language=${state.language}&fields=id,label,pictogram`, { signal: this.signal }) : new Response('null'));
    requests.push(!state.routes ? fetch(`${state.api}trek_route/?language=${state.language}&fields=id,route,pictogram`, { signal: this.signal }) : new Response('null'));
    requests.push(!state.practices ? fetch(`${state.api}trek_practice/?language=${state.language}&fields=id,name,pictogram`, { signal: this.signal }) : new Response('null'));
    requests.push(!state.themes ? fetch(`${state.api}theme/?language=${state.language}&fields=id,label,pictogram`, { signal: this.signal }) : new Response('null'));
    requests.push(
      !state.cities ? fetch(`${state.api}city/?language=${state.language}&fields=id,name&published=true&page_size=999`, { signal: this.signal }) : new Response('null'),
    );
    Promise.all([
      ...requests,
      fetch(`${this.api}sensitivearea/?language=${state.language}&published=true&trek=${this.trekId}&fields=id,geometry,name,description,contact,info_url,period,practices`, {
        signal: this.signal,
      }).catch(() => new Response('null')),
      fetch(`${state.api}label/?language=${state.language}&fields=id,name,advice,pictogram`, { signal: this.signal }),
      fetch(`${state.api}source/?language=${state.language}&fields=id,name,website,pictogram`, { signal: this.signal }),
      fetch(`${state.api}trek_accessibility/?language=${state.language}&fields=id,name,pictogram`, { signal: this.signal }),
      fetch(`${state.api}trek_accessibility_level/?language=${state.language}&fields=id,name`, { signal: this.signal }).catch(() => new Response('null')),
      fetch(`${state.api}poi/?language=${state.language}&trek=${this.trekId}&published=true&fields=id,name,description,attachments,type,geometry&page_size=999`, {
        signal: this.signal,
      }),
      fetch(`${state.api}poi_type/?language=${state.language}&fields=id,pictogram`, { signal: this.signal }),
      fetch(
        `${state.api}informationdesk/?language=${state.language}&fields=id,name,description,type,phone,email,website,municipality,postal_code,street,photo_url,latitude,longitude&page_size=999`,
        { signal: this.signal },
      ),
      fetch(
        `${state.api}trek/${this.trekId}/?language=${state.language}&published=true&fields=id,name,attachments,description,description_teaser,difficulty,duration,ascent,length_2d,practice,themes,route,geometry,gpx,kml,pdf,parking_location,departure,departure_city,arrival,cities,ambiance,access,public_transport,advice,advised_parking,gear,labels,source,points_reference,disabled_infrastructure,accessibility_level,accessibility_slope,accessibility_width,accessibility_signage,accessibility_covering,accessibility_exposure,accessibility_advice,accessibilities,information_desks`,
        { signal: this.signal },
      ),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(([difficulties, routes, practices, themes, cities, sensitiveAreas, labels, sources, accessibilities, accessibilitiesLevel, pois, poiTypes, informationDesks, trek]) => {
        state.trekNetworkError = false;
        if (difficulties) {
          state.difficulties = difficulties.results;
        }
        if (routes) {
          state.routes = routes.results;
        }
        if (practices) {
          state.practices = practices.results.map(practice => ({ ...practice, selected: false }));
        }
        if (themes) {
          state.themes = themes.results;
        }
        if (cities) {
          state.cities = cities.results;
        }
        if (sensitiveAreas) {
          state.currentSensitiveAreas = sensitiveAreas.results;
        }
        state.labels = labels.results;
        state.sources = sources.results;
        state.accessibilities = accessibilities.results;
        if (accessibilitiesLevel) {
          state.accessibilitiesLevel = accessibilitiesLevel.results;
        }
        state.currentPois = pois.results;
        state.poiTypes = poiTypes.results;
        state.currentInformationDesks = informationDesks.results;
        state.currentTrek = trek;
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
