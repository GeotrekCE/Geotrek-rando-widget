import { Build, Component, Host, getAssetPath, h, State, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state from 'store/store';
import Swiper, { Keyboard, Navigation, Pagination } from 'swiper';
import { TouristicEvent } from 'types/types';

@Component({
  tag: 'grw-touristic-event-card',
  styleUrl: 'grw-touristic-event-card.scss',
  shadow: true,
})
export class GrwTouristicEvent {
  @Event() touristicEventCardPress: EventEmitter<number>;
  swiperTouristicEvent?: Swiper;
  swiperTouristicEventRef?: HTMLDivElement;
  prevElTouristicEventRef?: HTMLDivElement;
  nextElTouristicEventRef?: HTMLDivElement;
  paginationElTouristicEventRef?: HTMLDivElement;

  @Prop() fontFamily = 'Roboto';

  @Prop() touristicEvent: TouristicEvent;
  @Prop() isLargeView = false;
  @Prop() isInsideHorizontalList = false;
  @State() displayFullscreen = false;

  @Event() cardTouristicEventMouseOver: EventEmitter<number>;
  @Event() cardTouristicEventMouseLeave: EventEmitter;

  componentDidLoad() {
    if (this.swiperTouristicEventRef) {
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
  }

  handleFullscreen() {
    if (this.touristicEvent.attachments && this.touristicEvent.attachments[0] && this.touristicEvent.attachments[0].url) {
      this.swiperTouristicEventRef.requestFullscreen();
    }
  }

  @Listen('mouseover')
  handleMouseOver() {
    this.cardTouristicEventMouseOver.emit(this.touristicEvent.id);
  }

  @Listen('mouseleave')
  handleMouseLeave() {
    this.cardTouristicEventMouseLeave.emit();
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const touristicEventType = state.touristicEventTypes.find(touristicEventType => touristicEventType.id === this.touristicEvent.type);
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
              ? `touristic-event-card-large-view-container${state.selectedTouristicEventId === this.touristicEvent.id ? ' selected-touristic-event-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
              : `touristic-event-card-container${state.selectedTouristicEventId === this.touristicEvent.id ? ' selected-touristic-event-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
          }
          onClick={() => {
            if (!this.isInsideHorizontalList) {
              this.touristicEventCardPress.emit(this.touristicEvent.id);
            }
          }}
        >
          <div class="touristic-event-img-container">
            {this.isInsideHorizontalList ? (
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
                      <img
                        /* @ts-ignore */
                        crossorigin="anonymous"
                        class="default-touristic-event-img"
                        src={defaultImageSrc}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
                <div class="swiper-pagination" ref={el => (this.paginationElTouristicEventRef = el)}></div>
                <div class="swiper-button-prev" ref={el => (this.prevElTouristicEventRef = el)}></div>
                <div class="swiper-button-next" ref={el => (this.nextElTouristicEventRef = el)}></div>
              </div>
            ) : this.touristicEvent.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
              <img
                /* @ts-ignore */
                crossorigin="anonymous"
                class="image"
                src={`${this.touristicEvent.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail}`}
                loading="lazy"
              />
            ) : (
              <div></div>
            )}
          </div>
          <div class="touristic-event-sub-container">
            <div class="touristic-event-type-container">
              {touristicEventType && touristicEventType.pictogram && (
                <img
                  /* @ts-ignore */
                  crossorigin="anonymous"
                  src={touristicEventType.pictogram}
                />
              )}
              <div class="touristic-event-type-name">{touristicEventType.type}</div>
            </div>
            <div class="touristic-event-name">{this.touristicEvent.name}</div>
            {(this.touristicEvent.begin_date || this.touristicEvent.end_date) && (
              <div class="touristic-event-date-container">
                {this.touristicEvent.begin_date === this.touristicEvent.end_date && (
                  <div class="touristic-event-date">
                    {translate[state.language].date} : {this.touristicEvent.begin_date}
                  </div>
                )}
                {this.touristicEvent.begin_date && this.touristicEvent.begin_date !== this.touristicEvent.end_date && (
                  <div class="touristic-event-date">
                    {translate[state.language].startDate} : {this.touristicEvent.begin_date}
                  </div>
                )}
                {this.touristicEvent.end_date && this.touristicEvent.begin_date !== this.touristicEvent.end_date && (
                  <div class="touristic-event-date">
                    {translate[state.language].endDate} : {this.touristicEvent.end_date}
                  </div>
                )}
              </div>
            )}
          </div>

          {this.isInsideHorizontalList && (
            <div class="touristic-event-more-detail-container">
              <button class="more-details-button" onClick={() => this.touristicEventCardPress.emit(this.touristicEvent.id)}>
                Plus de détails
              </button>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
