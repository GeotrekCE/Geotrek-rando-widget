import { Capacitor } from '@capacitor/core';
import { Component, Host, h, Listen, State, Prop, Element, Watch, Fragment } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state, { reset } from 'store/store';
import { handleOutdoorSitesFiltersAndSearch, handleTreksFiltersAndSearch, imagesRegExp, revokeObjectURL } from 'utils/utils';
import ArrowBackIcon from '../../assets/arrow-back.svg';

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
  @State() showOutdoorSite = false;
  @State() showOutdoorCourse = false;
  @State() showOutdoorSiteMap = false;
  @State() showOutdoorCourseMap = false;

  @State() showHomeMap = false;
  @State() showTrekMap = false;
  @State() showTouristicContentMap = false;
  @State() showTouristicEventMap = false;
  @State() showFilters = false;
  @State() isLargeView = false;
  @State() currentTrekId: number;
  @State() currentTouristicContentId: number;
  @State() currentTouristicEventId: number;
  @State() currentOutdoorSiteId: number;
  @State() currentOutdoorCourseId: number;

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
  @Prop() labels: string;
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
  @Prop() colorMarkers = null;
  @Prop() colorClusters = null;
  @Prop() colorOutdoorArea = '#ffb700';

  @Prop() useGradient = false;

  @Prop() treks = true;
  @Prop() touristicContents = false;
  @Prop() touristicEvents = false;
  @Prop() outdoor = false;

  @Prop() enableOffline = false;
  @Prop() globalTilesMinZoomOffline = 0;
  @Prop() globalTilesMaxZoomOffline = 11;
  @Prop() tilesMinZoomOffline = 12;
  @Prop() tilesMaxZoomOffline = 16;

  @Prop() mainMarkerSize = 32;
  @Prop() selectedMainMarkerSize = 48;
  @Prop() mainClusterSize = 48;
  @Prop() commonMarkerSize = 48;
  @Prop() departureArrivalMarkerSize = 14;
  @Prop() pointReferenceMarkerSize = 24;

  @Prop() largeViewSize = 1024;
  @Prop() elevationHeight = 280;
  @Prop() mobileElevationHeight = 280;

  @Prop() signages = false;

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

    state.mode = 'touristicEvents';
    this.showTouristicEvent = true;
    this.showTouristicEventMap = false;
    const url = new URL(window.location.toString());
    url.searchParams.delete('trek');
    url.searchParams.set('touristicevent', this.currentTouristicEventId.toString());
    window.history.pushState({}, '', url);
  }

  @Listen('outdoorSiteCardPress', { target: 'window' })
  onOutdoorSiteCardPress(event: CustomEvent<number>) {
    state.currentTrek = null;
    this.currentTrekId = null;
    this.showTrek = false;

    state.mode = 'outdoor';
    state.currentOutdoorSite = null;
    state.currentRelatedOutdoorSites = null;
    state.currentRelatedOutdoorCourses = null;
    this.currentOutdoorSiteId = event.detail;
    this.showOutdoorSite = true;
    this.showOutdoorSiteMap = false;
    const url = new URL(window.location.toString());
    url.searchParams.set('outdoorsite', this.currentOutdoorSiteId.toString());
    window.history.pushState({}, '', url);
  }

  @Listen('outdoorCourseCardPress', { target: 'window' })
  onOutdoorCourseCardPress(event: CustomEvent<number>) {
    state.currentTrek = null;
    this.currentTrekId = null;
    this.showTrek = false;

    state.mode = 'outdoor';
    state.currentOutdoorSite = null;
    state.currentOutdoorCourse = null;
    state.currentRelatedOutdoorSites = null;
    state.currentRelatedOutdoorCourses = null;
    this.currentOutdoorSiteId = null;
    this.currentOutdoorCourseId = event.detail;
    this.showOutdoorSite = false;
    this.showOutdoorSiteMap = false;
    this.showOutdoorCourse = true;
    this.showOutdoorSiteMap = false;
    const url = new URL(window.location.toString());
    url.searchParams.delete('outdoorsite');
    url.searchParams.set('outdoorcourse', this.currentOutdoorCourseId.toString());
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
    } else if (this.outdoor) {
      state.mode = 'outdoor';
    }
    const url = new URL(window.location.toString());
    const trekParam = url.searchParams.get('trek');
    const parentTrekId = url.searchParams.get('parenttrek');
    const touristicContentParam = url.searchParams.get('touristiccontent');
    const touristicEventParam = url.searchParams.get('touristicevent');
    const outdoorSiteParam = url.searchParams.get('outdoorsite');
    const outdoorCourseParam = url.searchParams.get('outdoorcourse');

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
    } else if (outdoorSiteParam) {
      window.history.replaceState({ isInitialHistoryWithDetails: true }, '', url);
      this.currentOutdoorSiteId = Number(outdoorSiteParam);
      state.mode = 'outdoor';
      this.showOutdoorSite = true;
    } else if (outdoorCourseParam) {
      window.history.replaceState({ isInitialHistoryWithDetails: true }, '', url);
      this.currentOutdoorCourseId = Number(outdoorCourseParam);
      state.mode = 'outdoor';
      this.showOutdoorCourse = true;
    }
  }

  componentDidLoad() {
    window.addEventListener('popstate', this.handlePopStateBind, false);
    this.handleView();
  }

  onDetailsClose() {
    if (state.mode === 'treks') {
      this.showTrek = false;
      this.showTrekMap = false;
      state.currentTrek = null;
      state.currentTrekSteps = null;
      state.parentTrekId = null;
      this.currentTrekId = null;
    } else if (state.mode === 'touristicContents') {
      state.currentTouristicContent = null;
      this.currentTouristicContentId = null;
      this.showTouristicContent = false;
      this.showTouristicContentMap = false;
    } else if (state.mode === 'touristicEvents') {
      state.currentTouristicEvent = null;
      this.currentTouristicEventId = null;
      this.showTouristicEvent = false;
      this.showTouristicEventMap = false;
    } else if (state.mode === 'outdoor') {
      state.currentOutdoorSite = null;
      this.currentOutdoorSiteId = null;
      this.showOutdoorSite = false;
      this.showOutdoorSiteMap = false;
      state.currentOutdoorCourse = null;
      this.currentOutdoorCourseId = null;
      this.showOutdoorCourse = false;
      this.showOutdoorCourseMap = false;
    }
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
      if (state.currentTrek && state.currentTrek.offline && !Capacitor.isNativePlatform()) {
        revokeObjectURL(state.currentPois, imagesRegExp, ['url']);
        revokeObjectURL(state.trekTouristicEvents, imagesRegExp, ['url']);
        revokeObjectURL(state.trekTouristicContents, imagesRegExp, ['url']);
        revokeObjectURL(state.currentInformationDesks, imagesRegExp);
        revokeObjectURL(state.currentTrek, imagesRegExp, ['url']);
      }
      this.onDetailsClose();
      const url = new URL(window.location.toString());
      url.searchParams.delete('trek');
      url.searchParams.delete('touristiccontent');
      url.searchParams.delete('touristicevent');
      url.searchParams.delete('outdoorsite');
      url.searchParams.delete('outdoorcourse');

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
    const outdoorSiteParam = Number(url.searchParams.get('outdoorsite'));
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
    } else if (outdoorSiteParam && this.currentOutdoorSiteId !== outdoorSiteParam) {
      this.currentOutdoorSiteId = outdoorSiteParam;
      state.currentOutdoorSite = null;
      this.showOutdoorCourse = false;
      this.showOutdoorSite = true;
    } else if (!trekParam && !touristicContentParam && !touristicEventParam && !outdoorSiteParam) {
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
    } else if (this.showOutdoorSite) {
      this.showOutdoorSiteMap = !this.showOutdoorSiteMap;
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
    } else if (this.showOutdoorSite || this.showOutdoorCourse) {
      mapIconButton = this.showOutdoorSiteMap || this.showOutdoorCourseMap ? 'summarize' : 'map';
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
      } else if (this.showOutdoorSite || this.showOutdoorCourse) {
        mapLabelButton = this.showOutdoorSiteMap ? translate[state.language].showDetails : translate[state.language].showMap;
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

  handleOffline() {
    if (state.mode === 'treks') {
      state.offlineTreks = !state.offlineTreks;
      state.currentTreks = handleTreksFiltersAndSearch();
    } else {
      state.offlineOutdoorSites = !state.offlineOutdoorSites;
      state.currentOutdoorSites = handleOutdoorSitesFiltersAndSearch();
    }
  }

  getFiltersName() {
    const activeFilters = state.selectedActivitiesFilters + state.selectedLocationFilters + state.selectedThemesFilters;
    return `${translate[state.language].filter}${activeFilters > 0 ? ' (' + activeFilters + ')' : ''}`;
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
            Number(this.treks) + Number(this.touristicContents) + Number(this.touristicEvents) + Number(this.outdoor) > 1
              ? this.enableOffline
                ? '188px'
                : '136px'
              : this.enableOffline
              ? '116px'
              : '64px',
          '--header-with-languages': this.languages.split(',').length > 1 ? '38px' : '0px',
          '--border-radius': this.rounded ? '' : '0px',
        }}
      >
        {!state.currentTreks &&
          !state.currentTrek &&
          !state.currentTouristicContent &&
          !state.currentTouristicEvent &&
          !state.currentTouristicContents &&
          !state.currentTouristicEvents &&
          !state.currentOutdoorSites &&
          !state.currentOutdoorSite &&
          !state.currentOutdoorCourses &&
          !state.currentOutdoorCourse && (
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
            labels={this.labels}
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
            labels={this.labels}
            signages={this.signages}
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
        {this.showOutdoorSite && this.currentOutdoorSiteId && !state.currentOutdoorSite && (
          <grw-outdoor-site-provider api={this.api} languages={this.languages} outdoor-site-id={this.currentOutdoorSiteId} portals={this.portals}></grw-outdoor-site-provider>
        )}
        {this.showOutdoorCourse && this.currentOutdoorCourseId && !state.currentOutdoorCourse && (
          <grw-outdoor-course-provider
            api={this.api}
            languages={this.languages}
            outdoor-course-id={this.currentOutdoorCourseId}
            portals={this.portals}
          ></grw-outdoor-course-provider>
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
        {this.outdoor &&
          state.mode === 'outdoor' &&
          !this.showOutdoorSite &&
          !this.showOutdoorCourse &&
          !this.showTouristicContent &&
          !this.showTouristicEvent &&
          !state.outdoorSites && (
            <grw-outdoor-sites-provider
              api={this.api}
              languages={this.languages}
              portals={this.portals}
              in-bbox={this.inBbox}
              cities={this.cities}
              districts={this.districts}
              structures={this.structures}
              themes={this.themes}
            ></grw-outdoor-sites-provider>
          )}

        {(state.currentTreks ||
          state.currentTrek ||
          state.touristicContents ||
          state.touristicEvents ||
          state.currentTouristicContent ||
          state.currentTouristicEvent ||
          state.currentOutdoorSites ||
          state.currentOutdoorSite ||
          state.currentOutdoorCourses ||
          state.currentOutdoorCourse ||
          state.networkError) && (
          <div class="grw-app-container">
            {state.languages && state.languages.length > 1 && (
              <div class="grw-languages-container">
                <grw-select-language></grw-select-language>
              </div>
            )}
            <div
              class={`${this.isLargeView ? 'grw-large-view-header-container' : 'grw-header-container'}${
                this.showTrek || this.showTouristicContent || this.showTouristicEvent || this.showOutdoorSite || this.showOutdoorCourse ? ' grw-header-detail' : ''
              }`}
            >
              {Number(this.treks) + Number(this.touristicContents) + Number(this.touristicEvents) + Number(this.outdoor) > 1 &&
                !this.showTrek &&
                !this.showTouristicContent &&
                !this.showTouristicEvent &&
                !this.showOutdoorSite &&
                !this.showOutdoorCourse && (
                  <grw-segmented-segment
                    font-family={this.fontFamily}
                    treks={this.treks}
                    touristicContents={this.touristicContents}
                    touristicEvents={this.touristicEvents}
                    outdoor={this.outdoor}
                  ></grw-segmented-segment>
                )}
              {!this.showTrek && !this.showTouristicContent && !this.showTouristicEvent && !this.showOutdoorSite && !this.showOutdoorCourse ? (
                <Fragment>
                  <div class="grw-handle-search-filters-container">
                    <div class="grw-handle-search-container">
                      <grw-search font-family={this.fontFamily}></grw-search>
                    </div>
                    <div class="grw-handle-filters-container">
                      <grw-common-button
                        exportparts="common-button,common-button-icon,common-button-label"
                        font-family={this.fontFamily}
                        action={() => this.handleFilters()}
                        icon={'filter_list'}
                        name={this.getFiltersName()}
                      ></grw-common-button>
                    </div>
                  </div>
                  {this.enableOffline && (state.mode === 'treks' || state.mode === 'outdoor') && (
                    <div part="grw-offline-container" class="grw-offline-container">
                      <div class="grw-offline-label">{state.mode === 'treks' ? translate[state.language].onlyOfflineTreks : translate[state.language].onlyOfflineOutdoor}</div>
                      <grw-switch
                        exportparts="common-button,common-button-icon,common-button-label"
                        font-family={this.fontFamily}
                        action={() => this.handleOffline()}
                        checked={state.mode === 'treks' ? state.offlineTreks : state.offlineOutdoorSites}
                      ></grw-switch>
                    </div>
                  )}
                </Fragment>
              ) : (
                <div class="grw-arrow-back-container">
                  <button onClick={() => this.handleBackButton()} class="grw-arrow-back-icon">
                    <span part="icon" class="icon" innerHTML={ArrowBackIcon}></span>
                  </button>
                </div>
              )}
            </div>

            <div
              class={`grw-content-container ${
                this.showTrek || this.showTouristicContent || this.showTouristicEvent || this.showOutdoorSite || this.showOutdoorCourse ? 'grw-content-trek' : 'grw-content-treks'
              }`}
            >
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
              {((state.mode === 'treks' && this.treks && state.treks) ||
                (state.mode === 'touristicContents' && this.touristicContents && state.touristicContents) ||
                (state.mode === 'touristicEvents' && this.touristicEvents && state.touristicEvents) ||
                (state.mode === 'outdoor' && this.outdoor && state.outdoorSites)) && (
                <div
                  class={this.isLargeView ? 'grw-large-view-app-list-container' : 'grw-app-list-container'}
                  style={{
                    display: this.showTrek || this.showTouristicContent || this.showTouristicEvent || this.showOutdoorSite || this.showOutdoorCourse ? 'none' : 'flex',
                    position: this.showTrek ? 'absolute' : 'relative',
                  }}
                >
                  {state.mode === 'treks' && this.treks && state.treks && (
                    <grw-treks-list
                      is-large-view={this.isLargeView}
                      font-family={this.fontFamily}
                      color-primary-app={this.colorPrimaryApp}
                      color-on-surface={this.colorOnSurface}
                      color-secondary-container={this.colorSecondaryContainer}
                      color-on-secondary-container={this.colorOnSecondaryContainer}
                      color-surface-container-low={this.colorSurfaceContainerLow}
                      grw-app={true}
                    ></grw-treks-list>
                  )}
                  {state.mode === 'touristicContents' && this.touristicContents && state.touristicContents && (
                    <grw-touristic-contents-list
                      is-large-view={this.isLargeView}
                      font-family={this.fontFamily}
                      color-primary-app={this.colorPrimaryApp}
                      color-on-surface={this.colorOnSurface}
                      color-secondary-container={this.colorSecondaryContainer}
                      color-on-secondary-container={this.colorOnSecondaryContainer}
                      color-surface-container-low={this.colorSurfaceContainerLow}
                    ></grw-touristic-contents-list>
                  )}
                  {state.mode === 'touristicEvents' && this.touristicEvents && state.touristicEvents && (
                    <grw-touristic-events-list
                      is-large-view={this.isLargeView}
                      font-family={this.fontFamily}
                      color-primary-app={this.colorPrimaryApp}
                      color-on-surface={this.colorOnSurface}
                      color-secondary-container={this.colorSecondaryContainer}
                      color-on-secondary-container={this.colorOnSecondaryContainer}
                      color-surface-container-low={this.colorSurfaceContainerLow}
                    ></grw-touristic-events-list>
                  )}
                  {state.mode === 'outdoor' && this.outdoor && state.outdoorSites && (
                    <grw-outdoor-sites-list
                      is-large-view={this.isLargeView}
                      font-family={this.fontFamily}
                      color-primary-app={this.colorPrimaryApp}
                      color-on-surface={this.colorOnSurface}
                      color-secondary-container={this.colorSecondaryContainer}
                      color-on-secondary-container={this.colorOnSecondaryContainer}
                      color-surface-container-low={this.colorSurfaceContainerLow}
                    ></grw-outdoor-sites-list>
                  )}
                </div>
              )}
              {((this.showTrek && !state.currentTrek) ||
                (this.showTouristicContent && !state.currentTouristicContent) ||
                (this.showTouristicEvent && !state.currentTouristicEvent) ||
                (this.showOutdoorSite && !state.currentOutdoorSite) ||
                (this.showOutdoorCourse && !state.currentOutdoorCourse) ||
                (!state.treks && state.mode === 'treks' && !this.showTrek) ||
                (!state.touristicContents && state.mode === 'touristicContents' && !this.showTouristicContent) ||
                (!state.touristicEvents && state.mode === 'touristicEvents' && !this.showTouristicEvent) ||
                (!state.outdoorSites && state.mode === 'outdoor' && !this.showOutdoorSite && !this.showOutdoorCourse)) && (
                <div class={this.isLargeView ? 'grw-large-view-loader-container' : 'grw-loader-container'}>
                  <grw-loader exportparts="loader" color-primary-container={this.colorSecondaryContainer} color-on-primary-container={this.colorOnSecondaryContainer}></grw-loader>
                </div>
              )}
              {this.showTrek && state.currentTrek && (
                <div class={this.isLargeView ? 'grw-large-view-app-trek-detail-container' : 'grw-app-trek-detail-container'}>
                  <grw-trek-detail
                    style={{
                      visibility: (!this.showTrekMap && this.showTrek) || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showTrekMap ? '1' : '0',
                    }}
                    font-family={this.fontFamily}
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
                    default-background-layer-url={this.urlLayer.split(',http').map((url, index) => (index === 0 ? url : 'http' + url))[0]}
                    default-background-layer-attribution={this.attributionLayer ? this.attributionLayer.split(',')[0] : []}
                    enable-offline={this.enableOffline}
                    global-tiles-min-zoom-offline={this.globalTilesMinZoomOffline}
                    global-tiles-max-zoom-offline={this.globalTilesMaxZoomOffline}
                    tiles-min-zoom-offline={this.tilesMinZoomOffline}
                    tiles-max-zoom-offline={this.tilesMaxZoomOffline}
                    grw-app={true}
                  ></grw-trek-detail>
                  <grw-offline-confirm-modal mode="treks"></grw-offline-confirm-modal>
                </div>
              )}
              {this.showTouristicContent && state.currentTouristicContent && (
                <div class={this.isLargeView ? 'grw-large-view-app-touristic-content-detail-container' : 'grw-app-touristic-content-detail-container'}>
                  <grw-touristic-content-detail
                    style={{
                      visibility: (!this.showTouristicContentMap && this.showTouristicContent) || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showTouristicContentMap ? '1' : '0',
                    }}
                    font-family={this.fontFamily}
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
              {this.showTouristicEvent && state.currentTouristicEvent && (
                <div class={this.isLargeView ? 'grw-large-view-app-touristic-event-detail-container' : 'grw-app-touristic-event-detail-container'}>
                  <grw-touristic-event-detail
                    style={{
                      visibility: (!this.showTouristicEventMap && this.showTouristicEvent) || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showTouristicEventMap ? '1' : '0',
                    }}
                    font-family={this.fontFamily}
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
              {this.showOutdoorSite && state.currentOutdoorSite && (
                <div class={this.isLargeView ? 'grw-large-view-app-outdoor-site-detail-container' : 'grw-app-outdoor-site-detail-container'}>
                  <grw-outdoor-site-detail
                    style={{
                      visibility: (!this.showOutdoorSiteMap && this.showOutdoorSite) || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showOutdoorSiteMap ? '1' : '0',
                    }}
                    font-family={this.fontFamily}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-primary-container={this.colorPrimaryContainer}
                    color-on-primary-container={this.colorOnPrimaryContainer}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                    color-background={this.colorBackground}
                    is-large-view={this.isLargeView}
                    weather={this.weather}
                    default-background-layer-url={this.urlLayer.split(',http').map((url, index) => (index === 0 ? url : 'http' + url))[0]}
                    default-background-layer-attribution={this.attributionLayer ? this.attributionLayer.split(',')[0] : []}
                    enable-offline={this.enableOffline}
                  ></grw-outdoor-site-detail>
                  <grw-offline-confirm-modal mode="treks"></grw-offline-confirm-modal>
                </div>
              )}
              {this.showOutdoorCourse && state.currentOutdoorCourse && (
                <div class={this.isLargeView ? 'grw-large-view-app-outdoor-course-detail-container' : 'grw-app-outdoor-course-detail-container'}>
                  <grw-outdoor-course-detail
                    style={{
                      visibility: (!this.showOutdoorCourseMap && this.showOutdoorCourse) || this.isLargeView ? 'visible' : 'hidden',
                      zIndex: !this.showOutdoorCourseMap ? '1' : '0',
                    }}
                    font-family={this.fontFamily}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-primary-container={this.colorPrimaryContainer}
                    color-on-primary-container={this.colorOnPrimaryContainer}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                    color-background={this.colorBackground}
                    is-large-view={this.isLargeView}
                  ></grw-outdoor-course-detail>
                </div>
              )}
              {!state.networkError && (
                <grw-map
                  exportparts="map,elevation,map-bottom-space,map-loader-container,loader"
                  class={this.isLargeView ? 'grw-large-view-app-map-container' : 'grw-app-map-container'}
                  style={{
                    visibility:
                      (this.showHomeMap && !this.showTrek && !this.showTouristicContent && !this.showTouristicEvent && !this.showOutdoorSite) ||
                      (this.showTrekMap && this.showTrek) ||
                      (this.showTouristicContentMap && this.showTouristicContent) ||
                      (this.showTouristicEventMap && this.showTouristicEvent) ||
                      (this.showOutdoorSiteMap && this.showOutdoorSite) ||
                      this.isLargeView
                        ? 'visible'
                        : 'hidden',
                    zIndex: this.showHomeMap || this.showTrekMap || this.showTouristicContentMap || this.showTouristicEventMap || this.showOutdoorSiteMap ? '1' : '0',
                  }}
                  name-layer={this.nameLayer}
                  url-layer={this.urlLayer}
                  attribution-layer={this.attributionLayer}
                  font-family={this.fontFamily}
                  color-primary-app={this.colorPrimaryApp}
                  color-on-surface={this.colorOnSurface}
                  color-primary-container={this.colorPrimaryContainer}
                  color-on-primary-container={this.colorOnPrimaryContainer}
                  color-background={this.colorBackground}
                  color-trek-line={this.colorTrekLine}
                  color-sensitive-area={this.colorSensitiveArea}
                  color-markers={this.colorMarkers ? this.colorMarkers : this.colorPrimaryApp}
                  color-clusters={this.colorClusters ? this.colorClusters : this.colorPrimaryApp}
                  use-gradient={this.useGradient}
                  tiles-max-zoom-offline={this.tilesMaxZoomOffline}
                  grw-app={true}
                  main-marker-size={this.mainMarkerSize}
                  selected-main-markerSize={this.selectedMainMarkerSize}
                  main-cluster-size={this.mainClusterSize}
                  common-marker-size={this.commonMarkerSize}
                  departure-arrival-marker-size={this.departureArrivalMarkerSize}
                  point-reference-marker-size={this.pointReferenceMarkerSize}
                  elevation-height={this.elevationHeight}
                  mobile-elevation-height={this.mobileElevationHeight}
                  large-view-size={this.largeViewSize}
                ></grw-map>
              )}
            </div>
            {((!this.showTrek && !this.showTouristicContent && !this.showTouristicEvent && !this.showOutdoorSite) ||
              (this.showTrek && state.currentTrek) ||
              (this.showTouristicContent && state.currentTouristicContent) ||
              (this.showTouristicEvent && state.currentTouristicEvent) ||
              (this.showOutdoorSite && state.currentOutdoorSite)) && (
              <div class="grw-map-visibility-button-container">
                <grw-extended-fab
                  exportparts="map-visibility-button,map-visibility-button-icon,map-visibility-button-label"
                  font-family={this.fontFamily}
                  action={() => this.handleShowMap()}
                  icon={() => this.getMapVisibilityIconButton()}
                  name={() => this.getMapVisibilityLabelButton()}
                  display={this.isLargeView ? 'none' : 'flex'}
                ></grw-extended-fab>
              </div>
            )}
          </div>
        )}
        {!this.showTrek && this.showFilters && <grw-filters font-family={this.fontFamily} handleFilters={() => this.handleFilters()}></grw-filters>}
      </Host>
    );
  }
}
