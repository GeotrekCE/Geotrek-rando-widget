import { Component, Host, h, Prop, State, Event, EventEmitter } from '@stencil/core';
import { InformationDesk } from 'types/types';

@Component({
  tag: 'grw-information-desk-detail',
  styleUrl: 'grw-information-desk-detail.scss',
  shadow: true,
})
export class GrwInformationDeskDetail {
  @Event() centerOnMap: EventEmitter<{ latitude: number; longitude: number }>;
  @State() displayShortDescription = true;
  @Prop() informationDesk: InformationDesk;

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
            <img src={this.informationDesk.photo_url} loading="lazy" />
          </div>
        )}
        <div class="information-desk-sub-container">
          {this.informationDesk.latitude && this.informationDesk.longitude && <button onClick={() => this.handleCenterOnMap()}>Centrer sur la carte</button>}
          {this.informationDesk.name && <div class="information-desk-name">{this.informationDesk.name}</div>}
          {(this.informationDesk.postal_code || this.informationDesk.municipality || this.informationDesk.street) && (
            <div>
              {this.informationDesk.postal_code && this.informationDesk.postal_code}
              {this.informationDesk.municipality && ` ${this.informationDesk.municipality}`}
              {this.informationDesk.street && ` ${this.informationDesk.street}`}
            </div>
          )}
          {this.informationDesk.phone && (
            <div>
              <a href={`tel:${this.informationDesk.phone}`}>{this.informationDesk.phone}</a>
            </div>
          )}
          {this.informationDesk.email && (
            <div>
              <a href={`mailto:${this.informationDesk.email}`}>{this.informationDesk.email}</a>
            </div>
          )}
          {this.informationDesk.website && (
            <div>
              <a href={`${this.informationDesk.website}`}>{this.informationDesk.website}</a>
            </div>
          )}
          {this.informationDesk.description && (
            <div class="information-desk-description-container">
              <div class={this.displayShortDescription ? 'information-desk-description-short' : 'information-desk-description'} innerHTML={this.informationDesk.description}></div>
              <div class="handle-information-desk-description" onClick={() => this.handleInformationDeskDescription()}>
                {this.displayShortDescription ? 'Lire plus' : 'Lire moins'}
              </div>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
