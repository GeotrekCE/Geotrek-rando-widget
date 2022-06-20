import { Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-treks-provider',
})
export class GrwTreksProvider {
  @Prop() api: string;

  componentWillLoad() {
    return Promise.all([
      fetch(`${this.api}trek/?language=fr&fields=id,name,attachments,description_teaser,difficulty,duration,ascent,length_2d,practice,route&page_size=5`),
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
