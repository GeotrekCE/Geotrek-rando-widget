import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'grw-loader',
  styleUrl: 'grw-loader.scss',
  shadow: true,
})
export class GrwLoader {
  @Prop() colorPrimaryContainer = '#eaddff';
  @Prop() colorOnPrimaryContainer = '#21005e';

  render() {
    return (
      <Host style={{ '--color-primary-container': this.colorPrimaryContainer, '--color-on-primary-container': this.colorOnPrimaryContainer }}>
        <span part="loader" class="loader"></span>
      </Host>
    );
  }
}
