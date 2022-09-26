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
  controller = new AbortController();
  signal = this.controller.signal;

  connectedCallback() {
    state.api = this.api;

    let treksRequest = `${this.api}trek/?language=${this.language}&published=true`;

    this.inBbox && (treksRequest += `&in_bbox=${this.inBbox}`);
    this.cities && (treksRequest += `&cities=${this.cities}`);
    this.districts && (treksRequest += `&districts=${this.districts}`);
    this.structures && (treksRequest += `&structures=${this.structures}`);
    this.themes && (treksRequest += `&themes=${this.themes}`);
    this.portals && (treksRequest += `&portals=${this.portals}`);
    this.routes && (treksRequest += `&routes=${this.routes}`);
    this.practices && (treksRequest += `&practices=${this.practices}`);

    treksRequest += `&fields=id,name,attachments,description_teaser,difficulty,duration,ascent,length_2d,practice,themes,route,departure,departure_city,departure_geom&page_size=999`;

    Promise.all([
      fetch(`${this.api}trek_difficulty/?language=${this.language}&fields=id,label,pictogram`, { signal: this.signal }),
      fetch(`${this.api}trek_route/?language=${this.language}&fields=id,route,pictogram`, { signal: this.signal }),
      fetch(`${this.api}trek_practice/?language=${this.language}&fields=id,name,pictogram`, { signal: this.signal }),
      fetch(`${this.api}theme/?language=${this.language}&fields=id,label,pictogram`, { signal: this.signal }),
      fetch(`${this.api}city/?language=${this.language}&fields=id,name&published=true`, { signal: this.signal }),
      fetch(treksRequest, { signal: this.signal }),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(([difficulties, routes, practices, themes, cities, treks]) => {
        state.treksNetworkError = false;
        state.difficulties = difficulties.results;
        state.routes = routes.results;
        state.practices = practices.results.map(practice => ({ ...practice, selected: false }));
        state.themes = themes.results;
        state.cities = cities.results;
        state.durations = [
          { id: 1, name: '0 - 1h', minValue: 0, maxValue: 1, selected: false },
          { id: 2, name: '1 - 2h', minValue: 1, maxValue: 2, selected: false },
          { id: 3, name: '2 - 5h', minValue: 2, maxValue: 5, selected: false },
          { id: 4, name: '5 - 10h', minValue: 5, maxValue: 10, selected: false },
        ];
        state.currentTreks = treks.results;
        state.treksWithinBounds = treks.results;
        state.treks = treks.results;
      })
      .catch(() => (state.treksNetworkError = true));
  }

  disconnectedCallback() {
    this.controller.abort();
    state.treksNetworkError = false;
  }

  render() {
    return <Host></Host>;
  }
}
