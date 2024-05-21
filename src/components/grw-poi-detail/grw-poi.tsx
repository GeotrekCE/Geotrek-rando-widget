import { Component, Host, h, Prop, State, Build, getAssetPath, Listen } from '@stencil/core';
import Swiper, { Navigation, Pagination, Keyboard } from 'swiper';
import state from 'store/store';
import { OutdoorSite, Poi, Trek } from 'types/types';
import { translate } from 'i18n/i18n';
import { getDataInStore } from 'services/grw-db.service';

@Component({
  tag: 'grw-poi',
  styleUrl: 'grw-poi.scss',
  shadow: true,
})
export class GrwPoiDetail {
  swiperPoi?: Swiper;
  swiperPoiRef?: HTMLDivElement;
  prevElPoiRef?: HTMLDivElement;
  nextElPoiRef?: HTMLDivElement;
  paginationElPoiRef?: HTMLDivElement;
  descriptionRef?: HTMLDivElement;

  @Prop() poi: Poi;
  @State() displayShortDescription = true;
  @State() showPoiDescriptionButton = false;
  @State() displayFullscreen = false;

  @State() offline = false;

  @Listen('trekDownloadedSuccessConfirm', { target: 'window' })
  onTrekDownloadedSuccessConfirm() {
    if (this.swiperPoi) {
      this.swiperPoi.slideTo(0);
    }
    this.offline = true;
  }

  @Listen('trekDeleteSuccessConfirm', { target: 'window' })
  onTrekDeleteSuccessConfirm() {
    this.offline = false;
  }

  componentDidLoad() {
    this.handleOffline();
    this.swiperPoi = new Swiper(this.swiperPoiRef, {
      modules: [Navigation, Pagination, Keyboard],
      navigation: {
        prevEl: this.prevElPoiRef,
        nextEl: this.nextElPoiRef,
      },
      pagination: { el: this.paginationElPoiRef },
      allowTouchMove: false,
      keyboard: false,
      loop: true,
    });
    this.swiperPoiRef.onfullscreenchange = () => {
      this.displayFullscreen = !this.displayFullscreen && !this.offline;
      if (this.displayFullscreen) {
        this.swiperPoi.keyboard.enable();
      } else {
        this.swiperPoi.keyboard.disable();
      }
    };
    this.showPoiDescriptionButton = this.descriptionRef.clientHeight < this.descriptionRef.scrollHeight;
  }

  handlePoiDescription() {
    this.displayShortDescription = !this.displayShortDescription;
  }

  handleFullscreen() {
    if (this.poi.attachments && this.poi.attachments[0] && this.poi.attachments[0].url) {
      this.swiperPoiRef.requestFullscreen();
    }
  }

  async handleOffline() {
    if (state.currentTrek) {
      const trekInStore: Trek = await getDataInStore('treks', state.currentTrek.id);
      const poiInStore: Poi = await getDataInStore('pois', this.poi.id);
      if (trekInStore && trekInStore.offline) {
        this.offline = Boolean(poiInStore);
      }
    } else if (state.currentOutdoorSite) {
      const outdoorSiteInStore: OutdoorSite = await getDataInStore('outdoorSites', state.currentOutdoorSite.id);
      if (outdoorSiteInStore && outdoorSiteInStore.offline) {
        const poiInStore: Poi = await getDataInStore('pois', this.poi.id);
        this.offline = Boolean(poiInStore);
      }
    }
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    return (
      <Host>
        <div part="poi-type-img-container" class="poi-type-img-container">
          <img part="poi-type" class="poi-type" src={`${state.poiTypes.find(poiType => poiType.id === this.poi.type)?.pictogram}`} alt="" />
          <div part="swiper-poi" class="swiper swiper-poi" ref={el => (this.swiperPoiRef = el)}>
            <div part="swiper-wrapper" class="swiper-wrapper">
              {this.poi.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
                this.poi.attachments
                  .filter(attachment => attachment.type === 'image')
                  .map(attachment => (
                    <div part="swiper-slide" class="swiper-slide">
                      <img
                        part="poi-iamg"
                        class={`poi-img${this.displayFullscreen ? ' img-fullscreen' : ''}`}
                        src={this.displayFullscreen ? attachment.url : attachment.thumbnail}
                        alt={attachment.legend}
                        loading="lazy"
                        /* @ts-ignore */
                        onerror={event => {
                          event.target.onerror = null;
                          event.target.className = 'default-poi-img';
                          event.target.src = defaultImageSrc;
                        }}
                        onClick={() => this.handleFullscreen()}
                      />
                    </div>
                  ))
              ) : (
                <div part="swiper-slide" class="swiper-slide">
                  <img part="default-poi-img" class="default-poi-img" src={defaultImageSrc} alt="" loading="lazy" />
                </div>
              )}
            </div>
            <div
              style={{ display: this.offline || this.poi.attachments.filter(attachment => attachment.type === 'image').length <= 1 ? 'none' : 'block' }}
              part="swiper-pagination"
              class="swiper-pagination"
              ref={el => (this.paginationElPoiRef = el)}
            ></div>
            <div
              style={{ display: this.offline || this.poi.attachments.filter(attachment => attachment.type === 'image').length <= 1 ? 'none' : 'flex' }}
              part="swiper-button-prev"
              class="swiper-button-prev"
              ref={el => (this.prevElPoiRef = el)}
            ></div>
            <div
              style={{ display: this.offline || this.poi.attachments.filter(attachment => attachment.type === 'image').length <= 1 ? 'none' : 'flex' }}
              part="swiper-button-next"
              class="swiper-button-next"
              ref={el => (this.nextElPoiRef = el)}
            ></div>
          </div>
        </div>
        <div part="poi-sub-container" class="poi-sub-container">
          <div part="poi-name" class="poi-name">
            {this.poi.name}
          </div>
          <div
            part="poi-description"
            class={this.displayShortDescription ? 'poi-description poi-description-short' : 'poi-description'}
            innerHTML={this.poi.description}
            ref={el => (this.descriptionRef = el)}
          ></div>
          <div part="handle-poi-description" class="handle-poi-description" onClick={() => this.handlePoiDescription()}>
            {this.showPoiDescriptionButton && (this.displayShortDescription ? translate[state.language].readMore : translate[state.language].readLess)}
          </div>
        </div>
      </Host>
    );
  }
}
