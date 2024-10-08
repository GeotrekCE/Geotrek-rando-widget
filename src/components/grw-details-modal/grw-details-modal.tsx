import { Component, Host, h, Event, EventEmitter, Prop } from '@stencil/core';
import CloseIcon from '../../assets/close.svg';

@Component({
  tag: 'grw-details-modal',
  styleUrl: 'grw-details-modal.scss',
  shadow: false,
})
export class GrwDetailsModal {
  @Event() closeDetailsModal: EventEmitter<number>;
  @Prop() fontFamily = 'Roboto';
  @Prop() colorBackground = '#fef7ff';
  @Prop() colorPrimaryContainer = '#eaddff';
  @Prop() colorOnPrimaryContainer = '#49454e';
  @Prop() rounded = true;

  handleCloseButton() {
    this.closeDetailsModal.emit();
  }

  render() {
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
          '--color-background': this.colorBackground,
          '--color-primary-container': this.colorPrimaryContainer,
          '--color-on-primary-container': this.colorOnPrimaryContainer,
          '--border-radius': this.rounded ? '' : '0px',
        }}
      >
        <div part="modal-container" class="modal-container">
          <div part="details-modal" class="grw-details-modal">
            <div part="arrow-back-container" class="grw-arrow-back-container">
              <button part="arrow-back-icon" onClick={() => this.handleCloseButton()} class="grw-arrow-back-icon">
                <span part="icon" class="icon" innerHTML={CloseIcon}></span>
              </button>
            </div>
            <div part="content-modal" class="grw-content-modal">
              <slot></slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
