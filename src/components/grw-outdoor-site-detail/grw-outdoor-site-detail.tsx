import { Build, Component, Host, Prop, State, getAssetPath, h, Event, EventEmitter } from '@stencil/core';
import { OutdoorSite } from 'components';
import state, { onChange } from 'store/store';
import Swiper, { Navigation, Pagination, Keyboard, FreeMode, Mousewheel, Scrollbar } from 'swiper';
import CloseIcon from '../../assets/close.svg';
import { translate } from 'i18n/i18n';
import DownloadIcon from '../../assets/download.svg';
import EventIcon from '../../assets/event.svg';
import WarningIcon from '../../assets/warning.svg';
import AirIcon from '../../assets/air.svg';
import ExploreIcon from '../../assets/explore.svg';

const threshold = 1;

@Component({
  tag: 'grw-outdoor-site-detail',
  styleUrl: 'grw-outdoor-site-detail.scss',
  shadow: true,
})
export class GrwOutdoorSiteDetail {
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

  @State() displayFullscreen = false;
  @State() currentOutdoorSite: OutdoorSite;

  @Event() informationPlacesIsInViewport: EventEmitter<boolean>;
  @Event() poiIsInViewport: EventEmitter<boolean>;
  @Event() touristicContentsIsInViewport: EventEmitter<boolean>;
  @Event() touristicEventsIsInViewport: EventEmitter<boolean>;
  @Event() sitesIsInViewport: EventEmitter<boolean>;
  @Event() coursesIsInViewport: EventEmitter<boolean>;

  outdoorSiteDetailContainerRef?: HTMLElement;
  swiperImagesRef?: HTMLDivElement;
  prevElImagesRef?: HTMLDivElement;
  nextElImagesRef?: HTMLDivElement;
  paginationElImagesRef?: HTMLDivElement;
  swiperImages?: Swiper;

  relatedOutdoorSitesRef: HTMLDivElement;
  swiperRelatedOutdoorSitesRef: HTMLDivElement;
  swiperRelatedOutdoorSites: Swiper;
  relatedOutdoorSitesSwiperScrollbar: HTMLDivElement;

  relatedOutdoorCoursesRef: HTMLDivElement;
  swiperRelatedOutdoorCoursesRef: HTMLDivElement;
  swiperRelatedOutdoorCourses: Swiper;
  relatedOutdoorCoursesSwiperScrollbar: HTMLDivElement;

  informationPlacesRef: HTMLDivElement;
  swiperInformationDesksRef: HTMLDivElement;
  swiperInformationDesks: Swiper;
  informationDesksContentsSwiperScrollbar: HTMLDivElement;

  swiperTouristicContents?: Swiper;
  swiperTouristicEvents?: Swiper;
  swiperTouristicContentsRef?: HTMLDivElement;
  swiperTouristicEventsRef?: HTMLDivElement;
  touristicContentsRef?: HTMLDivElement;
  touristicEventsRef?: HTMLDivElement;
  sitesRef?: HTMLDivElement;
  coursesRef?: HTMLDivElement;

  touristicContentsSwiperScrollbar?: HTMLDivElement;
  touristicEventsSwiperScrollbar?: HTMLDivElement;
  swiperPois?: Swiper;
  swiperPoisRef?: HTMLDivElement;
  poiRef?: HTMLDivElement;
  poisOptionRef?: HTMLAnchorElement;
  poisSwiperScrollbar?: HTMLDivElement;

  presentationRef?: HTMLDivElement;
  descriptionRef?: HTMLDivElement;
  recommendationRef?: HTMLDivElement;

