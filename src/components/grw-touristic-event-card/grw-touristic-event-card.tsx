import { Build, Component, Host, getAssetPath, h, State, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { translate } from 'i18n/i18n';
import { getDataInStore } from 'services/grw-db.service';
import state from 'store/store';
import Swiper, { Keyboard, Navigation, Pagination } from 'swiper';
import { OutdoorSite, TouristicEvent, Trek } from 'types/types';

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

  @State() offline = false;

  @Listen('trekDownloadedSuccessConfirm', { target: 'window' })
  onTrekDownloadedSuccessConfirm() {
    if (this.swiperTouristicEvent) {
      this.swiperTouristicEvent.slideTo(0);
    }
    this.offline = true;
  }

  @Listen('trekDeleteSuccessConfirm', { target: 'window' })
  onTrekDeleteSuccessConfirm() {
    this.offline = false;
  }

  componentDidLoad() {
    this.handleOffline();
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
        loop: true,
      });
      this.swiperTouristicEventRef.onfullscreenchange = () => {
        this.displayFullscreen = !this.displayFullscreen && !this.offline;
        if (this.displayFullscreen) {
          this.swiperTouristicEvent.keyboard.enable();
        } else {
          this.swiperTouristicEvent.keyboard.disable();
        }
      };
    }
  }

  async handleOffline() {
    if (state.currentTrek) {
      const trekInStore: Trek = await getDataInStore('treks', state.currentTrek.id);
      if (trekInStore && trekInStore.offline) {
        const touristicEventInStore: TouristicEvent = await getDataInStore('touristicEvents', this.touristicEvent.id);
        this.offline = trekInStore && trekInStore.offline && touristicEventInStore && touristicEventInStore.offline;
      }
    } else if (state.currentOutdoorSite) {
      const outdoorSiteInStore: OutdoorSite = await getDataInStore('outdoorSites', state.currentOutdoorSite.id);
      if (outdoorSiteInStore && outdoorSiteInStore.offline) {
        const touristicEventInStore: TouristicEvent = await getDataInStore('touristicEvents', this.touristicEvent.id);
        this.offline = touristicEventInStore && touristicEventInStore.offline;
      }
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
          part="touristic-event-card"
          class={
            this.isLargeView
              ? `touristic-event-card touristic-event-card-large-view-container${
                  state.selectedTouristicEventId === this.touristicEvent.id ? ' selected-touristic-event-card' : ''
                }${!this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''}`
              : ` touristic-event-card touristic-event-card-container${state.selectedTouristicEventId === this.touristicEvent.id ? ' selected-touristic-event-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
          }
          onClick={() => {
            if (!this.isInsideHorizontalList) {
              this.touristicEventCardPress.emit(this.touristicEvent.id);
            }
          }}
        >
          <div part="touristic-event-img-container" class="touristic-event-img-container">
            {this.isInsideHorizontalList ? (
              <div part="swiper-touristic-event" class="swiper swiper-touristic-event" ref={el => (this.swiperTouristicEventRef = el)}>
                <div part="swiper-wrapper" class="swiper-wrapper">
                  {this.touristicEvent.attachments.length > 0 ? (
                    this.touristicEvent.attachments
                      .filter(attachment => attachment.type === 'image')
                      .map(attachment => (
                        <div part="swiper-slide" class="swiper-slide">
                          <img
                            part="touristic-event-img"
                            class={`touristic-event-img${this.displayFullscreen ? ' img-fullscreen' : ''}`}
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
                        class="default-touristic-event-img"
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
                  ref={el => (this.paginationElTouristicEventRef = el)}
                ></div>
                <div style={{ display: this.offline ? 'none' : 'flex' }} part="swiper-button-prev" class="swiper-button-prev" ref={el => (this.prevElTouristicEventRef = el)}></div>
                <div style={{ display: this.offline ? 'none' : 'flex' }} part="swiper-button-next" class="swiper-button-next" ref={el => (this.nextElTouristicEventRef = el)}></div>
              </div>
            ) : this.touristicEvent.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
              <img
                part="touristic-event-img"
                class="touristic-event-img"
                /* @ts-ignore */

                src={`${this.touristicEvent.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail}`}
                alt={`${this.touristicEvent.attachments.filter(attachment => attachment.type === 'image')[0].legend}`}
                loading="lazy"
              />
            ) : (
              <img class="image default-touristic-event-img" src={defaultImageSrc} alt="" loading="lazy" />
            )}
          </div>
          <div part="touristic-event-sub-container" class="touristic-event-sub-container">
            <div part="touristic-event-type-container" class="touristic-event-type-container">
              {touristicEventType && touristicEventType.pictogram && (
                <img
                  part="touristic-event-type-img"
                  class="touristic-event-type-img"
                  /* @ts-ignore */

                  src={touristicEventType.pictogram}
                  alt=""
                />
              )}
              {touristicEventType && touristicEventType.type && (
                <div part="touristic-event-type-name" class="touristic-event-type-name">
                  {touristicEventType.type}
                </div>
              )}
            </div>
            <div part="touristic-event-name" class="touristic-event-name">
              {this.touristicEvent.name}
            </div>
            {(this.touristicEvent.begin_date || this.touristicEvent.end_date) && (
              <div part="touristic-event-date-container" class="touristic-event-date-container">
                {this.touristicEvent.begin_date === this.touristicEvent.end_date && (
                  <div part="touristic-event-date" class="touristic-event-date">
                    {translate[state.language].date} : {this.touristicEvent.begin_date}
                  </div>
                )}
                {this.touristicEvent.begin_date && this.touristicEvent.begin_date !== this.touristicEvent.end_date && (
                  <div part="touristic-event-date" class="touristic-event-date">
                    {translate[state.language].startDate} : {this.touristicEvent.begin_date}
                  </div>
                )}
                {this.touristicEvent.end_date && this.touristicEvent.begin_date !== this.touristicEvent.end_date && (
                  <div part="touristic-event-date" class="touristic-event-date">
                    {translate[state.language].endDate} : {this.touristicEvent.end_date}
                  </div>
                )}
              </div>
            )}
          </div>

          {this.isInsideHorizontalList && (
            <div part="touristic-event-more-detail-container" class="touristic-event-more-detail-container">
              <button part="more-details-button" class="more-details-button" onClick={() => this.touristicEventCardPress.emit(this.touristicEvent.id)}>
                Plus de détails
              </button>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
