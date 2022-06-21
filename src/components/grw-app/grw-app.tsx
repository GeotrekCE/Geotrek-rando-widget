import { Component, Host, h, Listen, State, Prop } from '@stencil/core';
import state from 'store/store';
import arrowBackImage from '../../assets/arrow-back.svg';

@Component({
  tag: 'grw-app',
  styleUrl: 'grw-app.scss',
  shadow: true,
})
export class GrwApp {
  @State() showTrek: boolean;
  @State() currentTrekId: number;
  @Prop() api: string;
  @Prop() appName: string = 'Geotrek Rando Widget';

  @Listen('trekCardPress')
  onTrekCardPress(event: CustomEvent<number>) {
    this.currentTrekId = event.detail;
    this.showTrek = !this.showTrek;
  }

  onTrekDetailsClose() {
    this.currentTrekId = null;
    this.showTrek = !this.showTrek;
  }

  render() {
    return (
      <Host>
        <grw-treks-provider api={this.api}>
          <div class="appbar-container">
            {this.showTrek ? <div onClick={() => this.onTrekDetailsClose()} class="arrow-back-icon" innerHTML={arrowBackImage}></div> : <div class="title">{this.appName}</div>}
          </div>
          {!this.showTrek && <grw-treks-list></grw-treks-list>}
          {this.showTrek && !state.currentTrek && (
            <div class="loader-container">
              <span class="loader"></span>
            </div>
          )}
          {this.showTrek && (
            <grw-trek-provider api={state.api} trek-id={this.currentTrekId}>
              <div class="trek-detail-map-container">
                <grw-trek-detail></grw-trek-detail>
                <grw-map></grw-map>
              </div>
            </grw-trek-provider>
          )}
        </grw-treks-provider>
      </Host>
    );
  }
}
