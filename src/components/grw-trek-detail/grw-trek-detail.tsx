import { Component, Host, h, Prop, State, Event, EventEmitter, Build, Listen, getAssetPath, Fragment } from '@stencil/core';
import Swiper, { Navigation, Pagination, Keyboard, FreeMode, Mousewheel, Scrollbar } from 'swiper';
import { translate } from 'i18n/i18n';
import state, { onChange } from 'store/store';
import { Accessibilities, AccessibilityLevel, Difficulty, Labels, Practice, Route, Sources, Themes, Trek, Option, Options, Treks } from 'types/types';
import { formatDuration, formatLength, formatAscent, formatDescent, imagesRegExp } from 'utils/utils';
import { getAllDataInStore, getDataInStore, writeOrUpdateDataInStore, writeOrUpdateFilesInStore, writeOrUpdateTilesInStore } from 'services/grw-db.service';
import { tileLayerOffline } from 'leaflet.offline';
import L from 'leaflet';
import { getDistricts, getPoisNearTrek, getSensitiveAreasNearTrek, getTrek, getTreksList } from 'services/treks.service';
import { getTouristicContentsNearTrek } from 'services/touristic-contents.service';
import { getTouristicEventsNearTrek } from 'services/touristic-events.service';
import CloseIcon from '../../assets/close.svg';
import TimelapseIcon from '../../assets/timelapse.svg';
import OpenInFullIcon from '../../assets/open_in_full.svg';
import MovingIcon from '../../assets/moving.svg';
import DownloadForOfflineIcon from '../../assets/download_for_offline.svg';
import DeleteIcon from '../../assets/delete.svg';
import DownloadIcon from '../../assets/download.svg';
import WarningIcon from '../../assets/warning.svg';
import BackpackIcon from '../../assets/backpack.svg';
import CallIcon from '../../assets/call.svg';

const threshold = 1;
const presentation: Option = {
  visible: true,
  indicator: false,
  ref: 'presentationOptionRef',
};
const steps: Option = {
  visible: false,
  indicator: false,
  ref: 'stepsOptionRef',
};
const description: Option = {
  visible: false,
  indicator: false,
  ref: 'descriptionOptionRef',
};
const pois: Option = {
  visible: false,
  indicator: false,
  ref: 'poisOptionRef',
};
const recommendations: Option = {
  visible: false,
  indicator: false,
  ref: 'recommendationsOptionRef',
};
const sensitiveArea: Option = {
  visible: false,
  indicator: false,
  ref: 'sensitiveAreaOptionRef',
};
const informationPlaces: Option = {
  visible: false,
  indicator: false,
  ref: 'informationPlacesOptionRef',
};
const accessibility: Option = {
  visible: false,
  indicator: false,
  ref: 'accessibilityOptionRef',
};
const touristicContents: Option = {
  visible: false,
  indicator: false,
  ref: 'touristicContentsOptionRef',
};
const touristicEvents: Option = {
  visible: false,
  indicator: false,
  ref: 'touristicEventsOptionRef',
};
const options: Options = {
  presentation,
  steps,
  description,
  pois,
  recommendations,
  sensitiveArea,
  informationPlaces,
  accessibility,
  touristicContents,
  touristicEvents,
};

@Component({
  tag: 'grw-trek-detail',
  styleUrl: 'grw-trek-detail.scss',
  shadow: true,
})
export class GrwTrekDetail {
  swiperImages?: Swiper;
  swiperStep?: Swiper;
  swiperPois?: Swiper;
  swiperInformationDesks?: Swiper;
  swiperTouristicContents?: Swiper;
  swiperTouristicEvents?: Swiper;
  swiperImagesRef?: HTMLDivElement;
  prevElImagesRef?: HTMLDivElement;
  nextElImagesRef?: HTMLDivElement;
  paginationElImagesRef?: HTMLDivElement;
  swiperStepRef?: HTMLDivElement;
  swiperPoisRef?: HTMLDivElement;
  swiperInformationDesksRef?: HTMLDivElement;
  swiperTouristicContentsRef?: HTMLDivElement;
  swiperTouristicEventsRef?: HTMLDivElement;
  trekDetailContainerRef?: HTMLElement;
  presentationRef?: HTMLDivElement;
  descriptionRef?: HTMLDivElement;
  parkingRef?: HTMLDivElement;
  recommendationRef?: HTMLDivElement;
  sensitiveAreaRef?: HTMLDivElement;
  informationPlacesRef?: HTMLDivElement;
  poiRef?: HTMLDivElement;
  stepsRef?: HTMLDivElement;
  accessibilityRef?: HTMLDivElement;
  touristicContentsRef?: HTMLDivElement;
  touristicEventsRef?: HTMLDivElement;
  presentationOptionRef?: HTMLAnchorElement;
  stepsOptionRef?: HTMLAnchorElement;
  descriptionOptionRef?: HTMLAnchorElement;
  recommendationsOptionRef?: HTMLAnchorElement;
  accessibilityOptionRef?: HTMLAnchorElement;
  sensitiveAreaOptionRef?: HTMLAnchorElement;
  informationPlacesOptionRef?: HTMLAnchorElement;
  poisOptionRef?: HTMLAnchorElement;
  touristicContentsOptionRef?: HTMLAnchorElement;
  touristicEventsOptionRef?: HTMLAnchorElement;
  stepSwiperScrollbar?: HTMLDivElement;
  poisSwiperScrollbar?: HTMLDivElement;
  informationDesksContentsSwiperScrollbar?: HTMLDivElement;
  touristicContentsSwiperScrollbar?: HTMLDivElement;
  touristicEventsSwiperScrollbar?: HTMLDivElement;

  presentationObserver: IntersectionObserver;
  stepsObserver: IntersectionObserver;
  descriptionObserver: IntersectionObserver;
  recommendationsObserver: IntersectionObserver;
  parkingObserver: IntersectionObserver;
  sensitiveAreaObserver: IntersectionObserver;
  informationPlacesObserver: IntersectionObserver;
  accessibilityObserve: IntersectionObserver;
  poiObserver: IntersectionObserver;
  accessibilityObserver: IntersectionObserver;
  touristicContentObserver: IntersectionObserver;
  touristicEventObserver: IntersectionObserver;

  hasStep?: boolean;

  defaultOptions: Options;
  @Event() descriptionIsInViewport: EventEmitter<boolean>;
  @Event() parkingIsInViewport: EventEmitter<boolean>;
  @Event() sensitiveAreaIsInViewport: EventEmitter<boolean>;
  @Event() informationPlacesIsInViewport: EventEmitter<boolean>;
  @Event() poiIsInViewport: EventEmitter<boolean>;
  @Event() stepsIsInViewport: EventEmitter<boolean>;
  @Event() touristicContentsIsInViewport: EventEmitter<boolean>;
  @Event() touristicEventsIsInViewport: EventEmitter<boolean>;
  @Event() parentTrekPress: EventEmitter<number>;
  @State() currentTrek: Trek;
  @State() difficulty: Difficulty;
  @State() route: Route;
  @State() practice: Practice;
  @State() themes: Themes;
  @State() labels: Labels;
  @State() sources: Sources;
  @State() accessibilities: Accessibilities;
  @State() accessibilityLevel: AccessibilityLevel;
  @State() displayFullscreen = false;
  @State() cities: string[];
  @State() options: Options;
  @State() offline = false;

  @Prop() emergencyNumber: number;

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorPrimaryContainer = '#eaddff';
  @Prop() colorOnPrimaryContainer = '#21005e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() colorBackground = '#fef7ff';

  @Prop() weather = false;
  @Prop() isLargeView = false;

  @Prop() defaultBackgroundLayerUrl;
  @Prop() defaultBackgroundLayerAttribution;

  @Prop() enableOffline = false;
  @Prop() globalTilesMinZoomOffline = 0;
  @Prop() globalTilesMaxZoomOffline = 11;
  @Prop() tilesMinZoomOffline = 12;
  @Prop() tilesMaxZoomOffline = 16;

  @Prop() grwApp = false;

  @Event() downloadConfirm: EventEmitter<number>;
  @Event() downloadedSuccessConfirm: EventEmitter<number>;

  @Event() deleteConfirm: EventEmitter<number>;
  @Event() deleteSuccessConfirm: EventEmitter<number>;

  indicatorSelectedTrekOption = { translateX: null, width: null, backgroundSize: null, ref: null };

  @State() showTouristicContentDetailsModal = false;
  @State() showTouristicEventDetailsModal = false;
  @State() modalDetailsId = null;

  @Listen('closeDetailsModal', { target: 'window' })
  onCloseDetailsModal() {
    document.body.style.overflow = `visible`;
    state.currentTouristicContent = null;
    this.modalDetailsId = null;
    if (this.showTouristicContentDetailsModal) {
      this.showTouristicContentDetailsModal = false;
    } else {
      this.showTouristicEventDetailsModal = false;
    }
  }

