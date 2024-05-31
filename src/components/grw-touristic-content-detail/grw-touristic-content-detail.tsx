import { Build, Component, Host, Prop, State, getAssetPath, h } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state from 'store/store';
import Swiper, { FreeMode, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper';
import CloseIcon from '../../assets/close.svg';
import DownloadIcon from '../../assets/download.svg';

@Component({
  tag: 'grw-touristic-content-detail',
  styleUrl: 'grw-touristic-content-detail.scss',
  shadow: true,
})
export class GrwTouristicContentDetail {
  swiperImages?: Swiper;
  swiperImagesRef?: HTMLDivElement;
  prevElImagesRef?: HTMLDivElement;
  nextElImagesRef?: HTMLDivElement;
  paginationElImagesRef?: HTMLDivElement;
  presentationRef?: HTMLDivElement;

  @State() displayFullscreen = false;
  @State() offline = false;

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

  descriptionRef?: HTMLDivElement;
  touristicContentDetailContainerRef?: HTMLElement;

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
        this.displayFullscreen && !this.offline ? this.swiperImages.keyboard.enable() : this.swiperImages.keyboard.disable();
      };
    }
  }

  componentDidUpdate() {
    this.handleSwipers();
  }

  componentDidLoad() {
    this.offline = state.currentTouristicContent.offline;
    this.handleSwipers();
  }

  handleFullscreen(close: boolean = false) {
    if (!close) {
      if (state.currentTouristicContent.attachments && state.currentTouristicContent.attachments[0] && state.currentTouristicContent.attachments[0].url) {
        this.swiperImagesRef.requestFullscreen();
      }
    } else {
      (document as any).exitFullscreen();
    }
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const touristicContentCategory =
      state.touristicContentCategories &&
      state.currentTouristicContent &&
      state.touristicContentCategories.find(touristicContentCategory => touristicContentCategory.id === state.currentTouristicContent.category);
    const cities = state.currentTouristicContent && state.currentTouristicContent.cities.map(currentCity => state.cities.find(city => city.id === currentCity)?.name);
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
            ? '204px'
            : '164px',
        }}
      >
        {state.currentTouristicContent && (
          <div part="touristic-content-detail-container" class="touristic-content-detail-container" ref={el => (this.touristicContentDetailContainerRef = el)}>
            <div part="images-container" class="images-container" ref={el => (this.presentationRef = el)}>
              <div part="swiper-images" class="swiper swiper-images" ref={el => (this.swiperImagesRef = el)}>
                <div part="swiper-wrapper" class="swiper-wrapper">
                  {state.currentTouristicContent.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
                    state.currentTouristicContent.attachments
                      .filter(attachment => attachment.type === 'image')
                      .map(attachment => {
                        const legend = [attachment.legend, attachment.author].filter(Boolean).join(' - ');
                        return (
                          <div part="swiper-slide" class="swiper-slide">
                            {this.displayFullscreen && (
                              <div part="close-fullscreen-button" class="close-fullscreen-button" onClick={() => this.handleFullscreen(true)}>
                                <span part="icon" class="icon" innerHTML={CloseIcon}></span>
                              </div>
                            )}
                            <div part="legend-container" class="legend-container">
                              {legend}
                            </div>
                            <img
                              part="image"
                              class="image"
                              src={this.offline && attachment.thumbnail !== '' ? attachment.thumbnail : attachment.url}
                              loading="lazy"
                              onClick={() => this.handleFullscreen()}
                              alt={attachment.legend}
                            />
                          </div>
                        );
                      })
                  ) : (
                    <div part="swiper-slide" class="swiper-slide">
                      <img part="default-poi-img" class="default-poi-img" src={defaultImageSrc} alt="" loading="lazy" />
                    </div>
                  )}
                </div>
                <div style={{ display: this.offline ? 'none' : 'block' }} part="swiper-pagination" class="swiper-pagination" ref={el => (this.paginationElImagesRef = el)}></div>
                <div style={{ display: this.offline ? 'none' : 'flex' }} part="swiper-button-prev" class="swiper-button-prev" ref={el => (this.prevElImagesRef = el)}></div>
                <div style={{ display: this.offline ? 'none' : 'flex' }} part="swiper-button-next" class="swiper-button-next" ref={el => (this.nextElImagesRef = el)}></div>
              </div>
            </div>
            <div part="touristic-content-category-container" class="touristic-content-category-container">
              <img
                part="touristic-content-category-img"
                class="touristic-content-category-img"
                /* @ts-ignore */

                src={touristicContentCategory.pictogram}
                alt=""
              />
              <div part="touristic-content-category-name" class="touristic-content-category-name">
                {touristicContentCategory.label}
              </div>
            </div>
            <div part="name" class="name">
              {state.currentTouristicContent.name}
            </div>
            <div part="divider" class="divider"></div>
            <div part="downloads-container" class="downloads-container">
              <div part="download-title" class="download-title">
                {translate[state.language].download}
              </div>
              <div part="links-container" class="links-container">
                <a part="link-container" class="link-container" href={`${state.currentTouristicContent.pdf}`} target="_blank" rel="noopener noreferrer">
                  <span part="icon" class="icon" innerHTML={DownloadIcon}></span>
                  <span part="label" class="">
                    PDF
                  </span>
                </a>
              </div>
            </div>
            {state.currentTouristicContent.description_teaser && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="description-teaser" class="description-teaser" innerHTML={state.currentTouristicContent.description_teaser}></div>
              </div>
            )}
            <div part="divider" class="divider"></div>
            {state.currentTouristicContent.practical_info && (
              <div part="description-container" class="description-container" ref={el => (this.descriptionRef = el)}>
                <div part="description-title" class="description-title">
                  {translate[state.language].description}
                </div>
                <div part="description" class="description" innerHTML={state.currentTouristicContent.description}></div>
              </div>
            )}
            {cities && cities.length > 0 && (
              <div part="cities-container" class="cities-container">
                <div part="cities-title" class="cities-title">
                  {translate[state.language].city} :&nbsp;
                </div>
                <div part="cities" class="cities" innerHTML={cities.join(', ')}></div>
              </div>
            )}
            {state.currentTouristicContent.practical_info && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="useful-information-container" class="useful-information-container">
                  <div part="useful-information-title" class="useful-information-title">
                    {translate[state.language].usefulInformation} :&nbsp;
                  </div>
                  <div part="useful-information" innerHTML={state.currentTouristicContent.practical_info}></div>
                </div>
              </div>
            )}
            {(state.currentTouristicContent.contact || state.currentTouristicContent.email || state.currentTouristicContent.website) && (
              <div>
                <div part="divider" class="divider"></div>
                <div part="contact-container" class="contact-container">
                  <div part="contact-title" class="contact-title">
                    {translate[state.language].contact} :&nbsp;
                  </div>
                  {state.currentTouristicContent.contact && <div part="contact" class="contact" innerHTML={state.currentTouristicContent.contact}></div>}
                  {state.currentTouristicContent.email && (
                    <div part="email-container" class="email-container">
                      <div part="email-title" class="email-title">
                        {translate[state.language].email} :&nbsp;
                      </div>
                      <a href={'mailto:' + state.currentTouristicContent.email} part="email" class="email" innerHTML={state.currentTouristicContent.email}></a>
                    </div>
                  )}
                  {state.currentTouristicContent.website && (
                    <div part="website-container" class="website-container">
                      <div part="website-title" class="website-title">
                        {translate[state.language].website} :&nbsp;
                      </div>
                      <a href={state.currentTouristicContent.website} part="website" class="website" innerHTML={state.currentTouristicContent.website}></a>
                    </div>
                  )}
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
