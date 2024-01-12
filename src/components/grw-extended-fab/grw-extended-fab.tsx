import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'grw-extended-fab',
  styleUrl: 'grw-extended-fab.scss',
  shadow: true,
})
export class GrwExtendedFab {
  @Prop() action: Function;
  @Prop() icon: Function;
  @Prop() name: Function;
  @Prop() display: string;

  @Prop() fontFamily = 'Roboto';

  render() {
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
        }}
      >
        <button onClick={() => this.action()} class="map-visibility-button" style={{ display: this.display }}>
          {/* @ts-ignore */}
          <span translate={false} class="material-symbols material-symbols-outlined">
            {this.icon()}
          </span>
          {this.name()}
        </button>
      </Host>
    );
  }
}
