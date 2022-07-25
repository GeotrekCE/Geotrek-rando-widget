import { Component, Host, h, Listen, State, Prop, Element, Watch } from '@stencil/core';
import state, { onChange } from 'store/store';
import arrowBackImage from '../../assets/arrow-back.svg';

@Component({
  tag: 'grw-app',
  styleUrls: ['grw-app.scss'],
  shadow: true,
})
export class GrwApp {
  @Element() element: HTMLElement;
  @State() showTrek = false;
  @State() showTreksMap = false;
  @State() showTrekMap = false;
  @State() showFilters = false;
  @State() isLargeView = false;
  @State() currentTrekId: number;
  @Prop() api: string;
  @Prop() language = 'fr';
  @Prop() inBbox: string;
  @Prop() cities: string;
  @Prop() districts: string;
  @Prop() structures: string;
  @Prop() themes: string;
  @Prop() portals: string;
  @Prop() routes: string;
  @Prop() practices: string;
  @Prop() urlLayer: string;
  @Prop() center: string;
  @Prop() zoom: number;
  @Prop() attribution: string;
  @Prop() colorPrimary = '#6b0030';
  @Prop() colorPrimaryShade = '#4a0021';
  @Prop() colorPrimaryTint = '#974c6e';
  @Prop() colorTrekLine = '#6b0030';
  @Prop() colorDepartureIcon = '#006b3b';
  @Prop() colorArrivalIcon = '#85003b';
  @Prop() colorSensitiveArea = '#4974a5';
  @Prop() colorPoiIcon = '#974c6e';
  largeViewSize = 1024;
  handlePopStateBind: (event: any) => void = this.handlePopState.bind(this);

  @Listen('trekCardPress')
  onTrekCardPress(event: CustomEvent<number>) {
    this.currentTrekId = event.detail;
    this.showTrek = !this.showTrek;
    const url = new URL(window.location.toString());
    url.searchParams.set('trek', this.currentTrekId.toString());
    window.history.pushState({}, '', url);
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
    onChange('trekNetworkError', () => {
      if (state.trekNetworkError) {
        const urlRedirect = new URL(window.location.toString());
        urlRedirect.searchParams.delete('trek');
        window.history.replaceState({}, '', urlRedirect);
        this.onTrekDetailsClose();
      }
    });
    this.handleView();
    window.addEventListener('popstate', this.handlePopStateBind, false);
    const url = new URL(window.location.toString());
    const trekParam = url.searchParams.get('trek');
    if (trekParam) {
      window.history.replaceState({ isInitialHistoryWithTrek: true }, '', url);
      this.currentTrekId = Number(trekParam);
      this.showTrek = !this.showTrek;
    }
  }

  onTrekDetailsClose() {
    this.currentTrekId = null;
    this.showTrek = !this.showTrek;
  }

  handleView() {
    this.isLargeView = this.element.getBoundingClientRect().width >= this.largeViewSize;
    this.showTreksMap = this.isLargeView;
    this.showTrekMap = this.isLargeView;
  }

  handleFilters() {
    this.showFilters = !this.showFilters;
  }

  handleBackButton() {
    if (window.history.state.isInitialHistoryWithTrek) {
      this.onTrekDetailsClose();
      const url = new URL(window.location.toString());
      url.searchParams.delete('trek');
      window.history.pushState({}, '', url);
    } else {
      window.history.back();
    }
  }

  handlePopState() {
    const url = new URL(window.location.toString());
    const trekParam = url.searchParams.get('trek');
    if (trekParam) {
      this.currentTrekId = Number(trekParam);
      this.showTrek = !this.showTrek;
    } else {
      this.onTrekDetailsClose();
    }
  }

