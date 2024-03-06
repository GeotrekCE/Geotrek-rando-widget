import { Component, Host, h, Listen, State, Prop, Element, Watch, Event, EventEmitter, Fragment } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state, { reset } from 'store/store';
import { handleTreksFiltersAndSearch } from 'utils/utils';

@Component({
  tag: 'grw-app',
  styleUrls: ['grw-app.scss'],
  shadow: false,
})
export class GrwApp {
  @Element() appElement: HTMLElement;
  @State() showTrek = false;
  @State() showTouristicContent = false;
  @State() showTouristicEvent = false;
  @State() showHomeMap = false;
  @State() showTrekMap = false;
  @State() showTouristicContentMap = false;
  @State() showTouristicEventMap = false;
  @State() showFilters = false;
  @State() isLargeView = false;
  @State() currentTrekId: number;
  @State() currentTouristicContentId: number;
  @State() currentTouristicEventId: number;
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
  @Prop() emergencyNumber: number;

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6750a4';
  @Prop() colorPrimary = '#6750a4';
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
  @Prop() rounded = true;

  @Prop() colorTrekLine = '#6b0030';
  @Prop() colorSensitiveArea = '#4974a5';
  @Prop() colorPoiIcon = '#974c6e';
  @Prop() useGradient = false;

  @Prop() treks = true;
  @Prop() touristicContents = false;
  @Prop() touristicEvents = false;

  @Prop() enableOffline = false;
  @Prop() globalTilesMinZoomOffline = 0;
  @Prop() globalTilesMaxZoomOffline = 11;
  @Prop() trekTilesMinZoomOffline = 12;
  @Prop() trekTilesMaxZoomOffline = 16;

  @State() showOfflineModal = false;
  @State() showConfirmModal = false;
  @State() showLoaderModal = false;
  @State() showSuccessModal = false;
  @State() showConfirmDeleteModal = false;
  @State() showDeletingMessage = false;
  @State() showDeleteSuccessMessage = false;

  @Event() trekDownloadPress: EventEmitter<number>;
  @Event() trekDeletePress: EventEmitter<number>;

  largeViewSize = 1024;
  handlePopStateBind: (event: any) => void = this.handlePopState.bind(this);

  @Listen('trekCardPress', { target: 'window' })
  onTrekCardPress(event: CustomEvent<number>) {
    this.currentTouristicContentId = null;
    this.showTouristicContent = false;
    state.currentTouristicContent = null;
    this.currentTouristicEventId = null;
    this.showTouristicEvent = false;
    state.currentTouristicEvent = null;
    const parentTrek = state.parentTrekId ? state.parentTrekId : state.currentTrekSteps ? this.currentTrekId : null;
    state.currentTrek = null;
    this.currentTrekId = event.detail;
    state.mode = 'treks';
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
    state.mode = 'treks';
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
    state.mode = 'touristicContents';
    this.showTouristicContent = true;
    this.showTouristicContentMap = false;
    const url = new URL(window.location.toString());
    url.searchParams.delete('trek');
    url.searchParams.set('touristiccontent', this.currentTouristicContentId.toString());
    window.history.pushState({}, '', url);
  }

