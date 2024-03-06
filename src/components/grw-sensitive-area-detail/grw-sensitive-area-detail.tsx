import { Component, Host, h, Prop } from '@stencil/core';
import state from 'store/store';
import { SensitiveArea } from 'types/types';

@Component({
  tag: 'grw-sensitive-area-detail',
  styleUrl: 'grw-sensitive-area-detail.scss',
  shadow: true,
})
export class GrwSensitiveAreaDetail {
  @Prop() sensitiveArea: SensitiveArea;

  render() {
    return (
      <Host>
        <div part="sensitive-area-title-container" class="sensitive-area-title-container">
          <div part="sensitive-area-color-container" class="sensitive-area-color-container"></div>
          <div part="sensitive-area-title" class="sensitive-area-title">
            {this.sensitiveArea.name}
          </div>
        </div>

        <div part="sensitive-area-description" class="sensitive-area-description" innerHTML={this.sensitiveArea.description}></div>
        {this.sensitiveArea.practices && this.sensitiveArea.practices.length > 0 && (
          <div part="sensitive-area-practice-container" class="sensitive-area-practice-container">
            <div part="sensitive-area-practice-title" class="sensitive-area-practice-title">
              Domaines d'activités concernés
            </div>
            <div part="sensitive-area-practices" class="sensitive-area-practices">
              {this.sensitiveArea.practices.map((sensitiveAreaPractice, index) => {
                const practice = state.practices.find(statePractice => statePractice.id === sensitiveAreaPractice);
                if (practice) {
                  return (
                    <div
                      part="sensitive-area-practice"
                      class="sensitive-area-practice"
                      innerHTML={`${practice.name.toUpperCase()}${index + 1 !== this.sensitiveArea.practices.length ? ' -&nbsp;' : ''}`}
                    ></div>
                  );
                }
              })}
            </div>
          </div>
        )}
        {this.sensitiveArea.period && this.sensitiveArea.period.length > 0 && (
          <div part="sensitive-area-period-container" class="sensitive-area-period-container">
            <div part="sensitive-area-period-title" class="sensitive-area-period-title">
              Périodes de sensibilité
            </div>
            <div part="sensitive-area-periods" class="sensitive-area-periods">
              {this.sensitiveArea.period.map((month, index) => {
                if (month) {
                  return (
                    <div
                      part="sensitive-area-period"
                      class="sensitive-area-period"
                      innerHTML={`${new Date(0, index + 1, 0).toLocaleDateString('fr', { month: 'long' }).toUpperCase()}${
                        this.sensitiveArea.period.slice(index + 1).find(month => month) ? ' -&nbsp;' : ''
                      }`}
                    ></div>
                  );
                }
              })}
            </div>
          </div>
        )}
        <div part="sensitive-area-contact-container" class="sensitive-area-contact-container">
          <div part="sensitive-area-contact-title" class="sensitive-area-contact-title">
            Contact
          </div>
          <div part="sensitive-area-contact-value" class="sensitive-area-contact-value" innerHTML={this.sensitiveArea.contact}></div>
        </div>
      </Host>
    );
  }
}
