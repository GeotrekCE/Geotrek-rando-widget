import { Build, Component, Host, Prop, State, getAssetPath, h } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state from 'store/store';
import Swiper, { FreeMode, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper';

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

  componentDidLoad() {
    if (this.swiperImagesRef) {
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
    }
  }

  handleFullscreen() {
    if (state.currentTouristicContent.attachments && state.currentTouristicContent.attachments[0] && state.currentTouristicContent.attachments[0].url) {
      this.swiperImagesRef.requestFullscreen();
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
        {state.currentTouristicContent && (
          <div class="touristic-content-detail-container" ref={el => (this.touristicContentDetailContainerRef = el)}>
            <div class="images-container" ref={el => (this.presentationRef = el)}>
              <div class="swiper swiper-images" ref={el => (this.swiperImagesRef = el)}>
                <div class="swiper-wrapper">
                  {state.currentTouristicContent.attachments.length > 0 ? (
                    state.currentTouristicContent.attachments
                      .filter(attachment => attachment.type === 'image')
                      .map(attachment => (
                        <div class="swiper-slide">
                          <img class="image" src={attachment.url} loading="lazy" onClick={() => this.handleFullscreen()} />
                        </div>
                      ))
                  ) : (
                    <div class="swiper-slide">
                      <img class="default-poi-img" src={defaultImageSrc} loading="lazy" />
                    </div>
                  )}
                </div>
                <div class="swiper-pagination" ref={el => (this.paginationElImagesRef = el)}></div>
                <div class="swiper-button-prev" ref={el => (this.prevElImagesRef = el)}></div>
                <div class="swiper-button-next" ref={el => (this.nextElImagesRef = el)}></div>
              </div>
            </div>
            <div class="touristic-content-category-container">
              <img src={touristicContentCategory.pictogram} />
              <div class="touristic-content-category-name">{touristicContentCategory.label}</div>
            </div>
            <div class="name">{state.currentTouristicContent.name}</div>
            <div class="divider"></div>
            <div class="downloads-container">
              <div class="download-title">{translate[state.language].download}</div>
              <div class="links-container">
                <a href={`${state.currentTouristicContent.pdf}`}>
                  {/* @ts-ignore */}
                  <span translate={false} class="material-symbols material-symbols-outlined">
                    download
                  </span>
                  PDF
                </a>
              </div>
            </div>
            {state.currentTouristicContent.description_teaser && (
              <div>
                <div class="divider"></div>
                <div class="description-teaser" innerHTML={state.currentTouristicContent.description_teaser}></div>
              </div>
            )}
            <div class="divider"></div>
            {state.currentTouristicContent.practical_info && (
              <div class="description-container" ref={el => (this.descriptionRef = el)}>
                <div class="description-title">{translate[state.language].description}</div>
                <div class="description" innerHTML={state.currentTouristicContent.description}></div>
              </div>
            )}
            {cities && cities.length > 0 && (
              <div class="cities-container">
                <div class="cities-title">{translate[state.language].city} :&nbsp;</div>
                <div innerHTML={cities.join(', ')}></div>
              </div>
            )}
            {state.currentTouristicContent.practical_info && (
              <div>
                <div class="divider"></div>
                <div class="useful-information-container">
                  <div class="useful-information-title">{translate[state.language].usefulInformation} :&nbsp;</div>
                  <div innerHTML={state.currentTouristicContent.practical_info}></div>
                </div>
              </div>
            )}
            {(state.currentTouristicContent.contact || state.currentTouristicContent.email || state.currentTouristicContent.website) && (
              <div>
                <div class="divider"></div>

                <div class="contact-container">
                  <div class="contact-title">{translate[state.language].contact} :&nbsp;</div>
                  {state.currentTouristicContent.contact && <div innerHTML={state.currentTouristicContent.contact}></div>}
                  {state.currentTouristicContent.email && (
                    <div class="email-container">
                      <div>{translate[state.language].email} :&nbsp;</div>
                      <div innerHTML={state.currentTouristicContent.email}></div>
                    </div>
                  )}
                  {state.currentTouristicContent.website && (
                    <div class="website-container">
                      <div>{translate[state.language].website} :&nbsp;</div>
                      <div innerHTML={state.currentTouristicContent.website}></div>
                    </div>
                  )}
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
