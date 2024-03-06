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
        <button part="map-visibility-button" class="map-visibility-button" onClick={() => this.action()} style={{ display: this.display }}>
          {/* @ts-ignore */}
          <span part="map-visibility-button-icon" class="material-symbols material-symbols-outlined icon" translate={false}>
            {this.icon()}
          </span>
          <span part="map-visibility-button-label" class="label">
            {this.name()}
          </span>
        </button>
      </Host>
    );
  }
}
