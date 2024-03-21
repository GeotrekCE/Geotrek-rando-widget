import { Component, Host, Prop, h } from '@stencil/core';
import RefreshIcon from '../../assets/refresh.svg';
import FilterListIcon from '../../assets/filter_list.svg';

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
          <span part="common-button-icon" class="icon" innerHTML={this.icon === 'refresh' ? RefreshIcon : FilterListIcon}></span>
          <span part="common-button-label" class="label">
            {this.name}
          </span>
        </button>
      </Host>
    );
  }
}
