import { Component, Host, Prop, h, Event, EventEmitter, Listen, getAssetPath, Build, State } from '@stencil/core';
import { getDataInStore } from 'services/grw-db.service';
import state from 'store/store';
import { OutdoorCourse, OutdoorSite } from 'types/types';

@Component({
  tag: 'grw-outdoor-course-card',
  styleUrl: 'grw-outdoor-course-card.scss',
  shadow: true,
})
export class GrwOutdoorCourseCard {
  @Event() outdoorCourseCardPress: EventEmitter<number>;

  @Prop() outdoorCourse: OutdoorCourse;

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() isLargeView = false;
  @Prop() isInsideHorizontalList = false;

  @Event() cardOutdoorCourseMouseOver: EventEmitter<number>;
  @Event() cardOutdoorCourseMouseLeave: EventEmitter;

  @State() offline = false;

  @Listen('mouseover')
  handleMouseOver() {
    this.cardOutdoorCourseMouseOver.emit(this.outdoorCourse.id);
  }

  @Listen('mouseleave')
  handleMouseLeave() {
    this.cardOutdoorCourseMouseLeave.emit();
  }

  async handleOffline() {
    if (state.currentOutdoorSite) {
      const outdoorSiteInStore: OutdoorSite = await getDataInStore('outdoorSites', state.currentOutdoorSite.id);
      if (outdoorSiteInStore && outdoorSiteInStore.offline) {
        const outdoorCourseInStore: OutdoorCourse = await getDataInStore('outdoorCourses', this.outdoorCourse.id);
        this.offline = Boolean(outdoorCourseInStore);
      }
    }
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    const outdoorPractice = null;
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
          'width': this.isLargeView ? '100%' : 'auto',
        }}
      >
        <div
          part="outdoor-course-card"
          class={
            this.isLargeView
              ? `outdoor-course-card outdoor-course-card-large-view-container${state.selectedOutdoorCourseId === this.outdoorCourse.id ? ' selected-outdoor-course-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
              : ` outdoor-course-card outdoor-course-card-container${state.selectedOutdoorCourseId === this.outdoorCourse.id ? ' selected-outdoor-course-card' : ''}${
                  !this.isInsideHorizontalList ? ' is-inside-vertical-list' : ''
                }`
          }
          onClick={() => {
            if (!this.isInsideHorizontalList) {
              this.outdoorCourseCardPress.emit(this.outdoorCourse.id);
            }
          }}
        >
          <div part="outdoor-course-img-container" class="outdoor-course-img-container">
            {this.outdoorCourse.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
              <img
                part="outdoor-course-img"
                class="outdoor-course-img"
                src={`${
                  this.outdoorCourse.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail !== ''
                    ? this.outdoorCourse.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail
                    : this.outdoorCourse.attachments.filter(attachment => attachment.type === 'image')[0].url
                }`}
                alt={`${this.outdoorCourse.attachments.filter(attachment => attachment.type === 'image')[0].legend}`}
                loading="lazy"
              />
            ) : (
              <img class="image default-outdoor-course-img" src={defaultImageSrc} alt="" loading="lazy" />
            )}
          </div>
          <div part="outdoor-course-sub-container" class="outdoor-course-sub-container">
            <div part="outdoor-course-practice-container" class="outdoor-course-practice-container">
              {outdoorPractice && outdoorPractice.pictogram && (
                <img
                  part="outdoor-course-type-img"
                  class="outdoor-course-type-img"
                  /* @ts-ignore */
                  src={outdoorPractice.pictogram}
                  alt=""
                />
              )}
              {outdoorPractice && outdoorPractice.name && (
                <div part="outdoor-course-practice-name" class="outdoor-course-practice-name">
                  {outdoorPractice.name}
                </div>
              )}
            </div>
            <div part="outdoor-course-name" class="outdoor-course-name">
              {this.outdoorCourse.name}
            </div>
          </div>
          {this.isInsideHorizontalList && (
            <div part="outdoor-course-more-detail-container" class="outdoor-course-more-detail-container">
              <button part="more-details-button" class="more-details-button" onClick={() => this.outdoorCourseCardPress.emit(this.outdoorCourse.id)}>
                Plus de détails
              </button>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