  @Listen('touristicEventCardPress', { target: 'window' })
  onTouristiceEventCardPress(event: CustomEvent<number>) {
    state.currentTrek = null;
    this.currentTrekId = null;
    this.showTrek = false;
    this.currentTouristicEventId = event.detail;
    ``;
    state.mode = 'touristicEvents';
    this.showTouristicEvent = true;
    this.showTouristicEventMap = false;
    const url = new URL(window.location.toString());
    url.searchParams.delete('trek');
    url.searchParams.set('touristicevent', this.currentTouristicEventId.toString());
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

  @Listen('trekDownloadConfirm', { target: 'window' })
  onTrekDownloadConfirm() {
    this.showLoaderModal = false;
    this.showSuccessModal = false;
    this.showDeleteSuccessMessage = false;
    this.showDeletingMessage = false;
    this.showConfirmDeleteModal = false;
    this.showOfflineModal = true;
    this.showConfirmModal = true;
  }

  @Listen('trekDownloadedSuccessConfirm', { target: 'window' })
  onTrekDownloadedSuccessConfirm() {
    this.showLoaderModal = false;
    this.showSuccessModal = true;
  }

  @Listen('trekDeleteConfirm', { target: 'window' })
  onTrekDeleteConfirm() {
    this.showLoaderModal = false;
    this.showSuccessModal = false;
    this.showDeleteSuccessMessage = false;
    this.showOfflineModal = true;
    this.showConfirmModal = true;
    this.showConfirmDeleteModal = true;
  }

  @Listen('trekDeleteSuccessConfirm', { target: 'window' })
  onTrekDeleteSuccessConfirm() {
    this.showLoaderModal = false;
    this.showSuccessModal = true;
    this.showDeleteSuccessMessage = true;
  }

  @Watch('isLargeView')
  watchPropHandler() {
    window.dispatchEvent(new window.Event('resize'));
  }

  componentWillLoad() {
    if (this.treks) {
      state.mode = 'treks';
    } else if (this.touristicContents) {
      state.mode = 'touristicContents';
    } else if (this.touristicEvents) {
      state.mode = 'touristicEvents';
    }
    const url = new URL(window.location.toString());
    const trekParam = url.searchParams.get('trek');
    const parentTrekId = url.searchParams.get('parenttrek');
    const touristicContentParam = url.searchParams.get('touristiccontent');
    const touristicEventParam = url.searchParams.get('touristicevent');
    if (trekParam) {
      window.history.replaceState({ isInitialHistoryWithDetails: true }, '', url);
      state.parentTrekId = parentTrekId ? Number(parentTrekId) : null;
      this.currentTrekId = Number(trekParam);
      state.mode = 'treks';
      this.showTrek = true;
    } else if (touristicContentParam) {
      window.history.replaceState({ isInitialHistoryWithDetails: true }, '', url);
      this.currentTouristicContentId = Number(touristicContentParam);
      state.mode = 'touristicContents';
      this.showTouristicContent = true;
    } else if (touristicEventParam) {
      window.history.replaceState({ isInitialHistoryWithDetails: true }, '', url);
      this.currentTouristicEventId = Number(touristicEventParam);
      state.mode = 'touristicEvents';
      this.showTouristicEvent = true;
    }
  }

  componentDidLoad() {
    window.addEventListener('popstate', this.handlePopStateBind, false);
    this.handleView();
  }

  onDetailsClose() {
    if (this.treks) {
      state.mode = 'treks';
    } else if (this.touristicContents) {
      state.mode = 'touristicContents';
    } else if (this.touristicEvents) {
      state.mode = 'touristicEvents';
    }
    this.currentTouristicContentId = null;
    this.showTouristicContent = false;
    this.showTouristicContentMap = false;
    this.showTouristicEvent = false;
    this.showTouristicEventMap = false;
    state.currentTouristicContent = null;
    state.currentTouristicEvent = null;
    state.currentTrek = null;
    state.currentTrekSteps = null;
    state.parentTrekId = null;
    this.currentTrekId = null;
    this.showTrek = false;
  }

  handleView() {
    this.isLargeView = this.appElement.getBoundingClientRect().width >= this.largeViewSize;
    this.showHomeMap = this.isLargeView;
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
      url.searchParams.delete('touristicevent');
      window.history.pushState({}, '', url);
    } else {
      window.history.back();
    }
  }

  handlePopState() {
    const url = new URL(window.location.toString());
    const trekParam = Number(url.searchParams.get('trek'));
    const touristicContentParam = url.searchParams.get('touristiccontent');
    const touristicEventParam = url.searchParams.get('touristicevent');
    if (trekParam && this.currentTrekId !== trekParam) {
      this.currentTouristicContentId = null;
      this.showTouristicContent = false;
      this.showTouristicEvent = false;
      state.currentTouristicContent = null;
      state.currentTouristicEvent = null;
      state.currentTrek = null;
      this.currentTrekId = trekParam;
      state.mode = 'treks';
      this.showTrek = true;
    } else if (!trekParam && !touristicContentParam && !touristicEventParam) {
      this.onDetailsClose();
    }
  }

