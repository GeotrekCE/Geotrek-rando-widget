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
  @State() showMap: boolean;
  @State() currentTrekId: number;
  @Prop() api: string;
  @Prop() portals: string;
  @Prop() appName: string = 'Geotrek Rando Widget';
  @Prop() colorPrimary: string = '#6b0030';
  @Prop() colorPrimaryTint: string = '#d2b2c0';

  @Listen('trekCardPress')
  onTrekCardPress(event: CustomEvent<number>) {
    this.currentTrekId = event.detail;
    this.showTrek = !this.showTrek;
  }

  @Listen('resize', { target: 'window' })
  onWindowResize(event: any) {
    this.showMap = !(event.composedPath()[0].innerWidth < 664);
  }

  onTrekDetailsClose() {
    this.currentTrekId = null;
    this.showTrek = !this.showTrek;
  }

  componentWillLoad() {
    this.showMap = !(window.innerWidth < 664);
  }

  render() {
    return (
      <Host style={{ '--color-primary': this.colorPrimary, '--color-primary-tint': this.colorPrimaryTint }}>
        <grw-treks-provider api={this.api} portals={this.portals}>
          <div class="header-container">
            {this.showTrek ? <div onClick={() => this.onTrekDetailsClose()} class="arrow-back-icon" innerHTML={arrowBackImage}></div> : <div class="title">{this.appName}</div>}
          </div>
          <div class="content-container">
            <div class="app-treks-list-container" style={{ visibility: this.showTrek ? 'hidden' : 'visible', position: this.showTrek ? 'absolute' : 'relative' }}>
              <grw-treks-list></grw-treks-list>
            </div>
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
            <div class="app-map-container" style={{ visibility: this.showMap ? 'visible' : 'hidden' }}>
              <grw-map></grw-map>
            </div>
          </div>
          <div class="map-visibility-button">
            <div onClick={() => (this.showMap = !this.showMap)}>{this.showMap ? (this.showTrek ? 'Voir la fiche' : 'Voir la liste') : 'Voir la carte'}</div>
          </div>
        </grw-treks-provider>
      </Host>
    );
  }
}
