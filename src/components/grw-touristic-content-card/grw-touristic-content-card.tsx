import { Build, Component, Host, getAssetPath, h, State, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import state from 'store/store';
import Swiper, { Keyboard, Navigation, Pagination } from 'swiper';
import { TouristicContent } from 'types/types';

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

  componentDidLoad() {
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
      });
      this.swiperTouristicContentRef.onfullscreenchange = () => {
        this.displayFullscreen = !this.displayFullscreen;
        if (this.displayFullscreen) {
          this.swiperTouristicContent.keyboard.enable();
        } else {
          this.swiperTouristicContent.keyboard.disable();
        }
      };
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
          class={
            this.isLargeView
              ? `touristic-content-card-large-view-container${state.selectedTouristicContentId === this.touristicContent.id ? ' selected-touristic-content-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
              : `touristic-content-card-container${state.selectedTouristicContentId === this.touristicContent.id ? ' selected-touristic-content-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
          }
          onClick={() => {
            if (!this.isInsideHorizontalList) {
              this.touristicContentCardPress.emit(this.touristicContent.id);
            }
          }}
        >
          <div class="touristic-content-type-img-container">
            {this.isInsideHorizontalList ? (
              <div class="swiper" ref={el => (this.swiperTouristicContentRef = el)}>
                <div class="swiper-wrapper">
                  {this.touristicContent.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
                    this.touristicContent.attachments
                      .filter(attachment => attachment.type === 'image')
                      .map(attachment => (
                        <div class="swiper-slide">
                          <img
                            class={`touristic-content-img${this.displayFullscreen ? ' img-fullscreen' : ''}`}
                            src={this.displayFullscreen ? attachment.url : attachment.thumbnail}
                            loading="lazy"
                            onClick={() => this.handleFullscreen()}
                          />
                        </div>
                      ))
                  ) : (
                    <div class="swiper-slide">
                      <img
                        /* @ts-ignore */
                        crossorigin="anonymous"
                        class="default-touristic-content-img"
                        src={defaultImageSrc}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
                <div class="swiper-pagination" ref={el => (this.paginationElTouristicContentRef = el)}></div>
                <div class="swiper-button-prev" ref={el => (this.prevElTouristicContentRef = el)}></div>
                <div class="swiper-button-next" ref={el => (this.nextElTouristicContentRef = el)}></div>
              </div>
            ) : this.touristicContent.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
              <img
                /* @ts-ignore */
                crossorigin="anonymous"
                class="image"
                src={`${this.touristicContent.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail}`}
                loading="lazy"
              />
            ) : (
              <div></div>
            )}
          </div>
          <div class="touristic-content-sub-container">
            <div class="touristic-content-category-container">
              <img
                /* @ts-ignore */
                crossorigin="anonymous"
                src={touristicContentCategory.pictogram}
              />
              <div class="touristic-content-category-name">{touristicContentCategory.label}</div>
            </div>
            <div class="touristic-content-name">{this.touristicContent.name}</div>
          </div>
          {this.isInsideHorizontalList && (
            <div class="touristic-content-more-detail-container">
              <button class="more-details-button" onClick={() => this.touristicContentCardPress.emit(this.touristicContent.id)}>
                Plus de détails
              </button>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
