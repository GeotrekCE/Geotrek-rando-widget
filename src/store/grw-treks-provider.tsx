import { Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-treks-provider',
})
export class GrwTreksProvider {
  @Prop() api: string;
  @Prop() portals: string;

  componentWillLoad() {
    state.api = this.api;

    let treksRequest = `${this.api}trek/?language=fr`;
    if (this.portals) {
      treksRequest += `&portals=${this.portals}`;
    }
    treksRequest += `&fields=id,name,attachments,description_teaser,difficulty,duration,ascent,length_2d,practice,route,departure_geom&page_size=999`;

    return Promise.all([
      fetch(treksRequest),
      fetch(`${this.api}trek_difficulty/?language=fr`),
      fetch(`${this.api}trek_route/?language=fr`),
      fetch(`${this.api}trek_practice/?language=fr`),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(([treks, difficulties, routes, practices]) => {
        state.treks = treks.results;
        state.difficulties = difficulties.results;
        state.routes = routes.results;
        state.practices = practices.results;
      });
  }

  render() {
    return <Host></Host>;
  }
}
