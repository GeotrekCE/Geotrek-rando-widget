import { Component, Host, h, Listen, State, Prop, Element, Watch } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state, { onChange, reset } from 'store/store';

@Component({
  tag: 'grw-app',
  styleUrls: ['grw-app.scss'],
  shadow: false,
})
export class GrwApp {
  @Element() appElement: HTMLElement;
  @State() showTrek = false;
  @State() showTreksMap = false;
  @State() showTrekMap = false;
  @State() showFilters = false;
  @State() isLargeView = false;
  @State() currentTrekId: number;
  @Prop() appWidth: string = '100%';
  @Prop() appHeight: string = '100vh';
  @Prop() api: string;
  @Prop() languages = 'fr';
  @Prop() inBbox: string;
  @Prop() cities: string;
  @Prop() districts: string;
  @Prop() structures: string;
  @Prop() themes: string;
  @Prop() portals: string;
  @Prop() routes: string;
  @Prop() practices: string;
  @Prop() center: string;
  @Prop() zoom: number;
  @Prop() nameLayer: string;
  @Prop() urlLayer: string;
  @Prop() attributionLayer: string;
  @Prop() weather = false;

  @Prop() colorPrimaryApp = '#6750a4';
  @Prop() colorOnPrimary = '#ffffff';
  @Prop() colorSurface = '#1c1b1f';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorSurfaceVariant = '#fef7ff';
  @Prop() colorOnSurfaceVariant = '#1c1b1f';
  @Prop() colorPrimaryContainer = '#eaddff';
  @Prop() colorOnPrimaryContainer = '#21005e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorBackground = '#fef7ff';
  @Prop() colorSurfaceContainerHigh = '#ece6f0';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() fabBackgroundColor = '#eaddff';
  @Prop() fabColor = '#21005d';

  @Prop() colorTrekLine = '#6b0030';
  @Prop() colorSensitiveArea = '#4974a5';
  @Prop() colorPoiIcon = '#974c6e';
  @Prop() useGradient = false;

  largeViewSize = 1024;
  handlePopStateBind: (event: any) => void = this.handlePopState.bind(this);

  @Listen('trekCardPress', { target: 'window' })
  onTrekCardPress(event: CustomEvent<number>) {
    const parentTrek = state.parentTrekId ? state.parentTrekId : state.currentTrekSteps ? this.currentTrekId : null;
    state.currentTrek = null;
    this.currentTrekId = event.detail;
    this.showTrek = true;
    this.showTrekMap = false;
    const url = new URL(window.location.toString());
    url.searchParams.set('trek', this.currentTrekId.toString());
    if (state.currentTrekSteps) {
      url.searchParams.set('parentTrek', parentTrek.toString());
    }
    window.history.pushState({}, '', url);
  }

  @Listen('parentTrekPress', { target: 'window' })
  onParentTrekPress(event: CustomEvent<number>) {
    state.currentTrek = null;
    this.currentTrekId = event.detail;
    this.showTrek = true;
    this.showTrekMap = false;
    const url = new URL(window.location.toString());
    url.searchParams.set('trek', this.currentTrekId.toString());
    url.searchParams.delete('parentTrek');
    window.history.pushState({}, '', url);
  }

  @Listen('resize', { target: 'window' })
  onWindowResize() {
    this.handleView();
  }

  @Listen('centerOnMap', { target: 'window' })
  onCenterOnMap() {
    if (!this.isLargeView) {
      this.showTrekMap = true;
    }
  }

  @Watch('isLargeView')
  watchPropHandler() {
    window.dispatchEvent(new window.Event('resize'));
  }

  componentWillLoad() {
    const url = new URL(window.location.toString());
    const trekParam = url.searchParams.get('trek');
    const parentTrekId = url.searchParams.get('parentTrek');
    if (trekParam) {
      window.history.replaceState({ isInitialHistoryWithTrek: true }, '', url);
      state.parentTrekId = parentTrekId ? Number(parentTrekId) : null;
      this.currentTrekId = Number(trekParam);
      this.showTrek = !this.showTrek;
    }
  }

