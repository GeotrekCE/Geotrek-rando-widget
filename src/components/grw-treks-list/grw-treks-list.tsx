import { Component, Host, h } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-treks-list',
  styleUrl: 'grw-treks-list.scss',
  shadow: true,
})
export class GrwTreksList {
  render() {
    return (
      <Host>
        <div class="treks-list-container">
          {state.treks.map(trek => (
            <grw-trek-card trek={trek}></grw-trek-card>
          ))}
        </div>
      </Host>
    );
  }
}
