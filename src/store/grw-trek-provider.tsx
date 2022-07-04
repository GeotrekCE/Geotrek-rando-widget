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
    return Promise.all([
      fetch(`${this.api}trek_difficulty/?language=${this.language}&fields=id,label,pictogram`),
      fetch(`${this.api}trek_route/?language=${this.language}&fields=id,route,pictogram`),
      fetch(`${this.api}trek_practice/?language=${this.language}&fields=id,name,pictogram`),
      fetch(`${this.api}sensitivearea/?language=${this.language}&trek=${this.trekId}&fields=id,geometry,name,description`).catch(() => new Response('[]')),
      fetch(
        `${this.api}poi/?language=${this.language}&trek=${this.trekId}&published=true&fields=id,name,description,attachments,type,type_label,type_pictogram,url,published,geometry&page_size=999`,
      ),
      fetch(
        `${this.api}trek/${this.trekId}/?language=${this.language}&published=true&fields=id,name,attachments,description,description_teaser,difficulty,duration,ascent,length_2d,practice,route,geometry,gpx,kml,pdf,parking_location`,
      ),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(([difficulties, routes, practices, sensitiveAreas, pois, trek]) => {
        console.log(sensitiveAreas);
        state.difficulties = difficulties.results;
        state.routes = routes.results;
        state.practices = practices.results;
        state.currentSensitiveAreas = sensitiveAreas.results;
        state.currentPois = pois.results;
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
