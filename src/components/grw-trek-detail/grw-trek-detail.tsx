import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import Swiper, { Navigation, Pagination, Keyboard, FreeMode, Mousewheel, Scrollbar } from 'swiper';
import { translate } from 'i18n/i18n';
import state, { onChange, reset } from 'store/store';
import { Accessibilities, AccessibilityLevel, Difficulty, Labels, Practice, Route, Sources, Themes, Trek, Option, Options } from 'types/types';
import { formatDuration, formatLength, formatAscent, formatDescent } from 'utils/utils';

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
  OptionRef?: HTMLAnchorElement;
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
  @Prop() trek: Trek;

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorPrimaryContainer = '#eaddff';
  @Prop() colorOnPrimaryContainer = '#21005e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() colorBackground = '#fef7ff';

  @Prop() resetStoreOnDisconnected = true;
  @Prop() weather = false;
  @Prop() isLargeView = false;
  indicatorSelectedTrekOption = { translateX: null, width: null, backgroundSize: null, ref: null };

  componentDidLoad() {
    this.swiperImages = new Swiper(this.swiperImagesRef, {
      modules: [Navigation, Pagination, Keyboard, FreeMode, Mousewheel],
      navigation: {
        prevEl: this.prevElImagesRef,
        nextEl: this.nextElImagesRef,
      },
      pagination: { el: this.paginationElImagesRef },
      allowTouchMove: false,
      keyboard: false,
    });
    this.swiperImagesRef.onfullscreenchange = () => {
      this.displayFullscreen = !this.displayFullscreen;
      this.displayFullscreen ? this.swiperImages.keyboard.enable() : this.swiperImages.keyboard.disable();
    };
    this.swiperStep = new Swiper(this.swiperStepRef, {
      modules: [FreeMode, Mousewheel, Scrollbar],
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
      },
    });
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
      },
    });
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
      },
    });
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
      },
    });
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
      },
    });
    if (this.presentationRef) {
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
    if (this.stepsRef) {
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
    if (this.descriptionRef) {
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
    if (this.recommendationRef) {
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
    if (this.parkingRef) {
      this.parkingObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.parkingIsInViewport.emit(isIntersecting);
        },
        { threshold },
      );
      this.parkingObserver.observe(this.parkingRef);
    }

    if (this.sensitiveAreaRef) {
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

    if (this.informationPlacesRef) {
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

    if (this.accessibilityRef) {
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

    if (this.poiRef) {
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

    if (this.touristicContentsRef) {
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
    if (this.touristicEventsRef) {
      this.touristicEventObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.touristicEventsIsInViewport.emit(isIntersecting);
          this.options = { ...this.options, touristicEvents: { ...this.defaultOptions.touristicEvents, indicator: isIntersecting } };
          this.handleIndicatorSelectedTrekOption();
        },
        { threshold },
      );
      this.touristicEventObserver.observe(this.touristicContentsRef);
    }
  }

  connectedCallback() {
    this.currentTrek = this.trek ? this.trek : state.currentTrek;
    if (this.currentTrek) {
      this.defaultOptions = this.handleOptions();
      this.options = { ...this.defaultOptions, presentation: { ...this.defaultOptions.presentation, indicator: true } };
      this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
      this.route = state.routes.find(route => route.id === this.currentTrek.route);
      this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
      this.themes = state.themes.filter(theme => this.currentTrek.themes.includes(theme.id));
      this.labels = state.labels.filter(label => this.currentTrek.labels.includes(label.id));
      this.sources = state.sources.filter(source => this.currentTrek.source.includes(source.id));
      this.accessibilities = state.accessibilities.filter(accessibility => this.currentTrek.accessibilities.includes(accessibility.id));
      if (state.accessibilitiesLevel) {
        this.accessibilityLevel = state.accessibilitiesLevel.find(accessibilityLevel => this.currentTrek.accessibility_level === accessibilityLevel.id);
      }
      this.cities = this.currentTrek.cities.map(currentCity => state.cities.find(city => city.id === currentCity)?.name);
      this.hasStep = this.currentTrek.children.length > 0;
    }
    onChange('currentTrek', () => {
      this.currentTrek = this.trek ? this.trek : state.currentTrek;
      if (this.currentTrek) {
        this.defaultOptions = this.handleOptions();
        this.options = { ...this.defaultOptions, presentation: { ...this.defaultOptions.presentation, indicator: true } };
        this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
        this.route = state.routes.find(route => route.id === this.currentTrek.route);
        this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
        this.themes = state.themes.filter(theme => this.currentTrek.themes.includes(theme.id));
        this.labels = state.labels.filter(label => this.currentTrek.labels.includes(label.id));
        this.sources = state.sources.filter(source => this.currentTrek.source.includes(source.id));
        this.accessibilities = state.accessibilities.filter(accessibility => this.currentTrek.accessibilities.includes(accessibility.id));
        if (state.accessibilitiesLevel) {
          this.accessibilityLevel = state.accessibilitiesLevel.find(accessibilityLevel => this.currentTrek.accessibility_level === accessibilityLevel.id);
        }
        this.cities = this.currentTrek.cities.map(currentCity => state.cities.find(city => city.id === currentCity)?.name);
        this.hasStep = this.currentTrek.children.length > 0;
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
    if (this.resetStoreOnDisconnected) {
      reset();
    }
  }

  handleOptions() {
    return {
      ...options,
      presentation: { ...presentation },
      steps: { ...steps, visible: Boolean(state.parentTrek) },
      description: { ...description, visible: Boolean(this.currentTrek.description) },
      pois: { ...pois, visible: Boolean(state.currentPois && state.currentPois.length > 0) },
      recommendations: { ...recommendations, visible: Boolean(this.currentTrek.advice || (this.labels && this.labels.length > 0)) },
      sensitiveArea: { ...sensitiveArea, visible: Boolean(state.currentSensitiveAreas && state.currentSensitiveAreas.length > 0) },
      informationPlaces: {
        ...informationPlaces,
        visible: Boolean(
          state.currentInformationDesks &&
            state.currentInformationDesks.filter(currentInformationDesks => this.currentTrek.information_desks.includes(currentInformationDesks.id)).length > 0,
        ),
      },
      accessibility: {
        ...accessibility,
        visible: Boolean(
          this.currentTrek.disabled_infrastructure ||
            (this.accessibilities && this.accessibilities.length > 0) ||
            this.currentTrek.accessibility_level ||
            this.currentTrek.accessibility_slope ||
            this.currentTrek.accessibility_width ||
            this.currentTrek.accessibility_signage ||
            this.currentTrek.accessibility_covering ||
            this.currentTrek.accessibility_exposure ||
            this.currentTrek.accessibility_advice,
        ),
      },
      touristicContents: { ...touristicContents, visible: Boolean(state.trekTouristicContents && state.trekTouristicContents.length > 0) },
      touristicEvents: { ...touristicEvents, visible: Boolean(state.touristicEvents && state.touristicEvents.length > 0) },
    };
  }

  handleFullscreen() {
    if (this.currentTrek.attachments && this.currentTrek.attachments[0] && this.currentTrek.attachments[0].url) {
      this.swiperImagesRef.requestFullscreen();
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
    this.trekDetailContainerRef.scrollTo({ top: element.offsetTop - 64 });
  }

  render() {
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
          '--detail-bottom-space-height': this.isLargeView ? '8px' : '104px',
        }}
      >
        {this.currentTrek && (
          <div class="trek-options">
            <a
              ref={el => (this.presentationOptionRef = el)}
              onClick={() => this.handleScrollTo(this.presentationRef)}
              class={`presentation trek-option${this.indicatorSelectedTrekOption.ref === 'presentationOptionRef' ? ' selected-trek-option' : ''}`}
            >
              {translate[state.language].options.presentation}
            </a>
            {this.options.steps.visible && (
              <a
                ref={el => (this.stepsOptionRef = el)}
                onClick={() => this.handleScrollTo(this.stepsRef)}
                class={`steps trek-option${this.options.steps.indicator ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.steps}
              </a>
            )}
            {this.options.description.visible && (
              <a
                ref={el => (this.descriptionOptionRef = el)}
                onClick={() => this.handleScrollTo(this.descriptionRef)}
                class={`description trek-option${this.indicatorSelectedTrekOption.ref === 'descriptionOptionRef' ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.description}
              </a>
            )}
            {this.options.pois.visible && (
              <a
                ref={el => (this.poisOptionRef = el)}
                onClick={() => this.handleScrollTo(this.poiRef)}
                class={`pois trek-option${this.indicatorSelectedTrekOption.ref === 'poisOptionRef' ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.pois}
              </a>
            )}
            {this.options.recommendations.visible && (
              <a
                ref={el => (this.recommendationsOptionRef = el)}
                onClick={() => this.handleScrollTo(this.recommendationRef)}
                class={`recommendations trek-option${this.indicatorSelectedTrekOption.ref === 'recommendationsOptionRef' ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.recommendations}
              </a>
            )}
            {this.options.sensitiveArea.visible && (
              <a
                ref={el => (this.sensitiveAreaOptionRef = el)}
                onClick={() => this.handleScrollTo(this.sensitiveAreaRef)}
                class={`sensitive-areas trek-option${this.indicatorSelectedTrekOption.ref === 'sensitiveAreaOptionRef' ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.environmentalSensitiveAreas}
              </a>
            )}
            {this.options.informationPlaces.visible && (
              <a
                ref={el => (this.informationPlacesOptionRef = el)}
                onClick={() => this.handleScrollTo(this.informationPlacesRef)}
                class={`information-places trek-option${this.indicatorSelectedTrekOption.ref === 'informationPlacesOptionRef' ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.informationPlaces}
              </a>
            )}
            {this.options.accessibility.visible && (
              <a
                ref={el => (this.accessibilityOptionRef = el)}
                onClick={() => this.handleScrollTo(this.accessibilityRef)}
                class={`accessibility trek-option${this.indicatorSelectedTrekOption.ref === 'accessibilityOptionRef' ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.accessibility}
              </a>
            )}
            {this.options.touristicContents.visible && (
              <a
                ref={el => (this.touristicContentsOptionRef = el)}
                onClick={() => this.handleScrollTo(this.touristicContentsRef)}
                class={`touristic-content trek-option${this.indicatorSelectedTrekOption.ref === 'touristicContentsOptionRef' ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.touristicContents}
              </a>
            )}
            {this.options.touristicEvents.visible && (
              <a
                ref={el => (this.touristicEventsOptionRef = el)}
                onClick={() => this.handleScrollTo(this.touristicEventsRef)}
                class={`touristic-event trek-option${this.indicatorSelectedTrekOption.ref === 'touristicEventsOptionRef' ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.touristicEvents}
              </a>
            )}
            {this.presentationOptionRef && (
              <span
                class="indicator-selected-trek-option"
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
          <div class="trek-detail-container" ref={el => (this.trekDetailContainerRef = el)}>
            <div class="images-container" ref={el => (this.presentationRef = el)}>
              <div class="swiper swiper-images" ref={el => (this.swiperImagesRef = el)}>
                <div class="swiper-wrapper">
                  {this.currentTrek.attachments
                    .filter(attachment => attachment.type === 'image')
                    .map(attachment => (
                      <div class="swiper-slide">
                        <img
                          /* @ts-ignore */
                          crossorigin="anonymous"
                          class="image"
                          src={attachment.url}
                          loading="lazy"
                          onClick={() => this.handleFullscreen()}
                        />
                      </div>
                    ))}
                </div>
                <div class="swiper-pagination" ref={el => (this.paginationElImagesRef = el)}></div>
                <div class="swiper-button-prev" ref={el => (this.prevElImagesRef = el)}></div>
                <div class="swiper-button-next" ref={el => (this.nextElImagesRef = el)}></div>
              </div>
            </div>
            <div class="name">{this.currentTrek.name}</div>
            {this.themes.length > 0 && (
              <div class="themes-container">
                {this.themes.map(theme => (
                  <div class="theme">{theme.label}</div>
                ))}
              </div>
            )}
            <div class="sub-container">
              <div class="icons-labels-container">
                <div class="icon-label difficulty">
                  {this.difficulty?.pictogram && (
                    <img
                      /* @ts-ignore */
                      crossorigin="anonymous"
                      src={this.difficulty.pictogram}
                    />
                  )}
                  {this.difficulty?.label}
                </div>
                <div class="icon-label duration">
                  {/* @ts-ignore */}
                  <span translate={false} class="material-symbols material-symbols-outlined">
                    timelapse
                  </span>
                  {formatDuration(this.currentTrek?.duration)}
                </div>
                <div class="icon-label route">
                  {this.route?.pictogram && (
                    <img
                      /* @ts-ignore */
                      crossorigin="anonymous"
                      src={this.route.pictogram}
                    />
                  )}
                  {this.route?.route}
                </div>
                <div class="icon-label length">
                  {/* @ts-ignore */}
                  <span translate={false} class="material-symbols material-symbols-outlined">
                    open_in_full
                  </span>
                  {formatLength(this.currentTrek.length_2d)}
                </div>
                {this.currentTrek.ascent && (
                  <div class="icon-label ascent">
                    {/* @ts-ignore */}
                    <span translate={false} class="material-symbols material-symbols-outlined">
                      moving
                    </span>
                    {formatAscent(this.currentTrek.ascent)}
                  </div>
                )}
                {this.currentTrek.descent && (
                  <div class="icon-label descent">
                    {/* @ts-ignore */}
                    <span translate={false} class="material-symbols material-symbols-outlined">
                      moving
                    </span>
                    {formatDescent(this.currentTrek.descent)}
                  </div>
                )}
                <div class="icon-label practice">
                  {this.practice?.pictogram && (
                    <img
                      /* @ts-ignore */
                      crossorigin="anonymous"
                      src={this.practice.pictogram}
                    />
                  )}
                  {this.practice?.name}
                </div>
                <div class="icon-label networks">
                  {this.currentTrek.networks.map(networkId => {
                    const currentNetwork = state.networks.find(network => network.id === networkId);
                    return (
                      <div class="network">
                        <img
                          /* @ts-ignore */
                          crossorigin="anonymous"
                          src={currentNetwork.pictogram}
                        />
                        {currentNetwork.label}
                      </div>
                    );
                  })}
                </div>
                {this.currentTrek.ratings.map(trekRating => (
                  <div class="row">
                    {`${state.ratingsScale.find(ratingScale => ratingScale.id === state.ratings.find(rating => rating.id === trekRating).scale).name} : ${
                      state.ratings.find(rating => rating.id === trekRating).name
                    }`}
                  </div>
                ))}
                {this.currentTrek.ratings_description && this.currentTrek.ratings_description !== '' && <div class="row">{this.currentTrek.ratings_description}</div>}
              </div>
            </div>
            <div class="divider"></div>
            <div class="downloads-container">
              <div class="download-title">{translate[state.language].downloads}</div>
              <div class="links-container">
                <a href={`${this.currentTrek.gpx}`} target="_blank" rel="noopener noreferrer">
                  {/* @ts-ignore */}
                  <span translate={false} class="material-symbols material-symbols-outlined">
                    download
                  </span>
                  GPX
                </a>
                <a href={`${this.currentTrek.kml}`} target="_blank" rel="noopener noreferrer">
                  {/* @ts-ignore */}
                  <span translate={false} class="material-symbols material-symbols-outlined">
                    download
                  </span>
                  KML
                </a>
                <a href={`${this.currentTrek.pdf}`} target="_blank" rel="noopener noreferrer">
                  {/* @ts-ignore */}
                  <span translate={false} class="material-symbols material-symbols-outlined">
                    download
                  </span>
                  PDF
                </a>
              </div>
            </div>
            <div class="divider"></div>
            {this.currentTrek.description_teaser && <div class="description-teaser" innerHTML={this.currentTrek.description_teaser}></div>}
            {this.currentTrek.ambiance && <div class="ambiance" innerHTML={this.currentTrek.ambiance}></div>}
            {state.parentTrekId && state.parentTrek && this.currentTrek.id !== state.parentTrekId && (
              <div>
                <div class="divider"></div>
                <div class="parent-trek-container">
                  <button class="parent-trek-title" onClick={() => this.parentTrekPress.emit(state.parentTrekId)}>
                    <div>&lt;</div>
                    {state.parentTrek.name}
                  </button>
                </div>
              </div>
            )}
            {state.currentTrekSteps && (
              <div class="step-container">
                <div class="step-title" ref={el => (this.stepsRef = el)}>{`${state.currentTrekSteps.length} ${translate[state.language].steps}`}</div>
                <div class="swiper swiper-step" ref={el => (this.swiperStepRef = el)}>
                  <div class="swiper-wrapper">
                    {state.currentTrekSteps &&
                      state.currentTrekSteps.map(trek => {
                        return (
                          <div class="swiper-slide">
                            <grw-trek-card
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
                            ></grw-trek-card>
                          </div>
                        );
                      })}
                  </div>
                  <div class="swiper-scrollbar" ref={el => (this.stepSwiperScrollbar = el)}></div>
                </div>
              </div>
            )}
            <div class="divider"></div>
            {this.currentTrek.description && (
              <div class="description-container">
                <div class="description-title" ref={el => (this.descriptionRef = el)}>
                  {translate[state.language].description}
                </div>
                <div class="description" innerHTML={this.currentTrek.description}></div>
              </div>
            )}
            {this.currentTrek.departure && (
              <div class="departure-container">
                <div class="departure-title">{translate[state.language].departure} :&nbsp;</div>
                <div innerHTML={this.currentTrek.departure}></div>
              </div>
            )}
            {this.currentTrek.arrival && (
              <div class="arrival-container">
                <div class="arrival-title">{translate[state.language].arrival} :&nbsp;</div>
                <div innerHTML={this.currentTrek.arrival}></div>
              </div>
            )}
            {this.currentTrek.cities && this.currentTrek.cities.length > 0 && (
              <div class="cities-container">
                <div class="cities-title">{translate[state.language].crossedCities} :&nbsp;</div>
                <div innerHTML={this.cities.join(', ')}></div>
              </div>
            )}
            {state.currentPois && state.currentPois.length > 0 && (
              <div>
                <div class="divider"></div>
                <div class="pois-container">
                  <div class="pois-title" ref={el => (this.poiRef = el)}>
                    {translate[state.language].pois(state.currentPois.length)}
                  </div>
                  <div class="swiper swiper-pois" ref={el => (this.swiperPoisRef = el)}>
                    <div class="swiper-wrapper">
                      {state.currentPois.map(poi => (
                        <div class="swiper-slide">
                          <grw-poi poi={poi}></grw-poi>
                        </div>
                      ))}
                    </div>
                    <div class="swiper-scrollbar" ref={el => (this.poisSwiperScrollbar = el)}></div>
                  </div>
                </div>
              </div>
            )}
            {this.weather && this.currentTrek.departure_city && (
              <div>
                <div class="divider"></div>
                <div class="weather-container">
                  <iframe height="150" frameborder="0" src={`https://meteofrance.com/widget/prevision/${this.currentTrek.departure_city}0#${this.colorPrimaryApp}`}></iframe>
                </div>
              </div>
            )}
            {this.currentTrek.access && (
              <div>
                <div class="divider"></div>
                <div class="access-container">
                  <div class="access-title">{translate[state.language].roadAccessAndParking}</div>
                  <div class="access" innerHTML={this.currentTrek.access}></div>
                  {this.currentTrek.advised_parking && (
                    <div>
                      <div class="advised-parking-title" ref={el => (this.parkingRef = el)}>
                        {translate[state.language].recommendedParking}
                      </div>
                      <div class="advised-parking" innerHTML={this.currentTrek.advised_parking}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {this.currentTrek.public_transport && (
              <div>
                <div class="divider"></div>
                <div class="public-transport-container">
                  <div class="public-transport-title">{translate[state.language].transport}</div>
                  <div class="public-transport" innerHTML={this.currentTrek.public_transport}></div>
                </div>
              </div>
            )}
            {(this.currentTrek.advice || this.currentTrek.gear || this.labels.length > 0) && (
              <div>
                <div class="divider"></div>
                <div class="advice-container">
                  <div class="advice-title" ref={el => (this.recommendationRef = el)}>
                    {translate[state.language].recommendations}
                  </div>
                  {this.currentTrek.advice && (
                    <div class="current-advice-container">
                      {/* @ts-ignore */}
                      <span translate={false} class="material-symbols material-symbols-outlined">
                        warning
                      </span>
                      <div class="advice" innerHTML={this.currentTrek.advice}></div>
                    </div>
                  )}
                  {this.currentTrek.gear && (
                    <div class="gear-container">
                      {/* @ts-ignore */}
                      <span translate={false} class="material-symbols material-symbols-outlined">
                        backpack
                      </span>
                      <div class="gear" innerHTML={this.currentTrek.gear}></div>
                    </div>
                  )}
                  {this.labels.map(label => (
                    <div class="label-container">
                      <div class="label-sub-container">
                        {label.pictogram && (
                          <img
                            /* @ts-ignore */
                            crossorigin="anonymous"
                            src={label.pictogram}
                          />
                        )}
                        <div class="label-name" innerHTML={label.name}></div>
                      </div>
                      <div class="label-advice" innerHTML={label.advice}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {state.currentSensitiveAreas && state.currentSensitiveAreas.length > 0 && (
              <div>
                <div class="divider"></div>
                <div class="sensitive-areas-container">
                  <div class="sensitive-areas-title" ref={el => (this.sensitiveAreaRef = el)}>
                    {translate[state.language].environmentalSensitiveAreas}
                  </div>
                  <div class="sensitive-areas-description">{translate[state.language].sensitiveAreasDescription}</div>
                  {state.currentSensitiveAreas.map(sensitiveArea => (
                    <grw-sensitive-area-detail sensitiveArea={sensitiveArea}></grw-sensitive-area-detail>
                  ))}
                </div>
              </div>
            )}
            {state.currentInformationDesks &&
              state.currentInformationDesks.filter(currentInformationDesks => this.currentTrek.information_desks.includes(currentInformationDesks.id)).length > 0 && (
                <div>
                  <div class="divider"></div>
                  <div class="information-desks-container">
                    <div class="information-desks-title" ref={el => (this.informationPlacesRef = el)}>
                      {translate[state.language].informationPlaces}
                    </div>
                    <div class="swiper swiper-information-desks" ref={el => (this.swiperInformationDesksRef = el)}>
                      <div class="swiper-wrapper">
                        {state.currentInformationDesks
                          .filter(currentInformationDesks => this.currentTrek.information_desks.includes(currentInformationDesks.id))
                          .map(informationDesk => (
                            <div class="swiper-slide">
                              <grw-information-desk informationDesk={informationDesk}></grw-information-desk>
                            </div>
                          ))}
                      </div>
                      <div class="swiper-scrollbar" ref={el => (this.informationDesksContentsSwiperScrollbar = el)}></div>
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
              this.currentTrek.accessibility_advice) && (
              <div>
                <div class="divider"></div>
                <div class="accessibilities-container">
                  <div class="accessibilities-title" ref={el => (this.accessibilityRef = el)}>
                    {translate[state.language].accessibility}
                  </div>
                  {this.currentTrek.disabled_infrastructure && <div innerHTML={this.currentTrek.disabled_infrastructure}></div>}
                  <div class="accessibilities-content-container">
                    {this.accessibilities.map(accessibility => (
                      <div class="accessibility-content-container">
                        <img
                          /* @ts-ignore */
                          crossorigin="anonymous"
                          src={accessibility.pictogram}
                        ></img>
                        <div innerHTML={accessibility.name}></div>
                      </div>
                    ))}
                  </div>
                  {this.currentTrek.accessibility_level && (
                    <div class="accessibility-level-container">
                      <div class="accessibility-level-title">{translate[state.language].accessibilityLevel}</div>
                      <div innerHTML={this.accessibilityLevel.name}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_slope && (
                    <div class="accessibility-slope-container">
                      <div class="accessibility-slope-title">{translate[state.language].accessibilitySlope}</div>
                      <div innerHTML={this.currentTrek.accessibility_slope}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_width && (
                    <div class="accessibility-width-container">
                      <div class="accessibility-width-title">{translate[state.language].accessibilityWidth}</div>
                      <div innerHTML={this.currentTrek.accessibility_width}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_signage && (
                    <div class="accessibility-signage-container">
                      <div class="accessibility-signage-title">{translate[state.language].accessibilitySignage}</div>
                      <div innerHTML={this.currentTrek.accessibility_signage}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_covering && (
                    <div class="accessibility-covering-container">
                      <div class="accessibility-covering-title">{translate[state.language].accessibilityCovering}</div>
                      <div innerHTML={this.currentTrek.accessibility_covering}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_exposure && (
                    <div class="accessibility-exposure-container">
                      <div class="accessibility-exposure-title">{translate[state.language].accessibilityExposure}</div>
                      <div innerHTML={this.currentTrek.accessibility_exposure}></div>
                    </div>
                  )}
                  {this.currentTrek.accessibility_advice && (
                    <div class="accessibility-advice-container">
                      <div class="accessibility-advice-title">{translate[state.language].accessibilityAdvices}</div>
                      <div innerHTML={this.currentTrek.accessibility_advice}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {state.trekTouristicContents && state.trekTouristicContents.length > 0 && (
              <div>
                <div class="divider"></div>
                <div class="touristic-content-container">
                  <div class="touristic-content-title" ref={el => (this.touristicContentsRef = el)}>
                    {translate[state.language].touristicContents(state.trekTouristicContents.length)}
                  </div>
                  <div class="swiper swiper-touristic-content" ref={el => (this.swiperTouristicContentsRef = el)}>
                    <div class="swiper-wrapper">
                      {state.trekTouristicContents.map(touristicContent => (
                        <div class="swiper-slide">
                          <grw-touristic-content-card fontFamily={this.fontFamily} touristicContent={touristicContent} isInsideHorizontalList={true}></grw-touristic-content-card>
                        </div>
                      ))}
                    </div>
                    <div class="swiper-scrollbar" ref={el => (this.touristicContentsSwiperScrollbar = el)}></div>
                  </div>
                </div>
              </div>
            )}
            {state.touristicEvents && state.touristicEvents.length > 0 && (
              <div>
                <div class="divider"></div>
                <div class="touristic-event-container">
                  <div class="touristic-event-title" ref={el => (this.touristicEventsRef = el)}>
                    {translate[state.language].touristicEvents(state.touristicEvents.length)}
                  </div>
                  <div class="swiper swiper-touristic-event" ref={el => (this.swiperTouristicEventsRef = el)}>
                    <div class="swiper-wrapper">
                      {state.touristicEvents.map(touristicEvent => (
                        <div class="swiper-slide">
                          <grw-touristic-event-card fontFamily={this.fontFamily} touristicEvent={touristicEvent}></grw-touristic-event-card>
                        </div>
                      ))}
                    </div>
                    <div class="swiper-scrollbar" ref={el => (this.touristicEventsSwiperScrollbar = el)}></div>
                  </div>
                </div>
              </div>
            )}
            {this.currentTrek.source && this.currentTrek.source.length > 0 && (
              <div>
                <div class="divider"></div>
                <div class="source-container">
                  <div class="source-title">{translate[state.language].sources}</div>
                  {this.sources.map(source => (
                    <div class="source-sub-container">
                      {source.pictogram && (
                        <img
                          /* @ts-ignore */
                          crossorigin="anonymous"
                          src={source.pictogram}
                        />
                      )}
                      <div>
                        <div class="source-name" innerHTML={source.name}></div>
                        <a class="source-advice" href={source.website} innerHTML={source.website}></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div class="detail-bottom-space"></div>
          </div>
        )}
      </Host>
    );
  }
}
