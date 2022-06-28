import { Component, Host, h, Listen, State, Prop, Element, Watch } from '@stencil/core';
import state from 'store/store';
import arrowBackImage from '../../assets/arrow-back.svg';

@Component({
  tag: 'grw-app',
  styleUrls: ['grw-app.scss'],
  shadow: true,
})
export class GrwApp {
  @Element() element: HTMLElement;
  @State() showTrek = false;
  @State() showMap = false;
  @State() isLargeView = false;
  @State() currentTrekId: number;
  @Prop() api: string;
  @Prop() inBbox: string;
  @Prop() cities: string;
  @Prop() districts: string;
  @Prop() structures: string;
  @Prop() themes: string;
  @Prop() portals: string;
  @Prop() routes: string;
  @Prop() practices: string;
  @Prop() appName: string = 'Geotrek Rando Widget';
  @Prop() urlLayer: string;
  @Prop() center: string;
  @Prop() zoom;
  @Prop() attribution: string;
  @Prop() colorPrimary: string = '#6b0030';
  @Prop() colorPrimaryTint: string = '#d2b2c0';
  @Prop() colorTrekLine: string = '#6b0030';
  @Prop() colorDepartureIcon: string = '#006b3b';
  @Prop() colorArrivalIcon: string = '#85003b';
  largeViewSize = 664;

  @Listen('trekCardPress')
  onTrekCardPress(event: CustomEvent<number>) {
    this.currentTrekId = event.detail;
    this.showTrek = !this.showTrek;
  }

  @Listen('resize', { target: 'window' })
  onWindowResize() {
    this.handleView();
  }

  @Watch('isLargeView')
  watchPropHandler() {
    window.dispatchEvent(new window.Event('resize'));
  }

  componentDidLoad() {
    this.handleView();
  }

  onTrekDetailsClose() {
    this.currentTrekId = null;
    this.showTrek = !this.showTrek;
  }

  handleView() {
    this.isLargeView = this.element.getBoundingClientRect().width >= this.largeViewSize;
    this.showMap = this.isLargeView;
  }

  render() {
    return (
      <Host style={{ '--color-primary': this.colorPrimary, '--color-primary-tint': this.colorPrimaryTint }}>
        <grw-treks-provider
          api={this.api}
          in-bbox={this.inBbox}
          cities={this.cities}
          districts={this.districts}
          structures={this.structures}
          themes={this.themes}
          portals={this.portals}
          routes={this.routes}
          practices={this.practices}
        ></grw-treks-provider>
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
              <grw-treks-list color-primary={this.colorPrimary} color-primary-tint={this.colorPrimaryTint}></grw-treks-list>
            </div>
            {this.showTrek && !state.currentTrek && (
              <div class={this.isLargeView ? 'large-view-loader-container' : 'loader-container'}>
                <span class="loader"></span>
              </div>
            )}
            {state.currentTrek && (
              <div class={this.isLargeView ? 'large-view-app-trek-detail-container' : 'app-trek-detail-container'}>
                <grw-trek-detail color-primary={this.colorPrimary} color-primary-tint={this.colorPrimaryTint}></grw-trek-detail>
              </div>
            )}
            <grw-map
              class={this.isLargeView ? 'large-view-app-map-container' : 'app-map-container'}
              style={{ visibility: this.showMap ? 'visible' : 'hidden' }}
              url-layer={this.urlLayer}
              center={this.center}
              zoom={this.zoom}
              attribution={this.attribution}
              color-trek-line={this.colorTrekLine}
              color-departure-icon={this.colorDepartureIcon}
              color-arrival-icon={this.colorArrivalIcon}
            ></grw-map>
          </div>
          <div class="map-visibility-button" style={{ display: this.isLargeView ? 'none' : 'flex' }}>
            <div onClick={() => (this.showMap = !this.showMap)}>{this.showMap ? (this.showTrek ? 'Voir la fiche' : 'Voir la liste') : 'Voir la carte'}</div>
          </div>
        </div>
      </Host>
    );
  }
}
