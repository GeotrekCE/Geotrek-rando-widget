import { Component, Host, h, Element, State, Prop } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state, { onChange } from 'store/store';
import { TouristicEvents } from 'types/types';

@Component({
  tag: 'grw-touristic-events-list',
  styleUrl: 'grw-touristic-events-list.scss',
  shadow: true,
})
export class GrwTouristicContentsList {
  @Element() element: HTMLElement;
  @State() touristicEventsToDisplay: TouristicEvents = [];

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
    if (state.currentTouristicEvents) {
      this.touristicEventsToDisplay = [...state.currentTouristicEvents.slice(0, this.step)];
    }
    onChange('currentTouristicEvents', () => {
      this.handleInfiniteScrollEvent(true);
      this.element.scroll({ top: 0 });
      if (state.currentTouristicContents) {
        this.touristicEventsToDisplay = [...state.currentTouristicEvents.slice(0, this.step)];
      }
    });
    onChange('touristicEventsWithinBounds', () => {
      this.handleInfiniteScrollEvent(true);
      this.element.scroll({ top: 0 });
      if (state.touristicEventsWithinBounds) {
        this.touristicEventsToDisplay = [...state.touristicEventsWithinBounds.slice(0, this.step)];
      }
    });
  }

  handleInfiniteScroll(event: any) {
    if (event.composedPath()[0].scrollTop + event.composedPath()[0].scrollHeight / 2 >= event.composedPath()[0].scrollHeight) {
      if (this.touristicEventsToDisplay.length < state.touristicEventsWithinBounds.length) {
        this.touristicEventsToDisplay = state.touristicEventsWithinBounds.slice(
          0,
          this.touristicEventsToDisplay.length + this.step >= state.touristicEventsWithinBounds.length
            ? state.touristicEventsWithinBounds.length
            : this.touristicEventsToDisplay.length + this.step,
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
        {state.touristicEventsWithinBounds && (
          <div part="current-touristic-events-within-bounds-length" class="current-touristic-events-within-bounds-length">{`${state.touristicEventsWithinBounds.length} ${
            state.touristicEventsWithinBounds.length > 1 ? translate[state.language].home.touristicEvents : translate[state.language].home.touristicEvent
          }`}</div>
        )}
        <div part="touristic-events-list-container" class="touristic-events-list-container">
          {this.touristicEventsToDisplay.map(touristicEvent => (
            <grw-touristic-event-card
              exportparts="touristic-event-card,touristic-event-img-container,swiper-touristic-event,swiper-wrapper,swiper-slide,touristic-event-img,default-touristic-event-img,swiper-pagination,swiper-button-prev,swiper-button-next,touristic-event-sub-container,touristic-event-sub-container,touristic-event-type-img,touristic-event-type-name,touristic-event-name,touristic-event-date-container,touristic-event-date,touristic-event-more-detail-container,more-details-button"
              key={`touristic-event-${touristicEvent.id}`}
              touristicEvent={touristicEvent}
              is-large-view={this.isLargeView}
              fontFamily={this.fontFamily}
              color-primary-app={this.colorPrimaryApp}
              color-on-surface={this.colorOnSurface}
              color-secondary-container={this.colorSecondaryContainer}
              color-on-secondary-container={this.colorOnSecondaryContainer}
              color-surface-container-low={this.colorSurfaceContainerLow}
            ></grw-touristic-event-card>
          ))}
        </div>
        <div part="list-bottom-space" class={!this.isLargeView ? 'list-bottom-space' : 'list-large-view-bottom-space'}></div>
      </Host>
    );
  }
}
