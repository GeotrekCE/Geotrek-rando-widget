import { Component, Host, Prop, h, Event, EventEmitter, Listen, getAssetPath, Build } from '@stencil/core';
import state from 'store/store';
import { OutdoorSite } from 'types/types';

@Component({
  tag: 'grw-outdoor-site-card',
  styleUrl: 'grw-outdoor-site-card.scss',
  shadow: true,
})
export class GrwOutdoorSiteCard {
  @Event() outdoorSiteCardPress: EventEmitter<number>;

  @Prop() outdoorSite: OutdoorSite;

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() isLargeView = false;
  @Prop() isInsideHorizontalList = false;

  @Event() cardOutdoorSiteMouseOver: EventEmitter<number>;
  @Event() cardOutdoorSiteMouseLeave: EventEmitter;

  @Listen('mouseover')
  handleMouseOver() {
    this.cardOutdoorSiteMouseOver.emit(this.outdoorSite.id);
  }

  @Listen('mouseleave')
  handleMouseLeave() {
    this.cardOutdoorSiteMouseLeave.emit();
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const outdoorPractice = state.outdoorPractices.find(outdoorPractice => outdoorPractice.id === this.outdoorSite.practice);
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
          'width': this.isLargeView ? '100%' : 'auto',
        }}
      >
        <div
          part="outdoor-site-card"
          class={
            this.isLargeView
              ? `outdoor-site-card outdoor-site-card-large-view-container${state.selectedOutdoorSiteId === this.outdoorSite.id ? ' selected-outdoor-site-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
              : ` outdoor-site-card outdoor-site-card-container${state.selectedOutdoorSiteId === this.outdoorSite.id ? ' selected-outdoor-site-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
          }
          onClick={() => {
            if (!this.isInsideHorizontalList) {
              this.outdoorSiteCardPress.emit(this.outdoorSite.id);
            }
          }}
        >
          <div part="outdoor-site-img-container" class="outdoor-site-img-container">
            {this.outdoorSite.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
              <img
                part="outdoor-site-img"
                class="outdoor-site-img"
                /* @ts-ignore */

                src={`${this.outdoorSite.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail}`}
                alt={`${this.outdoorSite.attachments.filter(attachment => attachment.type === 'image')[0].legend}`}
                loading="lazy"
              />
            ) : (
              <img class="image default-outdoor-site-img" src={defaultImageSrc} alt="" loading="lazy" />
            )}
          </div>
          <div part="outdoor-site-sub-container" class="outdoor-site-sub-container">
            <div part="outdoor-site-practice-container" class="outdoor-site-practice-container">
              {outdoorPractice && outdoorPractice.pictogram && (
                <img
                  part="outdoor-site-type-img"
                  class="outdoor-site-type-img"
                  /* @ts-ignore */
                  src={outdoorPractice.pictogram}
                  alt=""
                />
              )}
              {outdoorPractice && outdoorPractice.name && (
                <div part="outdoor-site-practice-name" class="outdoor-site-practice-name">
                  {outdoorPractice.name}
                </div>
              )}
            </div>
            <div part="outdoor-site-name" class="outdoor-site-name">
              {this.outdoorSite.name}
            </div>
            {state.themes && state.themes.filter(theme => this.outdoorSite.themes.includes(theme.id)).length > 0 && (
              <div part="themes-container" class="themes-container">
                {state.themes
                  .filter(theme => this.outdoorSite.themes.includes(theme.id))
                  .map(theme => (
                    <div part="theme" class="theme">
                      {theme.label}
                    </div>
                  ))}
              </div>
            )}
          </div>
          {this.isInsideHorizontalList && (
            <div part="outdoor-site-more-detail-container" class="outdoor-site-more-detail-container">
              <button part="more-details-button" class="more-details-button" onClick={() => this.outdoorSiteCardPress.emit(this.outdoorSite.id)}>
                Plus de détails
              </button>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
