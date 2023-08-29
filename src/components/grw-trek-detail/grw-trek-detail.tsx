import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import Swiper, { Navigation, Pagination, Keyboard, FreeMode, Mousewheel } from 'swiper';
import { translate } from 'i18n/i18n';
import state, { onChange, reset } from 'store/store';
import { Accessibilities, AccessibilityLevel, Difficulty, Labels, Practice, Route, Sources, Themes, Trek, Option, Options } from 'types/types';
import { formatDuration, formatLength, formatAscent } from 'utils/utils';

const presentation: Option = {
  visible: true,
  width: 120,
  indicator: false,
};
const description: Option = {
  visible: false,
  width: 120,
  indicator: false,
};
const recommendations: Option = {
  visible: false,
  width: 190,
  indicator: false,
};
const sensitiveArea: Option = {
  visible: false,
  width: 160,
  indicator: false,
};
const informationPlaces: Option = {
  visible: false,
  width: 200,
  indicator: false,
};
const pois: Option = {
  visible: false,
  width: 120,
  indicator: false,
};
const options: Options = {
  presentation,
  description,
  recommendations,
  sensitiveArea,
  informationPlaces,
  pois,
};

@Component({
  tag: 'grw-trek-detail',
  styleUrl: 'grw-trek-detail.scss',
  shadow: true,
})
export class GrwTrekDetail {
  swiperImages?: Swiper;
  swiperPois?: Swiper;
  swiperInformationDesks?: Swiper;
  swiperImagesRef?: HTMLDivElement;
  prevElImagesRef?: HTMLDivElement;
  nextElImagesRef?: HTMLDivElement;
  paginationElImagesRef?: HTMLDivElement;
  swiperPoisRef?: HTMLDivElement;
  swiperInformationDesksRef?: HTMLDivElement;
  presentationRef?: HTMLDivElement;
  descriptionRef?: HTMLDivElement;
  parkingRef?: HTMLDivElement;
  recommendationRef?: HTMLDivElement;
  sensitiveAreaRef?: HTMLDivElement;
  informationDeskRef?: HTMLDivElement;
  poiRef?: HTMLDivElement;
  trekDetailContainerRef?: HTMLElement;

  defaultOptions: Options;
  @Event() descriptionReferenceIsInViewport: EventEmitter<boolean>;
  @Event() parkingIsInViewport: EventEmitter<boolean>;
  @Event() sensitiveAreaIsInViewport: EventEmitter<boolean>;
  @Event() informationDeskIsInViewport: EventEmitter<boolean>;
  @Event() poiIsInViewport: EventEmitter<boolean>;
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

  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorPrimaryContainer = '#eaddff';
  @Prop() colorOnPrimaryContainer = '#21005e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorBackground = '#fef7ff';

  @Prop() resetStoreOnDisconnected = true;
  @Prop() weather = false;
  @Prop() isLargeView = false;

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
    this.swiperPois = new Swiper(this.swiperPoisRef, {
      modules: [FreeMode, Mousewheel],
      slidesPerView: 1.5,
      spaceBetween: 20,
      grabCursor: true,
      freeMode: true,
      mousewheel: { forceToAxis: true },
      breakpointsBase: 'container',
      breakpoints: {
        '540': {
          slidesPerView: 2.5,
        },
      },
    });
    this.swiperInformationDesks = new Swiper(this.swiperInformationDesksRef, {
      modules: [FreeMode, Mousewheel],
      slidesPerView: 1.5,
      spaceBetween: 20,
      grabCursor: true,
      freeMode: true,
      mousewheel: { forceToAxis: true },
      breakpointsBase: 'container',
      breakpoints: {
        '540': {
          slidesPerView: 2.5,
        },
      },
    });
    if (this.presentationRef) {
      const presentationObserver = new IntersectionObserver(entries => {
        const isIntersecting = entries[0].isIntersecting;
        if (isIntersecting) {
          this.options = { ...this.defaultOptions, presentation: { ...this.defaultOptions.presentation, indicator: isIntersecting } };
        }
      });
      presentationObserver.observe(this.presentationRef);
    }
    if (this.descriptionRef) {
      const descriptionReferenceObserver = new IntersectionObserver(entries => {
        const isIntersecting = entries[0].isIntersecting;
        this.descriptionReferenceIsInViewport.emit(isIntersecting);
        if (isIntersecting) {
          this.options = { ...this.defaultOptions, description: { ...this.defaultOptions.description, indicator: isIntersecting } };
        }
      });
      descriptionReferenceObserver.observe(this.descriptionRef);
    }
    if (this.recommendationRef) {
      const recommendationsObserver = new IntersectionObserver(entries => {
        const isIntersecting = entries[0].isIntersecting;
        if (isIntersecting) {
          this.options = { ...this.defaultOptions, recommendations: { ...this.defaultOptions.recommendations, indicator: isIntersecting } };
        }
      });
      recommendationsObserver.observe(this.recommendationRef);
    }
    if (this.parkingRef) {
      const parkingObserver = new IntersectionObserver(entries => {
        const isIntersecting = entries[0].isIntersecting;
        this.parkingIsInViewport.emit(isIntersecting);
      });
      parkingObserver.observe(this.parkingRef);
    }

