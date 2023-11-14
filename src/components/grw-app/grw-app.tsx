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
  @State() showTouristicContent = false;
  @State() showTreksMap = false;
  @State() showTrekMap = false;
  @State() showTouristicContentMap = false;
  @State() showFilters = false;
  @State() isLargeView = false;
  @State() currentTrekId: number;
  @State() currentTouristicContentId: number;
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
    this.currentTouristicContentId = null;
    this.showTouristicContent = false;
    state.currentTouristicContent = null;
    const parentTrek = state.parentTrekId ? state.parentTrekId : state.currentTrekSteps ? this.currentTrekId : null;
    state.currentTrek = null;
    this.currentTrekId = event.detail;
    this.showTrek = true;
    this.showTrekMap = false;
    const url = new URL(window.location.toString());
    url.searchParams.set('trek', this.currentTrekId.toString());
    if (state.currentTrekSteps) {
      url.searchParams.set('parenttrek', parentTrek.toString());
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
    url.searchParams.delete('parenttrek');
    window.history.pushState({}, '', url);
  }

  @Listen('touristicContentCardPress', { target: 'window' })
  onTouristicContentCardPress(event: CustomEvent<number>) {
    state.currentTrek = null;
    this.currentTrekId = null;
    this.showTrek = false;
    this.currentTouristicContentId = event.detail;
    this.showTouristicContent = true;
    this.showTouristicContentMap = false;
    const url = new URL(window.location.toString());
    url.searchParams.delete('trek');
    url.searchParams.set('touristiccontent', this.currentTouristicContentId.toString());
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
    const parentTrekId = url.searchParams.get('parenttrek');
    const touristicContentParam = url.searchParams.get('touristiccontent');
    if (trekParam) {
      window.history.replaceState({ isInitialHistoryWithDetails: true }, '', url);
      state.parentTrekId = parentTrekId ? Number(parentTrekId) : null;
      this.currentTrekId = Number(trekParam);
      this.showTrek = true;
    } else if (touristicContentParam) {
      window.history.replaceState({ isInitialHistoryWithDetails: true }, '', url);
      this.currentTouristicContentId = Number(touristicContentParam);
      this.showTouristicContent = true;
    }
  }

  componentDidLoad() {
    onChange('trekNetworkError', () => {
      if (state.trekNetworkError) {
        const urlRedirect = new URL(window.location.toString());
        urlRedirect.searchParams.delete('trek');
        urlRedirect.searchParams.delete('parenttrek');
        window.history.replaceState({}, '', urlRedirect);
        this.onDetailsClose();
      }
    });
    window.addEventListener('popstate', this.handlePopStateBind, false);
    this.handleView();
  }

  onDetailsClose() {
    this.currentTouristicContentId = null;
    this.showTouristicContent = false;
    this.showTouristicContentMap = false;
    state.currentTouristicContent = null;

    state.currentTrek = null;
    state.currentTrekSteps = null;
    state.parentTrekId = null;
    this.currentTrekId = null;
    this.showTrek = false;
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
    if (window.history.state && window.history.state.isInitialHistoryWithDetails) {
      this.onDetailsClose();
      const url = new URL(window.location.toString());
      url.searchParams.delete('trek');
      url.searchParams.delete('touristiccontent');
      window.history.pushState({}, '', url);
    } else {
      window.history.back();
    }
  }

  handlePopState() {
    const url = new URL(window.location.toString());
    const trekParam = Number(url.searchParams.get('trek'));
    const touristicContentParam = url.searchParams.get('touristiccontent');
    if (trekParam && this.currentTrekId !== trekParam) {
      this.currentTouristicContentId = null;
      this.showTouristicContent = false;
      state.currentTrek = null;
      this.currentTrekId = trekParam;
      this.showTrek = true;
    } else if (!trekParam && !touristicContentParam) {
      this.onDetailsClose();
    }
  }

  handleShowMap() {
    if (this.currentTrekId) {
      this.showTrekMap = !this.showTrekMap;
    } else if (this.showTouristicContent) {
      this.showTouristicContentMap = !this.showTouristicContentMap;
    } else {
      this.showTreksMap = !this.showTreksMap;
    }
  }

  getMapVisibilityIconButton() {
    let mapIconButton: string;

    if (this.showTrek) {
      mapIconButton = this.showTrekMap ? 'summarize' : 'map';
    } else if (this.showTouristicContent) {
      mapIconButton = this.showTouristicContentMap ? 'summarize' : 'map';
    } else {
      mapIconButton = this.showTreksMap ? 'list' : 'map';
    }

    return mapIconButton;
  }

  getMapVisibilityLabelButton() {
    let mapLabelButton: string;

    if (this.showTrek) {
      mapLabelButton = this.showTrekMap ? translate[state.language].showDetails : translate[state.language].showRoute;
    } else if (this.showTouristicContent) {
      mapLabelButton = this.showTouristicContentMap ? translate[state.language].showDetails : translate[state.language].showMap;
    } else {
      mapLabelButton = this.showTreksMap ? translate[state.language].showList : translate[state.language].showMap;
    }

    return mapLabelButton;
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
        {!state.currentTreks && !state.currentTrek && !state.currentTouristicContent && (
          <div class="init-loader-container">
            <span class="loader"></span>
          </div>
        )}
        {!this.showTrek && !this.showTouristicContent && !state.treks && (
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
        {this.showTouristicContent && this.currentTouristicContentId && (
          <grw-touristic-content-provider api={this.api} languages={this.languages} touristic-content-id={this.currentTouristicContentId}></grw-touristic-content-provider>
        )}
        {(state.currentTreks || state.currentTrek || state.currentTouristicContent) && (
          <div class="app-container">
            <div class={this.isLargeView ? 'large-view-header-container' : 'header-container'}>
              {!this.showTrek && !this.showTouristicContent ? (
                <div class="handle-search-filters-container">
                  <div class="handle-search-container">
                    <grw-search></grw-search>
                  </div>
                  <div class="handle-filters-container">
                    <button onClick={() => this.handleFilters()} class="handle-filters-button">
                      {/* @ts-ignore */}
                      <span translate={false} class="material-symbols material-symbols-outlined margin-right-icon">
                        filter_list
                      </span>
                      {translate[state.language].filter}
                    </button>
                  </div>
                </div>
              ) : (
                <div class="arrow-back-container">
                  <button onClick={() => this.handleBackButton()} class="arrow-back-icon">
                    {/* @ts-ignore */}
                    <span translate={false} class="material-symbols material-symbols-outlined">
                      arrow_back
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div class={`content-container ${this.showTrek ? 'content-trek' : 'content-treks'}`}>
              <div
                class={this.isLargeView ? 'large-view-app-treks-list-container' : 'app-treks-list-container'}
                style={{ display: this.showTrek || this.showTouristicContent ? 'none' : 'flex', position: this.showTrek ? 'absolute' : 'relative' }}
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
              {((this.showTrek && !state.currentTrek) || (this.showTouristicContent && !state.currentTouristicContent)) && (
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
              {this.showTouristicContent && (
                <div class={this.isLargeView ? 'large-view-app-touristic-content-detail-container' : 'app-touristic-content-detail-container'}>
                  <grw-touristic-content-detail
                    style={{
                      visibility: !this.showTouristicContentMap || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showTouristicContentMap ? '1' : '0',
                    }}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-primary-container={this.colorPrimaryContainer}
                    color-on-primary-container={this.colorOnPrimaryContainer}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                    color-background={this.colorBackground}
                    is-large-view={this.isLargeView}
                  ></grw-touristic-content-detail>
                </div>
              )}
              <grw-map
                reset-store-on-disconnected="false"
                class={this.isLargeView ? 'large-view-app-map-container' : 'app-map-container'}
                style={{
                  visibility:
                    (this.showTreksMap && !this.showTrek) || (this.showTrekMap && this.showTrek) || (this.showTouristicContentMap && this.showTouristicContent) || this.isLargeView
                      ? 'visible'
                      : 'hidden',
                  zIndex: this.showTreksMap || this.showTrekMap || this.showTouristicContentMap ? '1' : '0',
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
            {((!this.showTrek && !this.showTouristicContent) || (this.showTrek && state.currentTrek) || (this.showTouristicContent && state.currentTouristicContent)) && (
              <div class="map-visibility-button-container">
                <button onClick={() => this.handleShowMap()} class="map-visibility-button" style={{ display: this.isLargeView ? 'none' : 'flex' }}>
                  {/* @ts-ignore */}
                  <span translate={false} class="material-symbols material-symbols-outlined">
                    {this.getMapVisibilityIconButton()}
                  </span>
                  {this.getMapVisibilityLabelButton()}
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