  handleShowMap() {
    if (this.currentTrekId) {
      this.showTrekMap = !this.showTrekMap;
    } else {
      this.showTreksMap = !this.showTreksMap;
    }
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.handlePopStateBind);
  }

  render() {
    return (
      <Host style={{ '--color-primary': this.colorPrimary, '--color-primary-tint': this.colorPrimaryTint, '--color-primary-shade': this.colorPrimaryShade }}>
        <grw-treks-provider
          api={this.api}
          language={this.language}
          in-bbox={this.inBbox}
          cities={this.cities}
          districts={this.districts}
          structures={this.structures}
          themes={this.themes}
          portals={this.portals}
          routes={this.routes}
          practices={this.practices}
        ></grw-treks-provider>
        {this.showTrek && this.currentTrekId && <grw-trek-provider api={state.api} language={this.language} trek-id={this.currentTrekId}></grw-trek-provider>}
        <div class="app-container">
          <div class={this.isLargeView ? 'large-view-header-container' : 'header-container'}>
            {this.showTrek ? (
              <div onClick={() => this.handleBackButton()} class="arrow-back-icon" innerHTML={arrowBackImage}></div>
            ) : (
              <div class="handle-filters-container">
                <div onClick={() => this.handleFilters()} class="handle-filters-button">
                  FILTRER
                </div>
                <div class="current-treks-within-bounds-length">{`${state.treksWithinBounds.length} randonnée${state.treksWithinBounds.length > 1 ? 's' : ''}`}</div>
              </div>
            )}
            {!this.showTrek && this.showFilters && (
              <div class="options-container">
                <div class="filters-container">
                  <div onClick={() => this.handleFilters()} class="close-filters-button">
                    X
                  </div>
                  <div>
                    <grw-filter filterName="Pratique" filterType="practices" filterNameProperty="name"></grw-filter>
                  </div>
                  <div class="filter-margin-top">
                    <grw-filter filterName="Difficulté" filterType="difficulties" filterNameProperty="label"></grw-filter>
                  </div>
                  <div class="filter-margin-top">
                    <grw-filter filterName="Durée" filterType="durations" filterNameProperty="name"></grw-filter>
                  </div>
                </div>
                <div onClick={() => this.handleFilters()} class="back-filters-container"></div>
              </div>
            )}
            <div class="attribution-container">
              <a target="_blank" href="https://geotrek.fr">
                GEOTREK
              </a>
            </div>
          </div>
          <div class="content-container">
            <div
              class={this.isLargeView ? 'large-view-app-treks-list-container' : 'app-treks-list-container'}
              style={{ display: this.showTrek ? 'none' : 'flex', position: this.showTrek ? 'absolute' : 'relative' }}
            >
              <grw-treks-list is-large-view={this.isLargeView} color-primary={this.colorPrimary} color-primary-tint={this.colorPrimaryTint}></grw-treks-list>
            </div>
            {this.showTrek && !state.currentTrek && (
              <div class={this.isLargeView ? 'large-view-loader-container' : 'loader-container'}>
                <span class="loader"></span>
              </div>
            )}
            {state.currentTrek && (
              <div class={this.isLargeView ? 'large-view-app-trek-detail-container' : 'app-trek-detail-container'}>
                <grw-trek-detail color-primary={this.colorPrimary} color-primary-shade={this.colorPrimaryShade} color-primary-tint={this.colorPrimaryTint}></grw-trek-detail>
              </div>
            )}
            <grw-map
              class={this.isLargeView ? 'large-view-app-map-container' : 'app-map-container'}
              style={{ visibility: (this.showTreksMap && !this.showTrek) || (this.showTrekMap && this.showTrek) ? 'visible' : 'hidden' }}
              url-layer={this.urlLayer}
              center={this.center}
              zoom={this.zoom}
              attribution={this.attribution}
              color-primary={this.colorPrimary}
              color-primary-tint={this.colorPrimaryTint}
              color-trek-line={this.colorTrekLine}
              color-departure-icon={this.colorDepartureIcon}
              color-arrival-icon={this.colorArrivalIcon}
              color-sensitive-area={this.colorSensitiveArea}
              color-poi-icon={this.colorPoiIcon}
            ></grw-map>
          </div>
          <div class="map-visibility-button" style={{ display: this.isLargeView ? 'none' : 'flex' }}>
            <div onClick={() => this.handleShowMap()}>{this.showTreksMap || this.showTrekMap ? (this.showTrek ? 'Voir la fiche' : 'Voir la liste') : 'Voir la carte'}</div>
          </div>
        </div>
      </Host>
    );
  }
}