  informationPlacesObserver: IntersectionObserver;
  poiObserver: IntersectionObserver;
  touristicContentObserver: IntersectionObserver;
  touristicEventObserver: IntersectionObserver;
  siteObserver: IntersectionObserver;
  courseObserver: IntersectionObserver;

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
      loop: true,
    });
    this.swiperImagesRef.onfullscreenchange = () => {
      this.displayFullscreen = !this.displayFullscreen;
      this.displayFullscreen ? this.swiperImages.keyboard.enable() : this.swiperImages.keyboard.disable();
    };

    this.swiperRelatedOutdoorSites = new Swiper(this.swiperRelatedOutdoorSitesRef, {
      modules: [FreeMode, Mousewheel, Scrollbar],
      slidesPerView: 1.5,
      spaceBetween: 20,
      grabCursor: true,
      freeMode: true,
      mousewheel: { forceToAxis: true },
      scrollbar: {
        draggable: true,
        hide: false,
        el: this.relatedOutdoorSitesSwiperScrollbar,
      },
      breakpointsBase: 'container',
      breakpoints: {
        '540': {
          slidesPerView: 2.5,
        },
      },
      loop: false,
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
      loop: false,
    });

    this.swiperRelatedOutdoorCourses = new Swiper(this.swiperRelatedOutdoorCoursesRef, {
      modules: [FreeMode, Mousewheel, Scrollbar],
      slidesPerView: 1.5,
      spaceBetween: 20,
      grabCursor: true,
      freeMode: true,
      mousewheel: { forceToAxis: true },
      scrollbar: {
        draggable: true,
        hide: false,
        el: this.relatedOutdoorCoursesSwiperScrollbar,
      },
      breakpointsBase: 'container',
      breakpoints: {
        '540': {
          slidesPerView: 2.5,
        },
      },
      loop: false,
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
      loop: false,
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
      loop: false,
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
      loop: false,
    });

    if (this.informationPlacesRef) {
      this.informationPlacesObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.informationPlacesIsInViewport.emit(isIntersecting);
        },
        { threshold },
      );
      this.informationPlacesObserver.observe(this.informationPlacesRef);
    }

    if (this.poiRef) {
      this.poiObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.poiIsInViewport.emit(isIntersecting);
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
        },
        { threshold },
      );
      this.touristicEventObserver.observe(this.touristicEventsRef);
    }
    if (this.sitesRef) {
      this.siteObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.sitesIsInViewport.emit(isIntersecting);
        },
        { threshold },
      );
      this.siteObserver.observe(this.sitesRef);
    }
    if (this.coursesRef) {
      this.courseObserver = new IntersectionObserver(
        entries => {
          const isIntersecting = entries[0].isIntersecting;
          this.coursesIsInViewport.emit(isIntersecting);
        },
        { threshold },
      );
      this.courseObserver.observe(this.coursesRef);
    }
  }

  async connectedCallback() {
    if (state.currentOutdoorSite) {
      this.currentOutdoorSite = state.currentOutdoorSite;
    }

    onChange('currentOutdoorSite', async () => {
      if (state.currentOutdoorSite) {
        this.currentOutdoorSite = state.currentOutdoorSite;
      }
    });
  }

  handleFullscreen(close: boolean = false) {
    if (!close) {
      if (this.currentOutdoorSite.attachments && this.currentOutdoorSite.attachments[0] && this.currentOutdoorSite.attachments[0].url) {
        this.swiperImagesRef.requestFullscreen();
      }
    } else {
      (document as any).exitFullscreen();
    }
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const practice = state.outdoorPractices && this.currentOutdoorSite && state.outdoorPractices.find(practice => practice.id === this.currentOutdoorSite.practice);
    const city = state.cities && this.currentOutdoorSite && state.cities.find(city => city.id === this.currentOutdoorSite.cities[0]);
    const outdoorRatings =
      state.outdoorRatings && this.currentOutdoorSite && state.outdoorRatings.filter(outdoorRating => this.currentOutdoorSite.ratings.includes(outdoorRating.id));
    const currentOutdoorSitesRatingsScales = outdoorRatings && [...new Set(outdoorRatings.map(outdoorRating => outdoorRating.scale))];
    const outdoorRatingsScales =
      currentOutdoorSitesRatingsScales && state.outdoorRatingsScale.filter(outdoorRatingsScale => currentOutdoorSitesRatingsScales.includes(outdoorRatingsScale.id));

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
            ? '244px'
            : '204px',
        }}
      >
        {this.currentOutdoorSite && (
          <div part="outdoor-site-detail-container" class="outdoor-site-detail-container" ref={el => (this.outdoorSiteDetailContainerRef = el)}>
            <div part="outdoor-site-images-container" class="outdoor-site-images-container" ref={el => (this.presentationRef = el)}>
              <div part="swiper-images" class="swiper swiper-images" ref={el => (this.swiperImagesRef = el)}>
                <div part="swiper-wrapper" class="swiper-wrapper">
                  {this.currentOutdoorSite.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
                    this.currentOutdoorSite.attachments
                      .filter(attachment => attachment.type === 'image')
                      .map(attachment => {
                        const legend = [attachment.legend, attachment.author].filter(Boolean).join(' - ');
                        return (
                          <div part="swiper-slide" class="swiper-slide">
                            {this.displayFullscreen && (
                              <div part="outdoor-site-close-fullscreen-button" class="outdoor-site-close-fullscreen-button" onClick={() => this.handleFullscreen(true)}>
                                <span part="outdoor-site-close-fullcreen-icon" class="outdoor-site-close-fullcreen-icon" innerHTML={CloseIcon}></span>
                              </div>
                            )}
                            <div part="outdoor-site-image-legend" class="outdoor-site-image-legend">
                              {legend}
                            </div>
                            <img
                              part="outdoor-site-img"
                              class="outdoor-site-img"
                              src={attachment.url}
                              loading="lazy"
                              onClick={() => this.handleFullscreen()}
                              /* @ts-ignore */
                              onerror={event => {
                                event.target.onerror = null;
                                event.target.className = 'outdoor-site-img default-outdoor-site-img';
                                event.target.src = defaultImageSrc;
                              }}
                              alt={attachment.legend}
                            />
                          </div>
                        );
                      })
                  ) : (
                    <img part="outdoor-site-img" class="outdoor-site-img default-outdoor-site-img" src={defaultImageSrc} loading="lazy" alt="" />
                  )}
                </div>
                <div>
                  <div part="swiper-pagination" class="swiper-pagination" ref={el => (this.paginationElImagesRef = el)}></div>
                  <div part="swiper-button-prev" class="swiper-button-prev" ref={el => (this.prevElImagesRef = el)}></div>
                  <div part="swiper-button-next" class="swiper-button-next" ref={el => (this.nextElImagesRef = el)}></div>
                </div>
              </div>
            </div>
            <div part="outdoor-site-name" class="outdoor-site-name">
              {this.currentOutdoorSite.name}
            </div>
            {state.themes && state.themes.filter(theme => this.currentOutdoorSite.themes.includes(theme.id)).length > 0 && (
              <div part="themes-container" class="themes-container">
                {state.themes
                  .filter(theme => this.currentOutdoorSite.themes.includes(theme.id))
                  .map(theme => (
                    <div part="theme" class="theme">
                      {theme.label}
                    </div>
                  ))}
              </div>
            )}
            <div part="sub-container" class="sub-container">
              <div part="icons-labels-container" class="icons-labels-container">
                {practice && (
                  <div part="icon-label" class="icon-label practice">
                    {practice.pictogram && <img part="icon" class="icon" src={practice.pictogram} alt="" />}
                    <span part="label" class="label">
                      {practice.name}
                    </span>
                  </div>
                )}
                {this.currentOutdoorSite.orientation && this.currentOutdoorSite.orientation.length > 0 && (
                  <div part="row" class="row">
                    <span part="icon" class="icon" innerHTML={ExploreIcon}></span>
                    <span part="label" class="label">
                      {this.currentOutdoorSite.orientation.map(orientation => translate[state.language].cardinalPoints[orientation.toLowerCase()]).join(', ')}
                    </span>
                  </div>
                )}
                {this.currentOutdoorSite.wind && this.currentOutdoorSite.wind.length > 0 && (
                  <div part="row" class="row">
                    <span part="icon" class="icon" innerHTML={AirIcon}></span>
                    <span part="label" class="label">
                      {this.currentOutdoorSite.wind.map(wind => translate[state.language].cardinalPoints[wind.toLowerCase()]).join(', ')}
                    </span>
                  </div>
                )}
                {this.currentOutdoorSite.period && (
                  <div part="row" class="row">
                    <span part="icon" class="icon" innerHTML={EventIcon}></span>
                    <span part="label" class="label">
                      {this.currentOutdoorSite.period}
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
                  href={`${this.currentOutdoorSite.pdf}${state.portalsFromProviders && state.portalsFromProviders.length === 1 ? '?portal=' + state.portalsFromProviders[0] : ''}`}
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
            {this.currentOutdoorSite.description_teaser && <div part="description-teaser" class="description-teaser" innerHTML={this.currentOutdoorSite.description_teaser}></div>}
            {this.currentOutdoorSite.ambiance && <div part="ambiance" class="ambiance" innerHTML={this.currentOutdoorSite.ambiance}></div>}
            <div part="divider" class="divider"></div>
            {this.currentOutdoorSite.description && (
              <div part="description-container" class="description-container">
                <div part="description-title" class="description-title" ref={el => (this.descriptionRef = el)}>
                  {translate[state.language].description}
                </div>
                <div part="description" class="description" innerHTML={this.currentOutdoorSite.description}></div>
              </div>
            )}
            {this.currentOutdoorSite.cities && this.currentOutdoorSite.cities.length > 0 && (
              <div part="departure-container" class="departure-container">
                <div part="departure-title" class="departure-title">
                  {translate[state.language].departure} :&nbsp;
                </div>
                <div part="departure" innerHTML={city.name}></div>
              </div>
            )}
            {this.currentOutdoorSite.cities && this.currentOutdoorSite.cities.length > 0 && (
              <div part="cities-container" class="cities-container">
                <div part="cities-title" class="cities-title">
                  {translate[state.language].crossedCities} :&nbsp;
                </div>
                <div part="cities" innerHTML={this.currentOutdoorSite.cities.map(currentCity => state.cities.find(city => city.id === currentCity)?.name).join(', ')}></div>
              </div>
            )}
            {this.currentOutdoorSite.advice && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="advice-container" class="advice-container">
                  <div part="advice-title" class="advice-title" ref={el => (this.recommendationRef = el)}>
                    {translate[state.language].recommendations}
                  </div>
                  {this.currentOutdoorSite.advice && (
                    <div part="current-advice-container" class="current-advice-container">
                      <span part="icon" class="icon" innerHTML={WarningIcon}></span>
                      <div part="advice" class="advice" innerHTML={this.currentOutdoorSite.advice}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {this.currentOutdoorSite.accessibility && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="accessibilities-container" class="accessibilities-container">
                  <div part="accessibilites-title" class="accessibilities-title">
                    {translate[state.language].accessibility}
                  </div>
                  <div part="accessibilities" innerHTML={this.currentOutdoorSite.accessibility}></div>
                </div>
              </div>
            )}
            {state.currentInformationDesks &&
              state.currentInformationDesks.filter(currentInformationDesks => this.currentOutdoorSite.information_desks.includes(currentInformationDesks.id)).length > 0 && (
                <div>
                  <div part="divider" class="divider"></div>
                  <div part="information-desks-container" class="information-desks-container">
                    <div part="information-desks-title" class="information-desks-title" ref={el => (this.informationPlacesRef = el)}>
                      {translate[state.language].informationPlaces}
                    </div>
                    <div part="swiper-information-desks" class="swiper swiper-information-desks" ref={el => (this.swiperInformationDesksRef = el)}>
                      <div part="swiper-wrapper" class="swiper-wrapper">
                        {state.currentInformationDesks
                          .filter(currentInformationDesks => this.currentOutdoorSite.information_desks.includes(currentInformationDesks.id))
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
            {state.currentRelatedOutdoorSites && state.currentRelatedOutdoorSites.length > 0 && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="related-outdoor-sites-container" class="related-outdoor-sites-container">
                  <div part="related-outdoor-sites-title" class="related-outdoor-sites-title" ref={el => (this.sitesRef = el)}>
                    {translate[state.language].relatedOutdoorSites(state.currentRelatedOutdoorSites.length)}
                  </div>
                  <div part="swiper-related-outdoor-sites" class="swiper swiper-related-outdoor-sites" ref={el => (this.swiperRelatedOutdoorSitesRef = el)}>
                    <div part="swiper-wrapper" class="swiper-wrapper">
                      {state.currentRelatedOutdoorSites.map(relatedOutdoorSite => (
                        <div part="swiper-slide" class="swiper-slide">
                          <grw-outdoor-site-card
                            exportparts="related-outdoor-sites-card,related-outdoor-sites-img-container,swiper-related-outdoor-sites,swiper-wrapper,swiper-slide,related-outdoor-sites-img,default-related-outdoor-sites-img,swiper-pagination,swiper-button-prev,swiper-button-next,related-outdoor-sites-sub-container,related-outdoor-sites-sub-container,related-outdoor-sites-type-img,related-outdoor-sites-type-name,related-outdoor-sites-name,related-outdoor-sites-date-container,related-outdoor-sites-date,related-outdoor-sites-more-detail-container,more-details-button"
                            fontFamily={this.fontFamily}
                            outdoorSite={relatedOutdoorSite}
                            isInsideHorizontalList={true}
                          ></grw-outdoor-site-card>
                        </div>
                      ))}
                    </div>
                    <div part="swiper-scrollbar" class="swiper-scrollbar" ref={el => (this.relatedOutdoorSitesSwiperScrollbar = el)}></div>
                  </div>
                </div>
              </div>
            )}
            {state.currentRelatedOutdoorCourses && state.currentRelatedOutdoorCourses.length > 0 && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="related-outdoor-courses-container" class="related-outdoor-courses-container">
                  <div part="related-outdoor-courses-title" class="related-outdoor-courses-title" ref={el => (this.coursesRef = el)}>
                    {translate[state.language].relatedOutdoorCourses(state.currentRelatedOutdoorCourses.length)}
                  </div>
                  <div part="swiper-related-outdoor-courses" class="swiper swiper-related-outdoor-courses" ref={el => (this.swiperRelatedOutdoorCoursesRef = el)}>
                    <div part="swiper-wrapper" class="swiper-wrapper">
                      {state.currentRelatedOutdoorCourses.map(relatedOutdoorCourse => (
                        <div part="swiper-slide" class="swiper-slide">
                          <grw-outdoor-course-card
                            exportparts="related-outdoor-courses-card,related-outdoor-courses-img-container,swiper-related-outdoor-courses,swiper-wrapper,swiper-slide,related-outdoor-courses-img,default-related-outdoor-courses-img,swiper-pagination,swiper-button-prev,swiper-button-next,related-outdoor-courses-sub-container,related-outdoor-courses-sub-container,related-outdoor-courses-type-img,related-outdoor-courses-type-name,related-outdoor-courses-name,related-outdoor-courses-date-container,related-outdoor-courses-date,related-outdoor-courses-more-detail-container,more-details-button"
                            fontFamily={this.fontFamily}
                            outdoorCourse={relatedOutdoorCourse}
                            isInsideHorizontalList={true}
                          ></grw-outdoor-course-card>
                        </div>
                      ))}
                    </div>
                    <div part="swiper-scrollbar" class="swiper-scrollbar" ref={el => (this.relatedOutdoorCoursesSwiperScrollbar = el)}></div>
                  </div>
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
            {this.weather && city && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="weather-container" class="weather-container">
                  <iframe height="150" frameborder="0" src={`https://meteofrance.com/widget/prevision/${city.id}0#${this.colorPrimaryApp}`}></iframe>
                </div>
              </div>
            )}
            <div part="detail-bottom-space" class="detail-bottom-space"></div>
          </div>
        )}
      </Host>
    );
  }
}
