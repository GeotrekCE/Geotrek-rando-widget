import { Build, Component, Host, getAssetPath, h, State, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { getDataInStore } from 'services/grw-db.service';
import state from 'store/store';
import Swiper, { Keyboard, Navigation, Pagination } from 'swiper';
import { TouristicContent, Trek } from 'types/types';

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

  componentDidLoad() {
    this.handleOffline();
    if (this.swiperTouristicContentRef) {
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

  async handleOffline() {
    if (state.currentTrek) {
      const trekInStore: Trek = await getDataInStore('treks', state.currentTrek.id);
      const touristicContentInStore: TouristicContent = await getDataInStore('touristicContents', this.touristicContent.id);
      this.offline = trekInStore && trekInStore.offline && touristicContentInStore && touristicContentInStore.offline;
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

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const touristicContentCategory = state.touristicContentCategories.find(touristicContentCategory => touristicContentCategory.id === this.touristicContent.category);
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
          'width': this.isLargeView ? '100%' : 'auto',
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
              this.touristicContentCardPress.emit(this.touristicContent.id);
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
                            src={this.displayFullscreen ? (this.offline ? attachment.thumbnail : attachment.url) : attachment.thumbnail}
                            loading="lazy"
                            /* @ts-ignore */
                            onerror={event => {
                              event.target.onerror = null;
                              event.target.className = 'default-touristic-event-img';
                              event.target.src = defaultImageSrc;
                            }}
                            onClick={() => this.handleFullscreen()}
                            alt={attachment.legend}
                          />
                        </div>
                      ))
                  ) : (
                    <div part="swiper-slide" class="swiper-slide">
                      <img
                        part="default-touristic-event-img"
                        class="default-touristic-content-img"
                        /* @ts-ignore */

                        src={defaultImageSrc}
                        alt=""
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{ display: this.offline ? 'none' : 'flex' }}
                  part="swiper-pagination"
                  class="swiper-pagination"
                  ref={el => (this.paginationElTouristicContentRef = el)}
                ></div>
                <div
                  style={{ display: this.offline ? 'none' : 'flex' }}
                  part="swiper-button-prev"
                  class="swiper-button-prev"
                  ref={el => (this.prevElTouristicContentRef = el)}
                ></div>
                <div
                  style={{ display: this.offline ? 'none' : 'flex' }}
                  part="swiper-button-next"
                  class="swiper-button-next"
                  ref={el => (this.nextElTouristicContentRef = el)}
                ></div>
              </div>
            ) : this.touristicContent.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
              <img
                part="touristic-content-img"
                class="touristic-content-img"
                /* @ts-ignore */

                src={`${this.touristicContent.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail}`}
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
                <img
                  part="touristic-content-category-img"
                  class="touristic-content-category-img"
                  /* @ts-ignore */

                  src={touristicContentCategory.pictogram}
                  alt=""
                />
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
              <button part="more-details-button" class="more-details-button" onClick={() => this.touristicContentCardPress.emit(this.touristicContent.id)}>
                Plus de détails
              </button>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