    if (this.sensitiveAreaRef) {
      const sensitiveAreaRefObserver = new IntersectionObserver(entries => {
        const isIntersecting = entries[0].isIntersecting;
        this.sensitiveAreaIsInViewport.emit(isIntersecting);
        if (isIntersecting) {
          this.options = { ...this.defaultOptions, sensitiveArea: { ...this.defaultOptions.sensitiveArea, indicator: isIntersecting } };
        }
      });
      sensitiveAreaRefObserver.observe(this.sensitiveAreaRef);
    }

    if (this.informationDeskRef) {
      const informationDeskObserver = new IntersectionObserver(entries => {
        const isIntersecting = entries[0].isIntersecting;
        this.informationDeskIsInViewport.emit(isIntersecting);
        if (isIntersecting) {
          this.options = { ...this.defaultOptions, informationPlaces: { ...this.defaultOptions.informationPlaces, indicator: isIntersecting } };
        }
      });
      informationDeskObserver.observe(this.informationDeskRef);
    }

    if (this.poiRef) {
      const poiObserver = new IntersectionObserver(entries => {
        const isIntersecting = entries[0].isIntersecting;
        this.poiIsInViewport.emit(isIntersecting);
        if (isIntersecting) {
          this.options = { ...this.defaultOptions, pois: { ...this.defaultOptions.pois, indicator: isIntersecting } };
        }
      });
      poiObserver.observe(this.poiRef);
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
      }
    });
  }

  disconnectedCallback() {
    if (this.resetStoreOnDisconnected) {
      reset();
    }
  }

  handleOptions() {
    return {
      ...options,
      presentation: { ...presentation },
      description: { ...description, visible: Boolean(this.currentTrek.description) },
      recommendations: { ...recommendations, visible: Boolean(this.currentTrek.advice || (this.labels && this.labels.length > 0)) },
      sensitiveArea: { ...sensitiveArea, visible: Boolean(state.currentSensitiveAreas && state.currentSensitiveAreas.length > 0) },
      informationPlaces: {
        ...informationPlaces,
        visible: Boolean(
          state.currentInformationDesks &&
            state.currentInformationDesks.filter(currentInformationDesks => this.currentTrek.information_desks.includes(currentInformationDesks.id)).length > 0,
        ),
      },
      pois: { ...pois, visible: Boolean(state.currentPois && state.currentPois.length > 0) },
    };
  }

  handleFullscreen() {
    if (this.currentTrek.attachments && this.currentTrek.attachments[0] && this.currentTrek.attachments[0].url) {
      this.swiperImagesRef.requestFullscreen();
    }
  }

  handleIndicatorSelectedTrekOption() {
    let previousVisibleOptions = 0;
    let currentOption: Option;
    let previousWidthOptions = 0;
    const options: Option[] = Object.values(this.options);
    let index = 0;
    while (!currentOption && index < options.length) {
      if (options[index].indicator) {
        currentOption = options[index];
      } else {
        if (options[index].visible) {
          previousVisibleOptions += 1;
          previousWidthOptions += options[index].width;
        }
      }
      index++;
    }
    return `${previousWidthOptions + 16 * previousVisibleOptions - currentOption.width / 2}px`;
  }

  handleScrollTo(element: HTMLDivElement) {
    this.trekDetailContainerRef.scrollTo({ top: element.offsetTop - 48 });
  }

  render() {
    return (
      <Host
        style={{
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
            <a onClick={() => this.handleScrollTo(this.presentationRef)} class={`presentation trek-option${this.options.presentation.indicator ? ' selected-trek-option' : ''}`}>
              {translate[state.language].options.presentation}
            </a>
            {this.options.description.visible && (
              <a onClick={() => this.handleScrollTo(this.descriptionRef)} class={`description trek-option${this.options.description.indicator ? ' selected-trek-option' : ''}`}>
                {translate[state.language].options.description}
              </a>
            )}
            {this.options.recommendations.visible && (
              <a
                onClick={() => this.handleScrollTo(this.recommendationRef)}
                class={`recommendations trek-option${this.options.recommendations.indicator ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.recommendations}
              </a>
            )}
            {this.options.sensitiveArea.visible && (
              <a
                onClick={() => this.handleScrollTo(this.sensitiveAreaRef)}
                class={`sensitive-areas trek-option${this.options.sensitiveArea.indicator ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.environmentalSensitiveAreas}
              </a>
            )}
            {this.options.informationPlaces.visible && (
              <a
                onClick={() => this.handleScrollTo(this.informationDeskRef)}
                class={`information-places trek-option${this.options.informationPlaces.indicator ? ' selected-trek-option' : ''}`}
              >
                {translate[state.language].options.informationPlaces}
              </a>
            )}
            {this.options.pois.visible && (
              <a onClick={() => this.handleScrollTo(this.poiRef)} class={`pois trek-option${this.options.pois.indicator ? ' selected-trek-option' : ''}`}>
                {translate[state.language].options.pois}
              </a>
            )}
            <span class="indicator-selected-trek-option" style={{ transform: `translateX(${this.handleIndicatorSelectedTrekOption()})` }}></span>
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
                        <img class="image" src={attachment.url} loading="lazy" onClick={() => this.handleFullscreen()} />
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
                <div class="row">
                  <div class="icon-label difficulty">
                    {this.difficulty?.pictogram && <img src={this.difficulty.pictogram} />}
                    {this.difficulty?.label}
                  </div>
                  <div class="icon-label duration">
                    <span class="material-symbols material-symbols-outlined">timelapse</span>
                    {formatDuration(this.currentTrek?.duration)}
                  </div>
                  <div class="icon-label route">
                    {this.route?.pictogram && <img src={this.route.pictogram} />}
                    {this.route?.route}
                  </div>
                </div>
                <div class="row">
                  <div class="icon-label length">
                    <span class="material-symbols material-symbols-outlined">open_in_full</span>
                    {formatLength(this.currentTrek.length_2d)}
                  </div>
                  <div class="icon-label ascent">
                    <span class="material-symbols material-symbols-outlined">moving</span>
                    {formatAscent(this.currentTrek.ascent)}
                  </div>
                  <div class="icon-label practice">
                    {this.practice?.pictogram && <img src={this.practice.pictogram} />}
                    {this.practice?.name}
                  </div>
                </div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="downloads-container">
              <div class="download-title">{translate[state.language].downloads}</div>
              <div class="links-container">
                <a href={`${this.currentTrek.gpx}`}>
                  <span class="material-symbols material-symbols-outlined">download</span>GPX
                </a>
                <a href={`${this.currentTrek.kml}`}>
                  <span class="material-symbols material-symbols-outlined">download</span>KML
                </a>
                <a href={`${this.currentTrek.pdf}`}>
                  <span class="material-symbols material-symbols-outlined">download</span>PDF
                </a>
              </div>
            </div>
            <div class="divider"></div>
            {this.currentTrek.description_teaser && <div class="description-teaser" innerHTML={this.currentTrek.description_teaser}></div>}
            {this.currentTrek.ambiance && <div class="ambiance" innerHTML={this.currentTrek.ambiance}></div>}
            <div class="divider"></div>
            {this.currentTrek.description && (
              <div class="description-container" ref={el => (this.descriptionRef = el)}>
                <div class="description-title">{translate[state.language].description}</div>
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
                <div class="cities-title">{translate[state.language].cities} :&nbsp;</div>
                <div innerHTML={this.cities.join(', ')}></div>
              </div>
            )}
            {this.weather && this.currentTrek.departure_city && (
              <div class="weather-container">
                <iframe height="150" frameborder="0" src={`https://meteofrance.com/widget/prevision/${this.currentTrek.departure_city}0#${this.colorPrimaryApp}`}></iframe>
              </div>
            )}
            {this.currentTrek.access && (
              <div>
                <div class="divider"></div>
                <div class="access-container">
                  <div class="access-title">{translate[state.language].roadAccess}</div>
                  <div class="access" innerHTML={this.currentTrek.access}></div>
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
            {(this.currentTrek.advice || this.labels.length > 0) && (
              <div>
                <div class="divider"></div>
                <div class="advice-container" ref={el => (this.recommendationRef = el)}>
                  <div class="advice-title">{translate[state.language].recommendations}</div>
                  {this.currentTrek.advice && (
                    <div class="current-advice-container">
                      <span class="material-symbols material-symbols-outlined">warning</span>
                      <div class="advice" innerHTML={this.currentTrek.advice}></div>
                    </div>
                  )}
                  {this.labels.map(label => (
                    <div class="label-container">
                      <div class="label-sub-container">
                        {label.pictogram && <img src={label.pictogram} />}
                        <div class="label-name" innerHTML={label.name}></div>
                      </div>
                      <div class="label-advice" innerHTML={label.advice}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {this.currentTrek.advised_parking && (
              <div>
                <div class="divider"></div>
                <div class="advised-parking-container" ref={el => (this.parkingRef = el)}>
                  <div class="advised-parking-title">{translate[state.language].recommendedParking}</div>
                  <div class="advised-parking" innerHTML={this.currentTrek.advised_parking}></div>
                </div>
              </div>
            )}
            {this.currentTrek.gear && (
              <div>
                <div class="divider"></div>
                <div class="gear-container">
                  <div class="gear-title">{translate[state.language].equipments}</div>
                  <div class="gear" innerHTML={this.currentTrek.gear}></div>
                </div>
              </div>
            )}
            {state.currentSensitiveAreas && state.currentSensitiveAreas.length > 0 && (
              <div>
                <div class="divider"></div>
                <div class="sensitive-areas-container" ref={el => (this.sensitiveAreaRef = el)}>
                  <div class="sensitive-areas-title">{translate[state.language].environmentalSensitiveAreas}</div>
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
                  <div class="information-desks-container" ref={el => (this.informationDeskRef = el)}>
                    <div class="information-desks-title">{translate[state.language].informationPlaces}</div>
                    <div class="swiper swiper-information-desks" ref={el => (this.swiperInformationDesksRef = el)}>
                      <div class="swiper-wrapper">
                        {state.currentInformationDesks
                          .filter(currentInformationDesks => this.currentTrek.information_desks.includes(currentInformationDesks.id))
                          .map(informationDesk => (
                            <div class="swiper-slide">
                              <grw-information-desk-detail informationDesk={informationDesk}></grw-information-desk-detail>
                            </div>
                          ))}
                      </div>
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
                  <div class="accessibilities-title">{translate[state.language].accessibility}</div>
                  {this.currentTrek.disabled_infrastructure && <div innerHTML={this.currentTrek.disabled_infrastructure}></div>}
                  <div class="accessibilities-content-container">
                    {this.accessibilities.map(accessibility => (
                      <div class="accessibility-content-container">
                        <img src={accessibility.pictogram}></img>
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
            {state.currentPois && state.currentPois.length > 0 && (
              <div>
                <div class="divider"></div>
                <div class="pois-container" ref={el => (this.poiRef = el)}>
                  <div class="pois-title">{translate[state.language].pois(state.currentPois.length)}</div>
                  <div class="swiper swiper-pois" ref={el => (this.swiperPoisRef = el)}>
                    <div class="swiper-wrapper">
                      {state.currentPois.map(poi => (
                        <div class="swiper-slide">
                          <grw-poi-detail poi={poi}></grw-poi-detail>
                        </div>
                      ))}
                    </div>
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
                      {source.pictogram && <img src={source.pictogram} />}
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
