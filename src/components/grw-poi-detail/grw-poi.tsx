import { Component, Host, h, Prop, State, Build, getAssetPath } from '@stencil/core';
import Swiper, { Navigation, Pagination, Keyboard } from 'swiper';
import state from 'store/store';
import { Poi } from 'types/types';
import { translate } from 'i18n/i18n';

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

  componentDidLoad() {
    this.swiperPoi = new Swiper(this.swiperPoiRef, {
      modules: [Navigation, Pagination, Keyboard],
      navigation: {
        prevEl: this.prevElPoiRef,
        nextEl: this.nextElPoiRef,
      },
      pagination: { el: this.paginationElPoiRef },
      allowTouchMove: false,
      keyboard: false,
    });
    this.swiperPoiRef.onfullscreenchange = () => {
      this.displayFullscreen = !this.displayFullscreen;
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

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    return (
      <Host>
        <div part="poi-type-img-container" class="poi-type-img-container">
          <img
            part="poi-type"
            class="poi-type"
            /* @ts-ignore */
            crossorigin="anonymous"
            src={`${state.poiTypes.find(poiType => poiType.id === this.poi.type)?.pictogram}`}
          />
          <div part="swiper-poi" class="swiper swiper-poi" ref={el => (this.swiperPoiRef = el)}>
            <div part="swiper-wrapper" class="swiper-wrapper">
              {this.poi.attachments.length > 0 ? (
                this.poi.attachments
                  .filter(attachment => attachment.type === 'image')
                  .map(attachment => (
                    <div part="swiper-slide" class="swiper-slide">
                      <img
                        part="poi-img"
                        class={`poi-img${this.displayFullscreen ? ' img-fullscreen' : ''}`}
                        src={this.displayFullscreen ? attachment.url : attachment.thumbnail}
                        loading="lazy"
                        onClick={() => this.handleFullscreen()}
                      />
                    </div>
                  ))
              ) : (
                <div part="swiper-slide" class="swiper-slide">
                  <img
                    part="default-poi-img"
                    class="default-poi-img"
                    /* @ts-ignore */
                    crossorigin="anonymous"
                    src={defaultImageSrc}
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            <div part="swiper-pagination" class="swiper-pagination" ref={el => (this.paginationElPoiRef = el)}></div>
            <div part="swiper-button-prev" class="swiper-button-prev" ref={el => (this.prevElPoiRef = el)}></div>
            <div part="swiper-button-next" class="swiper-button-next" ref={el => (this.nextElPoiRef = el)}></div>
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
