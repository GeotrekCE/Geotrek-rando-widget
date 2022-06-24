import { Component, Host, h, Listen, State, Prop, Element } from '@stencil/core';
import state from 'store/store';
import arrowBackImage from '../../assets/arrow-back.svg';

@Component({
  tag: 'grw-app',
  styleUrls: ['grw-app.scss', 'grw-app.css'],
  shadow: true,
})
export class GrwApp {
  @State() showTrek: boolean;
  @State() showMap: boolean;
  @State() isLargeView: boolean;
  @State() currentTrekId: number;
  @Prop() api: string;
  @Prop() portals: string;
  @Prop() appName: string = 'Geotrek Rando Widget';
  @Prop() colorPrimary: string = '#6b0030';
  @Prop() colorPrimaryTint: string = '#d2b2c0';
  @Element() element: HTMLElement;

  @Listen('trekCardPress')
  onTrekCardPress(event: CustomEvent<number>) {
    this.currentTrekId = event.detail;
    this.showTrek = !this.showTrek;
  }

  @Listen('resize', { target: 'window' })
  onWindowResize() {
    this.isLargeView = this.element.getBoundingClientRect().width >= 664;
    this.showMap = this.isLargeView;
  }

  onTrekDetailsClose() {
    this.currentTrekId = null;
    this.showTrek = !this.showTrek;
  }

  componentDidLoad() {
    this.isLargeView = this.element.getBoundingClientRect().width >= 664;
    this.showMap = this.isLargeView;
  }

  render() {
    return (
      <Host style={{ '--color-primary': this.colorPrimary, '--color-primary-tint': this.colorPrimaryTint }}>
        <grw-treks-provider api={this.api} portals={this.portals}></grw-treks-provider>
        {this.showTrek && this.currentTrekId && <grw-trek-provider api={state.api} trek-id={this.currentTrekId}></grw-trek-provider>}
        <div class="app-container">
          <div class={this.isLargeView ? 'large-view-header-container' : 'header-container'}>
            {this.showTrek ? <div onClick={() => this.onTrekDetailsClose()} class="arrow-back-icon" innerHTML={arrowBackImage}></div> : <div class="title">{this.appName}</div>}
          </div>
          <div class="content-container">
            <div
              class={this.isLargeView ? 'large-view-app-treks-list-container' : 'app-treks-list-container'}
              style={{ display: this.showTrek ? 'none' : 'flex', position: this.showTrek ? 'absolute' : 'relative' }}
            >
              <grw-treks-list></grw-treks-list>
            </div>
            {this.showTrek && !state.currentTrek && (
              <div class={this.isLargeView ? 'large-view-loader-container' : 'loader-container'}>
                <span class="loader"></span>
              </div>
            )}
            {state.currentTrek && (
              <div class={this.isLargeView ? 'large-view-app-trek-detail-container' : 'app-trek-detail-container'}>
                <grw-trek-detail></grw-trek-detail>
              </div>
            )}
            <grw-map class={this.isLargeView ? 'large-view-app-map-container' : 'app-map-container'} style={{ visibility: this.showMap ? 'visible' : 'hidden' }}></grw-map>
          </div>
          <div class="map-visibility-button" style={{ display: this.isLargeView ? 'none' : 'flex' }}>
            <div onClick={() => (this.showMap = !this.showMap)}>{this.showMap ? (this.showTrek ? 'Voir la fiche' : 'Voir la liste') : 'Voir la carte'}</div>
          </div>
        </div>
      </Host>
    );
  }
}
