import { Component, Host, h, Prop } from '@stencil/core';
import { Poi } from 'types/types';

@Component({
  tag: 'grw-poi-detail',
  styleUrl: 'grw-poi-detail.scss',
  shadow: true,
})
export class GrwPoiDetail {
  @Prop() poi: Poi;
  render() {
    return (
      <Host>
        <div class="poi-img">
          <img src={this.poi.attachments[0].thumbnail} />
        </div>
        <div class="poi-right-container">
          <div class="poi-name">{this.poi.name}</div>
          <div class="poi-description" innerHTML={this.poi.description}></div>
        </div>
      </Host>
    );
  }
}
