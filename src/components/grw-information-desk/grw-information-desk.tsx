import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import state from 'store/store';
import { translate } from 'i18n/i18n';
import { InformationDesk } from 'types/types';

@Component({
  tag: 'grw-information-desk',
  styleUrl: 'grw-information-desk.scss',
  shadow: true,
})
export class GrwInformationDeskDetail {
  descriptionRef?: HTMLDivElement;
  @Event() centerOnMap: EventEmitter<{ latitude: number; longitude: number }>;
  @State() displayShortDescription = true;
  @State() showInformationDeskDescriptionButton = false;
  @Prop() informationDesk: InformationDesk;

  componentDidLoad() {
    this.showInformationDeskDescriptionButton = this.descriptionRef.clientHeight < this.descriptionRef.scrollHeight;
  }

  handleInformationDeskDescription() {
    this.displayShortDescription = !this.displayShortDescription;
  }

  handleCenterOnMap() {
    this.centerOnMap.emit({ latitude: this.informationDesk.latitude, longitude: this.informationDesk.longitude });
  }

  render() {
    return (
      <Host>
        {this.informationDesk.photo_url && (
          <div class="information-desk-img">
            <img
              /* @ts-ignore */
              crossorigin="anonymous"
              src={this.informationDesk.photo_url}
              loading="lazy"
            />
          </div>
        )}
        <div class="information-desk-sub-container">
          {this.informationDesk.name && <div class="information-desk-name">{this.informationDesk.name}</div>}
          {this.informationDesk.latitude && this.informationDesk.longitude && (
            <button class="center-on-map-button" onClick={() => this.handleCenterOnMap()}>
              {/* @ts-ignore */}
              <span translate={false} class="material-symbols material-symbols-outlined">
                location_searching
              </span>
              {translate[state.language].centerOnMap}
            </button>
          )}
          {(this.informationDesk.postal_code || this.informationDesk.municipality || this.informationDesk.street) && (
            <div>
              {this.informationDesk.postal_code && this.informationDesk.postal_code}
              {this.informationDesk.municipality && ` ${this.informationDesk.municipality}`}
              {this.informationDesk.street && ` ${this.informationDesk.street}`}
            </div>
          )}
          {this.informationDesk.phone && (
            <div class="phone-container">
              {/* @ts-ignore */}
              <span translate={false} class="material-symbols material-symbols-outlined">
                call
              </span>
              <a href={`tel:${this.informationDesk.phone}`}>{this.informationDesk.phone}</a>
            </div>
          )}
          {this.informationDesk.email && (
            <div class="mail-container">
              {/* @ts-ignore */}
              <span translate={false} class="material-symbols material-symbols-outlined">
                mail
              </span>
              <a href={`mailto:${this.informationDesk.email}`}>{this.informationDesk.email}</a>
            </div>
          )}
          {this.informationDesk.website && (
            <div class="link-container">
              {/* @ts-ignore */}
              <span translate={false} class="material-symbols material-symbols-outlined">
                link
              </span>
              <a href={`${this.informationDesk.website}`}>{this.informationDesk.website}</a>
            </div>
          )}
          {this.informationDesk.description && (
            <div class="information-desk-description-container">
              <div
                class={this.displayShortDescription ? 'information-desk-description-short' : 'information-desk-description'}
                innerHTML={this.informationDesk.description}
                ref={el => (this.descriptionRef = el)}
              ></div>
              {false && (
                <div class="handle-information-desk-description" onClick={() => this.handleInformationDeskDescription()}>
                  {this.displayShortDescription ? translate[state.language].readMore : translate[state.language].readLess}
                </div>
              )}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
