import { Component, Host, h, Element, State, Prop } from '@stencil/core';
import state, { onChange, reset } from 'store/store';
import { Treks } from 'types/types';

@Component({
  tag: 'grw-treks-list',
  styleUrl: 'grw-treks-list.scss',
  shadow: true,
})
export class GrwTreksList {
  @Element() element: HTMLElement;
  @State() treksToDisplay: Treks = [];
  @Prop() colorPrimary = '#6b0030';
  @Prop() colorPrimaryTint = '#974c6e';
  @Prop() isLargeView = false;
  @Prop() resetStoreOnDisconnected = true;
  step = 10;
  handleInfiniteScrollBind: (event: any) => void = this.handleInfiniteScroll.bind(this);
  shouldAddInfiniteScrollEvent = true;

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
    if (this.resetStoreOnDisconnected) {
      reset();
    }
    this.handleInfiniteScrollEvent(false);
  }

  render() {
    return (
      <Host style={{ '--color-primary': this.colorPrimary, '--color-primary-tint': this.colorPrimaryTint }}>
        {this.treksToDisplay.map(trek => (
          <grw-trek-card
            reset-store-on-disconnected="false"
            key={`trek-${trek.id}`}
            trek={trek}
            is-large-view={this.isLargeView}
            color-primary={this.colorPrimary}
            color-primary-tint={this.colorPrimaryTint}
          ></grw-trek-card>
        ))}
      </Host>
    );
  }
}