  @Listen('touristicEventCardPress', { target: 'window' })
  onTouristiceEventCardPress(touristicEventId) {
    if (!this.grwApp) {
      this.modalDetailsId = touristicEventId.detail;
      this.onOpenDetailsModal('TouristicContent');
    }
  }

  @Listen('touristicContentCardPress', { target: 'window' })
  onTouristicContentCardPress(touristicContentId) {
    if (!this.grwApp) {
      this.modalDetailsId = touristicContentId.detail;
      this.onOpenDetailsModal('touristicContent');
    }
  }

  onOpenDetailsModal(modalDetails: 'touristicContent' | 'TouristicContent') {
    document.body.style.overflow = `hidden`;
    if (modalDetails === 'touristicContent') {
      this.showTouristicContentDetailsModal = true;
    } else {
      this.showTouristicEventDetailsModal = true;
    }
  }

  componentDidUpdate() {
    this.handleObservers();
    this.handleSwipers();
  }

  handleSwipers() {
    if (this.swiperImagesRef && !this.swiperImages) {
      this.swiperImages = new Swiper(this.swiperImagesRef, {
        modules: [Navigation, Pagination, Keyboard, FreeMode, Mousewheel],
        navigation: {
          prevEl: this.prevElImagesRef,
          nextEl: this.nextElImagesRef,
        },
        pagination: { el: this.paginationElImagesRef },
        allowTouchMove: false,
        keyboard: false,
        loop: true,
      });
      if (this.swiperImagesRef) {
        this.swiperImagesRef.onfullscreenchange = () => {
          this.displayFullscreen = !this.displayFullscreen;
          this.displayFullscreen && !this.offline ? this.swiperImages.keyboard.enable() : this.swiperImages.keyboard.disable();
        };
      }
    }
    if (this.swiperStepRef && !this.swiperStep) {
      this.swiperStep = new Swiper(this.swiperStepRef, {
        modules: [FreeMode, Mousewheel, Scrollbar],
        initialSlide: this.getCurrentStepIndex(),
        slidesPerView: 1.5,
        spaceBetween: 20,
        grabCursor: true,
        freeMode: true,
        mousewheel: { forceToAxis: true },
        scrollbar: {
          draggable: true,
          hide: false,
          el: this.stepSwiperScrollbar,
        },
        breakpointsBase: 'container',
        breakpoints: {
          '540': {
            slidesPerView: 2.5,
          },
          '1024': {
            slidesPerView: 4,
          },
        },
        loop: false,
      });
    }
    if (this.swiperPoisRef && !this.swiperPois) {
      this.swiperPois = new Swiper(this.swiperPoisRef, {
        modules: [FreeMode, Mousewheel, Scrollbar],
        slidesPerView: 1.5,
        spaceBetween: 20,
        grabCursor: true,
        freeMode: true,
        mousewheel: { forceToAxis: true },
        scrollbar: {
          draggable: true,
          hide: false,
          el: this.poisSwiperScrollbar,
        },
        breakpointsBase: 'container',
        breakpoints: {
          '540': {
            slidesPerView: 2.5,
          },
          '1024': {
            slidesPerView: 4,
          },
        },
        loop: false,
      });
    }
    if (this.swiperInformationDesksRef && !this.swiperInformationDesks) {
      this.swiperInformationDesks = new Swiper(this.swiperInformationDesksRef, {
        modules: [FreeMode, Mousewheel, Scrollbar],
        slidesPerView: 1.5,
        spaceBetween: 20,
        grabCursor: true,
        freeMode: true,
        mousewheel: { forceToAxis: true },
        scrollbar: {
          draggable: true,
          hide: false,
          el: this.informationDesksContentsSwiperScrollbar,
        },
        breakpointsBase: 'container',
        breakpoints: {
          '540': {
            slidesPerView: 2.5,
          },
          '1024': {
            slidesPerView: 4,
          },
        },
        loop: false,
      });
    }
    if (this.swiperTouristicContentsRef && !this.swiperTouristicContents) {
      this.swiperTouristicContents = new Swiper(this.swiperTouristicContentsRef, {
        modules: [FreeMode, Mousewheel, Scrollbar],
        slidesPerView: 1.5,
        spaceBetween: 20,
        grabCursor: true,
        freeMode: true,
        mousewheel: { forceToAxis: true },
        scrollbar: {
          draggable: true,
          hide: false,
          el: this.touristicContentsSwiperScrollbar,
        },
        breakpointsBase: 'container',
        breakpoints: {
          '540': {
            slidesPerView: 2.5,
          },
          '1024': {
            slidesPerView: 4,
          },
        },
        loop: false,
      });
    }
    if (this.swiperTouristicEventsRef && !this.swiperTouristicEvents) {
      this.swiperTouristicEvents = new Swiper(this.swiperTouristicEventsRef, {
        modules: [FreeMode, Mousewheel, Scrollbar],
        slidesPerView: 1.5,
        spaceBetween: 20,
        grabCursor: true,
        freeMode: true,
        mousewheel: { forceToAxis: true },
        scrollbar: {
          draggable: true,
          hide: false,
          el: this.touristicEventsSwiperScrollbar,
        },
        breakpointsBase: 'container',
        breakpoints: {
          '540': {
            slidesPerView: 2.5,
          },
          '1024': {
            slidesPerView: 4,
          },
        },
        loop: false,
      });
    }
  }

