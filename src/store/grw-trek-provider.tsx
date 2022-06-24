import { Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-trek-provider',
  shadow: true,
})
export class GrwTrekProvider {
  @Prop() api: string;
  @Prop() trekId: string;

  componentWillLoad() {
    state.api = this.api;
    return Promise.all([
      fetch(`${this.api}trek_difficulty/?language=fr`),
      fetch(`${this.api}trek_route/?language=fr`),
      fetch(`${this.api}trek_practice/?language=fr`),
      fetch(`${this.api}trek/${this.trekId}/?language=fr&fields=id,name,attachments,description,description_teaser,difficulty,duration,ascent,length_2d,practice,route,geometry`),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(([difficulties, routes, practices, trek]) => {
        state.difficulties = difficulties.results;
        state.routes = routes.results;
        state.practices = practices.results;
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
