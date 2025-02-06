import { Component, Host, h, Element, State, Prop } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state, { onChange } from 'store/store';
import { SensitiveAreas } from 'types/types';
@Component({
  tag: 'grw-sensitive-areas-list',
  styleUrl: 'grw-sensitive-areas-list.scss',
  shadow: true,
})
export class GrwSensitiveAreasList {
  @Element() element: HTMLElement;
  @State() sensitiveAreasToDisplay: SensitiveAreas = [];

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() isLargeView = false;

  step = 10;
  shouldAddInfiniteScrollEvent = true;

  handleInfiniteScrollBind: (event: any) => void = this.handleInfiniteScroll.bind(this);

  connectedCallback() {
    this.handleInfiniteScrollEvent(true);
    if (state.currentSensitiveAreas) {
      this.sensitiveAreasToDisplay = [...state.currentSensitiveAreas.slice(0, this.step)];
    }
    onChange('currentOutdoorSites', () => {
      this.handleInfiniteScrollEvent(true);
      this.element.scroll({ top: 0 });
      if (state.currentSensitiveAreas) {
        this.sensitiveAreasToDisplay = [...state.currentSensitiveAreas.slice(0, this.step)];
      }
    });
    onChange('sensitiveAreasWithinBounds', () => {
      this.handleInfiniteScrollEvent(true);
      this.element.scroll({ top: 0 });
      if (state.sensitiveAreasWithinBounds) {
        this.sensitiveAreasToDisplay = [...state.sensitiveAreasWithinBounds.slice(0, this.step)];
      }
    });
  }

  handleInfiniteScroll(event: any) {
    if (event.composedPath()[0].scrollTop + event.composedPath()[0].scrollHeight / 2 >= event.composedPath()[0].scrollHeight) {
      console.log('state.sensitiveAreasWithinBounds', state.sensitiveAreasWithinBounds)
      if (this.sensitiveAreasToDisplay.length < state.sensitiveAreasWithinBounds.length) {
        this.sensitiveAreasToDisplay = state.sensitiveAreasWithinBounds.slice(
          0,
          this.sensitiveAreasToDisplay.length + this.step >= state.sensitiveAreasWithinBounds.length
            ? state.sensitiveAreasWithinBounds.length
            : this.sensitiveAreasToDisplay.length + this.step,
        );
      } else {
        this.handleInfiniteScrollEvent(false);
      }
    }
  }

  handleInfiniteScrollEvent(shouldAddInfiniteScrollEvent: boolean) {
    if (shouldAddInfiniteScrollEvent) {
      if (this.shouldAddInfiniteScrollEvent) {
        this.element.addEventListener('scroll', this.handleInfiniteScrollBind);
        this.shouldAddInfiniteScrollEvent = !shouldAddInfiniteScrollEvent;
      }
    } else {
      this.element.removeEventListener('scroll', this.handleInfiniteScrollBind);
      this.shouldAddInfiniteScrollEvent = !shouldAddInfiniteScrollEvent;
    }
  }

  disconnectedCallback() {
    this.handleInfiniteScrollEvent(false);
  }

  render() {
    console.debug('state.sensitiveAreasWithinBounds',state.sensitiveAreasWithinBounds)
    return (
      <Host style={{ '--font-family': this.fontFamily, '--color-primary-app': this.colorPrimaryApp }}>
        {state.sensitiveAreasWithinBounds && (
          <div part="current-sensitive-areas-within-bounds-length" class="current-sensitive-areas-within-bounds-length">{`${state.sensitiveAreasWithinBounds.length} ${
            state.sensitiveAreasWithinBounds.length > 1 ? translate[state.language].sensitiveAreas : translate[state.language].sensitiveArea
          }`}</div>
        )}
        {<div part="sensitive-areas-list-container" class="sensitive-areas-list-container">
          {this.sensitiveAreasToDisplay.map(sensitiveArea => (
            <grw-sensitive-area-card
              sensitiveArea={sensitiveArea}
              exportparts="sensitive-area-card,sensitive-area-img-container,sensitive-area-img,sensitive-area-sub-container,sensitive-area-departure,sensitive-area-name,sensitive-area-themes-container,sensitive-area-theme,sensitive-area-icons-labels-container,sensitive-area-icon-label,sensitive-area-icon,sensitive-area-label"
              key={`sensitiveArea-${sensitiveArea.id}`}
              is-large-view={this.isLargeView}
              fontFamily={this.fontFamily}
              color-primary-app={this.colorPrimaryApp}
              color-on-surface={this.colorOnSurface}
              color-secondary-container={this.colorSecondaryContainer}
              color-on-secondary-container={this.colorOnSecondaryContainer}
              color-surface-container-low={this.colorSurfaceContainerLow}
            ></grw-sensitive-area-card>
          ))}
        </div>}
        <div part="list-bottom-space" class={!this.isLargeView ? 'list-bottom-space' : 'list-large-view-bottom-space'}></div>
      </Host>
    );
  }
}
