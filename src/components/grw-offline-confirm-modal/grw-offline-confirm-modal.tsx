import { Component, Event, EventEmitter, Fragment, Host, Listen, Prop, State, h } from '@stencil/core';
import { translate } from 'i18n/i18n';
import state from 'store/store';
import { Mode } from 'types/types';

@Component({
  tag: 'grw-offline-confirm-modal',
  styleUrl: 'grw-offline-confirm-modal.scss',
  shadow: true,
})
export class GrwOfflineConfirmModal {
  @State() showOfflineModal = false;
  @State() showConfirmModal = false;
  @State() showLoaderModal = false;
  @State() showSuccessModal = false;
  @State() showErrorModal = false;
  @State() showConfirmDeleteModal = false;
  @State() showDeletingMessage = false;
  @State() showDeleteSuccessMessage = false;

  @Event() downloadPress: EventEmitter<number>;
  @Event() deletePress: EventEmitter<number>;

  @Prop() mode: Mode;

  @Listen('downloadConfirm', { target: 'window' })
  onDownloadConfirm() {
    this.showLoaderModal = false;
    this.showSuccessModal = false;
    this.showDeleteSuccessMessage = false;
    this.showDeletingMessage = false;
    this.showConfirmDeleteModal = false;
    document.body.style.overflow = `hidden`;
    this.showOfflineModal = true;
    this.showConfirmModal = true;
  }

  @Listen('downloadedSuccessConfirm', { target: 'window' })
  onDownloadedSuccessConfirm() {
    this.showLoaderModal = false;
    this.showSuccessModal = true;
  }

  @Listen('downloadedErrorConfirm', { target: 'window' })
  downloadedErrorConfirm() {
    this.showLoaderModal = false;
    this.showErrorModal = true;
  }

  @Listen('deleteConfirm', { target: 'window' })
  onDeleteConfirm() {
    this.showLoaderModal = false;
    this.showSuccessModal = false;
    this.showDeleteSuccessMessage = false;
    document.body.style.overflow = `hidden`;
    this.showOfflineModal = true;
    this.showConfirmModal = true;
    this.showConfirmDeleteModal = true;
  }

  @Listen('deleteSuccessConfirm', { target: 'window' })
  onDeleteSuccessConfirm() {
    this.showLoaderModal = false;
    this.showSuccessModal = true;
    this.showDeleteSuccessMessage = true;
  }

  @Listen('deleteErrorConfirm', { target: 'window' })
  deleteErrorConfirm() {
    this.showLoaderModal = false;
    this.showSuccessModal = true;
    this.showDeleteSuccessMessage = true;
  }

  handleOkDeleteModal() {
    this.showDeletingMessage = true;
    this.showConfirmDeleteModal = false;
    this.showConfirmModal = false;
    this.showLoaderModal = true;
    this.deletePress.emit();
  }

  handleOkDownloadModal() {
    this.showConfirmModal = false;
    this.showLoaderModal = true;
    this.downloadPress.emit();
  }

  handleCancelModal() {
    document.body.style.overflow = `visible`;
    this.showOfflineModal = false;
  }

  render() {
    return (
      <Host>
        {this.showOfflineModal && (
          <div class="modal-container">
            <div class="modal-content-container">
              {this.showConfirmModal && !this.showConfirmDeleteModal && (
                <Fragment>
                  <div class="modal-message-container">{`${
                    this.mode === 'treks' ? translate[state.language].offline.downloadRouteQuestion : translate[state.language].offline.downloadOutdoorQuestion
                  }`}</div>
                  <div class="modal-buttons-container">
                    <button part="modal-button" class="modal-button" onClick={() => this.handleCancelModal()}>
                      {translate[state.language].offline.cancel}
                    </button>
                    <button part="modal-button" class="modal-button" onClick={() => this.handleOkDownloadModal()}>
                      {translate[state.language].offline.ok}
                    </button>
                  </div>
                </Fragment>
              )}
              {this.showConfirmDeleteModal && (
                <Fragment>
                  <div class="modal-message-container">{`${
                    this.mode === 'treks' ? translate[state.language].offline.deleteRouteQuestion : translate[state.language].offline.deleteRouteQuestion
                  }`}</div>
                  <div class="modal-buttons-container">
                    <button part="modal-button" class="modal-button" onClick={() => this.handleCancelModal()}>
                      {translate[state.language].offline.cancel}
                    </button>
                    <button part="modal-button" class="modal-button" onClick={() => this.handleOkDeleteModal()}>
                      {translate[state.language].offline.ok}
                    </button>
                  </div>
                </Fragment>
              )}
              {this.showLoaderModal && (
                <Fragment>
                  <div class="modal-message-container">
                    <div class="modal-loader"></div>
                    {this.showDeletingMessage ? translate[state.language].offline.deleting : translate[state.language].offline.downloading}
                  </div>
                </Fragment>
              )}
              {this.showSuccessModal && (
                <Fragment>
                  <div class="modal-message-container">
                    {this.showDeleteSuccessMessage
                      ? this.mode === 'treks'
                        ? translate[state.language].offline.offlineRouteDeleted
                        : translate[state.language].offline.offlineOutdoorDeleted
                      : this.mode === 'treks'
                      ? translate[state.language].offline.routeAvailableOffline
                      : translate[state.language].offline.outdoorAvailableOffline}
                  </div>
                  <div class="modal-button-container">
                    <button part="modal-button" class="modal-button" onClick={() => this.handleCancelModal()}>
                      {translate[state.language].offline.ok}
                    </button>
                  </div>
                </Fragment>
              )}

              {this.showErrorModal && (
                <Fragment>
                  <div class="modal-message-container">
                    {this.showDeleteSuccessMessage
                      ? this.mode === 'treks'
                        ? translate[state.language].offline.deleteRouteError
                        : translate[state.language].offline.deleteOutdoorError
                      : this.mode === 'treks'
                      ? translate[state.language].offline.downloadRouteError
                      : translate[state.language].offline.downloadOutdoorError}
                  </div>
                  <div class="modal-button-container">
                    <button part="modal-button" class="modal-button" onClick={() => this.handleCancelModal()}>
                      {translate[state.language].offline.ok}
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        )}
      </Host>
    );
  }
}
