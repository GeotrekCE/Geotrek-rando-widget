import { Component, Host, h, Prop } from '@stencil/core';
import state from 'store/store';
import { SensitiveArea } from 'types/types';
import { translate } from 'i18n/i18n';

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
        {this.sensitiveArea.rules && this.sensitiveArea.rules.length > 0 && (
          <div part="sensitive-area-rules-container" class="sensitive-area-rules-container">
            <div part="sensitive-area-rules-title" class="sensitive-area-rules-title">
              {translate[state.language].rules}
            </div>
            <div part="sensitive-area-rules" class="sensitive-area-rules">
              {this.sensitiveArea.rules.map(rule => (
                <div key={rule.id} part="sensitive-area-rule" class="sensitive-area-rule">
                  <div part="sensitive-area-rule-name" class="sensitive-area-rule-name">
                    {rule.url ? (
                      <a href={rule.url} target="_blank" rel="noopener noreferrer">
                        {rule.name}
                      </a>
                    ) : (
                      rule.name
                    )}
                  </div>
                  {rule.description && (
                    <div part="sensitive-area-rule-description" class="sensitive-area-rule-description" innerHTML={rule.description}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {this.sensitiveArea.practices && this.sensitiveArea.practices.length > 0 && (
          <div part="sensitive-area-practice-container" class="sensitive-area-practice-container">
            <div part="sensitive-area-practice-title" class="sensitive-area-practice-title">
              Domaines d'activités concernés
            </div>
            <div part="sensitive-area-practices" class="sensitive-area-practices">
              {this.sensitiveArea.practices
                .map(sensitiveAreaPractice => state.practices.find(statePractice => statePractice.id === sensitiveAreaPractice))
                .filter(Boolean)
                .map((practice, index, array) => (
                  <div
                    part="sensitive-area-practice"
                    class="sensitive-area-practice"
                    innerHTML={`${practice.name.toUpperCase()}${index + 1 !== array.length ? ' -&nbsp;' : ''}`}
                  ></div>
                ))}
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
