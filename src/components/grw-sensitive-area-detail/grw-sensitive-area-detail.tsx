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
        <div class="sensitive-area-title">{this.sensitiveArea.name}</div>
        <div class="sensitive-area-description" innerHTML={this.sensitiveArea.description}></div>
        {this.sensitiveArea.practices && this.sensitiveArea.practices.length > 0 && (
          <div class="sensitive-area-practice-container">
            <div class="sensitive-area-practice-title">Domaines d'activités concernés :</div>
            <div class="sensitive-area-practice-values">
              {this.sensitiveArea.practices.map((practice, index) => (
                <div
                  innerHTML={`${state.practices.find(statePractice => statePractice.id === practice).name.toUpperCase()}${
                    index + 1 !== this.sensitiveArea.practices.length ? ' -&nbsp;' : ''
                  }`}
                ></div>
              ))}
            </div>
          </div>
        )}
        {this.sensitiveArea.period && this.sensitiveArea.period.length > 0 && (
          <div class="sensitive-area-period-container">
            <div class="sensitive-area-period-title">Périodes de sensibilité</div>
            <div class="sensitive-area-period-values">
              {this.sensitiveArea.period.map((month, index) => {
                if (month) {
                  return (
                    <div
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
        <div class="sensitive-area-contact-container">
          <div class="sensitive-area-contact-title">Contact</div>
          <div innerHTML={this.sensitiveArea.contact} class="sensitive-area-contact-value"></div>
        </div>
      </Host>
    );
  }
}
