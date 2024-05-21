import { Component, Host, h, Prop, Event, EventEmitter, State, Listen, Fragment, getAssetPath, Build } from '@stencil/core';
import { trekIsAvailableOffline } from 'services/treks.service';
import state, { onChange } from 'store/store';
import { City, Difficulty, Practice, Route, Themes, Trek } from 'types/types';
import { formatDuration, formatLength, formatAscent } from 'utils/utils';
import OfflinePinIcon from '../../assets/offline_pin.svg';
import TimelapseIcon from '../../assets/timelapse.svg';
import OpenInFullIcon from '../../assets/open_in_full.svg';
import MovingIcon from '../../assets/moving.svg';

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

  @State() isAvailableOffline = false;
  @State() showDefaultImage = false;

  @Listen('trekDownloadedSuccessConfirm', { target: 'window' })
  onTrekDownloadedSuccessConfirm() {
    this.isAvailableOffline = true;
  }

  @Listen('trekDeleteSuccessConfirm', { target: 'window' })
  onTrekDeleteSuccessConfirm() {
    this.isAvailableOffline = false;
  }

  connectedCallback() {
    this.currentTrek = this.trek ? this.trek : state.currentTrek;
    if (this.currentTrek) {
      this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
      this.route = state.routes.find(route => route.id === this.currentTrek.route);
      this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
      this.themes = state.themes.filter(theme => this.currentTrek.themes.includes(theme.id));
      this.departureCity = state.cities.find(city => city.id === this.currentTrek.departure_city);
      this.handleOffline(this.currentTrek.id);
    }
    onChange('currentTrek', () => {
      this.currentTrek = this.trek ? this.trek : state.currentTrek;
      if (this.currentTrek) {
        this.difficulty = this.currentTrek.difficulty && state.difficulties ? state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty) : null;
        this.route = this.currentTrek.route && state.routes ? state.routes.find(route => route.id === this.currentTrek.route) : null;
        this.practice = this.currentTrek.practice && state.practices ? state.practices.find(practice => practice.id === this.currentTrek.practice) : null;
        this.themes = this.currentTrek.themes && state.themes ? state.themes.filter(theme => this.currentTrek.themes.includes(theme.id)) : null;
        this.departureCity = this.currentTrek.departure_city && state.cities ? state.cities.find(city => city.id === this.currentTrek.departure_city) : null;
        this.handleOffline(this.currentTrek.id);
      }
    });
  }

  async handleOffline(trekId) {
    this.isAvailableOffline = await trekIsAvailableOffline(trekId);
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
            part="trek-card"
            class={
              this.isStep
                ? `trek-card trek-card-container trek-step-card${state.selectedStepId === this.currentTrek.id ? ' selected-trek-card' : ''} ${
                    state.currentTrek && state.currentTrek.id === this.currentTrek.id ? 'is-current-step' : ''
                  }`
                : this.isLargeView
                ? `trek-card trek-card-large-view-container${state.selectedTrekId === this.currentTrek.id ? ' selected-trek-card' : ''}`
                : `trek-card trek-card-container${state.selectedTrekId === this.currentTrek.id ? ' selected-trek-card' : ''}`
            }
            onClick={() => this.trekCardPress.emit(this.currentTrek.id)}
          >
            <div part="trek-img-container" class="trek-img-container">
              {this.isAvailableOffline && (
                <div part="offline-indicator" class="offline-indicator">
                  <span part="icon" class="icon" innerHTML={OfflinePinIcon}></span>
                </div>
              )}
              {this.currentTrek.attachments.filter(attachment => attachment.type === 'image').length > 0 ? (
                <img
                  part="trek-img"
                  class="trek-img"
                  src={`${this.currentTrek.attachments.filter(attachment => attachment.type === 'image')[0].thumbnail}`}
                  alt={`${this.currentTrek.attachments.filter(attachment => attachment.type === 'image')[0].legend}`}
                  loading="lazy"
                  /* @ts-ignore */
                  onerror={event => {
                    event.target.onerror = null;
                    event.target.className = 'trek-img default-trek-img';
                    event.target.src = defaultImageSrc;
                  }}
                />
              ) : (
                <img
                  part="trek-img"
                  class="trek-img default-trek-img"
                  /* @ts-ignore */

                  src={defaultImageSrc}
                  alt=""
                  loading="lazy"
                />
              )}
            </div>
            <div part="trek-sub-container" class="trek-sub-container">
              {this.departureCity && (
                <div part="trek-departure" class="trek-departure">
                  {this.departureCity.name}
                </div>
              )}
              <div part="trek-name" class="trek-name">
                {this.currentTrek?.name}
              </div>
              {!this.isStep && this.themes && (
                <div part="trek-themes-container" class="trek-themes-container">
                  {this.themes.map(theme => (
                    <div part="trek-theme" class="trek-theme">
                      {theme.label}
                    </div>
                  ))}
                </div>
              )}
              <div part="trek-icons-labels-container" class="trek-icons-labels-container">
                {this.difficulty && (
                  <div part="trek-icon-label" class="trek-icon-label difficulty">
                    {this.difficulty.pictogram && <img part="trek-icon" class="trek-icon" src={this.difficulty.pictogram} alt="" />}
                    <span part="trek-label" class="trek-label">
                      {this.difficulty.label}
                    </span>
                  </div>
                )}
                <div part="trek-icon-label" class="trek-icon-label duration">
                  <span part="trek-icon" class="trek-icon" innerHTML={TimelapseIcon}></span>
                  <span part="trek-label" class="trek-label">
                    {formatDuration(this.currentTrek.duration)}
                  </span>
                </div>
                <div part="trek-icon-label" class="trek-icon-label length">
                  <span part="trek-icon" class="trek-icon" innerHTML={OpenInFullIcon}></span>
                  <span part="trek-label" class="trek-label">
                    {formatLength(this.currentTrek.length_2d)}
                  </span>
                </div>
                <div part="trek-icon-label" class="trek-icon-label ascent">
                  <span part="trek-icon" class="trek-icon" innerHTML={MovingIcon}></span>
                  <span part="trek-label" class="trek-label">
                    {formatAscent(this.currentTrek.ascent)}
                  </span>
                </div>
                {!this.isStep && (
                  <Fragment>
                    <div part="trek-icon-label" class="trek-icon-label route">
                      {this.route?.pictogram && <img part="trek-icon" class="trek-icon" src={this.route.pictogram} alt="" />}
                      <span part="trek-label" class="trek-label">
                        {this.route?.route}
                      </span>
                    </div>
                    <div part="trek-icon-label" class="trek-icon-label practice">
                      {this.practice?.pictogram && <img part="trek-icon" class="trek-icon" src={this.practice.pictogram} alt="" />}
                      <span part="trek-label" class="trek-label">
                        {this.practice?.name}
                      </span>
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
