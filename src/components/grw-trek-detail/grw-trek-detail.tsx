import { Component, Host, h, Prop, State, getAssetPath, Build, Event, EventEmitter } from '@stencil/core';
import Swiper, { Navigation, Pagination, Keyboard, FreeMode, Mousewheel } from 'swiper';
import { translate } from 'i18n/i18n';
import state, { onChange, reset } from 'store/store';
import { Accessibilities, AccessibilityLevel, Difficulty, Labels, Practice, Route, Sources, Themes, Trek } from 'types/types';
import { formatDuration, formatLength, formatAscent } from 'utils/utils';

const options: {
  presentation: boolean;
  description: boolean;
  sensitiveArea: boolean;
  informationPlaces: boolean;
  pois: boolean;
} = {
  presentation: false,
  description: false,
  sensitiveArea: false,
  informationPlaces: false,
  pois: false,
};

@Component({
  tag: 'grw-trek-detail',
  styleUrl: 'grw-trek-detail.scss',
  shadow: false,
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
  pointReferenceRef?: HTMLDivElement;
  parkingRef?: HTMLDivElement;
  sensitiveAreaRef?: HTMLDivElement;
  informationDeskRef?: HTMLDivElement;
  poiRef?: HTMLDivElement;
  @Event() informationDeskIsInViewport: EventEmitter<boolean>;
  @Event() pointReferenceIsInViewport: EventEmitter<boolean>;
  @Event() parkingIsInViewport: EventEmitter<boolean>;
  @Event() sensitiveAreaIsInViewport: EventEmitter<boolean>;
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
  @State() options = { ...options, presentation: true };
  @Prop() trek: Trek;
  @Prop() colorPrimary = '#6b0030';
  @Prop() colorPrimaryShade = '#4a0021';
  @Prop() colorPrimaryTint = '#974c6e';
  @Prop() resetStoreOnDisconnected = true;
  @Prop() weather = false;

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
    const presentationObserver = new IntersectionObserver(
      entries => {
        const intersectionRatio = entries[0].intersectionRatio >= 0.5;
        if (intersectionRatio) {
          this.options = { ...options, presentation: intersectionRatio };
        }
      },
      { threshold: 0.5 },
    );
    presentationObserver.observe(this.presentationRef);
    const pointReferenceObserver = new IntersectionObserver(
      entries => {
        const intersectionRatio = entries[0].intersectionRatio >= 0.5;
        this.pointReferenceIsInViewport.emit(intersectionRatio);
        if (intersectionRatio) {
          this.options = { ...options, description: intersectionRatio };
        }
      },
      { threshold: 0.5 },
    );
    pointReferenceObserver.observe(this.pointReferenceRef);
    const parkingObserver = new IntersectionObserver(
      entries => {
        const intersectionRatio = entries[0].intersectionRatio >= 0.5;
        this.parkingIsInViewport.emit(intersectionRatio);
      },
      { threshold: 0.5 },
    );
    parkingObserver.observe(this.parkingRef);
    const sensitiveAreaRefObserver = new IntersectionObserver(
      entries => {
        const intersectionRatio = entries[0].intersectionRatio >= 0.5;
        this.sensitiveAreaIsInViewport.emit(intersectionRatio);
        if (intersectionRatio) {
          this.options = { ...options, sensitiveArea: intersectionRatio };
        }
      },
      { threshold: 0.5 },
    );
    sensitiveAreaRefObserver.observe(this.sensitiveAreaRef);
    const informationDeskObserver = new IntersectionObserver(
      entries => {
        const intersectionRatio = entries[0].intersectionRatio >= 0.5;
        this.informationDeskIsInViewport.emit(intersectionRatio);
        if (intersectionRatio) {
          this.options = { ...options, informationPlaces: intersectionRatio };
        }
      },
      { threshold: 0.5 },
    );
    informationDeskObserver.observe(this.informationDeskRef);
    const poiObserver = new IntersectionObserver(
      entries => {
        const intersectionRatio = entries[0].intersectionRatio >= 0.5;
        this.poiIsInViewport.emit(intersectionRatio);
        if (intersectionRatio) {
          this.options = { ...options, pois: intersectionRatio };
        }
      },
      { threshold: 0.5 },
    );
    poiObserver.observe(this.poiRef);
  }

  connectedCallback() {
    this.currentTrek = this.trek ? this.trek : state.currentTrek;
    if (this.currentTrek) {
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

  handleFullscreen() {
    if (this.currentTrek.attachments && this.currentTrek.attachments[0] && this.currentTrek.attachments[0].url) {
      this.swiperImagesRef.requestFullscreen();
    }
  }

  render() {
    const durationImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/duration.svg`);
    const lengthImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/length.svg`);
    const ascentImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/ascent.svg`);
    const adviseImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/advise.svg`);
    return (
      <Host style={{ '--color-primary': this.colorPrimary, '--color-primary-shade': this.colorPrimaryShade, '--color-primary-tint': this.colorPrimaryTint }}>
        <div class="trek-options">
          <a href="#presentation" class={`trek-option${this.options.presentation ? ' selected-trek-option' : ''}`}>
            {translate[state.language].options.presentation}
          </a>
          <a href="#description" class={`trek-option${this.options.description ? ' selected-trek-option' : ''}`}>
            {translate[state.language].options.description}
          </a>
          <a href="#sensitive-areas" class={`trek-option${this.options.sensitiveArea ? ' selected-trek-option' : ''}`}>
            {translate[state.language].options.environmentalSensitiveAreas}
          </a>
          <a href="#information-places" class={`trek-option${this.options.informationPlaces ? ' selected-trek-option' : ''}`}>
            {translate[state.language].options.informationPlaces}
          </a>
          <a href="#pois" class={`trek-option${this.options.pois ? ' selected-trek-option' : ''}`}>
            {translate[state.language].options.pois}
          </a>
        </div>
        {this.currentTrek && (
          <div class="trek-detail-container">
            <div id="presentation" class="images-container" ref={el => (this.presentationRef = el)}>
              <div class="swiper" ref={el => (this.swiperImagesRef = el)}>
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
            <div class="sub-container">
              <div class="icons-labels-container">
                <div class="row">
                  <div class="icon-label difficulty">
                    {this.difficulty?.pictogram && <img src={this.difficulty.pictogram} />}
                    {this.difficulty?.label}
                  </div>
                  <div class="icon-label duration">
                    <img src={durationImageSrc} />
                    {formatDuration(this.currentTrek?.duration)}
                  </div>
                  <div class="icon-label route">
                    {this.route?.pictogram && <img src={this.route.pictogram} />}
                    {this.route?.route}
                  </div>
                </div>
                <div class="row">
                  <div class="icon-label length">
                    <img src={lengthImageSrc} />

                    {formatLength(this.currentTrek.length_2d)}
                  </div>
                  <div class="icon-label ascent">
                    <img src={ascentImageSrc} />

                    {formatAscent(this.currentTrek.ascent)}
                  </div>
                  <div class="icon-label practice">
                    {this.practice?.pictogram && <img src={this.practice.pictogram} />}
                    {this.practice?.name}
                  </div>
                </div>
              </div>
            </div>
            <div class="downloads-container">
              <div class="download-title">{translate[state.language].downloads}</div>
              <div class="links-container">
                <a href={`${this.currentTrek.gpx}`}>GPX</a>
                <a href={`${this.currentTrek.kml}`}>KML</a>
                <a href={`${this.currentTrek.pdf}`}>PDF</a>
              </div>
            </div>
            {this.themes.length > 0 && (
              <div class="themes-container">
                {this.themes.map(theme => (
                  <div class="theme">{theme.label}</div>
                ))}
              </div>
            )}
            {this.currentTrek.description_teaser && <div class="description-teaser" innerHTML={this.currentTrek.description_teaser}></div>}
            {this.currentTrek.ambiance && <div class="ambiance" innerHTML={this.currentTrek.ambiance}></div>}
            {this.currentTrek.description && (
              <div id="description" class="description-container" ref={el => (this.pointReferenceRef = el)}>
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
            {this.currentTrek.cities && (
              <div class="cities-container">
                <div class="cities-title">{translate[state.language].cities} :&nbsp;</div>
                <div innerHTML={this.cities.join(', ')}></div>
              </div>
            )}
            {this.weather && this.currentTrek.departure_city && (
              <div class="weather-container">
                <iframe
                  id="weather-widget"
                  height="150"
                  frameborder="0"
                  src={`https://meteofrance.com/widget/prevision/${this.currentTrek.departure_city}0#${this.colorPrimaryTint}`}
                ></iframe>
              </div>
            )}
            {this.currentTrek.access && (
              <div class="access-container">
                <div class="access-title">{translate[state.language].roadAccess}</div>
                <div class="access" innerHTML={this.currentTrek.access}></div>
              </div>
            )}
            {this.currentTrek.public_transport && (
              <div class="public-transport-container">
                <div class="public-transport-title">{translate[state.language].transport}</div>
                <div class="public-transport" innerHTML={this.currentTrek.public_transport}></div>
              </div>
            )}
            {(this.currentTrek.advice || this.labels.length > 0) && (
              <div class="advice-container">
                <div class="advice-title">{translate[state.language].recommandations}</div>
                {this.currentTrek.advice && (
                  <div class="current-advice-container">
                    <img src={adviseImageSrc} />
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
            )}
            {this.currentTrek.advised_parking && (
              <div class="advised-parking-container" ref={el => (this.parkingRef = el)}>
                <div class="advised-parking-title">{translate[state.language].recommendedParking}</div>
                <div class="advised_parking" innerHTML={this.currentTrek.advised_parking}></div>
              </div>
            )}
            {this.currentTrek.gear && (
              <div class="gear-container">
                <div class="gear-title">{translate[state.language].equipments}</div>
                <div class="gear" innerHTML={this.currentTrek.gear}></div>
              </div>
            )}
            {state.currentSensitiveAreas && state.currentSensitiveAreas.length > 0 && (
              <div id="sensitive-areas" class="sensitive-areas-container" ref={el => (this.sensitiveAreaRef = el)}>
                <div class="sensitive-areas-title">{translate[state.language].environmentalSensitiveAreas}</div>
                {state.currentSensitiveAreas.map(sensitiveArea => (
                  <grw-sensitive-area-detail sensitiveArea={sensitiveArea}></grw-sensitive-area-detail>
                ))}
              </div>
            )}
            {state.currentInformationDesks && state.currentInformationDesks.length > 0 && (
              <div id="information-places" class="information-desks-container" ref={el => (this.informationDeskRef = el)}>
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
            )}
            {state.currentPois && state.currentPois.length > 0 && (
              <div id="pois" class="pois-container" ref={el => (this.poiRef = el)}>
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
            )}
            {this.currentTrek.source && this.currentTrek.source.length > 0 && (
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
            )}
          </div>
        )}
      </Host>
    );
  }
}
