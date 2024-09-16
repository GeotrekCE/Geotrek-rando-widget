import { Build, Component, Host, Prop, State, getAssetPath, h, Event, EventEmitter } from '@stencil/core';
import { OutdoorCourse } from 'components';
import state, { onChange } from 'store/store';
import Swiper, { Navigation, Pagination, Keyboard, FreeMode, Mousewheel, Scrollbar } from 'swiper';
import CloseIcon from '../../assets/close.svg';
import { translate } from 'i18n/i18n';
import TimelapseIcon from '../../assets/timelapse.svg';
import OpenInFullIcon from '../../assets/open_in_full.svg';
import MovingIcon from '../../assets/moving.svg';
import DownloadIcon from '../../assets/download.svg';
import WarningIcon from '../../assets/warning.svg';
import { formatAscent, formatDuration, formatLength } from 'utils/utils';

const threshold = 1;

@Component({
  tag: 'grw-outdoor-course-detail',
  styleUrl: 'grw-outdoor-course-detail.scss',
  shadow: true,
})
export class GrwOutdoorCourseDetail {
  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorPrimaryContainer = '#eaddff';
  @Prop() colorOnPrimaryContainer = '#21005e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() colorBackground = '#fef7ff';
  @Prop() isLargeView = false;
  @Prop() weather = false;
  @Prop() grwApp = false;

  @State() displayFullscreen = false;
  @State() currentOutdoorCourse: OutdoorCourse;
  @State() offline = false;

  @Event() poiIsInViewport: EventEmitter<boolean>;
  @Event() touristicContentsIsInViewport: EventEmitter<boolean>;
  @Event() touristicEventsIsInViewport: EventEmitter<boolean>;

  outdoorCourseDetailContainerRef?: HTMLElement;
  swiperImagesRef?: HTMLDivElement;
  prevElImagesRef?: HTMLDivElement;
  nextElImagesRef?: HTMLDivElement;
  paginationElImagesRef?: HTMLDivElement;
  swiperImages?: Swiper;

  presentationRef?: HTMLDivElement;
  descriptionRef?: HTMLDivElement;
  recommendationRef?: HTMLDivElement;

  swiperTouristicContents?: Swiper;
  swiperTouristicEvents?: Swiper;
  swiperTouristicContentsRef?: HTMLDivElement;
  swiperTouristicEventsRef?: HTMLDivElement;
  touristicContentsRef?: HTMLDivElement;
  touristicEventsRef?: HTMLDivElement;
  touristicContentsSwiperScrollbar?: HTMLDivElement;
  touristicEventsSwiperScrollbar?: HTMLDivElement;
  swiperPois?: Swiper;
  poiRef?: HTMLDivElement;
  swiperPoisRef?: HTMLDivElement;
  poisOptionRef?: HTMLAnchorElement;
  poisSwiperScrollbar?: HTMLDivElement;

