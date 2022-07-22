import { Component, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';
import state, { onChange } from 'store/store';
import { Difficulty, Practice, Route, Themes, Trek } from 'types/types';
import { formatDuration, formatLength, formatAscent } from 'utils/utils';
import ascentImage from '../../assets/ascent.svg';
import durationImage from '../../assets/duration.svg';
import lengthImage from '../../assets/length.svg';

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
  @Prop() trek: Trek;
  @Prop() colorPrimary = '#6b0030';
  @Prop() colorPrimaryTint = '#974c6e';
  @Prop() isLargeView = false;

  componentWillLoad() {
    this.currentTrek = this.trek ? this.trek : state.currentTrek;
    if (this.currentTrek) {
      this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
      this.route = state.routes.find(route => route.id === this.currentTrek.route);
      this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
      this.themes = state.themes.filter(theme => this.currentTrek.themes.includes(theme.id));
    }
    onChange('currentTrek', () => {
      this.currentTrek = this.trek ? this.trek : state.currentTrek;
      if (this.currentTrek) {
        this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
        this.route = state.routes.find(route => route.id === this.currentTrek.route);
        this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
        this.themes = state.themes.filter(theme => this.currentTrek.themes.includes(theme.id));
      }
    });
  }

  render() {
    return (
      <Host
        onClick={() => this.trekCardPress.emit(this.currentTrek.id)}
        style={{ 'width': this.isLargeView ? '100%' : 'auto', '--color-primary': this.colorPrimary, '--color-primary-tint': this.colorPrimaryTint }}
      >
        {this.currentTrek && (
          <div class={this.isLargeView ? 'trek-card-large-view-container' : 'trek-card-container'}>
            {this.currentTrek.attachments && this.currentTrek.attachments[0] && this.currentTrek.attachments[0].thumbnail && (
              <img class="image" src={`${this.currentTrek.attachments[0].thumbnail}`} loading="lazy" />
            )}
            <div class="sub-container">
              <div class="departure">{this.currentTrek?.departure}</div>
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
                    <div class="svg-icon" innerHTML={durationImage}></div>
                    {formatDuration(this.currentTrek.duration)}
                  </div>
                </div>
                <div class="row">
                  <div class="icon-label length">
                    <div class="svg-icon" innerHTML={lengthImage}></div>
                    {formatLength(this.currentTrek.length_2d)}
                  </div>
                  <div class="icon-label ascent">
                    <div class="svg-icon" innerHTML={ascentImage}></div>
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
