import { Component, Host, Prop, h } from '@stencil/core';

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
          <input onChange={() => this.action()} type="checkbox" id="darkmode" name="darkmode" />
          <span class="slider">
            {/* @ts-ignore */}
            <span translate={false} part="icon" class="material-symbols material-symbols-outlined icon">
              done
            </span>
          </span>
        </label>
      </Host>
    );
  }
}
