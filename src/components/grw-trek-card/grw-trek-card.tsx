import { Component, Host, h, Prop } from '@stencil/core';
import { Trek } from 'types/types';

@Component({
  tag: 'grw-trek-card',
  styleUrl: 'grw-trek-card.scss',
  shadow: true,
})
export class GrwTrekCard {
  @Prop() trek: Trek;

  render() {
    return <Host>{this.trek.name}</Host>;
  }
}
