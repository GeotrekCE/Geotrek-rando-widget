import { Component, Host, h, Element, State, Prop } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state, { onChange } from 'store/store';
import { Treks } from 'types/types';

@Component({
  tag: 'grw-treks-list',
  styleUrl: 'grw-treks-list.scss',
  shadow: true,
})
export class GrwTreksList {
  @Element() element: HTMLElement;
  @State() treksToDisplay: Treks = [];

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
    if (state.currentTreks) {
      this.treksToDisplay = [...state.currentTreks.slice(0, this.step)];
    }
    onChange('currentTreks', () => {
      this.handleInfiniteScrollEvent(true);
      this.element.scroll({ top: 0 });
      if (state.currentTreks) {
        this.treksToDisplay = [...state.currentTreks.slice(0, this.step)];
      }
    });
    onChange('treksWithinBounds', () => {
      this.handleInfiniteScrollEvent(true);
      this.element.scroll({ top: 0 });
      if (state.treksWithinBounds) {
        this.treksToDisplay = [...state.treksWithinBounds.slice(0, this.step)];
      }
    });
  }

  handleInfiniteScroll(event: any) {
    if (event.composedPath()[0].scrollTop + event.composedPath()[0].scrollHeight / 2 >= event.composedPath()[0].scrollHeight) {
      if (this.treksToDisplay.length < state.treksWithinBounds.length) {
        this.treksToDisplay = state.treksWithinBounds.slice(
          0,
          this.treksToDisplay.length + this.step >= state.treksWithinBounds.length ? state.treksWithinBounds.length : this.treksToDisplay.length + this.step,
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
        {state.treksWithinBounds && (
          <div part="current-treks-within-bounds-length" class="current-treks-within-bounds-length">{`${state.treksWithinBounds.length} ${
            state.treksWithinBounds.length > 1 ? translate[state.language].treks : translate[state.language].trek
          }`}</div>
        )}
        <div part="treks-list-container" class="treks-list-container">
          {this.treksToDisplay.map(trek => (
            <grw-trek-card
              exportparts="trek-card,trek-img-container,trek-img,trek-sub-container,trek-departure,trek-name,trek-themes-container,trek-theme,trek-icons-labels-container,trek-icon-label,trek-icon,trek-label"
              key={`trek-${trek.id}`}
              trek={trek}
              is-large-view={this.isLargeView}
              fontFamily={this.fontFamily}
              color-primary-app={this.colorPrimaryApp}
              color-on-surface={this.colorOnSurface}
              color-secondary-container={this.colorSecondaryContainer}
              color-on-secondary-container={this.colorOnSecondaryContainer}
              color-surface-container-low={this.colorSurfaceContainerLow}
            ></grw-trek-card>
          ))}
        </div>
        <div part="list-bottom-space" class={!this.isLargeView ? 'list-bottom-space' : 'list-large-view-bottom-space'}></div>
      </Host>
    );
  }
}
