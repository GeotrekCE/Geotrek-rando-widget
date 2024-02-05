import { Component, Host, h, Prop, Event, EventEmitter, State, Listen, Fragment, getAssetPath, Build } from '@stencil/core';
import state, { onChange } from 'store/store';
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

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorSecondaryContainer = '#e8def8';
  @Prop() colorOnSecondaryContainer = '#1d192b';
  @Prop() colorSurfaceContainerLow = '#f7f2fa';
  @Prop() isLargeView = false;
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
        this.difficulty = this.currentTrek.difficulty && state.difficulties ? state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty) : null;
        this.route = this.currentTrek.route && state.routes ? state.routes.find(route => route.id === this.currentTrek.route) : null;
        this.practice = this.currentTrek.practice && state.practices ? state.practices.find(practice => practice.id === this.currentTrek.practice) : null;
        this.themes = this.currentTrek.themes && state.themes ? state.themes.filter(theme => this.currentTrek.themes.includes(theme.id)) : null;
        this.departureCity = this.currentTrek.departure_city && state.cities ? state.cities.find(city => city.id === this.currentTrek.departure_city) : null;
      }
    });
  }

  @Listen('mouseover')
  handleMouseOver() {
    this.cardTrekMouseOver.emit(this.currentTrek.id);
  }

  @Listen('mouseleave')
  handleMouseLeave() {
    this.cardTrekMouseLeave.emit();
  }

  render() {
    const defaultImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/default-image.svg`);
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
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
                ? `trek-card-container trek-step-card${state.selectedStepId === this.currentTrek.id ? ' selected-trek-card' : ''} ${
                    state.currentTrek.id === this.currentTrek.id ? 'is-current-step' : ''
                  }`
                : this.isLargeView
                ? `trek-card-large-view-container${state.selectedTrekId === this.currentTrek.id ? ' selected-trek-card' : ''}`
                : `trek-card-container${state.selectedTrekId === this.currentTrek.id ? ' selected-trek-card' : ''}`
            }
            onClick={() => this.trekCardPress.emit(this.currentTrek.id)}
          >
            <div class="trek-img-container">
              {this.currentTrek.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
                <img
                  /* @ts-ignore */
                  crossorigin="anonymous"
                  class="image"
                  src={`${this.currentTrek.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail}`}
                  loading="lazy"
                />
              ) : (
                <img
                  /* @ts-ignore */
                  crossorigin="anonymous"
                  class="image default-trek-img"
                  src={defaultImageSrc}
                  loading="lazy"
                />
              )}
            </div>
            <div class="sub-container">
              {this.departureCity && <div class="departure">{this.departureCity.name}</div>}
              <div class="name">{this.currentTrek?.name}</div>
              {!this.isStep && this.themes && (
                <div class="themes-container">
                  {this.themes.map(theme => (
                    <div class="theme">{theme.label}</div>
                  ))}
                </div>
              )}
              <div class="icons-labels-container">
                {this.difficulty && (
                  <div class="icon-label">
                    {this.difficulty.pictogram && (
                      <img
                        /* @ts-ignore */
                        crossorigin="anonymous"
                        class="icon"
                        src={this.difficulty.pictogram}
                      />
                    )}
                    <span class="difficulty">{this.difficulty.label}</span>
                  </div>
                )}
                <div class="icon-label duration">
                  {/* @ts-ignore */}
                  <span translate={false} class="material-symbols material-symbols-outlined icon">
                    timelapse
                  </span>
                  {formatDuration(this.currentTrek.duration)}
                </div>
                <div class="icon-label length">
                  {/* @ts-ignore */}
                  <span translate={false} class="material-symbols material-symbols-outlined icon">
                    open_in_full
                  </span>
                  {formatLength(this.currentTrek.length_2d)}
                </div>
                <div class="icon-label ascent">
                  {/* @ts-ignore */}
                  <span translate={false} class="material-symbols material-symbols-outlined icon">
                    moving
                  </span>
                  {formatAscent(this.currentTrek.ascent)}
                </div>
                {!this.isStep && (
                  <Fragment>
                    <div class="icon-label route">
                      {this.route?.pictogram && (
                        <img
                          /* @ts-ignore */
                          crossorigin="anonymous"
                          class="icon"
                          src={this.route.pictogram}
                        />
                      )}
                      {this.route?.route}
                    </div>
                    <div class="icon-label practice">
                      {this.practice?.pictogram && (
                        <img
                          /* @ts-ignore */
                          crossorigin="anonymous"
                          class="icon"
                          src={this.practice.pictogram}
                        />
                      )}
                      {this.practice?.name}
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        )}
      </Host>
    );
  }
}
