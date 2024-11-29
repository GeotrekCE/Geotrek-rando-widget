import { Component, Host, Prop, h, Event, EventEmitter, Listen, getAssetPath, Build, State } from '@stencil/core';
import { getDataInStore } from 'services/grw-db.service';
import state from 'store/store';
import { SensitiveArea } from 'types/types';
import { translate } from 'i18n/i18n';

@Component({
  tag: 'grw-sensitive-area-card',
  styleUrl: 'grw-sensitive-area-card.scss',
  shadow: true,
})
export class GrwSensitiveAreaCard {
  @Event() sensitiveAreaCardPress: EventEmitter<number>;

  @Prop() sensitiveArea: SensitiveArea;

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() isLargeView = false;
  @Prop() isInsideHorizontalList = false;

  @Event() cardSensitiveAreaMouseOver: EventEmitter<number>;
  @Event() cardSensitiveAreaMouseLeave: EventEmitter;

  @State() offline = false;

  @Listen('mouseover')
  handleMouseOver() {
    this.cardSensitiveAreaMouseOver.emit(this.sensitiveArea.id);
  }

  @Listen('mouseleave')
  handleMouseLeave() {
    this.cardSensitiveAreaMouseLeave.emit();
  }

  async handleOffline() {
    if (state.currentSensitiveArea) {
      const sensitiveAreaInStore: SensitiveArea = await getDataInStore('sensitiveAreas', state.currentSensitiveArea.id);
      this.offline = sensitiveAreaInStore && sensitiveAreaInStore.offline;
    }
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const outdoorPractice = state.outdoorPractices.find(outdoorPractice => this.sensitiveArea.practices.includes(outdoorPractice.id));
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
          'width': this.isLargeView ? '100%' : 'auto',
        }}
      >
        <div
          part="sensitive-area-card"
          class={
            this.isLargeView
              ? `sensitive-area-card sensitive-area-card-large-view-container${state.selectedSensitiveAreaId === this.sensitiveArea.id ? ' selected-sensitive-area-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
              : ` sensitive-area-card sensitive-area-card-container${state.selectedSensitiveAreaId === this.sensitiveArea.id ? ' selected-sensitive-area-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
          }
          onClick={() => {
            if (!this.isInsideHorizontalList) {
              this.sensitiveAreaCardPress.emit(this.sensitiveArea.id);
            }
          }}
        >
          <div part="sensitive-area-img-container" class="sensitive-area-img-container">
            {this.sensitiveArea.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
              <img
                part="sensitive-area-img"
                class="sensitive-area-img"
                src={`${
                  this.sensitiveArea.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail !== ''
                    ? this.sensitiveArea.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail
                    : this.sensitiveArea.attachments.filter(attachment => attachment.type === 'image')[0].url
                }`}
                alt={`${this.sensitiveArea.attachments.filter(attachment => attachment.type === 'image')[0].legend}`}
                loading="lazy"
              />
            ) : (
              <img class="image default-sensitive-area-img" src={defaultImageSrc} alt="" loading="lazy" />
            )}
          </div>
          <div part="sensitive-area-sub-container" class="sensitive-area-sub-container">
            <div part="sensitive-area-practice-container" class="sensitive-area-practice-container">
              {outdoorPractice && outdoorPractice.pictogram && (
                <img
                  part="sensitive-area-type-img"
                  class="sensitive-area-type-img"
                  /* @ts-ignore */
                  src={outdoorPractice.pictogram}
                  alt=""
                />
              )}
              {outdoorPractice && outdoorPractice.name && (
                <div part="sensitive-area-practice-name" class="sensitive-area-practice-name">
                  {outdoorPractice.name}
                </div>
              )}
            </div>
            <div part="sensitive-area-name" class="sensitive-area-name">
              {this.sensitiveArea.name}
            </div>
          </div>
          {this.isInsideHorizontalList && (
            <div part="sensitive-area-more-detail-container" class="sensitive-area-more-detail-container">
              <button part="more-details-button" class="more-details-button" onClick={() => this.sensitiveAreaCardPress.emit(this.sensitiveArea.id)}>
                {translate[state.language].moreDetails}
              </button>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
