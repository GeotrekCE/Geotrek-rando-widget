import { Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-trek-provider',
  shadow: true,
})
export class GrwTrekProvider {
  @Prop() language = 'fr';
  @Prop() api: string;
  @Prop() trekId: string;
  controller = new AbortController();
  signal = this.controller.signal;

  connectedCallback() {
    state.api = this.api;
    const requests = [];
    requests.push(!state.difficulties ? fetch(`${this.api}trek_difficulty/?language=${this.language}&fields=id,label,pictogram`, { signal: this.signal }) : new Response('null'));
    requests.push(!state.routes ? fetch(`${this.api}trek_route/?language=${this.language}&fields=id,route,pictogram`, { signal: this.signal }) : new Response('null'));
    requests.push(!state.practices ? fetch(`${this.api}trek_practice/?language=${this.language}&fields=id,name,pictogram`, { signal: this.signal }) : new Response('null'));
    requests.push(!state.themes ? fetch(`${this.api}theme/?language=${this.language}&fields=id,label,pictogram`, { signal: this.signal }) : new Response('null'));
    Promise.all([
      ...requests,
      fetch(`${this.api}sensitivearea/?language=${this.language}&published=true&trek=${this.trekId}&fields=id,geometry,name,description,contact,info_url,period,practices`, {
        signal: this.signal,
      }).catch(() => new Response('null')),
      fetch(`${this.api}label/?language=${this.language}&fields=id,name,advice,pictogram`, { signal: this.signal }),
      fetch(`${this.api}source/?language=${this.language}&fields=id,name,website,pictogram`, { signal: this.signal }),
      fetch(`${this.api}trek_accessibility/?language=${this.language}&fields=id,name,pictogram`, { signal: this.signal }),
      fetch(`${this.api}trek_accessibility_level/?language=${this.language}&fields=id,name`, { signal: this.signal }).catch(() => new Response('null')),
      fetch(`${this.api}poi/?language=${this.language}&trek=${this.trekId}&published=true&fields=id,name,description,attachments,type,geometry&page_size=999`, {
        signal: this.signal,
      }),
      fetch(`${this.api}poi_type/?language=${this.language}&fields=id,pictogram`, { signal: this.signal }),
      fetch(
        `${this.api}informationdesk/?language=${this.language}&near_trek=${this.trekId}&fields=id,name,description,type,phone,email,website,municipality,postal_code,street,photo_url,latitude,longitude&page_size=999`,
        { signal: this.signal },
      ),
      fetch(
        `${this.api}trek/${this.trekId}/?language=${this.language}&published=true&fields=id,name,attachments,description,description_teaser,difficulty,duration,ascent,length_2d,practice,themes,route,geometry,gpx,kml,pdf,parking_location,departure,arrival,altimetric_profile,ambiance,access,public_transport,advice,advised_parking,gear,labels,source,points_reference,disabled_infrastructure,accessibility_level,accessibility_slope,accessibility_width,accessibility_signage,accessibility_covering,accessibility_exposure,accessibility_advice,accessibilities`,
        { signal: this.signal },
      ),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(([difficulties, routes, practices, themes, sensitiveAreas, labels, sources, accessibilities, accessibilitiesLevel, pois, poiTypes, informationDesks, trek]) => {
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
    state.currentTrek = null;
    state.trekNetworkError = false;
  }

  render() {
    return <Host></Host>;
  }
}
