import { Component, Host, h, Element, State, Prop } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state, { onChange } from 'store/store';
import { TouristicContents } from 'types/types';

@Component({
  tag: 'grw-touristic-contents-list',
  styleUrl: 'grw-touristic-contents-list.scss',
  shadow: true,
})
export class GrwTouristicContentsList {
  @Element() element: HTMLElement;
  @State() touristicContentsToDisplay: TouristicContents = [];

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
    if (state.currentTouristicContents) {
      this.touristicContentsToDisplay = [...state.currentTouristicContents.slice(0, this.step)];
    }
    onChange('currentTouristicContents', () => {
      this.handleInfiniteScrollEvent(true);
      this.element.scroll({ top: 0 });
      if (state.currentTouristicContents) {
        this.touristicContentsToDisplay = [...state.currentTouristicContents.slice(0, this.step)];
      }
    });
    onChange('touristicContentsWithinBounds', () => {
      this.handleInfiniteScrollEvent(true);
      this.element.scroll({ top: 0 });
      if (state.touristicContentsWithinBounds) {
        this.touristicContentsToDisplay = [...state.touristicContentsWithinBounds.slice(0, this.step)];
      }
    });
  }

  handleInfiniteScroll(event: any) {
    if (event.composedPath()[0].scrollTop + event.composedPath()[0].scrollHeight / 2 >= event.composedPath()[0].scrollHeight) {
      if (this.touristicContentsToDisplay.length < state.touristicContentsWithinBounds.length) {
        this.touristicContentsToDisplay = state.touristicContentsWithinBounds.slice(
          0,
          this.touristicContentsToDisplay.length + this.step >= state.touristicContentsWithinBounds.length
            ? state.touristicContentsWithinBounds.length
            : this.touristicContentsToDisplay.length + this.step,
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
    return (
      <Host style={{ '--font-family': this.fontFamily, '--color-primary-app': this.colorPrimaryApp }}>
        {state.touristicContentsWithinBounds && (
          <div part="current-touristic-contents-within-bounds-length" class="current-touristic-contents-within-bounds-length">{`${state.touristicContentsWithinBounds.length} ${
            state.touristicContentsWithinBounds.length > 1 ? translate[state.language].home.touristicContents : translate[state.language].home.touristicContent
          }`}</div>
        )}
        <div part="touristic-contents-list-container" class="touristic-contents-list-container">
          {this.touristicContentsToDisplay.map(touristicContent => (
            <grw-touristic-content-card
              exportparts="touristic-content-card,touristic-content-img-container,swiper-touristic-content,swiper-wrapper,swiper-slide,touristic-content-img,default-touristic-content-img,swiper-pagination,swiper-button-prev,swiper-button-next,touristic-content-sub-container,touristic-content-category-container,touristic-content-category-img,touristic-content-category-name,touristic-content-name,touristic-content-more-detail-container,more-details-button"
              fontFamily={this.fontFamily}
              key={`touristic-content-${touristicContent.id}`}
              touristicContent={touristicContent}
              is-large-view={this.isLargeView}
              color-primary-app={this.colorPrimaryApp}
              color-on-surface={this.colorOnSurface}
              color-secondary-container={this.colorSecondaryContainer}
              color-on-secondary-container={this.colorOnSecondaryContainer}
              color-surface-container-low={this.colorSurfaceContainerLow}
            ></grw-touristic-content-card>
          ))}
        </div>
        <div part="list-bottom-space" class={!this.isLargeView ? 'list-bottom-space' : 'list-large-view-bottom-space'}></div>
      </Host>
    );
  }
}
