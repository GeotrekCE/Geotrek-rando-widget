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

  @Prop() fontFamily = 'Roboto';

  render() {
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
        }}
      >
        <button part="common-button" class="common-button" onClick={() => this.action()}>
          {/* @ts-ignore */}
          <span part="common-button-icon" class="material-symbols material-symbols-outlined icon" translate={false}>
            {this.icon}
          </span>
          <span part="common-button-label" class="label">
            {this.name}
          </span>
        </button>
      </Host>
    );
  }
}
