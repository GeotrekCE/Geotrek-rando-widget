import { Component, Host, h, Prop } from '@stencil/core';
import state from 'store/store';
import { Difficulty, Practice, Route, Trek } from 'types/types';
import { formatDuration, formatLength, formatAscent } from 'utils/utils';

@Component({
  tag: 'grw-trek-card',
  styleUrl: 'grw-trek-card.scss',
  shadow: true,
  assetsDirs: ['../../assets'],
})
export class GrwTrekCard {
  @Prop() trek: Trek;
  currentTrek: Trek;
  difficulty: Difficulty;
  route: Route;
  practice: Practice;

  componentWillLoad() {
    this.currentTrek = this.trek ? this.trek : state.currentTrek;
    this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
    this.route = state.routes.find(route => route.id === this.currentTrek.route);
    this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
  }

  render() {
    const ascentImage = `./assets/ascent.svg`;
    const durationImage = `./assets/duration.svg`;
    const lengthImage = `./assets/length.svg`;

    return (
      <Host>
        <div class="trek-card-container">
          <img class="image" src={this.currentTrek.attachments[0].url} />
          <div class="sub-container">
            <div class="name">{this.currentTrek.name}</div>
            <div class="description" innerHTML={this.currentTrek.description_teaser}></div>
            <div class="icons-labels-container">
              <div class="row">
                <div class="icon-label difficulty">
                  <img src={this.difficulty.pictogram} />
                  {this.difficulty.label}
                </div>
                <div class="icon-label duration">
                  <img src={durationImage} />
                  {formatDuration(this.currentTrek.duration)}
                </div>
                <div class="icon-label route">
                  <img src={this.route.pictogram} />
                  {this.route.route}
                </div>
              </div>
              <div class="row">
                <div class="icon-label length">
                  <img src={lengthImage} />
                  {formatLength(this.currentTrek.length_2d)}
                </div>
                <div class="icon-label ascent">
                  <img src={ascentImage} />
                  {formatAscent(this.currentTrek.ascent)}
                </div>
                <div class="icon-label practice">
                  <img src={this.practice.pictogram} />
                  {this.practice.name}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
