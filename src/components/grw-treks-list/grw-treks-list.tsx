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
  @Prop() colorPrimary: string = '#6b0030';
  @Prop() colorPrimaryTint: string = '#974c6e';

  handleInfiniteScrollBind: (event) => void = this.handleInfiniteScroll.bind(this);
  step = 10;

  componentWillLoad() {
    this.element.addEventListener('scroll', this.handleInfiniteScrollBind);
    onChange('treks', () => {
      this.treksToDisplay = state.treks.slice(0, this.step);
    });
  }

  handleInfiniteScroll(event: any) {
    if (event.composedPath()[0].scrollTop + event.composedPath()[0].scrollHeight / 2 >= event.composedPath()[0].scrollHeight) {
      if (this.treksToDisplay.length < state.treks.length) {
        this.treksToDisplay = state.treks.slice(0, this.treksToDisplay.length + this.step >= state.treks.length ? state.treks.length : this.treksToDisplay.length + this.step);
      } else {
        this.element.removeEventListener('scroll', this.handleInfiniteScrollBind);
      }
    }
  }

  render() {
    return (
      <Host style={{ '--color-primary': this.colorPrimary, '--color-primary-tint': this.colorPrimaryTint }}>
        {this.treksToDisplay.map(trek => (
          <grw-trek-card trek={trek} color-primary={this.colorPrimary} color-primary-tint={this.colorPrimaryTint}></grw-trek-card>
        ))}
      </Host>
    );
  }
}