  poiObserver: IntersectionObserver;
  touristicContentObserver: IntersectionObserver;
  touristicEventObserver: IntersectionObserver;

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
      this.swiperImagesRef.onfullscreenchange = () => {
        this.displayFullscreen = !this.displayFullscreen;
        this.displayFullscreen ? this.swiperImages.keyboard.enable() : this.swiperImages.keyboard.disable();
      };
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
  }

  handleObservers() {
    if (this.poiRef && !this.poiObserver) {
      this.poiObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.poiIsInViewport.emit(isIntersecting);
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
        },
        { threshold },
      );
      this.touristicEventObserver.observe(this.touristicEventsRef);
    }
  }

  componentDidUpdate() {
    this.handleObservers();
    this.handleSwipers();
  }

  componentDidLoad() {
    this.handleObservers();
    this.handleSwipers();
  }

  async connectedCallback() {
    if (state.currentOutdoorCourse) {
      this.currentOutdoorCourse = state.currentOutdoorCourse;
      this.offline = this.currentOutdoorCourse.offline;
    }

    onChange('currentOutdoorCourse', async () => {
      if (state.currentOutdoorCourse) {
        this.currentOutdoorCourse = state.currentOutdoorCourse;
        this.offline = this.currentOutdoorCourse.offline;
      }
    });
  }

  handleFullscreen(close: boolean = false) {
    if (!close) {
      if (this.currentOutdoorCourse.attachments && this.currentOutdoorCourse.attachments[0] && this.currentOutdoorCourse.attachments[0].url) {
        this.swiperImagesRef.requestFullscreen();
      }
    } else {
      (document as any).exitFullscreen();
    }
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const type = state.outdoorCourseTypes && this.currentOutdoorCourse && state.outdoorCourseTypes.find(type => type.id === this.currentOutdoorCourse.type);
    const city = state.cities && state.cities.find(city => city.id === this.currentOutdoorCourse.cities[0]);
    const outdoorRatings =
      state.outdoorRatings && this.currentOutdoorCourse && state.outdoorRatings.filter(outdoorRating => this.currentOutdoorCourse.ratings.includes(outdoorRating.id));
    const currentOutdoorCoursesRatingsScales = outdoorRatings && [...new Set(outdoorRatings.map(outdoorRating => outdoorRating.scale))];
    const outdoorRatingsScales =
      currentOutdoorCoursesRatingsScales && state.outdoorRatingsScale.filter(outdoorRatingsScale => currentOutdoorCoursesRatingsScales.includes(outdoorRatingsScale.id));

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
        {this.currentOutdoorCourse && (
          <div part="outdoor-course-detail-container" class="outdoor-course-detail-container" ref={el => (this.outdoorCourseDetailContainerRef = el)}>
            <div part="outdoor-course-images-container" class="outdoor-course-images-container" ref={el => (this.presentationRef = el)}>
              <div part="swiper-images" class="swiper swiper-images" ref={el => (this.swiperImagesRef = el)}>
                <div part="swiper-wrapper" class="swiper-wrapper">
                  {this.currentOutdoorCourse.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
                    this.currentOutdoorCourse.attachments
                      .filter(attachment => attachment.type === 'image')
                      .map(attachment => {
                        const legend = [attachment.legend, attachment.author].filter(Boolean).join(' - ');
                        return (
                          <div part="swiper-slide" class="swiper-slide">
                            {this.displayFullscreen && (
                              <div part="outdoor-course-close-fullscreen-button" class="outdoor-course-close-fullscreen-button" onClick={() => this.handleFullscreen(true)}>
                                <span part="outdoor-course-close-fullcreen-icon" class="outdoor-course-close-fullcreen-icon" innerHTML={CloseIcon}></span>
                              </div>
                            )}
                            <div part="outdoor-course-image-legend" class="outdoor-course-image-legend">
                              {legend}
                            </div>
                            <img
                              part="outdoor-course-img"
                              class="outdoor-course-img"
                              src={this.offline && attachment.thumbnail !== '' ? attachment.thumbnail : attachment.url}
                              loading="lazy"
                              onClick={() => this.handleFullscreen()}
                              /* @ts-ignore */
                              onerror={event => {
                                event.target.onerror = null;
                                event.target.className = 'outdoor-course-img default-outdoor-course-img';
                                event.target.src = defaultImageSrc;
                              }}
                              alt={attachment.legend}
                            />
                          </div>
                        );
                      })
                  ) : (
                    <img part="outdoor-course-img" class="outdoor-course-img default-outdoor-course-img" src={defaultImageSrc} loading="lazy" alt="" />
                  )}
                </div>
                <div>
                  <div part="swiper-pagination" class="swiper-pagination" ref={el => (this.paginationElImagesRef = el)}></div>
                  <div part="swiper-button-prev" class="swiper-button-prev" ref={el => (this.prevElImagesRef = el)}></div>
                  <div part="swiper-button-next" class="swiper-button-next" ref={el => (this.nextElImagesRef = el)}></div>
                </div>
              </div>
            </div>
            <div part="outdoor-course-name" class="outdoor-course-name">
              {this.currentOutdoorCourse.name}
            </div>
            <div part="sub-container" class="sub-container">
              <div part="icons-labels-container" class="icons-labels-container">
                {type && (
                  <div part="icon-label" class="icon-label type">
                    {type.pictogram && <img part="icon" class="icon" src={type.pictogram} alt="" />}
                    <span part="label" class="label">
                      {type.name}
                    </span>
                  </div>
                )}
                <div part="icon-label" class="icon-label duration">
                  <span part="icon" class="icon" innerHTML={TimelapseIcon}></span>
                  <span part="label" class="label">
                    {formatDuration(this.currentOutdoorCourse.duration)}
                  </span>
                </div>
                <div part="icon-label" class="icon-label length">
                  <span part="icon" class="icon" innerHTML={OpenInFullIcon}></span>
                  <span part="label" class="label">
                    {formatLength(this.currentOutdoorCourse.length)}
                  </span>
                </div>
                {this.currentOutdoorCourse.max_elevation && (
                  <div part="icon-label" class="icon-label ascent">
                    <span part="icon" class="icon" innerHTML={MovingIcon}></span>
                    <span part="label" class="label">
                      {formatAscent(this.currentOutdoorCourse.max_elevation)}
                    </span>
                  </div>
                )}
                {outdoorRatings &&
                  outdoorRatingsScales.map(outdoorRatingsScale => (
                    <div part="row" class="row">
                      {`${outdoorRatingsScale.name} : ${outdoorRatings
                        .filter(outdoorRating => outdoorRating.scale === outdoorRatingsScale.id)
                        .map(rating => rating.name)
                        .join(', ')}`}
                    </div>
                  ))}
              </div>
            </div>
            <div part="divider" class="divider"></div>
            <div part="downloads-container" class="downloads-container">
              <div part="download-title" class="download-title">
                {translate[state.language].downloads}
              </div>
              <div part="links-container" class="links-container">
                <a
                  href={`${this.currentOutdoorCourse.pdf}${
                    state.portalsFromProviders && state.portalsFromProviders.length === 1 ? '?portal=' + state.portalsFromProviders[0] : ''
                  }`}
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
            {this.currentOutdoorCourse.description && (
              <div part="description-container" class="description-container">
                <div part="description-title" class="description-title" ref={el => (this.descriptionRef = el)}>
                  {translate[state.language].description}
                </div>
                <div part="description" class="description" innerHTML={this.currentOutdoorCourse.description}></div>
              </div>
            )}
            {this.currentOutdoorCourse && this.currentOutdoorCourse.cities && this.currentOutdoorCourse.cities.length > 0 && (
              <div part="departure-container" class="departure-container">
                <div part="departure-title" class="departure-title">
                  {translate[state.language].departure} :&nbsp;
                </div>
                <div part="departure" innerHTML={city.name}></div>
              </div>
            )}
            {this.currentOutdoorCourse.cities && this.currentOutdoorCourse.cities.length > 0 && (
              <div part="cities-container" class="cities-container">
                <div part="cities-title" class="cities-title">
                  {translate[state.language].crossedCities} :&nbsp;
                </div>
                <div part="cities" innerHTML={this.currentOutdoorCourse.cities.map(currentCity => state.cities.find(city => city.id === currentCity)?.name).join(', ')}></div>
              </div>
            )}
            {this.currentOutdoorCourse.advice && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="advice-container" class="advice-container">
                  <div part="advice-title" class="advice-title" ref={el => (this.recommendationRef = el)}>
                    {translate[state.language].recommendations}
                  </div>
                  {this.currentOutdoorCourse.advice && (
                    <div part="current-advice-container" class="current-advice-container">
                      <span part="icon" class="icon" innerHTML={WarningIcon}></span>
                      <div part="advice" class="advice" innerHTML={this.currentOutdoorCourse.advice}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {this.currentOutdoorCourse.accessibility && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="accessibilities-container" class="accessibilities-container">
                  <div part="accessibilites-title" class="accessibilities-title">
                    {translate[state.language].accessibility}
                  </div>
                  <div part="accessibilities" innerHTML={this.currentOutdoorCourse.accessibility}></div>
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
            {this.weather && city && !this.offline && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="weather-container" class="weather-container">
                  <iframe height="150" frameborder="0" src={`https://meteofrance.com/widget/prevision/${city.id}0#${this.colorPrimaryApp}`}></iframe>
                </div>
              </div>
            )}
            {this.grwApp && <div part="detail-bottom-space" class="detail-bottom-space"></div>}
          </div>
        )}
      </Host>
    );
  }
}
