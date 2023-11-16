import { Build, Component, Host, getAssetPath, h, State, Prop, Event, EventEmitter } from '@stencil/core';
import state from 'store/store';
import Swiper, { Keyboard, Navigation, Pagination } from 'swiper';
import { TouristicEvent } from 'types/types';

@Component({
  tag: 'grw-touristic-event',
  styleUrl: 'grw-touristic-event.scss',
  shadow: true,
})
export class GrwTouristicEvent {
  @Event() touristicEventCardPress: EventEmitter<number>;
  swiperTouristicEvent?: Swiper;
  swiperTouristicEventRef?: HTMLDivElement;
  prevElTouristicEventRef?: HTMLDivElement;
  nextElTouristicEventRef?: HTMLDivElement;
  paginationElTouristicEventRef?: HTMLDivElement;
  @Prop() touristicEvent: TouristicEvent;
  @State() displayFullscreen = false;

  componentDidLoad() {
    this.swiperTouristicEvent = new Swiper(this.swiperTouristicEventRef, {
      modules: [Navigation, Pagination, Keyboard],
      navigation: {
        prevEl: this.prevElTouristicEventRef,
        nextEl: this.nextElTouristicEventRef,
      },
      pagination: { el: this.paginationElTouristicEventRef },
      allowTouchMove: false,
      keyboard: false,
    });
    this.swiperTouristicEventRef.onfullscreenchange = () => {
      this.displayFullscreen = !this.displayFullscreen;
      if (this.displayFullscreen) {
        this.swiperTouristicEvent.keyboard.enable();
      } else {
        this.swiperTouristicEvent.keyboard.disable();
      }
    };
  }

  handleFullscreen() {
    if (this.touristicEvent.attachments && this.touristicEvent.attachments[0] && this.touristicEvent.attachments[0].url) {
      this.swiperTouristicEventRef.requestFullscreen();
    }
  }
  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const touristicEventTypes = state.touristicEventTypes.find(touristicEventType => touristicEventType.id === this.touristicEvent.type);
    return (
      <Host>
        <div class="touristic-event-type-img-container">
          <div class="swiper" ref={el => (this.swiperTouristicEventRef = el)}>
            <div class="swiper-wrapper">
              {this.touristicEvent.attachments.length > 0 ? (
                this.touristicEvent.attachments
                  .filter(attachment => attachment.type === 'image')
                  .map(attachment => (
                    <div class="swiper-slide">
                      <img
                        class={`touristic-event-img${this.displayFullscreen ? ' img-fullscreen' : ''}`}
                        src={this.displayFullscreen ? attachment.url : attachment.thumbnail}
                        loading="lazy"
                        onClick={() => this.handleFullscreen()}
                      />
                    </div>
                  ))
              ) : (
                <div class="swiper-slide">
                  <img class="default-touristic-event-img" src={defaultImageSrc} loading="lazy" />
                </div>
              )}
            </div>
            <div class="swiper-pagination" ref={el => (this.paginationElTouristicEventRef = el)}></div>
            <div class="swiper-button-prev" ref={el => (this.prevElTouristicEventRef = el)}></div>
            <div class="swiper-button-next" ref={el => (this.nextElTouristicEventRef = el)}></div>
          </div>
        </div>
        <div class="touristic-event-sub-container">
          <div class="touristic-event-type-container">
            <img src={touristicEventTypes.pictogram} />
            <div class="touristic-event-type-name">{touristicEventTypes.type}</div>
          </div>
          <div class="touristic-event-name">{this.touristicEvent.name}</div>
        </div>
        <div class="touristic-event-more-detail-container">
          <button class="more-details-button" onClick={() => this.touristicEventCardPress.emit(this.touristicEvent.id)}>
            Plus de détails
          </button>
        </div>
      </Host>
    );
  }
}
