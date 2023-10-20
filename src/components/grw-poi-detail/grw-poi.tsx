import { Component, Host, h, Prop, State, Build, getAssetPath } from '@stencil/core';
import Swiper, { Navigation, Pagination, Keyboard } from 'swiper';
import state from 'store/store';
import { Poi } from 'types/types';

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
  @Prop() poi: Poi;
  @State() displayShortDescription = true;
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
        <div class="poi-type-img-container">
          <img class="poi-type" src={`${state.poiTypes.find(poiType => poiType.id === this.poi.type)?.pictogram}`} />
          <div class="swiper" ref={el => (this.swiperPoiRef = el)}>
            <div class="swiper-wrapper">
              {this.poi.attachments.length > 0 ? (
                this.poi.attachments
                  .filter(attachment => attachment.type === 'image')
                  .map(attachment => (
                    <div class="swiper-slide">
                      <img
                        class={`poi-img${this.displayFullscreen ? ' img-fullscreen' : ''}`}
                        src={this.displayFullscreen ? attachment.url : attachment.thumbnail}
                        loading="lazy"
                        onClick={() => this.handleFullscreen()}
                      />
                    </div>
                  ))
              ) : (
                <div class="swiper-slide">
                  <img class="default-poi-img" src={defaultImageSrc} loading="lazy" />
                </div>
              )}
            </div>
            <div class="swiper-pagination" ref={el => (this.paginationElPoiRef = el)}></div>
            <div class="swiper-button-prev" ref={el => (this.prevElPoiRef = el)}></div>
            <div class="swiper-button-next" ref={el => (this.nextElPoiRef = el)}></div>
          </div>
        </div>
        <div class="poi-sub-container">
          <div class="poi-name">{this.poi.name}</div>
          <div class={this.displayShortDescription ? 'poi-description-short' : 'poi-description'} innerHTML={this.poi.description}></div>
          <div class="handle-poi-description" onClick={() => this.handlePoiDescription()}>
            {this.displayShortDescription ? 'Lire plus' : 'Lire moins'}
          </div>
        </div>
      </Host>
    );
  }
}
