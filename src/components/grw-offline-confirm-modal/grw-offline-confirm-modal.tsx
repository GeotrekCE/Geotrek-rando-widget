import { Component, Event, EventEmitter, Fragment, Host, Listen, Prop, State, h } from '@stencil/core';
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
                    this.mode === 'treks'
                      ? 'Êtes-vous sûr de vouloir rendre cet itinéraire disponible hors ligne ?'
                      : 'Êtes-vous sûr de vouloir rendre cet outdoor disponible hors ligne ?'
                  }`}</div>
                  <div class="modal-buttons-container">
                    <button part="modal-button" class="modal-button" onClick={() => this.handleCancelModal()}>
                      ANNULER
                    </button>
                    <button part="modal-button" class="modal-button" onClick={() => this.handleOkDownloadModal()}>
                      OK
                    </button>
                  </div>
                </Fragment>
              )}
              {this.showConfirmDeleteModal && (
                <Fragment>
                  <div class="modal-message-container">{`${
                    this.mode === 'treks' ? 'Êtes-vous sûr de vouloir supprimer cet itinéraire du hors ligne ?' : 'Êtes-vous sûr de vouloir supprimer cet outdoor du hors ligne ?'
                  }`}</div>
                  <div class="modal-buttons-container">
                    <button part="modal-button" class="modal-button" onClick={() => this.handleCancelModal()}>
                      ANNULER
                    </button>
                    <button part="modal-button" class="modal-button" onClick={() => this.handleOkDeleteModal()}>
                      OK
                    </button>
                  </div>
                </Fragment>
              )}
              {this.showLoaderModal && (
                <Fragment>
                  <div class="modal-message-container">
                    <div class="modal-loader"></div>
                    {this.showDeletingMessage ? 'Suppression en cours' : 'Téléchargement en cours'}
                  </div>
                </Fragment>
              )}
              {this.showSuccessModal && (
                <Fragment>
                  <div class="modal-message-container">
                    {this.showDeleteSuccessMessage
                      ? this.mode === 'treks'
                        ? "L'itinéraire est supprimé du hors ligne"
                        : "L'outdoor est supprimé du hors ligne"
                      : this.mode === 'treks'
                      ? "L'itinéraire est disponible hors ligne"
                      : "L'outdoor est disponible hors ligne"}
                  </div>
                  <div class="modal-button-container">
                    <button part="modal-button" class="modal-button" onClick={() => this.handleCancelModal()}>
                      OK
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
