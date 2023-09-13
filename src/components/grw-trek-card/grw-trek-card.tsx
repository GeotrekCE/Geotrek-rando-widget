import { Component, Host, h, Prop, Event, EventEmitter, State, Listen } from '@stencil/core';
import state, { onChange, reset } from 'store/store';
import { City, Difficulty, Practice, Route, Themes, Trek } from 'types/types';
import { formatDuration, formatLength, formatAscent } from 'utils/utils';

@Component({
  tag: 'grw-trek-card',
  styleUrl: 'grw-trek-card.scss',
  shadow: true,
})
export class GrwTrekCard {
  @Event() trekCardPress: EventEmitter<number>;
  @State() currentTrek: Trek;
  @State() difficulty: Difficulty;
  @State() route: Route;
  @State() practice: Practice;
  @State() themes: Themes;
  @State() departureCity: City;
  @Prop() trek: Trek;
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() isLargeView = false;
  @Prop() resetStoreOnDisconnected = true;
  @Prop() isStep: false;

  @Event() cardTrekMouseOver: EventEmitter<number>;
  @Event() cardTrekMouseLeave: EventEmitter;

  connectedCallback() {
    this.currentTrek = this.trek ? this.trek : state.currentTrek;
    if (this.currentTrek) {
      this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
      this.route = state.routes.find(route => route.id === this.currentTrek.route);
      this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
      this.themes = state.themes.filter(theme => this.currentTrek.themes.includes(theme.id));
      this.departureCity = state.cities.find(city => city.id === this.currentTrek.departure_city);
    }
    onChange('currentTrek', () => {
      this.currentTrek = this.trek ? this.trek : state.currentTrek;
      if (this.currentTrek) {
        this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
        this.route = state.routes.find(route => route.id === this.currentTrek.route);
        this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
        this.themes = state.themes.filter(theme => this.currentTrek.themes.includes(theme.id));
        this.departureCity = state.cities.find(city => city.id === this.currentTrek.departure_city);
      }
    });
  }

  disconnectedCallback() {
    if (this.resetStoreOnDisconnected) {
      reset();
    }
  }

  @Listen('mouseover')
  handleMouseOver() {
    !this.isStep && this.cardTrekMouseOver.emit(this.currentTrek.id);
  }

  @Listen('mouseleave')
  handleMouseLeave() {
    !this.isStep && this.cardTrekMouseLeave.emit();
  }

  render() {
    return (
      <Host
        style={{
          'width': this.isLargeView ? '100%' : 'auto',
          '--color-primary-app': this.colorPrimaryApp,
          '--color-on-surface': this.colorOnSurface,
          '--color-secondary-container': this.colorSecondaryContainer,
          '--color-on-secondary-container': this.colorOnSecondaryContainer,
          '--color-surface-container-low': this.colorSurfaceContainerLow,
        }}
      >
        {this.currentTrek && (
          <div
            class={
              this.isStep
                ? 'trek-card-container trek-step-card'
                : this.isLargeView
                ? `trek-card-large-view-container${state.selectedTrekId === this.currentTrek.id ? ' selected-trek-card' : ''}`
                : `trek-card-container${state.selectedTrekId === this.currentTrek.id ? ' selected-trek-card' : ''}`
            }
            onClick={() => this.trekCardPress.emit(this.currentTrek.id)}
          >
            {this.currentTrek.attachments.filter(attachment => attachment.type === 'image').length > 0 && (
              <img class="image" src={`${this.currentTrek.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail}`} loading="lazy" />
            )}
            <div class="sub-container">
              {this.departureCity && <div class="departure">{this.departureCity.name}</div>}
              <div class="name">{this.currentTrek?.name}</div>
              <div class="themes-container">
                {this.themes.map(theme => (
                  <div class="theme">{theme.label}</div>
                ))}
              </div>
              <div class="icons-labels-container">
                <div class="row">
                  <div class="icon-label difficulty">
                    {this.difficulty?.pictogram && <img src={this.difficulty.pictogram} />}
                    {this.difficulty?.label}
                  </div>
                  <div class="icon-label duration">
                    <span class="material-symbols material-symbols-outlined">timelapse</span>
                    {formatDuration(this.currentTrek.duration)}
                  </div>
                </div>
                <div class="row">
                  <div class="icon-label length">
                    <span class="material-symbols material-symbols-outlined">open_in_full</span>
                    {formatLength(this.currentTrek.length_2d)}
                  </div>
                  <div class="icon-label ascent">
                    <span class="material-symbols material-symbols-outlined">moving</span>
                    {formatAscent(this.currentTrek.ascent)}
                  </div>
                </div>
                <div class="row">
                  <div class="icon-label route">
                    {this.route?.pictogram && <img src={this.route.pictogram} />}
                    {this.route?.route}
                  </div>
                  <div class="icon-label practice">
                    {this.practice?.pictogram && <img src={this.practice.pictogram} />}
                    {this.practice?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Host>
    );
  }
}