  handleObservers() {
    if (this.presentationRef && !this.presentationObserver) {
      this.presentationObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.options = { ...this.options, presentation: { ...this.defaultOptions.presentation, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.presentationObserver.observe(this.presentationRef);
    }
    if (this.stepsRef && !this.stepsObserver) {
      this.stepsObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.stepsIsInViewport.emit(isIntersecting);
          this.options = { ...this.options, steps: { ...this.defaultOptions.steps, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.stepsObserver.observe(this.stepsRef);
    }
    if (this.descriptionRef && !this.descriptionObserver) {
      this.descriptionObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.descriptionIsInViewport.emit(isIntersecting);
          this.options = { ...this.options, description: { ...this.defaultOptions.description, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.descriptionObserver.observe(this.descriptionRef);
    }
    if (this.recommendationRef && !this.recommendationsObserver) {
      this.recommendationsObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.options = { ...this.options, recommendations: { ...this.defaultOptions.recommendations, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.recommendationsObserver.observe(this.recommendationRef);
    }
    if (this.parkingRef && !this.parkingObserver) {
      this.parkingObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.parkingIsInViewport.emit(isIntersecting);
        },
        { threshold },
      );
      this.parkingObserver.observe(this.parkingRef);
    }

    if (this.sensitiveAreaRef && !this.sensitiveAreaObserver) {
      this.sensitiveAreaObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.sensitiveAreaIsInViewport.emit(isIntersecting);
          this.options = { ...this.options, sensitiveArea: { ...this.defaultOptions.sensitiveArea, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.sensitiveAreaObserver.observe(this.sensitiveAreaRef);
    }

    if (this.informationPlacesRef && !this.informationPlacesObserver) {
      this.informationPlacesObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.informationPlacesIsInViewport.emit(isIntersecting);
          this.options = { ...this.options, informationPlaces: { ...this.defaultOptions.informationPlaces, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.informationPlacesObserver.observe(this.informationPlacesRef);
    }

    if (this.accessibilityRef && !this.accessibilityObserver) {
      this.accessibilityObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.options = { ...this.options, accessibility: { ...this.defaultOptions.accessibility, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.accessibilityObserver.observe(this.accessibilityRef);
    }

    if (this.poiRef && !this.poiObserver) {
      this.poiObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.poiIsInViewport.emit(isIntersecting);
          this.options = { ...this.options, pois: { ...this.defaultOptions.pois, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.poiObserver.observe(this.poiRef);
    }

    if (this.touristicContentsRef && !this.touristicContentObserver) {
      this.touristicContentObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.touristicContentsIsInViewport.emit(isIntersecting);
          this.options = { ...this.options, touristicContents: { ...this.defaultOptions.touristicContents, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.touristicContentObserver.observe(this.touristicContentsRef);
    }
    if (this.touristicEventsRef && !this.touristicEventObserver) {
      this.touristicEventObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.touristicEventsIsInViewport.emit(isIntersecting);
          this.options = { ...this.options, touristicEvents: { ...this.defaultOptions.touristicEvents, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.touristicEventObserver.observe(this.touristicEventsRef);
    }
  }

  componentDidLoad() {
    this.handleObservers();
    this.handleSwipers();
  }

  async connectedCallback() {
    if (state.currentTrek) {
      this.offline = state.currentTrek.offline;
      this.defaultOptions = this.handleOptions();
      this.options = { ...this.defaultOptions, presentation: { ...this.defaultOptions.presentation, indicator: true } };
      this.difficulty = state.difficulties.find(difficulty => difficulty.id === state.currentTrek.difficulty);
      this.route = state.routes.find(route => route.id === state.currentTrek.route);
      this.practice = state.practices.find(practice => practice.id === state.currentTrek.practice);
      this.themes = state.themes.filter(theme => state.currentTrek.themes.includes(theme.id));
      this.labels = state.labels.filter(label => state.currentTrek.labels.includes(label.id));
      this.sources = state.sources.filter(source => state.currentTrek.source.includes(source.id));
      this.accessibilities = state.accessibilities.filter(accessibility => state.currentTrek.accessibilities.includes(accessibility.id));
      if (state.accessibilitiesLevel) {
        this.accessibilityLevel = state.accessibilitiesLevel.find(accessibilityLevel => state.currentTrek.accessibility_level === accessibilityLevel.id);
      }
      this.cities = state.currentTrek.cities.map(currentCity => state.cities.find(city => city.id === currentCity)?.name);
      this.hasStep = state.currentTrek.children.length > 0;
      this.currentTrek = state.currentTrek;
    }

    onChange('currentTrek', async () => {
      if (state.currentTrek) {
        this.offline = state.currentTrek.offline;
        this.defaultOptions = this.handleOptions();
        this.options = { ...this.defaultOptions, presentation: { ...this.defaultOptions.presentation, indicator: true } };
        this.difficulty = state.difficulties.find(difficulty => difficulty.id === state.currentTrek.difficulty);
        this.route = state.routes.find(route => route.id === state.currentTrek.route);
        this.practice = state.practices.find(practice => practice.id === state.currentTrek.practice);
        this.themes = state.themes.filter(theme => state.currentTrek.themes.includes(theme.id));
        this.labels = state.labels.filter(label => state.currentTrek.labels.includes(label.id));
        this.sources = state.sources.filter(source => state.currentTrek.source.includes(source.id));
        this.accessibilities = state.accessibilities.filter(accessibility => state.currentTrek.accessibilities.includes(accessibility.id));
        if (state.accessibilitiesLevel) {
          this.accessibilityLevel = state.accessibilitiesLevel.find(accessibilityLevel => state.currentTrek.accessibility_level === accessibilityLevel.id);
        }
        this.cities = state.currentTrek.cities.map(currentCity => state.cities.find(city => city.id === currentCity)?.name);
        this.hasStep = state.currentTrek.children.length > 0;
        this.currentTrek = state.currentTrek;
      }
    });
  }

  disconnectedCallback() {
    this.presentationObserver && this.presentationObserver.disconnect();
    this.stepsObserver && this.stepsObserver.disconnect();
    this.descriptionObserver && this.descriptionObserver.disconnect();
    this.recommendationsObserver && this.recommendationsObserver.disconnect();
    this.parkingObserver && this.parkingObserver.disconnect();
    this.sensitiveAreaObserver && this.sensitiveAreaObserver.disconnect();
    this.informationPlacesObserver && this.informationPlacesObserver.disconnect();
    this.accessibilityObserver && this.accessibilityObserver.disconnect();
    this.poiObserver && this.poiObserver.disconnect();
    this.accessibilityObserver && this.accessibilityObserver.disconnect();
    this.touristicContentObserver && this.touristicContentObserver.disconnect();
    this.touristicEventObserver && this.touristicEventObserver.disconnect();
  }

  handleOptions() {
    return {
      ...options,
      presentation: { ...presentation },
      steps: { ...steps, visible: Boolean(state.parentTrek) },
      description: { ...description, visible: Boolean(state.currentTrek.description) },
      pois: { ...pois, visible: Boolean(state.currentPois && state.currentPois.length > 0) },
      recommendations: { ...recommendations, visible: Boolean(state.currentTrek.advice || (this.labels && this.labels.length > 0)) },
      sensitiveArea: { ...sensitiveArea, visible: Boolean(state.currentSensitiveAreas && state.currentSensitiveAreas.length > 0) },
      informationPlaces: {
        ...informationPlaces,
        visible: Boolean(
          state.currentInformationDesks &&
            state.currentInformationDesks.filter(currentInformationDesks => state.currentTrek.information_desks.includes(currentInformationDesks.id)).length > 0,
        ),
      },
      accessibility: {
        ...accessibility,
        visible: Boolean(
          state.currentTrek.disabled_infrastructure ||
            (this.accessibilities && this.accessibilities.length > 0) ||
            state.currentTrek.accessibility_level ||
            state.currentTrek.accessibility_slope ||
            state.currentTrek.accessibility_width ||
            state.currentTrek.accessibility_signage ||
            state.currentTrek.accessibility_covering ||
            state.currentTrek.accessibility_exposure ||
            state.currentTrek.accessibility_advice ||
            this.emergencyNumber,
        ),
      },
      touristicContents: { ...touristicContents, visible: Boolean(state.trekTouristicContents && state.trekTouristicContents.length > 0) },
      touristicEvents: { ...touristicEvents, visible: Boolean(state.trekTouristicEvents && state.trekTouristicEvents.length > 0) },
    };
  }

  handleFullscreen(close: boolean = false) {
    if (!close) {
      if (this.currentTrek.attachments && this.currentTrek.attachments[0] && this.currentTrek.attachments[0].url) {
        this.swiperImagesRef.requestFullscreen();
      }
    } else {
      (document as any).exitFullscreen();
    }
  }

  handleIndicatorSelectedTrekOption() {
    let currentOption: Option;
    let previousVisibleOptions = 0;
    let previousWidthOptions = 0;
    let elementWidth = 0;

    const options: Option[] = Object.values(this.options);
    let index = 0;
    while (!currentOption && index < options.length) {
      if (options[index].indicator) {
        currentOption = options[index];
      } else {
        if (options[index].visible) {
          previousVisibleOptions += 1;
          previousWidthOptions += this[options[index].ref].clientWidth;
        }
      }
      index++;
    }
    if (currentOption && this[currentOption.ref]) {
      elementWidth = this[currentOption.ref].clientWidth;
      this.indicatorSelectedTrekOption = {
        translateX: `${previousWidthOptions + 16 * previousVisibleOptions - elementWidth / 2}px`,
        width: `${elementWidth * 2}px`,
        backgroundSize: `${elementWidth}px 100%`,
        ref: currentOption.ref,
      };
    }
  }

  handleScrollTo(element: HTMLDivElement) {
    const scrollbarFromElement = this.trekDetailContainerRef.scrollHeight > this.trekDetailContainerRef.clientHeight;
    if (scrollbarFromElement) {
      this.trekDetailContainerRef.scrollTo({ top: element.offsetTop - 64 });
    } else {
      window.scrollTo({ top: element.offsetTop - 64 });
    }
  }

  getCurrentStepIndex(): number {
    return state.currentTrekSteps ? state.currentTrekSteps.findIndex(step => step.id === this.currentTrek.id) : 0;
  }

  async downloadGlobalTiles(url, attribution) {
    const offlineLayer = tileLayerOffline(url, { attribution });

    const treksDepartureCoordinates = [];

    if (state.treks) {
      for (const trek of state.treks) {
        treksDepartureCoordinates.push(trek.departure_geom);
      }
    }

    const bounds = L.latLngBounds(treksDepartureCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));

    await writeOrUpdateTilesInStore(offlineLayer, bounds, this.globalTilesMinZoomOffline, this.globalTilesMaxZoomOffline);
  }

  async downloadTrekTiles(url, attribution) {
    const offlineLayer = tileLayerOffline(url, { attribution });

    const bounds = L.latLngBounds(this.currentTrek.geometry.coordinates.map(coordinate => [coordinate[1], coordinate[0]]));

    await writeOrUpdateTilesInStore(offlineLayer, bounds, this.tilesMinZoomOffline, this.tilesMaxZoomOffline);
  }

  async downloadTrek() {
    // download treks list data
    const controller = new AbortController();
    const signal = controller.signal;
    const init: RequestInit = { cache: Build.isDev ? 'force-cache' : 'default', signal: signal };
    const offlineTreks = (await getAllDataInStore('treks')).filter(trek => trek.offline === true);
    let treks;
    if (!state.treks) {
      const treksList = await getTreksList(
        state.api,
        state.language,
        state.inBboxFromProviders,
        state.citiesFromProviders,
        state.districts,
        state.structuresFromProviders,
        state.themesFromProviders,
        state.portalsFromProviders,
        state.routesFromProviders,
        state.practicesFromProviders,
        state.labelsFromProviders,
        init,
      );
      state.treks = (await treksList.json()).results;
    }
    treks = state.treks;
    treks = treks.filter(trek => offlineTreks.findIndex(offlineTrek => offlineTrek.id === trek.id) === -1);

    if (!state.districts) {
      const districtsList = await getDistricts(state.api, state.language, init);
      state.districts = (await districtsList.json()).results;
    }

    await writeOrUpdateDataInStore('treks', treks);
    await writeOrUpdateDataInStore('districts', state.districts);

    // download global tiles
    await this.downloadGlobalTiles(this.defaultBackgroundLayerUrl, this.defaultBackgroundLayerAttribution);

    // download trek tiles
    await this.downloadTrekTiles(this.defaultBackgroundLayerUrl, this.defaultBackgroundLayerAttribution);

    // download global medias
    await writeOrUpdateFilesInStore(state.difficulties, imagesRegExp);
    await writeOrUpdateFilesInStore(state.routes, imagesRegExp);
    await writeOrUpdateFilesInStore(state.practices, imagesRegExp);
    await writeOrUpdateFilesInStore(state.themes, imagesRegExp);
    await writeOrUpdateFilesInStore(state.labels, imagesRegExp);
    await writeOrUpdateFilesInStore(state.districts, imagesRegExp);
    await writeOrUpdateFilesInStore(state.sources, imagesRegExp);
    await writeOrUpdateFilesInStore(state.accessibilities, imagesRegExp);
    await writeOrUpdateFilesInStore(state.poiTypes, imagesRegExp);
    await writeOrUpdateFilesInStore(state.currentInformationDesks, imagesRegExp);
    await writeOrUpdateFilesInStore(state.touristicContentCategories, imagesRegExp);
    await writeOrUpdateFilesInStore(state.touristicEventTypes, imagesRegExp);
    await writeOrUpdateFilesInStore(state.networks, imagesRegExp);

    // download trek images
    await writeOrUpdateFilesInStore(this.currentTrek, imagesRegExp, true, ['url']);

    // download trek data
    await writeOrUpdateDataInStore('difficulties', state.difficulties);
    await writeOrUpdateDataInStore('routes', state.routes);
    await writeOrUpdateDataInStore(
      'practices',
      state.practices.map(practice => ({ ...practice, selected: false })),
    );
    await writeOrUpdateDataInStore('themes', state.themes);
    await writeOrUpdateDataInStore('cities', state.cities);
    await writeOrUpdateDataInStore('accessibilities', state.accessibilities);
    await writeOrUpdateDataInStore('ratings', state.ratings);
    await writeOrUpdateDataInStore('ratingsScale', state.ratingsScale);
    await writeOrUpdateDataInStore('sensitiveAreas', state.currentSensitiveAreas);
    await writeOrUpdateDataInStore('labels', state.labels);
    await writeOrUpdateDataInStore('sources', state.sources);
    await writeOrUpdateDataInStore('accessibilitiesLevel', state.accessibilitiesLevel);
    await writeOrUpdateDataInStore('touristicContentCategories', state.touristicContentCategories);
    await writeOrUpdateDataInStore('touristicEventTypes', state.touristicEventTypes);
    await writeOrUpdateDataInStore('networks', state.networks);
    await writeOrUpdateDataInStore('pois', state.currentPois);
    await writeOrUpdateDataInStore('poiTypes', state.poiTypes);
    await writeOrUpdateDataInStore('signages', state.currentSignages);
    await writeOrUpdateDataInStore('informationDesks', state.currentInformationDesks);
    await writeOrUpdateDataInStore('treks', [
      {
        ...this.currentTrek,
        offline: true,
        pois: state.currentPois.map(poi => poi.id),
        signages: state.currentSignages.map(signage => signage.id),
        touristicContents: state.trekTouristicContents.map(trekTouristicContent => trekTouristicContent.id),
        touristicEvents: state.trekTouristicEvents.map(trekTouristicEvent => trekTouristicEvent.id),
        sensitiveAreas: state.currentSensitiveAreas ? state.currentSensitiveAreas.map(currentSensitiveArea => currentSensitiveArea.id) : [],
      },
    ]);

    await writeOrUpdateFilesInStore(state.currentPois, imagesRegExp, true, ['url']);
    await writeOrUpdateFilesInStore(state.currentInformationDesks, imagesRegExp, true);

    // download items data
    await writeOrUpdateFilesInStore(state.trekTouristicContents, imagesRegExp, true, ['url']);
    state.trekTouristicContents.forEach(trekTouristicContent => {
      trekTouristicContent.offline = true;
    });
    await writeOrUpdateDataInStore('touristicContents', state.trekTouristicContents);

    await writeOrUpdateFilesInStore(state.trekTouristicEvents, imagesRegExp, true, ['url']);
    state.trekTouristicEvents.forEach(trekTouristicEvent => {
      trekTouristicEvent.offline = true;
    });
    await writeOrUpdateDataInStore('touristicEvents', state.trekTouristicEvents);

    // download itinerancy
    if (this.currentTrek.children && this.currentTrek.children.length > 0) {
      // fetch and store children treks
      const steps: number[] = [];
      steps.push(...this.currentTrek.children);
      const stepRequests = [];
      const stepsTouristicContentsRequests = [];
      const stepsTouristicEventsRequests = [];
      const stepsPoisRequests = [];
      const stepsSensitiveAreasRequests = [];

      steps.forEach(stepId => {
        stepRequests.push(getTrek(state.api, state.language, stepId, init));
        stepsTouristicContentsRequests.push(getTouristicContentsNearTrek(state.api, state.language, stepId, init));
        stepsTouristicEventsRequests.push(getTouristicEventsNearTrek(state.api, state.language, stepId, init));
        stepsPoisRequests.push(getPoisNearTrek(state.api, state.language, stepId, init));
        stepsSensitiveAreasRequests.push(getSensitiveAreasNearTrek(state.api, state.language, stepId, init));
      });

      const trekSteps: Treks = await Promise.all([...stepRequests]).then(responses => Promise.all(responses.map(response => response.json())));

      const stepsTouristicContentsResponses = await Promise.all([...stepsTouristicContentsRequests]).then(responses => Promise.all(responses.map(response => response.json())));
      const stepsTouristicEventsResponses = await Promise.all([...stepsTouristicEventsRequests]).then(responses => Promise.all(responses.map(response => response.json())));
      const stepsPoisResponses = await Promise.all([...stepsPoisRequests]).then(responses => Promise.all(responses.map(response => response.json())));
      const stepsSensitiveAreasResponses = await Promise.all([...stepsSensitiveAreasRequests]).then(responses => Promise.all(responses.map(response => response.json())));

      for (let index = 0; index < trekSteps.length; index++) {
        trekSteps[index].offline = true;
        trekSteps[index].pois = stepsPoisResponses[index].results.map(poi => poi.id);
        trekSteps[index].touristicContents = stepsTouristicContentsResponses[index].results.map(trekTouristicContent => trekTouristicContent.id);
        trekSteps[index].touristicEvents = stepsTouristicEventsResponses[index].results.map(trekTouristicEvent => trekTouristicEvent.id);
        trekSteps[index].sensitiveAreas = stepsSensitiveAreasResponses[index].results.map(currentSensitiveArea => currentSensitiveArea.id);
        await writeOrUpdateDataInStore('treks', [trekSteps[index]]);
        await writeOrUpdateFilesInStore(trekSteps[index], imagesRegExp, true, ['url']);
      }
    }

    state.treks.find(trek => trek.id === this.currentTrek.id).offline = true;
    if (!state.currentTreks) {
      state.currentTreks = state.treks;
    }
    state.currentTreks.find(trek => trek.id === this.currentTrek.id).offline = true;
    if (this.swiperImages) {
      this.swiperImages.slideTo(0);
    }
    this.offline = true;
    this.downloadedSuccessConfirm.emit();
  }

  async deleteTrek() {
    const treksInStore: Treks = [];
    const trekInStore = await getDataInStore('treks', this.currentTrek.id);
    this.deleteOfflineTrekProperties(trekInStore);
    treksInStore.push(trekInStore);
    if (this.currentTrek.children.length > 0) {
      for (let index = 0; index < this.currentTrek.children.length; index++) {
        const trekInStore = await getDataInStore('treks', this.currentTrek.children[index]);
        this.deleteOfflineTrekProperties(trekInStore);
        treksInStore.push(trekInStore);
      }
    }
    await writeOrUpdateDataInStore('treks', treksInStore);

    if (state.treks) {
      delete state.treks.find(trek => trek.id === this.currentTrek.id).offline;

      if (!state.currentTreks) {
        state.currentTreks = state.treks;
      }
      delete state.currentTreks.find(trek => trek.id === this.currentTrek.id).offline;
    }

    if (state.parentTrek) {
      delete state.parentTrek.offline;
    }

    if (state.currentTrekSteps) {
      state.currentTrekSteps.forEach(currentTrekStep => {
        delete currentTrekStep.offline;
      });
    }

    this.offline = false;
    this.deleteSuccessConfirm.emit();
  }

  displayDownloadModal() {
    this.downloadConfirm.emit();
  }

  displayDeleteModal() {
    this.deleteConfirm.emit();
  }

  @Listen('downloadPress', { target: 'window' })
  onDownloadPress() {
    this.downloadTrek();
  }

  @Listen('deletePress', { target: 'window' })
  onDeletePress() {
    this.deleteTrek();
  }

  deleteOfflineTrekProperties(trekInStore) {
    delete trekInStore.descent;
    delete trekInStore.geometry;
    delete trekInStore.gpx;
    delete trekInStore.kml;
    delete trekInStore.pdf;
    delete trekInStore.parking_location;
    delete trekInStore.arrival;
    delete trekInStore.ambiance;
    delete trekInStore.access;
    delete trekInStore.public_transport;
    delete trekInStore.advice;
    delete trekInStore.advised_parking;
    delete trekInStore.gear;
    delete trekInStore.source;
    delete trekInStore.points_reference;
    delete trekInStore.disabled_infrastructure;
    delete trekInStore.accessibility_level;
    delete trekInStore.accessibility_slope;
    delete trekInStore.accessibility_width;
    delete trekInStore.accessibility_signage;
    delete trekInStore.accessibility_covering;
    delete trekInStore.accessibility_exposure;
    delete trekInStore.accessibility_advice;
    delete trekInStore.ratings;
    delete trekInStore.ratings_description;
    delete trekInStore.children;
    delete trekInStore.networks;
    delete trekInStore.web_links;
    delete trekInStore.update_datetime;
    delete trekInStore.information_desks;
    delete trekInStore.pois;
    delete trekInStore.touristicContents;
    delete trekInStore.touristicEvents;
    delete trekInStore.sensitiveAreas;
    delete trekInStore.offline;
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const displayPaginationAndNavigation = (this.currentTrek && this.currentTrek.attachments.filter(attachment => attachment.type === 'image').length > 1) || this.offline;
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
          '--color-primary-app': this.colorPrimaryApp,
          '--color-on-surface': this.colorOnSurface,
          '--color-primary-container': this.colorPrimaryContainer,
          '--color-on-primary-container': this.colorOnPrimaryContainer,
          '--color-secondary-container': this.colorSecondaryContainer,
          '--color-on-secondary-container': this.colorOnSecondaryContainer,
          '--color-background': this.colorBackground,
          '--detail-bottom-space-height': this.isLargeView
            ? state.languages && state.languages.length > 1
              ? '44px'
              : '12px'
            : state.languages && state.languages.length > 1
            ? '164px'
            : '124px',
        }}
      >
        {this.currentTrek && (
          <div part="trek-options" class="trek-options">
            <a
              part="trek-option"
              class={`presentation trek-option${this.indicatorSelectedTrekOption.ref === 'presentationOptionRef' ? ' selected-trek-option' : ''}`}
              ref={el => (this.presentationOptionRef = el)}
              onClick={() => this.handleScrollTo(this.presentationRef)}
            >
              {translate[state.language].options.presentation}
            </a>
            {this.options.steps.visible && (
              <a
                part="trek-option"
                class={`steps trek-option${this.options.steps.indicator ? ' selected-trek-option' : ''}`}
                ref={el => (this.stepsOptionRef = el)}
                onClick={() => this.handleScrollTo(this.stepsRef)}
              >
                {translate[state.language].options.steps}
              </a>
            )}
            {this.options.description.visible && (
              <a
                part="trek-option"
                class={`description trek-option${this.indicatorSelectedTrekOption.ref === 'descriptionOptionRef' ? ' selected-trek-option' : ''}`}
                ref={el => (this.descriptionOptionRef = el)}
                onClick={() => this.handleScrollTo(this.descriptionRef)}
              >
                {translate[state.language].options.description}
              </a>
            )}
            {this.options.pois.visible && (
              <a
                part="trek-option"
                class={`pois trek-option${this.indicatorSelectedTrekOption.ref === 'poisOptionRef' ? ' selected-trek-option' : ''}`}
                ref={el => (this.poisOptionRef = el)}
                onClick={() => this.handleScrollTo(this.poiRef)}
              >
                {translate[state.language].options.pois}
              </a>
            )}
            {this.options.recommendations.visible && (
              <a
                part="trek-option"
                class={`recommendations trek-option${this.indicatorSelectedTrekOption.ref === 'recommendationsOptionRef' ? ' selected-trek-option' : ''}`}
                ref={el => (this.recommendationsOptionRef = el)}
                onClick={() => this.handleScrollTo(this.recommendationRef)}
              >
                {translate[state.language].options.recommendations}
              </a>
            )}
            {this.options.sensitiveArea.visible && (
              <a
                part="trek-option"
                class={`sensitive-areas trek-option${this.indicatorSelectedTrekOption.ref === 'sensitiveAreaOptionRef' ? ' selected-trek-option' : ''}`}
                ref={el => (this.sensitiveAreaOptionRef = el)}
                onClick={() => this.handleScrollTo(this.sensitiveAreaRef)}
              >
                {translate[state.language].options.environmentalSensitiveAreas}
              </a>
            )}
            {this.options.informationPlaces.visible && (
              <a
                part="trek-option"
                class={`information-places trek-option${this.indicatorSelectedTrekOption.ref === 'informationPlacesOptionRef' ? ' selected-trek-option' : ''}`}
                ref={el => (this.informationPlacesOptionRef = el)}
                onClick={() => this.handleScrollTo(this.informationPlacesRef)}
              >
                {translate[state.language].options.informationPlaces}
              </a>
            )}
            {this.options.accessibility.visible && (
              <a
                part="trek-option"
                class={`accessibility trek-option${this.indicatorSelectedTrekOption.ref === 'accessibilityOptionRef' ? ' selected-trek-option' : ''}`}
                ref={el => (this.accessibilityOptionRef = el)}
                onClick={() => this.handleScrollTo(this.accessibilityRef)}
              >
                {translate[state.language].options.accessibility}
              </a>
            )}
            {this.options.touristicContents.visible && (
              <a
                part="trek-option"
                class={`touristic-content trek-option${this.indicatorSelectedTrekOption.ref === 'touristicContentsOptionRef' ? ' selected-trek-option' : ''}`}
                ref={el => (this.touristicContentsOptionRef = el)}
                onClick={() => this.handleScrollTo(this.touristicContentsRef)}
              >
                {translate[state.language].options.touristicContents}
              </a>
            )}
            {this.options.touristicEvents.visible && (
              <a
                part="trek-option"
                class={`touristic-event trek-option${this.indicatorSelectedTrekOption.ref === 'touristicEventsOptionRef' ? ' selected-trek-option' : ''}`}
                ref={el => (this.touristicEventsOptionRef = el)}
                onClick={() => this.handleScrollTo(this.touristicEventsRef)}
              >
                {translate[state.language].options.touristicEvents}
              </a>
            )}
            {this.presentationOptionRef && (
              <span
                part="trek-indicator-selected-trek-option"
                class="trek-indicator-selected-trek-option"
                style={{
                  transform: `translateX(${this.indicatorSelectedTrekOption.translateX})`,
                  width: this.indicatorSelectedTrekOption.width,
                  backgroundSize: this.indicatorSelectedTrekOption.backgroundSize,
                }}
              ></span>
            )}
          </div>
        )}
        {this.currentTrek && (
          <div part="trek-detail-container" class="trek-detail-container" ref={el => (this.trekDetailContainerRef = el)}>
            <div part="trek-images" class="trek-images-container" ref={el => (this.presentationRef = el)}>
              <div part="swiper-images" class="swiper swiper-images" ref={el => (this.swiperImagesRef = el)}>
                <div part="swiper-wrapper" class="swiper-wrapper">
                  {this.currentTrek.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
                    this.currentTrek.attachments
                      .filter(attachment => attachment.type === 'image')
                      .map(attachment => {
                        const legend = [attachment.legend, attachment.author].filter(Boolean).join(' - ');
                        return (
                          <div part="swiper-slide" class="swiper-slide">
                            {this.displayFullscreen && (
                              <div part="trek-close-fullscreen-button" class="trek-close-fullscreen-button" onClick={() => this.handleFullscreen(true)}>
                                <span part="trek-close-fullcreen-icon" class="trek-close-fullcreen-icon" innerHTML={CloseIcon}></span>
                              </div>
                            )}
                            <div part="trek-image-legend" class="trek-image-legend">
                              {legend}
                            </div>
                            <img
                              part="trek-img"
                              class="trek-img"
                              src={this.offline && attachment.thumbnail !== '' ? attachment.thumbnail : attachment.url}
                              loading="lazy"
                              onClick={() => this.handleFullscreen()}
                              /* @ts-ignore */
                              onerror={event => {
                                event.target.onerror = null;
                                event.target.className = 'trek-img default-trek-img';
                                event.target.src = defaultImageSrc;
                              }}
                              alt={attachment.legend}
                            />
                          </div>
                        );
                      })
                  ) : (
                    <img part="trek-img" class="trek-img default-trek-img" src={defaultImageSrc} loading="lazy" alt="" />
                  )}
                </div>
                <div
                  style={{ display: 'block', visibility: displayPaginationAndNavigation ? 'visible' : 'hidden' }}
                  part="swiper-pagination"
                  class="swiper-pagination"
                  ref={el => (this.paginationElImagesRef = el)}
                ></div>
                <div
                  style={{ display: 'flex', visibility: displayPaginationAndNavigation ? 'visible' : 'hidden' }}
                  part="swiper-button-prev"
                  class="swiper-button-prev"
                  ref={el => (this.prevElImagesRef = el)}
                ></div>
                <div
                  style={{ display: 'flex', visibility: displayPaginationAndNavigation ? 'visible' : 'hidden' }}
                  part="swiper-button-next"
                  class="swiper-button-next"
                  ref={el => (this.nextElImagesRef = el)}
                ></div>
              </div>
            </div>
            <div part="trek-name" class="trek-name">
              {this.currentTrek.name}
            </div>
            {this.themes.length > 0 && (
              <div part="themes-container" class="themes-container">
                {this.themes.map(theme => (
                  <div part="theme" class="theme">
                    {theme.label}
                  </div>
                ))}
              </div>
            )}
            <div part="sub-container" class="sub-container">
              <div part="icons-labels-container" class="icons-labels-container">
                {this.difficulty && (
                  <div part="icon-label" class="icon-label difficulty">
                    {this.difficulty.pictogram && <img part="icon" class="icon" src={this.difficulty.pictogram} alt="" />}
                    <span part="label" class="label">
                      {this.difficulty.label}
                    </span>
                  </div>
                )}
                <div part="icon-label" class="icon-label duration">
                  <span part="icon" class="icon" innerHTML={TimelapseIcon}></span>
                  <span part="label" class="label">
                    {formatDuration(this.currentTrek?.duration)}
                  </span>
                </div>
                <div part="icon-label" class="icon-label route">
                  {this.route?.pictogram && <img part="icon" class="icon" src={this.route.pictogram} alt="" />}
                  <span part="label" class="label">
                    {this.route?.route}
                  </span>
                </div>
                <div part="icon-label" class="icon-label length">
                  <span part="icon" class="icon" innerHTML={OpenInFullIcon}></span>
                  <span part="label" class="label">
                    {formatLength(this.currentTrek.length_2d)}
                  </span>
                </div>
                {this.currentTrek.ascent && (
                  <div part="icon-label" class="icon-label ascent">
                    <span part="icon" class="icon" innerHTML={MovingIcon}></span>
                    <span part="label" class="label">
                      {formatAscent(this.currentTrek.ascent)}
                    </span>
                  </div>
                )}
                {this.currentTrek.descent && (
                  <div part="icon-label" class="icon-label descent">
                    <span part="icon" class="icon" innerHTML={MovingIcon}></span>
                    <span part="label" class="label">
                      {formatDescent(this.currentTrek.descent)}
                    </span>
                  </div>
                )}
                <div part="icon-label" class="icon-label practice">
                  {this.practice?.pictogram && <img part="icon" class="icon" src={this.practice.pictogram} alt="" />}
                  <span part="label" class="label">
                    {this.practice?.name}
                  </span>
                </div>
                <div part="icon-label" class="icon-label networks">
                  {this.currentTrek.networks.map(networkId => {
                    const currentNetwork = state.networks.find(network => network.id === networkId);
                    return (
                      <div part="network" class="network">
                        <img part="icon" class="icon" src={currentNetwork.pictogram} alt="" />
                        <span part="label" class="label">
                          {currentNetwork.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {this.currentTrek.ratings.map(trekRating => (
                  <div part="row" class="row">
                    {`${state.ratingsScale.find(ratingScale => ratingScale.id === state.ratings.find(rating => rating.id === trekRating).scale).name} : ${
                      state.ratings.find(rating => rating.id === trekRating).name
                    }`}
                  </div>
                ))}
                {this.currentTrek.ratings_description && this.currentTrek.ratings_description !== '' && (
                  <div part="row" class="row" innerHTML={this.currentTrek.ratings_description}></div>
                )}
              </div>
            </div>
            <div part="divider" class="divider"></div>
            <div part="downloads-container" class="downloads-container">
              <div part="download-title" class="download-title">
                {translate[state.language].downloads}
              </div>
              {this.enableOffline && !this.offline && (!this.currentTrek.parents || this.currentTrek.parents.length === 0) && (
                <button part="offline-button" class="offline-button" onClick={() => this.displayDownloadModal()}>
                  <span part="icon" class="icon" innerHTML={DownloadForOfflineIcon}></span>
                  <span part="label" class="label">
                    RENDRE DISPONIBLE HORS LIGNE
                  </span>
                </button>
              )}
              {this.enableOffline && this.offline && (!this.currentTrek.parents || this.currentTrek.parents.length === 0) && (
                <button part="offline-button" class="offline-button" onClick={() => this.displayDeleteModal()}>
                  <span part="icon" class="icon" innerHTML={DeleteIcon}></span>
                  <span part="label" class="label">
                    SUPPRIMER DU HORS LIGNE
                  </span>
                </button>
              )}
              <div part="links-container" class="links-container">
                <a part="download-gpx-button" href={`${this.currentTrek.gpx}`} target="_blank" rel="noopener noreferrer">
                  <span part="icon" class=" icon" innerHTML={DownloadIcon}></span>
                  <span part="label" class="label">
                    GPX
                  </span>
                </a>
                <a part="download-kml-button" href={`${this.currentTrek.kml}`} target="_blank" rel="noopener noreferrer">
                  <span part="icon" class="icon" innerHTML={DownloadIcon}></span>
                  <span part="label" class="label">
                    KML
                  </span>
                </a>
                <a
                  part="download-pdf-button"
                  href={`${this.currentTrek.pdf}${state.portalsFromProviders && state.portalsFromProviders.length === 1 ? '?portal=' + state.portalsFromProviders[0] : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span part="icon" class="icon" innerHTML={DownloadIcon}></span>
                  <span part="label" class="label">
                    PDF
                  </span>
                </a>
              </div>
            </div>
            <div part="divider" class="divider"></div>
            {this.currentTrek.description_teaser && <div part="description-teaser" class="description-teaser" innerHTML={this.currentTrek.description_teaser}></div>}
            {this.currentTrek.ambiance && <div part="ambiance" class="ambiance" innerHTML={this.currentTrek.ambiance}></div>}
            {state.parentTrekId && state.parentTrek && this.currentTrek.id !== state.parentTrekId && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="parent-trek-container" class="parent-trek-container">
                  <button part="parent-trek-title" class="parent-trek-title" onClick={() => this.parentTrekPress.emit(state.parentTrekId)}>
                    <div>&lt;</div>
                    {state.parentTrek.name}
                  </button>
                </div>
              </div>
            )}
            {state.currentTrekSteps && (
              <div part="step-container" class="step-container">
                <div part="step-title" class="step-title" ref={el => (this.stepsRef = el)}>{`${state.currentTrekSteps.length} ${translate[state.language].steps}`}</div>
                <div part="swiper-step" class="swiper swiper-step" ref={el => (this.swiperStepRef = el)}>
                  <div part="swiper-wrapper" class="swiper-wrapper">
                    {state.currentTrekSteps &&
                      state.currentTrekSteps.map(trek => {
                        return (
                          <div part="swiper-slide" class="swiper-slide">
                            <grw-trek-card
                              exportparts="trek-card,trek-img-container,trek-img,trek-sub-container,trek-departure,trek-name,trek-themes-container,trek-theme,trek-icons-labels-container,trek-icon-label,trek-icon,trek-label"
                              key={`trek-${trek.id}`}
                              trek={trek}
                              is-large-view={false}
                              is-step={true}
                              fontFamily={this.fontFamily}
                              color-primary-app={this.colorPrimaryApp}
                              color-on-surface={this.colorOnSurface}
                              color-secondary-container={this.colorSecondaryContainer}
                              color-on-secondary-container={this.colorOnSecondaryContainer}
                              color-surface-container-low={this.colorSurfaceContainerLow}
                              grw-app={this.grwApp}
                            ></grw-trek-card>
                          </div>
                        );
                      })}
                  </div>
                  <div part="swiper-scrollbar" class="swiper-scrollbar" ref={el => (this.stepSwiperScrollbar = el)}></div>
                </div>
              </div>
            )}
            <div part="divider" class="divider"></div>
            {this.currentTrek.description && (
              <div part="description-container" class="description-container">
                <div part="description-title" class="description-title" ref={el => (this.descriptionRef = el)}>
                  {translate[state.language].description}
                </div>
                <div part="description" class="description" innerHTML={this.currentTrek.description}></div>
              </div>
            )}
            {this.currentTrek.departure && (
              <div part="departure-container" class="departure-container">
                <div part="departure-title" class="departure-title">
                  {translate[state.language].departure} :&nbsp;
                </div>
                <div part="departure" innerHTML={this.currentTrek.departure}></div>
              </div>
            )}
            {this.currentTrek.arrival && (
              <div part="arrival-container" class="arrival-container">
                <div part="arrival-title" class="arrival-title">
                  {translate[state.language].arrival} :&nbsp;
                </div>
                <div part="arrival" innerHTML={this.currentTrek.arrival}></div>
              </div>
            )}
            {this.currentTrek.cities && this.currentTrek.cities.length > 0 && (
              <div part="cities-container" class="cities-container">
                <div part="cities-title" class="cities-title">
                  {translate[state.language].crossedCities} :&nbsp;
                </div>
                <div part="cities" innerHTML={this.cities.join(', ')}></div>
              </div>
            )}
            {state.currentPois && state.currentPois.length > 0 && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="pois-container" class="pois-container">
                  <div part="pois-title" class="pois-title" ref={el => (this.poiRef = el)}>
                    {translate[state.language].pois(state.currentPois.length)}
                  </div>
                  <div part="swiper-pois" class="swiper swiper-pois" ref={el => (this.swiperPoisRef = el)}>
                    <div part="swiper-wrapper" class="swiper-wrapper">
                      {state.currentPois.map(poi => (
                        <div part="swiper-slide" class="swiper-slide">
                          <grw-poi
                            exportparts="poi-type-img-container,poi-type,swiper-poi,swiper-wrapper,swiper-slide,poi-img,default-poi-img,swiper-pagination,swiper-button-prev,swiper-button-next,poi-sub-container,poi-name,poi-description,handle-poi-description"
                            poi={poi}
                          ></grw-poi>
                        </div>
                      ))}
                    </div>
                    <div part="swiper-scrollbar" class="swiper-scrollbar" ref={el => (this.poisSwiperScrollbar = el)}></div>
                  </div>
                </div>
              </div>
            )}
            {this.weather && this.currentTrek.departure_city && !this.offline && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="weather-container" class="weather-container">
                  <iframe height="150" frameborder="0" src={`https://meteofrance.com/widget/prevision/${this.currentTrek.departure_city}0#${this.colorPrimaryApp}`}></iframe>
                </div>
              </div>
            )}
            {this.currentTrek.access && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="access-container" class="access-container">
                  <div part="access-title" class="access-title">
                    {translate[state.language].roadAccessAndParking}
                  </div>
                  <div part="access" class="access" innerHTML={this.currentTrek.access}></div>
                  {this.currentTrek.advised_parking && (
                    <div>
                      <div part="advised-parking-title" class="advised-parking-title" ref={el => (this.parkingRef = el)}>
                        {translate[state.language].recommendedParking}
                      </div>
                      <div part="advised-parking" class="advised-parking" innerHTML={this.currentTrek.advised_parking}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {this.currentTrek.public_transport && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="public-transport-container" class="public-transport-container">
                  <div part="public-transport-title" class="public-transport-title">
                    {translate[state.language].transport}
                  </div>
                  <div part="public-transport" class="public-transport" innerHTML={this.currentTrek.public_transport}></div>
                </div>
              </div>
            )}
            {(this.currentTrek.advice || this.currentTrek.gear || this.labels.length > 0) && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="advice-container" class="advice-container">
                  <div part="advice-title" class="advice-title" ref={el => (this.recommendationRef = el)}>
                    {translate[state.language].recommendations}
                  </div>
                  {this.currentTrek.advice && (
                    <div part="current-advice-container" class="current-advice-container">
                      <span part="icon" class="icon" innerHTML={WarningIcon}></span>
                      <div part="advice" class="advice" innerHTML={this.currentTrek.advice}></div>
                    </div>
                  )}
                  {this.currentTrek.gear && (
                    <div part="gear-container" class="gear-container">
                      <span part="icon" class="icon" innerHTML={BackpackIcon}></span>
                      <div part="gear" class="gear" innerHTML={this.currentTrek.gear}></div>
                    </div>
                  )}
                  {this.labels.map(label => (
                    <div part="label-container" class="label-container">
                      <div part="label-sub-container" class="label-sub-container">
                        {label.pictogram && <img src={label.pictogram} alt="" />}
                        <div part="label-name" class="label-name" innerHTML={label.name}></div>
                      </div>
                      <div part="label-advice" class="label-advice" innerHTML={label.advice}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {state.currentSensitiveAreas && state.currentSensitiveAreas.length > 0 && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="sensitive-areas-container" class="sensitive-areas-container">
                  <div part="ensitive-areas-title" class="sensitive-areas-title" ref={el => (this.sensitiveAreaRef = el)}>
                    {translate[state.language].environmentalSensitiveAreas}
                  </div>
                  <div part="sensitive-areas-description" class="sensitive-areas-description">
                    {translate[state.language].sensitiveAreasDescription}
                  </div>
                  {state.currentSensitiveAreas.map(sensitiveArea => (
                    <grw-sensitive-area-detail
                      exportparts="sensitive-area-title-container,sensitive-area-color-container,sensitive-area-title,sensitive-area-description,sensitive-area-practice-container,sensitive-area-practice-title,sensitive-area-practices,sensitive-area-practice,sensitive-area-period-container,sensitive-area-period-title,sensitive-area-periods,sensitive-area-period,sensitive-area-contact-container,sensitive-area-contact-title,sensitive-area-contact-value"
                      sensitiveArea={sensitiveArea}
                    ></grw-sensitive-area-detail>
                  ))}
                </div>
              </div>
            )}
            {state.currentInformationDesks &&
              state.currentInformationDesks.filter(currentInformationDesks => this.currentTrek.information_desks.includes(currentInformationDesks.id)).length > 0 && (
                <div>
                  <div part="divider" class="divider"></div>
                  <div part="information-desks-container" class="information-desks-container">
                    <div part="information-desks-title" class="information-desks-title" ref={el => (this.informationPlacesRef = el)}>
                      {translate[state.language].informationPlaces}
                    </div>
                    <div part="swiper-information-desks" class="swiper swiper-information-desks" ref={el => (this.swiperInformationDesksRef = el)}>
                      <div part="swiper-wrapper" class="swiper-wrapper">
                        {state.currentInformationDesks
                          .filter(currentInformationDesks => this.currentTrek.information_desks.includes(currentInformationDesks.id))
                          .map(informationDesk => (
                            <div part="swiper-slide" class="swiper-slide">
                              <grw-information-desk
                                exportparts="information-desk-img-container,information-desk-img,information-desk-sub-container,information-desk-name,center-on-map-button,icon,label,information-desk-informations,phone-container,mail-container,link-container,information-desk-description-container,information-desk-description,handle-information-desk-description"
                                informationDesk={informationDesk}
                              ></grw-information-desk>
                            </div>
                          ))}
                      </div>
                      <div part="swiper-scrollbar" class="swiper-scrollbar" ref={el => (this.informationDesksContentsSwiperScrollbar = el)}></div>
                    </div>
                  </div>
                </div>
              )}
            {(this.currentTrek.disabled_infrastructure ||
              (this.accessibilities && this.accessibilities.length > 0) ||
              this.currentTrek.accessibility_level ||
              this.currentTrek.accessibility_slope ||
              this.currentTrek.accessibility_width ||
              this.currentTrek.accessibility_signage ||
              this.currentTrek.accessibility_covering ||
              this.currentTrek.accessibility_exposure ||
              this.currentTrek.accessibility_advice ||
              this.emergencyNumber) && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="accessibilities-container" class="accessibilities-container">
                  <div part="accessibilities-title" class="accessibilities-title" ref={el => (this.accessibilityRef = el)}>
                    {translate[state.language].accessibility}
                  </div>
                  {this.currentTrek.disabled_infrastructure && <div part="disabled-infrastructure" innerHTML={this.currentTrek.disabled_infrastructure}></div>}
                  {this.accessibilities && this.accessibilities.length > 0 && (
                    <div part="accessibilities-content-container" class="accessibilities-content-container">
                      {this.accessibilities.map(accessibility => (
                        <div part="accessibility-content-container" class="accessibility-content-container">
                          <img src={accessibility.pictogram} alt=""></img>
                          <div part="accessibility-name" innerHTML={accessibility.name}></div>
                        </div>
                      ))}
                    </div>
                  )}
                  {this.emergencyNumber && (
                    <div part="accessibility-emergency-number-container" class="accessibility-emergency-number-container">
                      <div part="accessibility-emergency-number-title" class="accessibility-emergency-number-title">
                        {translate[state.language].emergencyNumber}
                      </div>
                      <div part="accessibility-emergency-number-content" class="accessibility-emergency-number-content">
                        {
                          <a href={`tel:${this.emergencyNumber.toString()}`}>
                            <span part="icon" class="icon" innerHTML={CallIcon}></span>
                            <span part="emergency-number" class="emergency-number">
                              {this.emergencyNumber.toString()}
                            </span>
                          </a>
                        }
                      </div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_level && (
                    <div part="accessibility-level-container" class="accessibility-level-container">
                      <div part="accessibility-level-title" class="accessibility-level-title">
                        {translate[state.language].accessibilityLevel}
                      </div>
                      <div part="accessibility-level-name" innerHTML={this.accessibilityLevel.name}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_slope && (
                    <div part="accessibility-slope-container" class="accessibility-slope-container">
                      <div part="accessibility-slope-title" class="accessibility-slope-title">
                        {translate[state.language].accessibilitySlope}
                      </div>
                      <div part="accessibility-slope" innerHTML={this.currentTrek.accessibility_slope}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_width && (
                    <div part="accessibility-width-container" class="accessibility-width-container">
                      <div part="accessibility-width-title" class="accessibility-width-title">
                        {translate[state.language].accessibilityWidth}
                      </div>
                      <div part="accessibility-width" innerHTML={this.currentTrek.accessibility_width}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_signage && (
                    <div part="accessibility-signage-container" class="accessibility-signage-container">
                      <div part="accessibility-signage-title" class="accessibility-signage-title">
                        {translate[state.language].accessibilitySignage}
                      </div>
                      <div part="accessibility-signage" innerHTML={this.currentTrek.accessibility_signage}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_covering && (
                    <div part="accessibility-covering-container" class="accessibility-covering-container">
                      <div part="accessibility-covering-title" class="accessibility-covering-title">
                        {translate[state.language].accessibilityCovering}
                      </div>
                      <div part="accessibility-covering" innerHTML={this.currentTrek.accessibility_covering}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_exposure && (
                    <div part="accessibility-exposure-container" class="accessibility-exposure-container">
                      <div part="accessibility-exposure-title" class="accessibility-exposure-title">
                        {translate[state.language].accessibilityExposure}
                      </div>
                      <div part="accessibility-exposure" innerHTML={this.currentTrek.accessibility_exposure}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_advice && (
                    <div part="accessibility-advice-container" class="accessibility-advice-container">
                      <div part="accessibility-advice-title" class="accessibility-advice-title">
                        {translate[state.language].accessibilityAdvices}
                      </div>
                      <div part="accessibility-advice" innerHTML={this.currentTrek.accessibility_advice}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {state.trekTouristicContents && state.trekTouristicContents.length > 0 && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="touristic-content-container" class="touristic-content-container">
                  <div part="touristic-content-title" class="touristic-content-title" ref={el => (this.touristicContentsRef = el)}>
                    {translate[state.language].touristicContents(state.trekTouristicContents.length)}
                  </div>
                  <div part="swiper-touristic-content" class="swiper swiper-touristic-content" ref={el => (this.swiperTouristicContentsRef = el)}>
                    <div part="swiper-wrapper" class="swiper-wrapper">
                      {state.trekTouristicContents.map(touristicContent => (
                        <div part="swiper-slide" class="swiper-slide">
                          <grw-touristic-content-card
                            exportparts="touristic-content-card,touristic-content-img-container,swiper-touristic-content,swiper-wrapper,swiper-slide,touristic-content-img,default-touristic-content-img,swiper-pagination,swiper-button-prev,swiper-button-next,touristic-content-sub-container,touristic-content-category-container,touristic-content-category-img,touristic-content-category-name,touristic-content-name,touristic-content-more-detail-container,more-details-button"
                            fontFamily={this.fontFamily}
                            touristicContent={touristicContent}
                            isInsideHorizontalList={true}
                          ></grw-touristic-content-card>
                        </div>
                      ))}
                    </div>
                    <div part="swiper-scrollbar" class="swiper-scrollbar" ref={el => (this.touristicContentsSwiperScrollbar = el)}></div>
                  </div>
                </div>
              </div>
            )}
            {state.trekTouristicEvents && state.trekTouristicEvents.length > 0 && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="touristic-event-container" class="touristic-event-container">
                  <div part="touristic-event-title" class="touristic-event-title" ref={el => (this.touristicEventsRef = el)}>
                    {translate[state.language].touristicEvents(state.trekTouristicEvents.length)}
                  </div>
                  <div part="swiper-touristic-event" class="swiper swiper-touristic-event" ref={el => (this.swiperTouristicEventsRef = el)}>
                    <div part="swiper-wrapper" class="swiper-wrapper">
                      {state.trekTouristicEvents.map(touristicEvent => (
                        <div part="swiper-slide" class="swiper-slide">
                          <grw-touristic-event-card
                            exportparts="touristic-event-card,touristic-event-img-container,swiper-touristic-event,swiper-wrapper,swiper-slide,touristic-event-img,default-touristic-event-img,swiper-pagination,swiper-button-prev,swiper-button-next,touristic-event-sub-container,touristic-event-sub-container,touristic-event-type-img,touristic-event-type-name,touristic-event-name,touristic-event-date-container,touristic-event-date,touristic-event-more-detail-container,more-details-button"
                            fontFamily={this.fontFamily}
                            touristicEvent={touristicEvent}
                            isInsideHorizontalList={true}
                          ></grw-touristic-event-card>
                        </div>
                      ))}
                    </div>
                    <div part="swiper-scrollbar" class="swiper-scrollbar" ref={el => (this.touristicEventsSwiperScrollbar = el)}></div>
                  </div>
                </div>
              </div>
            )}
            {this.currentTrek.web_links && this.currentTrek.web_links.length > 0 && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="weblinks-container" class="weblinks-container">
                  <div part="weblinks-title" class="weblinks-title">
                    {translate[state.language].learnMore}
                  </div>
                  {this.currentTrek.web_links.map(weblink => (
                    <a part="weblink-container" class="weblink-container" href={weblink.url} target="_blank" rel="noopener noreferrer">
                      {weblink.category && weblink.category.pictogram && <img src={weblink.category.pictogram} alt={weblink.category.label} />}
                      {weblink.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {this.currentTrek.source && this.currentTrek.source.length > 0 && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="source-container" class="source-container">
                  <div part="source-title" class="source-title">
                    {translate[state.language].sources}
                  </div>
                  {this.sources.map(source => (
                    <div part="source-sub-container" class="source-sub-container">
                      {source.pictogram && <img src={source.pictogram} alt="" />}
                      <div>
                        <div part="source-name" class="source-name" innerHTML={source.name}></div>
                        <a part="source-advice" class="source-advice" href={source.website} innerHTML={source.website}></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {this.grwApp && <div part="detail-bottom-space" class="detail-bottom-space"></div>}
          </div>
        )}
        {(this.showTouristicContentDetailsModal || this.showTouristicEventDetailsModal) && (
          <grw-details-modal>
            {this.showTouristicContentDetailsModal && this.modalDetailsId && (
              <Fragment>
                {state.currentTouristicContent && (
                  <grw-touristic-content-detail
                    font-family={this.fontFamily}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-primary-container={this.colorPrimaryContainer}
                    color-on-primary-container={this.colorOnPrimaryContainer}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                    color-background={this.colorBackground}
                  ></grw-touristic-content-detail>
                )}
                <grw-touristic-content-provider api={state.api} touristic-content-id={this.modalDetailsId}></grw-touristic-content-provider>
              </Fragment>
            )}
            {this.showTouristicEventDetailsModal && this.modalDetailsId && (
              <Fragment>
                {state.currentTouristicEvent && (
                  <grw-touristic-event-detail
                    font-family={this.fontFamily}
                    color-primary-app={this.colorPrimaryApp}
                    color-on-surface={this.colorOnSurface}
                    color-primary-container={this.colorPrimaryContainer}
                    color-on-primary-container={this.colorOnPrimaryContainer}
                    color-secondary-container={this.colorSecondaryContainer}
                    color-on-secondary-container={this.colorOnSecondaryContainer}
                    color-surface-container-low={this.colorSurfaceContainerLow}
                    color-background={this.colorBackground}
                  ></grw-touristic-event-detail>
                )}
                <grw-touristic-event-provider api={state.api} touristic-event-id={this.modalDetailsId}></grw-touristic-event-provider>
              </Fragment>
            )}
          </grw-details-modal>
        )}
      </Host>
    );
  }
}
