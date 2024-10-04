import { Component, Host, h, Prop } from '@stencil/core';
import ShowElevationIcon from '../../assets/show-elevation.svg';
import HideElevationIcon from '../../assets/hide-elevation.svg';

@Component({
  tag: 'grw-fab',
  styleUrl: 'grw-fab.scss',
  shadow: true,
})
export class GrwFab {
  @Prop() action: Function;
  @Prop() icon: Function;
  @Prop() showTitle: string;
  @Prop() hideTitle: string;

  @Prop() fontFamily = 'Roboto';
  @Prop() fabBackgroundColor = '#eaddff';
  @Prop() fabColor = '#21005d';

  render() {
    const icon = this.icon();
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
          '--fab-background-color': this.fabBackgroundColor,
          '--fab-color': this.fabColor,
        }}
      >
        <button title={icon === 'show-elevation' ? this.hideTitle : this.showTitle} part="fab-visibility-button" class="fab-visibility-button" onClick={() => this.action()}>
          <span part="fab-visibility-button-icon" class="icon" innerHTML={icon === 'show-elevation' ? ShowElevationIcon : HideElevationIcon}></span>
        </button>
      </Host>
    );
  }
}
