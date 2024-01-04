import { Component, Host, h, Listen, State, Prop, Element, Watch } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state, { onChange, reset } from 'store/store';
import { mode } from 'types/types';
import {
  handleTouristicContentsFiltersAndSearch,
  handleTouristicEventsFiltersAndSearch,
  handleTreksFiltersAndSearch,
  touristicContentsFilters,
  touristicEventsFilters,
  treksFilters,
} from 'utils/utils';

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

  @Prop() treks = true;
  @Prop() touristicContents = false;
  @Prop() touristicEvents = false;

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

  @Listen('touristicEventCardPress', { target: 'window' })
  onTouristiceEventCardPress(event: CustomEvent<number>) {
    state.currentTrek = null;
    this.currentTrekId = null;
    this.showTrek = false;
    this.currentTouristicEventId = event.detail;
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
      this.showTrek = true;
    } else if (touristicContentParam) {
      window.history.replaceState({ isInitialHistoryWithDetails: true }, '', url);
      this.currentTouristicContentId = Number(touristicContentParam);
      this.showTouristicContent = true;
    } else if (touristicEventParam) {
      window.history.replaceState({ isInitialHistoryWithDetails: true }, '', url);
      this.currentTouristicEventId = Number(touristicEventParam);
      this.showTouristicEvent = true;
    }
  }

  componentDidLoad() {
    onChange('trekNetworkError', () => {
      if (state.trekNetworkError) {
        const urlRedirect = new URL(window.location.toString());
        urlRedirect.searchParams.delete('trek');
        urlRedirect.searchParams.delete('parenttrek');
        urlRedirect.searchParams.delete('touristiccontent');
        urlRedirect.searchParams.delete('touristicevent');
        window.history.replaceState({}, '', urlRedirect);
        this.onDetailsClose();
      }
    });
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

    if (this.showTrek) {
      mapLabelButton = this.showTrekMap ? translate[state.language].showDetails : translate[state.language].showRoute;
    } else if (this.showTouristicContent) {
      mapLabelButton = this.showTouristicContentMap ? translate[state.language].showDetails : translate[state.language].showMap;
    } else if (this.showTouristicEvent) {
      mapLabelButton = this.showTouristicEventMap ? translate[state.language].showDetails : translate[state.language].showMap;
    } else {
      mapLabelButton = this.showHomeMap ? translate[state.language].showList : translate[state.language].showMap;
    }

    return mapLabelButton;
  }

  disconnectedCallback() {
    reset();
    window.removeEventListener('popstate', this.handlePopStateBind);
  }

  changeMode(mode: mode) {
    state.searchValue = '';
    if (mode === 'treks' && state.currentTreks) {
      treksFilters.forEach(filter => {
        state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
      });
      state.selectedActivitiesFilters = 0;
      state.selectedThemesFilters = 0;
      state.selectedLocationFilters = 0;
      state.currentTreks = handleTreksFiltersAndSearch();
    } else if (mode === 'touristicContents' && state.currentTouristicContents) {
      touristicContentsFilters.forEach(filter => {
        state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
      });
      state.selectedActivitiesFilters = 0;
      state.selectedLocationFilters = 0;
      state.currentTouristicContents = handleTouristicContentsFiltersAndSearch();
    } else if (mode === 'touristicEvents' && state.currentTouristicEvents) {
      touristicEventsFilters.forEach(filter => {
        state[filter.property].forEach(currentFilter => (currentFilter.selected = false));
      });
      state.selectedActivitiesFilters = 0;
      state.selectedLocationFilters = 0;
      state.currentTouristicEvents = handleTouristicEventsFiltersAndSearch();
    }
    state.mode = mode;
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
          '--header-height': Number(this.treks) + Number(this.touristicContents) + Number(this.touristicEvents) > 1 ? '136px' : '64px',
        }}
      >
        {!state.currentTreks &&
          !state.currentTrek &&
          !state.currentTouristicContent &&
          !state.currentTouristicEvent &&
          !state.currentTouristicContents &&
          !state.currentTouristicEvents && (
            <div class="init-loader-container">
              <span class="loader"></span>
            </div>
          )}
        {this.treks && state.mode === 'treks' && !this.showTrek && !this.showTouristicContent && !this.showTouristicEvent && !state.currentTreks && (
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
          <grw-trek-provider api={this.api} languages={this.languages} trek-id={this.currentTrekId} portals={this.portals}></grw-trek-provider>
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
        {(state.currentTreks || state.currentTrek || state.touristicContents || state.touristicEvents || state.currentTouristicContent || state.currentTouristicEvent) && (
          <div class="app-container">
            {state.languages && state.languages.length > 1 && (
              <div class="languages-container">
                <grw-select-language></grw-select-language>
              </div>
            )}
            <div
              class={`${this.isLargeView ? 'large-view-header-container' : 'header-container'}${
                this.showTrek || this.showTouristicContent || this.showTouristicEvent ? ' header-detail' : ''
              }`}
            >
              {Number(this.treks) + Number(this.touristicContents) + Number(this.touristicEvents) > 1 && !this.showTrek && !this.showTouristicContent && !this.showTouristicEvent && (
                <div class="segmented-buttons-container">
                  {this.treks && (
                    <label class={`segment${state.mode === 'treks' ? ' selected-segment' : ''}`} onClick={() => this.changeMode('treks')}>
                      {translate[state.language].home.segment.treks}
                    </label>
                  )}
                  {this.touristicContents && (
                    <label class={`segment${state.mode === 'touristicContents' ? ' selected-segment' : ''}`} onClick={() => this.changeMode('touristicContents')}>
                      {translate[state.language].home.segment.touristicContents}
                    </label>
                  )}
                  {this.touristicContents && (
                    <label class={`segment${state.mode === 'touristicEvents' ? ' selected-segment' : ''}`} onClick={() => this.changeMode('touristicEvents')}>
                      {translate[state.language].home.segment.touristicEvents}
                    </label>
                  )}
                </div>
              )}
              {!this.showTrek && !this.showTouristicContent && !this.showTouristicEvent ? (
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

            <div class={`content-container ${this.showTrek || this.showTouristicContent || this.showTouristicEvent ? 'content-trek' : 'content-treks'}`}>
              <div
                class={this.isLargeView ? 'large-view-app-treks-list-container' : 'app-treks-list-container'}
                style={{ display: this.showTrek || this.showTouristicContent || this.showTouristicEvent ? 'none' : 'flex', position: this.showTrek ? 'absolute' : 'relative' }}
              >
                {state.mode === 'treks' && this.treks && (
                  <grw-treks-list
                    reset-store-on-disconnected={'false'}
                    is-large-view={this.isLargeView}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                  ></grw-treks-list>
                )}
                {state.mode === 'touristicContents' && this.touristicContents && (
                  <grw-touristic-contents-list
                    reset-store-on-disconnected={'false'}
                    is-large-view={this.isLargeView}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                  ></grw-touristic-contents-list>
                )}
                {state.mode === 'touristicEvents' && this.touristicEvents && (
                  <grw-touristic-events-list
                    reset-store-on-disconnected={'false'}
                    is-large-view={this.isLargeView}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                  ></grw-touristic-events-list>
                )}
              </div>
              {(this.showTrek && !state.currentTrek) ||
                (this.showTouristicContent && !state.currentTouristicContent) ||
                (this.showTouristicEvent && !state.currentTouristicEvent) ||
                (!state.currentTreks && state.mode === 'treks') ||
                (!state.touristicContents && state.mode === 'touristicContents' && (
                  <div class={this.isLargeView ? 'large-view-loader-container' : 'loader-container'}>
                    <span class="loader"></span>
                  </div>
                ))}
              {state.currentTrek && (
                <div class={this.isLargeView ? 'large-view-app-trek-detail-container' : 'app-trek-detail-container'}>
                  <grw-trek-detail
                    style={{
                      visibility: (!this.showTrekMap && this.showTrek) || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showTrekMap ? '1' : '0',
                    }}
                    reset-store-on-disconnected={'false'}
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
              {this.showTouristicEvent && (
                <div class={this.isLargeView ? 'large-view-app-touristic-event-detail-container' : 'app-touristic-event-detail-container'}>
                  <grw-touristic-event-detail
                    style={{
                      visibility: !this.showTouristicEventMap || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showTouristicEventMap ? '1' : '0',
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
                  ></grw-touristic-event-detail>
                </div>
              )}
              <grw-map
                reset-store-on-disconnected={'false'}
                class={this.isLargeView ? 'large-view-app-map-container' : 'app-map-container'}
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
            {((!this.showTrek && !this.showTouristicContent && !this.showTouristicEvent) ||
              (this.showTrek && state.currentTrek) ||
              (this.showTouristicContent && state.currentTouristicContent) ||
              (this.showTouristicEvent && state.currentTouristicEvent)) && (
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
