import { Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-treks-provider',
})
export class GrwTreksProvider {
  @Prop() api: string;

  componentWillLoad() {
    return fetch(`${this.api}trek/?language=fr&fields=id,name&page_size=999`)
      .then(response => response.json())
      .then(treks => {
        state.treks = treks.results;
      });
  }

  render() {
    return <Host></Host>;
  }
}