  handleShowMap() {
    if (this.currentTrekId) {
      this.showTrekMap = !this.showTrekMap;
    } else if (this.showTouristicContent) {
      this.showTouristicContentMap = !this.showTouristicContentMap;
    } else if (this.showTouristicEvent) {
      this.showTouristicEventMap = !this.showTouristicEventMap;
    } else {
      this.showHomeMap = !this.showHomeMap;
    }
  }

  getMapVisibilityIconButton() {
    let mapIconButton: string;

    if (this.showTrek) {
      mapIconButton = this.showTrekMap ? 'summarize' : 'map';
    } else if (this.showTouristicContent) {
      mapIconButton = this.showTouristicContentMap ? 'summarize' : 'map';
    } else if (this.showTouristicEvent) {
      mapIconButton = this.showTouristicEventMap ? 'summarize' : 'map';
    } else {
      mapIconButton = this.showHomeMap ? 'list' : 'map';
    }

    return mapIconButton;
  }

  getMapVisibilityLabelButton() {
    let mapLabelButton: string;

    if (state.language) {
      if (this.showTrek) {
        mapLabelButton = this.showTrekMap ? translate[state.language].showDetails : translate[state.language].showRoute;
      } else if (this.showTouristicContent) {
        mapLabelButton = this.showTouristicContentMap ? translate[state.language].showDetails : translate[state.language].showMap;
      } else if (this.showTouristicEvent) {
        mapLabelButton = this.showTouristicEventMap ? translate[state.language].showDetails : translate[state.language].showMap;
      } else {
        mapLabelButton = this.showHomeMap ? translate[state.language].showList : translate[state.language].showMap;
      }
    }

    return mapLabelButton;
  }

  reload() {
    window.location.reload();
  }

  disconnectedCallback() {
    reset();
    window.removeEventListener('popstate', this.handlePopStateBind);
  }

  handleOkDeleteModal() {
    this.trekDeletePress.emit();
    this.showDeletingMessage = true;
    this.showConfirmDeleteModal = false;
    this.showConfirmModal = false;
    this.showLoaderModal = true;
  }

  handleOkDownloadModal() {
    this.trekDownloadPress.emit();
    this.showConfirmModal = false;
    this.showLoaderModal = true;
  }

  handleCancelModal() {
    this.showOfflineModal = false;
  }

  handleOffline() {
    state.offlineTreks = !state.offlineTreks;
    state.currentTreks = handleTreksFiltersAndSearch();
  }

