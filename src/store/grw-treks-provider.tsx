import { Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-treks-provider',
  shadow: true,
})
export class GrwTreksProvider {
  @Prop() language = 'fr';
  @Prop() api: string;
  @Prop() inBbox: string;
  @Prop() cities: string;
  @Prop() districts: string;
  @Prop() structures: string;
  @Prop() themes: string;
  @Prop() portals: string;
  @Prop() routes: string;
  @Prop() practices: string;

  componentWillLoad() {
    state.api = this.api;

    let treksRequest = `${this.api}trek/?language=${this.language}`;

    this.inBbox && (treksRequest += `&in_bbox=${this.inBbox}`);
    this.cities && (treksRequest += `&cities=${this.cities}`);
    this.districts && (treksRequest += `&districts=${this.districts}`);
    this.structures && (treksRequest += `&structures=${this.structures}`);
    this.themes && (treksRequest += `&themes=${this.themes}`);
    this.portals && (treksRequest += `&portals=${this.portals}`);
    this.routes && (treksRequest += `&routes=${this.routes}`);
    this.practices && (treksRequest += `&practices=${this.practices}`);

    treksRequest += `&fields=id,name,attachments,description_teaser,difficulty,duration,ascent,length_2d,practice,route,departure_geom&page_size=999`;

    return Promise.all([
      fetch(`${this.api}trek_difficulty/?language=${this.language}`),
      fetch(`${this.api}trek_route/?language=${this.language}`),
      fetch(`${this.api}trek_practice/?language=${this.language}`),
      fetch(treksRequest),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(([difficulties, routes, practices, treks]) => {
        state.difficulties = difficulties.results;
        state.routes = routes.results;
        state.practices = practices.results;
        state.treks = treks.results;
      });
  }

  render() {
    return <Host></Host>;
  }
}
