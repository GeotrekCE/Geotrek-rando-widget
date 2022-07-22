import { Component, Host, h, Element, State, Prop } from '@stencil/core';
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
  @Prop() colorPrimary = '#6b0030';
  @Prop() colorPrimaryTint = '#974c6e';
  @Prop() isLargeView = false;
  step = 10;
  handleInfiniteScrollBind: (event: any) => void = this.handleInfiniteScroll.bind(this);

  componentWillLoad() {
    onChange('currentTreks', () => {
      this.element.addEventListener('scroll', this.handleInfiniteScrollBind);
      this.element.scroll({ top: 0 });
      this.treksToDisplay = [...state.currentTreks.slice(0, this.step)];
    });
    onChange('treksWithinBounds', () => {
      this.element.addEventListener('scroll', this.handleInfiniteScrollBind);
      this.element.scroll({ top: 0 });
      this.treksToDisplay = [...state.treksWithinBounds.slice(0, this.step)];
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
        this.element.removeEventListener('scroll', this.handleInfiniteScrollBind);
      }
    }
  }

  render() {
    return (
      <Host style={{ '--color-primary': this.colorPrimary, '--color-primary-tint': this.colorPrimaryTint }}>
        {<div class="current-treks-length">{`${state.treksWithinBounds.length} résultat${state.treksWithinBounds.length > 1 ? 's' : ''}`}</div>}
        <div class="current-treks-container">
          {this.treksToDisplay.map(trek => (
            <grw-trek-card
              key={`trek-${trek.id}`}
              trek={trek}
              is-large-view={this.isLargeView}
              color-primary={this.colorPrimary}
              color-primary-tint={this.colorPrimaryTint}
            ></grw-trek-card>
          ))}
        </div>
      </Host>
    );
  }
}