  render() {
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
          '--color-primary-app': this.colorPrimaryApp,
          '--color-primary': this.colorPrimary,
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
          '--color-sensitive-area': this.colorSensitiveArea,
          '--app-width': this.appWidth,
          '--app-height': this.appHeight,
          '--header-height':
            Number(this.treks) + Number(this.touristicContents) + Number(this.touristicEvents) > 1
              ? this.enableOffline
                ? '188px'
                : '136px'
              : this.enableOffline
              ? '116px'
              : '64px',
          '--header-with-segment': Number(this.treks) + Number(this.touristicContents) + Number(this.touristicEvents) > 1 ? '16px' : '0px',
          '--header-with-languages': this.languages.split(',').length > 1 ? '38px' : '0px',
          '--border-radius': this.rounded ? '' : '0px',
        }}
      >
        {!state.currentTreks &&
          !state.currentTrek &&
          !state.currentTouristicContent &&
          !state.currentTouristicEvent &&
          !state.currentTouristicContents &&
          !state.currentTouristicEvents && (
            <div class="grw-init-loader-container">
              <grw-loader exportparts="loader" color-primary-container={this.colorPrimaryContainer} color-on-primary-container={this.colorOnPrimaryContainer}></grw-loader>
            </div>
          )}
        {this.treks && state.mode === 'treks' && !this.showTrek && !this.showTouristicContent && !this.showTouristicEvent && !state.currentTreks && (
          <grw-treks-provider
            api={this.api}
            languages={this.languages}
            portals={this.portals}
            in-bbox={this.inBbox}
            cities={this.cities}
            districts={this.districts}
            structures={this.structures}
            themes={this.themes}
            routes={this.routes}
            practices={this.practices}
          ></grw-treks-provider>
        )}
        {this.showTrek && this.currentTrekId && !state.currentTrek && (
          <grw-trek-provider
            api={this.api}
            languages={this.languages}
            trek-id={this.currentTrekId}
            portals={this.portals}
            in-bbox={this.inBbox}
            cities={this.cities}
            districts={this.districts}
            structures={this.structures}
            themes={this.themes}
            routes={this.routes}
            practices={this.practices}
          ></grw-trek-provider>
        )}
        {this.showTouristicContent && this.currentTouristicContentId && (
          <grw-touristic-content-provider
            api={this.api}
            languages={this.languages}
            touristic-content-id={this.currentTouristicContentId}
            portals={this.portals}
          ></grw-touristic-content-provider>
        )}
        {this.showTouristicEvent && this.currentTouristicEventId && (
          <grw-touristic-event-provider
            api={this.api}
            languages={this.languages}
            touristic-event-id={this.currentTouristicEventId}
            portals={this.portals}
          ></grw-touristic-event-provider>
        )}
        {this.touristicContents && state.mode === 'touristicContents' && !state.currentTouristicContents && !this.showTouristicContent && (
          <grw-touristic-contents-provider
            api={this.api}
            languages={this.languages}
            in-bbox={this.inBbox}
            cities={this.cities}
            districts={this.districts}
            structures={this.structures}
            themes={this.themes}
            portals={this.portals}
          ></grw-touristic-contents-provider>
        )}
        {this.touristicEvents && state.mode === 'touristicEvents' && !state.currentTouristicEvents && !this.showTouristicEvent && (
          <grw-touristic-events-provider
            api={this.api}
            languages={this.languages}
            in-bbox={this.inBbox}
            cities={this.cities}
            districts={this.districts}
            structures={this.structures}
            themes={this.themes}
            portals={this.portals}
          ></grw-touristic-events-provider>
        )}
        {(state.currentTreks ||
          state.currentTrek ||
          state.touristicContents ||
          state.touristicEvents ||
          state.currentTouristicContent ||
          state.currentTouristicEvent ||
          state.networkError) && (
          <div class="grw-app-container">
            {state.languages && state.languages.length > 1 && (
              <div class="grw-languages-container">
                <grw-select-language></grw-select-language>
              </div>
            )}
            <div
              class={`${this.isLargeView ? 'grw-large-view-header-container' : 'grw-header-container'}${
                this.showTrek || this.showTouristicContent || this.showTouristicEvent ? ' grw-header-detail' : ''
              }`}
            >
              {Number(this.treks) + Number(this.touristicContents) + Number(this.touristicEvents) > 1 &&
                !this.showTrek &&
                !this.showTouristicContent &&
                !this.showTouristicEvent && (
                  <grw-segmented-segment
                    fontFamily={this.fontFamily}
                    treks={this.treks}
                    touristicContents={this.touristicContents}
                    touristicEvents={this.touristicEvents}
                  ></grw-segmented-segment>
                )}
              {!this.showTrek && !this.showTouristicContent && !this.showTouristicEvent ? (
                <Fragment>
                  <div class="grw-handle-search-filters-container">
                    <div class="grw-handle-search-container">
                      <grw-search fontFamily={this.fontFamily}></grw-search>
                    </div>
                    <div class="grw-handle-filters-container">
                      <grw-common-button
                        exportparts="common-button,common-button-icon,common-button-label"
                        fontFamily={this.fontFamily}
                        action={() => this.handleFilters()}
                        icon={'filter_list'}
                        name={translate[state.language].filter}
                      ></grw-common-button>
                    </div>
                  </div>
                  {this.enableOffline && (
                    <div part="grw-offline-container" class="grw-offline-container">
                      <div class="grw-offline-label">Afficher uniquement les itinéraires hors ligne</div>
                      <grw-switch exportparts="common-button,common-button-icon,common-button-label" fontFamily={this.fontFamily} action={() => this.handleOffline()}></grw-switch>
                    </div>
                  )}
                </Fragment>
              ) : (
                <div class="grw-arrow-back-container">
                  <button onClick={() => this.handleBackButton()} class="grw-arrow-back-icon">
                    {/* @ts-ignore */}
                    <span translate={false} part="icon" class="material-symbols material-symbols-outlined icon">
                      arrow_back
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div class={`grw-content-container ${this.showTrek || this.showTouristicContent || this.showTouristicEvent ? 'grw-content-trek' : 'grw-content-treks'}`}>
              {state.networkError && (
                <div class="grw-error-container">
                  Une erreur est survenue.
                  <grw-common-button
                    exportparts="common-button,common-button-icon,common-button-label"
                    icon="refresh"
                    name="Recharger la page"
                    action={() => this.reload()}
                  ></grw-common-button>
                </div>
              )}
              <div
                class={this.isLargeView ? 'grw-large-view-app-treks-list-container' : 'grw-app-treks-list-container'}
                style={{ display: this.showTrek || this.showTouristicContent || this.showTouristicEvent ? 'none' : 'flex', position: this.showTrek ? 'absolute' : 'relative' }}
              >
                {state.mode === 'treks' && this.treks && (
                  <grw-treks-list
                    is-large-view={this.isLargeView}
                    fontFamily={this.fontFamily}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                  ></grw-treks-list>
                )}
                {state.mode === 'touristicContents' && this.touristicContents && (
                  <grw-touristic-contents-list
                    is-large-view={this.isLargeView}
                    fontFamily={this.fontFamily}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                  ></grw-touristic-contents-list>
                )}
                {state.mode === 'touristicEvents' && this.touristicEvents && (
                  <grw-touristic-events-list
                    is-large-view={this.isLargeView}
                    fontFamily={this.fontFamily}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                  ></grw-touristic-events-list>
                )}
              </div>
              {((this.showTrek && !state.currentTrek) ||
                (this.showTouristicContent && !state.currentTouristicContent) ||
                (this.showTouristicEvent && !state.currentTouristicEvent) ||
                (!state.treks && state.mode === 'treks' && !this.showTrek) ||
                (!state.touristicContents && state.mode === 'touristicContents' && !this.showTouristicContent) ||
                (!state.touristicEvents && state.mode === 'touristicEvents' && !this.showTouristicEvent)) && (
                <div class={this.isLargeView ? 'grw-large-view-loader-container' : 'grw-loader-container'}>
                  <grw-loader exportparts="loader" color-primary-container={this.colorSecondaryContainer} color-on-primary-container={this.colorOnSecondaryContainer}></grw-loader>
                </div>
              )}
              {this.showTrek && (
                <div class={this.isLargeView ? 'grw-large-view-app-trek-detail-container' : 'grw-app-trek-detail-container'}>
                  <grw-trek-detail
                    style={{
                      visibility: (!this.showTrekMap && this.showTrek) || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showTrekMap ? '1' : '0',
                    }}
                    fontFamily={this.fontFamily}
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
                    emergency-number={this.emergencyNumber}
                    defaultBackgroundLayerUrl={this.urlLayer.split(',http').map((url, index) => (index === 0 ? url : 'http' + url))[0]}
                    defaultBackgroundLayerAttribution={this.attributionLayer ? this.attributionLayer.split(',')[0] : []}
                    enable-offline={this.enableOffline}
                    global-tiles-min-zoom-offline={this.globalTilesMinZoomOffline}
                    global-tiles-max-zoom-offline={this.globalTilesMaxZoomOffline}
                    trek-tiles-min-zoom-offline={this.trekTilesMinZoomOffline}
                    trek-tiles-max-zoom-offline={this.trekTilesMaxZoomOffline}
                  ></grw-trek-detail>
                  {this.showOfflineModal && (
                    <div class="modal-container">
                      <div class="modal-content-container">
                        {this.showConfirmModal && !this.showConfirmDeleteModal && (
                          <Fragment>
                            <div class="modal-message-container">Êtes-vous sûr de vouloir rendre cet itinéraire disponible hors ligne ?</div>
                            <div class="modal-buttons-container">
                              <button part="modal-button" class="modal-button" onClick={() => this.handleCancelModal()}>
                                ANNULER
                              </button>
                              <button part="modal-button" class="modal-button" onClick={() => this.handleOkDownloadModal()}>
                                OK
                              </button>
                            </div>
                          </Fragment>
                        )}
                        {this.showConfirmDeleteModal && (
                          <Fragment>
                            <div class="modal-message-container">Êtes-vous sûr de vouloir supprimer cet itinéraire du hors ligne ?</div>
                            <div class="modal-buttons-container">
                              <button part="modal-button" class="modal-button" onClick={() => this.handleCancelModal()}>
                                ANNULER
                              </button>
                              <button part="modal-button" class="modal-button" onClick={() => this.handleOkDeleteModal()}>
                                OK
                              </button>
                            </div>
                          </Fragment>
                        )}
                        {this.showLoaderModal && (
                          <Fragment>
                            <div class="modal-message-container">
                              <div class="modal-loader"></div>
                              {this.showDeletingMessage ? 'Suppression en cours' : 'Téléchargement en cours'}
                            </div>
                          </Fragment>
                        )}
                        {this.showSuccessModal && (
                          <Fragment>
                            <div class="modal-message-container">
                              {this.showDeleteSuccessMessage ? "L'itinéraire est supprimé du hors ligne" : "L'itinéraire est disponible hors ligne"}
                            </div>
                            <div class="modal-button-container">
                              <button part="modal-button" class="modal-button" onClick={() => this.handleCancelModal()}>
                                OK
                              </button>
                            </div>
                          </Fragment>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {this.showTouristicContent && (
                <div class={this.isLargeView ? 'grw-large-view-app-touristic-content-detail-container' : 'grw-app-touristic-content-detail-container'}>
                  <grw-touristic-content-detail
                    style={{
                      visibility: !this.showTouristicContentMap || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showTouristicContentMap ? '1' : '0',
                    }}
                    fontFamily={this.fontFamily}
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
              {this.showTouristicEvent && (
                <div class={this.isLargeView ? 'grw-large-view-app-touristic-event-detail-container' : 'grw-app-touristic-event-detail-container'}>
                  <grw-touristic-event-detail
                    style={{
                      visibility: !this.showTouristicEventMap || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showTouristicEventMap ? '1' : '0',
                    }}
                    fontFamily={this.fontFamily}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-primary-container={this.colorPrimaryContainer}
                    color-on-primary-container={this.colorOnPrimaryContainer}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                    color-background={this.colorBackground}
                    is-large-view={this.isLargeView}
                  ></grw-touristic-event-detail>
                </div>
              )}
              {!state.networkError && (
                <grw-map
                  exportparts="map,elevation,map-bottom-space,map-loader-container,loader"
                  class={this.isLargeView ? 'grw-large-view-app-map-container' : 'grw-app-map-container'}
                  style={{
                    visibility:
                      (this.showHomeMap && !this.showTrek) ||
                      (this.showTrekMap && this.showTrek) ||
                      (this.showTouristicContentMap && this.showTouristicContent) ||
                      (this.showTouristicEventMap && this.showTouristicEvent) ||
                      this.isLargeView
                        ? 'visible'
                        : 'hidden',
                    zIndex: this.showHomeMap || this.showTrekMap || this.showTouristicContentMap || this.showTouristicEventMap ? '1' : '0',
                  }}
                  center={this.center}
                  zoom={this.zoom}
                  name-layer={this.nameLayer}
                  url-layer={this.urlLayer}
                  attribution-layer={this.attributionLayer}
                  fontFamily={this.fontFamily}
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
                  trek-tiles-max-zoom-offline={this.trekTilesMaxZoomOffline}
                ></grw-map>
              )}
            </div>
            {((!this.showTrek && !this.showTouristicContent && !this.showTouristicEvent) ||
              (this.showTrek && state.currentTrek) ||
              (this.showTouristicContent && state.currentTouristicContent) ||
              (this.showTouristicEvent && state.currentTouristicEvent)) && (
              <div class="grw-map-visibility-button-container">
                <grw-extended-fab
                  exportparts="map-visibility-button,map-visibility-button-icon,map-visibility-button-label"
                  fontFamily={this.fontFamily}
                  action={() => this.handleShowMap()}
                  icon={() => this.getMapVisibilityIconButton()}
                  name={() => this.getMapVisibilityLabelButton()}
                  display={this.isLargeView ? 'none' : 'flex'}
                ></grw-extended-fab>
              </div>
            )}
          </div>
        )}
        {!this.showTrek && this.showFilters && <grw-filters fontFamily={this.fontFamily} handleFilters={() => this.handleFilters()}></grw-filters>}
      </Host>
    );
  }
}
