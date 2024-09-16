import { Component, Host, h, Event, EventEmitter } from '@stencil/core';
import CloseIcon from '../../assets/close.svg';

@Component({
  tag: 'grw-details-modal',
  styleUrl: 'grw-details-modal.scss',
  shadow: true,
})
export class GrwDetailsModal {
  @Event() closeDetailsModal: EventEmitter<number>;

  handleCloseButton() {
    this.closeDetailsModal.emit();
  }

  render() {
    return (
      <Host>
        <div class="modal-container">
          <div class="grw-details-modal">
            <div class="grw-arrow-back-container">
              <button onClick={() => this.handleCloseButton()} class="grw-arrow-back-icon">
                <span part="icon" class="icon" innerHTML={CloseIcon}></span>
              </button>
            </div>
            <div class="grw-content-modal">
              <slot></slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
