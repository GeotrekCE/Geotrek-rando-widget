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
  @Prop() portals: string;

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
        <grw-treks-provider api={this.api} portals={this.portals}>
          <div class="header-container">
            {this.showTrek ? <div onClick={() => this.onTrekDetailsClose()} class="arrow-back-icon" innerHTML={arrowBackImage}></div> : <div class="title">{this.appName}</div>}
          </div>
          <div class="content-container">
            {!this.showTrek && (
              <div class="app-treks-list-container">
                <grw-treks-list></grw-treks-list>
              </div>
            )}
            {this.showTrek && !state.currentTrek && (
              <div class="loader-container">
                <span class="loader"></span>
              </div>
            )}
            {this.showTrek && this.currentTrekId && (
              <grw-trek-provider api={state.api} trek-id={this.currentTrekId}>
                {state.currentTrek && (
                  <div class="app-trek-detail-container">
                    <grw-trek-detail></grw-trek-detail>
                  </div>
                )}
              </grw-trek-provider>
            )}
            <div class="app-map-container">
              <grw-map></grw-map>
            </div>
          </div>
        </grw-treks-provider>
      </Host>
    );
  }
}
