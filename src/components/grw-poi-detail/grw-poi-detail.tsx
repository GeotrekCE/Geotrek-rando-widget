import { Component, Host, h, Prop, State, Build, getAssetPath } from '@stencil/core';
import Swiper, { Navigation, Pagination, Keyboard } from 'swiper';
import state from 'store/store';
import { Poi } from 'types/types';

@Component({
  tag: 'grw-poi-detail',
  styleUrl: 'grw-poi-detail.scss',
  shadow: true,
})
export class GrwPoiDetail {
  swiper?: Swiper;
  swiperRef?: HTMLDivElement;
  prevElRef?: HTMLDivElement;
  nextElRef?: HTMLDivElement;
  paginationElRef?: HTMLDivElement;
  @Prop() poi: Poi;
  @State() displayShortDescription = true;
  @State() displayFullscreen = false;

  componentDidLoad() {
    this.swiper = new Swiper(this.swiperRef, {
      modules: [Navigation, Pagination, Keyboard],
      navigation: {
        prevEl: this.prevElRef,
        nextEl: this.nextElRef,
      },
      pagination: { el: this.paginationElRef },
      allowTouchMove: false,
      keyboard: false,
    });
    this.swiperRef.onfullscreenchange = () => {
      this.displayFullscreen = !this.displayFullscreen;
      if (this.displayFullscreen) {
        this.swiper.keyboard.enable();
      } else {
        this.swiper.keyboard.disable();
      }
    };
  }

  handlePoiDescription() {
    this.displayShortDescription = !this.displayShortDescription;
  }

  handleFullscreen() {
    if (this.poi.attachments && this.poi.attachments[0] && this.poi.attachments[0].thumbnail) {
      this.swiperRef.requestFullscreen();
    }
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    return (
      <Host>
        <div class="poi-type-img-container">
          <img class="poi-type" src={`${state.poiTypes.find(poiType => poiType.id === this.poi.type)?.pictogram}`} />
          <div class="swiper" ref={el => (this.swiperRef = el)}>
            <div class="swiper-wrapper">
              {this.poi.attachments.length > 0 ? (
                this.poi.attachments.map(attachment => (
                  <div class="swiper-slide">
                    <img class="poi-img" src={this.displayFullscreen ? attachment.url : attachment.thumbnail} loading="lazy" onClick={() => this.handleFullscreen()} />
                  </div>
                ))
              ) : (
                <div class="swiper-slide">
                  <img class="poi-default-img" src={defaultImageSrc} loading="lazy" />
                </div>
              )}
            </div>
            <div class="swiper-pagination" ref={el => (this.paginationElRef = el)}></div>
            <div class="swiper-button-prev" ref={el => (this.prevElRef = el)}></div>
            <div class="swiper-button-next" ref={el => (this.nextElRef = el)}></div>
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
