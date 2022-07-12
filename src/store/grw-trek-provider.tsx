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

  componentWillLoad() {
    state.api = this.api;
    const requests = [];
    requests.push(!state.difficulties ? fetch(`${this.api}trek_difficulty/?language=${this.language}&fields=id,label,pictogram`) : new Response('null'));
    requests.push(!state.routes ? fetch(`${this.api}trek_route/?language=${this.language}&fields=id,route,pictogram`) : new Response('null'));
    requests.push(!state.practices ? fetch(`${this.api}trek_practice/?language=${this.language}&fields=id,name,pictogram`) : new Response('null'));
    requests.push(!state.themes ? fetch(`${this.api}theme/?language=${this.language}&fields=id,label,pictogram`) : new Response('null'));
    return Promise.all([
      ...requests,
      fetch(`${this.api}sensitivearea/?language=${this.language}&trek=${this.trekId}&fields=id,geometry,name,description`).catch(() => new Response('null')),
      fetch(`${this.api}label/?language=${this.language}&fields=id,name,advice,pictogram`),
      fetch(`${this.api}source/?language=${this.language}&fields=id,name,website,pictogram`),
      fetch(
        `${this.api}poi/?language=${this.language}&trek=${this.trekId}&published=true&fields=id,name,description,attachments,type,type_label,type_pictogram,url,published,geometry&page_size=999`,
      ),
      fetch(
        `${this.api}informationdesk/?language=${this.language}&near_trek=${this.trekId}&fields=id,name,description,type,phone,email,website,municipality,postal_code,street,photo_url,latitude,longitude&page_size=999`,
      ),
      fetch(
        `${this.api}trek/${this.trekId}/?language=${this.language}&published=true&fields=id,name,attachments,description,description_teaser,difficulty,duration,ascent,length_2d,practice,themes,route,geometry,gpx,kml,pdf,parking_location,departure,arrival,altimetric_profile,ambiance,access,public_transport,advice,advised_parking,gear,labels,source,points_reference`,
      ),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(([difficulties, routes, practices, themes, sensitiveAreas, labels, sources, pois, informationDesks, trek]) => {
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
        state.currentPois = pois.results;
        state.currentInformationDesks = informationDesks.results;
        state.currentTrek = trek;
      });
  }

  disconnectedCallback() {
    state.currentTrek = null;
  }

  render() {
    return <Host></Host>;
  }
}
