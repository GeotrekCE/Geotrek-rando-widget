import { Component, Host, h } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-select-language',
  styleUrl: 'grw-select-language.scss',
  shadow: true,
})
export class GrwSelectLanguage {
  handleSelect(event) {
    state.treks = null;
    state.currentTreks = null;
    state.currentTrek = null;
    state.language = event.target.value;
  }

  render() {
    return (
      <Host>
        {/* @ts-ignore */}
        <span translate={false} class="material-symbols material-symbols-outlined margin-right-icon">
          translate
        </span>
        <select onInput={event => this.handleSelect(event)} name="languages" id="language-select">
          {state.languages.map(language => (
            <option selected={language === state.language} value={language.toLocaleLowerCase()}>
              {language.toLocaleUpperCase()}
            </option>
          ))}
        </select>
      </Host>
    );
  }
}
