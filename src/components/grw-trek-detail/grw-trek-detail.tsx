import { Component, Host, h, Prop, State } from '@stencil/core';
import state, { onChange } from 'store/store';
import { Difficulty, Practice, Route, Trek } from 'types/types';
import { formatDuration, formatLength, formatAscent } from 'utils/utils';
import ascentImage from '../../assets/ascent.svg';
import durationImage from '../../assets/duration.svg';
import lengthImage from '../../assets/length.svg';

@Component({
  tag: 'grw-trek-detail',
  styleUrl: 'grw-trek-detail.scss',
  shadow: true,
})
export class GrwTrekDetail {
  @Prop() trek: Trek;
  @Prop() colorPrimary: string = '#6b0030';
  @Prop() colorPrimaryShade: string = '#4a0021';
  @Prop() colorPrimaryTint: string = '#974c6e';
  @State() currentTrek: Trek;
  @State() difficulty: Difficulty;
  @State() route: Route;
  @State() practice: Practice;

  componentWillLoad() {
    this.currentTrek = this.trek ? this.trek : state.currentTrek;
    if (this.currentTrek) {
      this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
      this.route = state.routes.find(route => route.id === this.currentTrek.route);
      this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
    }
    onChange('currentTrek', () => {
      this.currentTrek = this.trek ? this.trek : state.currentTrek;
      if (this.currentTrek) {
        this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
        this.route = state.routes.find(route => route.id === this.currentTrek.route);
        this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
      }
    });
  }

  render() {
    return (
      <Host style={{ '--color-primary': this.colorPrimary, '--color-primary-shade': this.colorPrimaryShade, '--color-primary-tint': this.colorPrimaryTint }}>
        {this.currentTrek && (
          <div class="trek-detail-container">
            <div class="name">{this.currentTrek.name}</div>
            {this.currentTrek.attachments && this.currentTrek.attachments[0] && <img class="image" src={this.currentTrek.attachments[0].url} loading="lazy" />}
            <div class="sub-container">
              <div class="icons-labels-container">
                <div class="row">
                  <div class="icon-label difficulty">
                    {this.difficulty?.pictogram && <img src={this.difficulty.pictogram} />}
                    {this.difficulty?.label}
                  </div>
                  <div class="icon-label duration">
                    <div class="svg-icon" innerHTML={durationImage}></div>
                    {formatDuration(this.currentTrek?.duration)}
                  </div>
                  <div class="icon-label route">
                    {this.route?.pictogram && <img src={this.route.pictogram} />}
                    {this.route?.route}
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
                  <div class="icon-label practice">
                    {this.practice?.pictogram && <img src={this.practice.pictogram} />}
                    {this.practice?.name}
                  </div>
                </div>
              </div>
            </div>
            <div class="downloads-container">
              <div class="download-title">Téléchargements</div>
              <div class="links-container">
                <a href={`${this.currentTrek.gpx}`}>GPX</a>
                <a href={`${this.currentTrek.kml}`}>KML</a>
                <a href={`${this.currentTrek.pdf}`}>PDF</a>
              </div>
            </div>
            <div class="description" innerHTML={this.currentTrek.description ? this.currentTrek.description : this.currentTrek.description_teaser}></div>
          </div>
        )}
      </Host>
    );
  }
}
