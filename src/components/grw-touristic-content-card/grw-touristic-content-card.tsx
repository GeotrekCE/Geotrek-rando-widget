import { Build, Component, Host, getAssetPath, h, State, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { translate } from 'i18n/i18n';
import { getDataInStore } from 'services/grw-db.service';
import state from 'store/store';
import Swiper, { Keyboard, Navigation, Pagination } from 'swiper';
import { OutdoorSite, TouristicContent, Trek } from 'types/types';

@Component({
  tag: 'grw-touristic-content-card',
  styleUrl: 'grw-touristic-content-card.scss',
  shadow: true,
})
export class GrwTouristicContentCard {
  @Event() touristicContentCardPress: EventEmitter<number>;
  swiperTouristicContent?: Swiper;
  swiperTouristicContentRef?: HTMLDivElement;
  prevElTouristicContentRef?: HTMLDivElement;
  nextElTouristicContentRef?: HTMLDivElement;
  paginationElTouristicContentRef?: HTMLDivElement;

  @Prop() fontFamily = 'Roboto';

  @Prop() touristicContent: TouristicContent;
  @Prop() isLargeView = false;
  @Prop() isInsideHorizontalList = false;
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @State() displayFullscreen = false;

  @Event() cardTouristicContentMouseOver: EventEmitter<number>;
  @Event() cardTouristicContentMouseLeave: EventEmitter;

  @State() offline = false;

  @Listen('trekDownloadedSuccessConfirm', { target: 'window' })
  onTrekDownloadedSuccessConfirm() {
    if (this.swiperTouristicContent) {
      this.swiperTouristicContent.slideTo(0);
    }
    this.offline = true;
  }

  @Listen('trekDeleteSuccessConfirm', { target: 'window' })
  onTrekDeleteSuccessConfirm() {
    this.offline = false;
  }

  handleSwipers() {
    if (this.swiperTouristicContentRef && !this.swiperTouristicContent) {
      this.swiperTouristicContent = new Swiper(this.swiperTouristicContentRef, {
        modules: [Navigation, Pagination, Keyboard],
        navigation: {
          prevEl: this.prevElTouristicContentRef,
          nextEl: this.nextElTouristicContentRef,
        },
        pagination: { el: this.paginationElTouristicContentRef },
        allowTouchMove: false,
        keyboard: false,
        loop: true,
      });
      this.swiperTouristicContentRef.onfullscreenchange = () => {
        this.displayFullscreen = !this.displayFullscreen && !this.offline;
        if (this.displayFullscreen) {
          this.swiperTouristicContent.keyboard.enable();
        } else {
          this.swiperTouristicContent.keyboard.disable();
        }
      };
    }
  }

  componentDidUpdate() {
    this.handleSwipers();
  }

  componentDidLoad() {
    this.handleOffline();
    this.handleSwipers();
  }

  async handleOffline() {
    if (state.currentTrek) {
      const trekInStore: Trek = await getDataInStore('treks', state.currentTrek.id);
      if (trekInStore && trekInStore.offline) {
        const touristicContentInStore: TouristicContent = await getDataInStore('touristicContents', this.touristicContent.id);
        this.offline = touristicContentInStore && touristicContentInStore.offline;
      }
    } else if (state.currentOutdoorSite) {
      const outdoorSiteInStore: OutdoorSite = await getDataInStore('outdoorSites', state.currentOutdoorSite.id);
      if (outdoorSiteInStore && outdoorSiteInStore.offline) {
        const touristicContentInStore: TouristicContent = await getDataInStore('touristicContents', this.touristicContent.id);
        this.offline = touristicContentInStore && touristicContentInStore.offline;
      }
    }
  }

  handleFullscreen() {
    if (this.touristicContent.attachments && this.touristicContent.attachments[0] && this.touristicContent.attachments[0].url) {
      this.swiperTouristicContentRef.requestFullscreen();
    }
  }

  @Listen('mouseover')
  handleMouseOver() {
    this.cardTouristicContentMouseOver.emit(this.touristicContent.id);
  }

  @Listen('mouseleave')
  handleMouseLeave() {
    this.cardTouristicContentMouseLeave.emit();
  }

  onMoreDetailsClick() {
    this.touristicContentCardPress.emit(this.touristicContent.id);
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const touristicContentCategory = state.touristicContentCategories.find(touristicContentCategory => touristicContentCategory.id === this.touristicContent.category);
    const displayPaginationAndNavigation =
      (this.touristicContent && this.touristicContent.attachments.filter(attachment => attachment.type === 'image').length > 1) || this.offline;
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
          'width': this.isLargeView ? '100%' : 'auto',
          '--color-surface-container-low': this.colorSurfaceContainerLow,
        }}
      >
        <div
          part="touristic-content-card"
          class={
            this.isLargeView
              ? `touristic-content-card touristic-content-card-large-view-container${
                  state.selectedTouristicContentId === this.touristicContent.id ? ' selected-touristic-content-card' : ''
                }${!this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''}`
              : `touristic-content-card touristic-content-card-container${state.selectedTouristicContentId === this.touristicContent.id ? ' selected-touristic-content-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
          }
          onClick={() => {
            if (!this.isInsideHorizontalList) {
              this.onMoreDetailsClick();
            }
          }}
        >
          <div part="touristic-content-img-container" class="touristic-content-img-container">
            {this.isInsideHorizontalList ? (
              <div part="swiper-touristic-content" class="swiper swiper-touristic-content" ref={el => (this.swiperTouristicContentRef = el)}>
                <div part="swiper-wrapper" class="swiper-wrapper">
                  {this.touristicContent.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
                    this.touristicContent.attachments
                      .filter(attachment => attachment.type === 'image')
                      .map(attachment => (
                        <div part="swiper-slide" class="swiper-slide">
                          <img
                            part="touristic-content-img"
                            class={`touristic-content-img${this.displayFullscreen ? ' img-fullscreen' : ''}`}
                            src={this.displayFullscreen ? (this.offline && attachment.thumbnail !== '' ? attachment.thumbnail : attachment.url) : attachment.thumbnail}
                            loading="lazy"
                            /* @ts-ignore */
                            onerror={event => {
                              event.target.onerror = null;
                              event.target.className = 'default-touristic-content-img';
                              event.target.src = defaultImageSrc;
                            }}
                            onClick={() => this.handleFullscreen()}
                            alt={attachment.legend}
                          />
                        </div>
                      ))
                  ) : (
                    <div part="swiper-slide" class="swiper-slide">
                      <img part="default-touristic-content-img" src={defaultImageSrc} class="default-touristic-content-img" alt="" loading="lazy" />
                    </div>
                  )}
                </div>
                <div
                  style={{ display: 'block', visibility: displayPaginationAndNavigation ? 'visible' : 'hidden' }}
                  part="swiper-pagination"
                  class="swiper-pagination"
                  ref={el => (this.paginationElTouristicContentRef = el)}
                ></div>
                <div
                  style={{ display: 'flex', visibility: displayPaginationAndNavigation ? 'visible' : 'hidden' }}
                  part="swiper-button-prev"
                  class="swiper-button-prev"
                  ref={el => (this.prevElTouristicContentRef = el)}
                ></div>
                <div
                  style={{ display: 'flex', visibility: displayPaginationAndNavigation ? 'visible' : 'hidden' }}
                  part="swiper-button-next"
                  class="swiper-button-next"
                  ref={el => (this.nextElTouristicContentRef = el)}
                ></div>
              </div>
            ) : this.touristicContent.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
              <img
                part="touristic-content-img"
                class="touristic-content-img"
                src={`${
                  this.touristicContent.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail !== ''
                    ? this.touristicContent.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail
                    : this.touristicContent.attachments.filter(attachment => attachment.type === 'image')[0].url
                }`}
                alt={`${this.touristicContent.attachments.filter(attachment => attachment.type === 'image')[0].legend}`}
                loading="lazy"
              />
            ) : (
              <img class="image default-touristic-content-img" src={defaultImageSrc} loading="lazy" alt="" />
            )}
          </div>
          <div part="touristic-content-sub-container" class="touristic-content-sub-container">
            <div part="touristic-content-category-container" class="touristic-content-category-container">
              {touristicContentCategory && touristicContentCategory.pictogram && (
                <img part="touristic-content-category-img" class="touristic-content-category-img" src={touristicContentCategory.pictogram} alt="" />
              )}
              <div part="touristic-content-category-name" class="touristic-content-category-name">
                {touristicContentCategory.label}
              </div>
            </div>
            <div part="touristic-content-name" class="touristic-content-name">
              {this.touristicContent.name}
            </div>
          </div>
          {this.isInsideHorizontalList && (
            <div part="touristic-content-more-detail-container" class="touristic-content-more-detail-container">
              <button part="more-details-button" class="more-details-button" onClick={() => this.onMoreDetailsClick()}>
                {translate[state.language].moreDetails}
              </button>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
