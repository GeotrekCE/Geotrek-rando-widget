import { Build, Component, Host, getAssetPath, h, State, Prop, Event, EventEmitter } from '@stencil/core';
import state from 'store/store';
import Swiper, { Keyboard, Navigation, Pagination } from 'swiper';
import { TouristicContent } from 'types/types';

@Component({
  tag: 'grw-touristic-content',
  styleUrl: 'grw-touristic-content.scss',
  shadow: true,
})
export class GrwTouristicContent {
  @Event() touristicContentCardPress: EventEmitter<number>;
  swiperTouristicContent?: Swiper;
  swiperTouristicContentRef?: HTMLDivElement;
  prevElTouristicContentRef?: HTMLDivElement;
  nextElTouristicContentRef?: HTMLDivElement;
  paginationElTouristicContentRef?: HTMLDivElement;
  @Prop() touristicContent: TouristicContent;
  @State() displayFullscreen = false;

  componentDidLoad() {
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

  handleFullscreen() {
    if (this.touristicContent.attachments && this.touristicContent.attachments[0] && this.touristicContent.attachments[0].url) {
      this.swiperTouristicContentRef.requestFullscreen();
    }
  }
  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const touristicContentCategory = state.touristicContentCategories.find(touristicContentCategory => touristicContentCategory.id === this.touristicContent.category);
    return (
      <Host>
        <div class="touristic-content-type-img-container">
          {/* <img class="touristic-content-type" src={`${state.poiTypes.find(poiType => poiType.id === this.poi.type)?.pictogram}`} /> */}
          <div class="swiper" ref={el => (this.swiperTouristicContentRef = el)}>
            <div class="swiper-wrapper">
              {this.touristicContent.attachments.length > 0 ? (
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
                  <img class="default-touristic-content-img" src={defaultImageSrc} loading="lazy" />
                </div>
              )}
            </div>
            <div class="swiper-pagination" ref={el => (this.paginationElTouristicContentRef = el)}></div>
            <div class="swiper-button-prev" ref={el => (this.prevElTouristicContentRef = el)}></div>
            <div class="swiper-button-next" ref={el => (this.nextElTouristicContentRef = el)}></div>
          </div>
        </div>
        <div class="touristic-content-sub-container">
          <div class="touristic-content-category-container">
            <img src={touristicContentCategory.pictogram} />
            <div class="touristic-content-category-name">{touristicContentCategory.label}</div>
          </div>
          <div class="touristic-content-name">{this.touristicContent.name}</div>
        </div>
        <div class="touristic-content-more-detail-container">
          <button class="more-details-button" onClick={() => this.touristicContentCardPress.emit(this.touristicContent.id)}>
            Plus de détails
          </button>
        </div>
      </Host>
    );
  }
}
