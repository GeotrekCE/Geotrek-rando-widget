import { Component, Host, Prop, h } from '@stencil/core';
import SummarizeIcon from '../../assets/summarize.svg';
import MapIcon from '../../assets/map.svg';
import ListIcon from '../../assets/list.svg';

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
    const icon = this.icon();
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
        }}
      >
        <button part="map-visibility-button" class="map-visibility-button" onClick={() => this.action()} style={{ display: this.display }}>
          <span part="map-visibility-button-icon" class="icon" innerHTML={icon === 'Summarize' ? SummarizeIcon : icon === 'map' ? MapIcon : ListIcon}></span>
          <span part="map-visibility-button-label" class="label">
            {this.name()}
          </span>
        </button>
      </Host>
    );
  }
}
