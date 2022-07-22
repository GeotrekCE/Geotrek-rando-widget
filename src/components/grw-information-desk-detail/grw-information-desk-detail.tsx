import { Component, Host, h, Prop } from '@stencil/core';
import { InformationDesk } from 'types/types';

@Component({
  tag: 'grw-information-desk-detail',
  styleUrl: 'grw-information-desk-detail.scss',
  shadow: true,
})
export class GrwInformationDeskDetail {
  @Prop() informationDesk: InformationDesk;

  render() {
    return (
      <Host>
        {this.informationDesk.photo_url && (
          <div class="information-desk-img">
            <img src={this.informationDesk.photo_url} loading="lazy" />
          </div>
        )}
        <div class="information-desk-sub-container">
          {this.informationDesk.name && <div class="information-desk-name">{this.informationDesk.name}</div>}
          {this.informationDesk.description && <div class="information-desk-description" innerHTML={this.informationDesk.description}></div>}
          {this.informationDesk.postal_code ||
            this.informationDesk.municipality ||
            (this.informationDesk.street && (
              <div>
                {this.informationDesk.postal_code}
                {` ${this.informationDesk.municipality}`}
                {` ${this.informationDesk.street}`}
              </div>
            ))}
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
        </div>
      </Host>
    );
  }
}
