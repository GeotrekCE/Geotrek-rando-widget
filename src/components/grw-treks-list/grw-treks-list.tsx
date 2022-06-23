import { Component, Host, h, Element, State } from '@stencil/core';
import state from 'store/store';
import { Treks } from 'types/types';

@Component({
  tag: 'grw-treks-list',
  styleUrl: 'grw-treks-list.scss',
  shadow: true,
})
export class GrwTreksList {
  @Element() element: HTMLElement;
  @State() treksToDisplay: Treks = [];
  step = 10;

  componentWillLoad() {
    this.treksToDisplay = state.treks.slice(0, this.step);
    this.element.addEventListener('scroll', event => {
      if ((event as any).path[0].scrollTop + (event as any).path[0].scrollHeight / 4 >= (event as any).path[0].scrollHeight) {
        this.treksToDisplay = state.treks.slice(0, this.treksToDisplay.length + this.step);
      }
    });
  }

  render() {
    return (
      <Host class="treks-list-container">
        {this.treksToDisplay.map(trek => (
          <grw-trek-card trek={trek}></grw-trek-card>
        ))}
      </Host>
    );
  }
}
