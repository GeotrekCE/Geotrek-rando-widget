import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'grw-common-button',
  styleUrl: 'grw-common-button.scss',
  shadow: true,
})
export class GrwCommonButton {
  @Prop() action: Function;
  @Prop() icon: string;
  @Prop() name: string;

  render() {
    return (
      <Host>
        <button onClick={() => this.action()} class="common-button">
          {/* @ts-ignore */}
          <span translate={false} class="material-symbols material-symbols-outlined margin-right-icon">
            {this.icon}
          </span>
          {this.name}
        </button>
      </Host>
    );
  }
}