  componentDidLoad() {
    onChange('trekNetworkError', () => {
      if (state.trekNetworkError) {
        const urlRedirect = new URL(window.location.toString());
        urlRedirect.searchParams.delete('trek');
        urlRedirect.searchParams.delete('parentTrek');
        window.history.replaceState({}, '', urlRedirect);
        this.onTrekDetailsClose();
      }
    });
    window.addEventListener('popstate', this.handlePopStateBind, false);
    this.handleView();
  }

  onTrekDetailsClose() {
    state.currentTrek = null;
    state.currentTrekSteps = null;
    state.parentTrekId = null;
    this.currentTrekId = null;
    this.showTrek = !this.showTrek;
  }

  handleView() {
    this.isLargeView = this.appElement.getBoundingClientRect().width >= this.largeViewSize;
    this.showTreksMap = this.isLargeView;
    this.showTrekMap = this.isLargeView;
  }

  handleFilters() {
    this.showFilters = !this.showFilters;
  }

  handleBackButton() {
    if (window.history.state && window.history.state.isInitialHistoryWithTrek) {
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
    const trekParam = Number(url.searchParams.get('trek'));
    if (trekParam && this.currentTrekId !== trekParam) {
      state.currentTrek = null;
      this.currentTrekId = trekParam;
      this.showTrek = true;
    } else if (!trekParam) {
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
    reset();
    window.removeEventListener('popstate', this.handlePopStateBind);
  }

  render() {
    return (
      <Host
        style={{
          '--color-primary-app': this.colorPrimaryApp,
          '--color-on-primary': this.colorOnPrimary,
          '--color-surface': this.colorSurface,
          '--color-on-surface': this.colorOnSurface,
          '--color-surface-variant': this.colorSurfaceVariant,
          '--color-on-surface-variant': this.colorOnSurfaceVariant,
          '--color-primary-container': this.colorPrimaryContainer,
          '--color-on-primary-container': this.colorOnPrimaryContainer,
          '--color-secondary-container': this.colorSecondaryContainer,
          '--color-on-secondary-container': this.colorOnSecondaryContainer,
          '--color-background': this.colorBackground,
          '--color-surface-container-high': this.colorSurfaceContainerHigh,
          '--color-surface-container-low': this.colorSurfaceContainerLow,
          '--fab-background-color': this.fabBackgroundColor,
          '--fab-color': this.fabColor,
          '--app-width': this.appWidth,
          '--app-height': this.appHeight,
        }}
      >
        {!state.currentTreks && !state.currentTrek && (
          <div class="init-loader-container">
            <span class="loader"></span>
          </div>
        )}
        {!this.showTrek && !state.treks && (
          <grw-treks-provider
            api={this.api}
            languages={this.languages}
            in-bbox={this.inBbox}
            cities={this.cities}
            districts={this.districts}
            structures={this.structures}
            themes={this.themes}
            portals={this.portals}
            routes={this.routes}
            practices={this.practices}
          ></grw-treks-provider>
        )}
        {this.showTrek && this.currentTrekId && !state.currentTrek && (
          <grw-trek-provider api={this.api} languages={this.languages} trek-id={this.currentTrekId}></grw-trek-provider>
        )}
        {(state.currentTreks || state.currentTrek) && (
          <div class="app-container">
            <div class={this.isLargeView ? 'large-view-header-container' : 'header-container'}>
              {!this.showTrek ? (
                <div class="handle-search-filters-container">
                  <div class="handle-search-container">
                    <grw-search></grw-search>
                  </div>
                  <div class="handle-filters-container">
                    <button onClick={() => this.handleFilters()} class="handle-filters-button">
                      <span class="material-symbols material-symbols-outlined margin-right-icon">filter_list</span>
                      {translate[state.language].filter}
                    </button>
                  </div>
                </div>
              ) : (
                <div class="arrow-back-container">
                  <button onClick={() => this.handleBackButton()} class="arrow-back-icon">
                    <span class="material-symbols material-symbols-outlined">arrow_back</span>
                  </button>
                </div>
              )}
            </div>

            <div class={`content-container ${this.showTrek ? 'content-trek' : 'content-treks'}`}>
              <div
                class={this.isLargeView ? 'large-view-app-treks-list-container' : 'app-treks-list-container'}
                style={{ display: this.showTrek ? 'none' : 'flex', position: this.showTrek ? 'absolute' : 'relative' }}
              >
                <grw-treks-list
                  reset-store-on-disconnected="false"
                  is-large-view={this.isLargeView}
                  color-primary-app={this.colorPrimaryApp}
                  color-on-surface={this.colorOnSurface}
                  color-secondary-container={this.colorSecondaryContainer}
                  color-on-secondary-container={this.colorOnSecondaryContainer}
                  color-surface-container-low={this.colorSurfaceContainerLow}
                ></grw-treks-list>
              </div>
              {this.showTrek && !state.currentTrek && (
                <div class={this.isLargeView ? 'large-view-loader-container' : 'loader-container'}>
                  <span class="loader"></span>
                </div>
              )}
              {state.currentTrek && (
                <div class={this.isLargeView ? 'large-view-app-trek-detail-container' : 'app-trek-detail-container'}>
                  <grw-trek-detail
                    style={{
                      visibility: (!this.showTrekMap && this.showTrek) || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showTrekMap ? '1' : '0',
                    }}
                    reset-store-on-disconnected="false"
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-primary-container={this.colorPrimaryContainer}
                    color-on-primary-container={this.colorOnPrimaryContainer}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                    color-background={this.colorBackground}
                    weather={this.weather}
                    is-large-view={this.isLargeView}
                  ></grw-trek-detail>
                </div>
              )}
              <grw-map
                reset-store-on-disconnected="false"
                class={this.isLargeView ? 'large-view-app-map-container' : 'app-map-container'}
                style={{
                  visibility: (this.showTreksMap && !this.showTrek) || (this.showTrekMap && this.showTrek) || this.isLargeView ? 'visible' : 'hidden',
                  zIndex: this.showTrekMap ? '1' : '0',
                }}
                center={this.center}
                zoom={this.zoom}
                name-layer={this.nameLayer}
                url-layer={this.urlLayer}
                attribution-layer={this.attributionLayer}
                color-primary-app={this.colorPrimaryApp}
                color-on-surface={this.colorOnSurface}
                color-primary-container={this.colorPrimaryContainer}
                color-on-primary-container={this.colorOnPrimaryContainer}
                color-background={this.colorBackground}
                color-trek-line={this.colorTrekLine}
                color-sensitive-area={this.colorSensitiveArea}
                color-poi-icon={this.colorPoiIcon}
                is-large-view={this.isLargeView}
                use-gradient={this.useGradient}
              ></grw-map>
            </div>
            {(!this.showTrek || (this.showTrek && state.currentTrek)) && (
              <div class="map-visibility-button-container">
                <button onClick={() => this.handleShowMap()} class="map-visibility-button" style={{ display: this.isLargeView ? 'none' : 'flex' }}>
                  <span class="material-symbols material-symbols-outlined">{this.showTrek ? (this.showTrekMap ? 'summarize' : 'map') : this.showTreksMap ? 'list' : 'map'}</span>
                  {this.showTrek
                    ? this.showTrekMap
                      ? translate[state.language].showDetails
                      : translate[state.language].showRoute
                    : this.showTreksMap
                    ? translate[state.language].showList
                    : translate[state.language].showMap}
                </button>
              </div>
            )}
          </div>
        )}
        {!this.showTrek && this.showFilters && <grw-filters handleFilters={() => this.handleFilters()}></grw-filters>}
      </Host>
    );
  }
}
