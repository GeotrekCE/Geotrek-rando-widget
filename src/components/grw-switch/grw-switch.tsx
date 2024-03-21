import { Component, Host, Prop, h } from '@stencil/core';
import state from 'store/store';
import DoneIcon from '../../assets/done.svg';

@Component({
  tag: 'grw-switch',
  styleUrl: 'grw-switch.scss',
  shadow: true,
})
export class GrwSwitch {
  @Prop() action: Function;

  @Prop() fontFamily = 'Roboto';

  render() {
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
        }}
      >
        <label class="md3 switch">
          <input checked={state.offlineTreks} onChange={() => this.action()} type="checkbox" id="darkmode" name="darkmode" />
          <span class="slider">
            <span part="icon" class="icon" innerHTML={DoneIcon}></span>
          </span>
        </label>
      </Host>
    );
  }
}
