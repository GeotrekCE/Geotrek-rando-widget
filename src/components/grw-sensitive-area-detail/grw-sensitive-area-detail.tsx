import { Component, Host, h, Prop } from '@stencil/core';
import { SensitiveArea } from 'types/types';

@Component({
  tag: 'grw-sensitive-area-detail',
  styleUrl: 'grw-sensitive-area-detail.scss',
  shadow: true,
})
export class GrwSensitiveAreaDetail {
  @Prop() sensitiveArea: SensitiveArea;

  render() {
    return (
      <Host>
        <div class="sensitive-area-name">{this.sensitiveArea.name}</div>
        <div class="sensitive-area-description" innerHTML={this.sensitiveArea.description}></div>
      </Host>
    );
  }
}
