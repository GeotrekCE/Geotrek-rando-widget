import { Component, Host, h, Prop, State } from '@stencil/core';
import state, { onChange } from 'store/store';
import { Accessibilities, AccessibilityLevel, Difficulty, Labels, Practice, Route, Sources, Themes, Trek } from 'types/types';
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
  @State() difficulty: Difficulty;
  @State() route: Route;
  @State() practice: Practice;
  @State() themes: Themes;
  @State() labels: Labels;
  @State() sources: Sources;
  @State() accessibilities: Accessibilities;
  @State() accessibilityLevel: AccessibilityLevel;
  @Prop() trek: Trek;
  @Prop() colorPrimary: string = '#6b0030';
  @Prop() colorPrimaryShade: string = '#4a0021';
  @Prop() colorPrimaryTint: string = '#974c6e';
  @State() currentTrek: Trek;

  componentWillLoad() {
    this.currentTrek = this.trek ? this.trek : state.currentTrek;
    if (this.currentTrek) {
      this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
      this.route = state.routes.find(route => route.id === this.currentTrek.route);
      this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
      this.themes = state.themes.filter(theme => this.currentTrek.themes.includes(theme.id));
      this.labels = state.labels.filter(label => this.currentTrek.labels.includes(label.id));
      this.sources = state.sources.filter(source => this.currentTrek.source.includes(source.id));
      this.accessibilities = state.accessibilities.filter(accessibility => this.currentTrek.accessibilities.includes(accessibility.id));
      this.accessibilityLevel = state.accessibilitiesLevel.find(accessibilityLevel => this.currentTrek.accessibility_level === accessibilityLevel.id);
    }
    onChange('currentTrek', () => {
      this.currentTrek = this.trek ? this.trek : state.currentTrek;
      if (this.currentTrek) {
        this.difficulty = state.difficulties.find(difficulty => difficulty.id === this.currentTrek.difficulty);
        this.route = state.routes.find(route => route.id === this.currentTrek.route);
        this.practice = state.practices.find(practice => practice.id === this.currentTrek.practice);
        this.themes = state.themes.filter(theme => this.currentTrek.themes.includes(theme.id));
        this.labels = state.labels.filter(label => this.currentTrek.labels.includes(label.id));
        this.sources = state.sources.filter(source => this.currentTrek.source.includes(source.id));
      }
    });
  }

  render() {
    return (
      <Host style={{ '--color-primary': this.colorPrimary, '--color-primary-shade': this.colorPrimaryShade, '--color-primary-tint': this.colorPrimaryTint }}>
        {this.currentTrek && (
          <div class="trek-detail-container">
            <div class="name">{this.currentTrek.name}</div>
            {this.currentTrek.attachments && this.currentTrek.attachments[0] && this.currentTrek.attachments[0].thumbnail && (
              <img class="image" src={this.currentTrek.attachments[0].thumbnail} loading="lazy" />
            )}
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
            {this.themes.length > 0 && (
              <div class="themes-container">
                {this.themes.map(theme => (
                  <div class="theme">{theme.label}</div>
                ))}
              </div>
            )}
            {this.currentTrek.description_teaser && <div class="description-teaser" innerHTML={this.currentTrek.description_teaser}></div>}
            {this.currentTrek.ambiance && <div class="ambiance" innerHTML={this.currentTrek.ambiance}></div>}
            {this.currentTrek.description && (
              <div class="description-container">
                <div class="description-title">Description</div>
                <div class="description" innerHTML={this.currentTrek.description}></div>
              </div>
            )}
            {this.currentTrek.departure && (
              <div class="departure-container">
                <div class="departure-title">Départ :&nbsp;</div>
                <div innerHTML={this.currentTrek.departure}></div>
              </div>
            )}
            {this.currentTrek.arrival && (
              <div class="arrival-container">
                <div class="arrival-title">Arrivée :&nbsp;</div>
                <div innerHTML={this.currentTrek.arrival}></div>
              </div>
            )}
            {this.currentTrek.altimetric_profile && (
              <div class="altimetric-profile-container">
                <div class="altimetric-profile-title">Profil altimétrique</div>
                <img src={this.currentTrek.altimetric_profile} />
              </div>
            )}
            {this.currentTrek.access && (
              <div class="access-container">
                <div class="access-title">Accès routier</div>
                <div class="access" innerHTML={this.currentTrek.access}></div>
              </div>
            )}
            {this.currentTrek.public_transport && (
              <div class="public-transport-container">
                <div class="public-transport-title">Transport</div>
                <div class="public-transport" innerHTML={this.currentTrek.public_transport}></div>
              </div>
            )}
            {(this.currentTrek.advice || this.labels.length > 0) && (
              <div class="advice-container">
                <div class="advice-title">Recommandations</div>
                {this.currentTrek.advice && <div class="advice" innerHTML={this.currentTrek.advice}></div>}
                {this.labels.map(label => (
                  <div class="label-container">
                    <div class="label-sub-container">
                      {label.pictogram && <img src={label.pictogram} />}
                      <div class="label-name" innerHTML={label.name}></div>
                    </div>
                    <div class="label-advice" innerHTML={label.advice}></div>
                  </div>
                ))}
              </div>
            )}
            {this.currentTrek.advised_parking && (
              <div class="advised-parking-container">
                <div class="advised-parking-title">Parking conseillé</div>
                <div class="advised_parking" innerHTML={this.currentTrek.advised_parking}></div>
              </div>
            )}
            {this.currentTrek.gear && (
              <div class="gear-container">
                <div class="gear-title">Équipements</div>
                <div class="gear" innerHTML={this.currentTrek.gear}></div>
              </div>
            )}
            {state.currentSensitiveAreas && state.currentSensitiveAreas.length > 0 && (
              <div class="sensitive-areas-container">
                <div class="sensitive-areas-title">Zones de sensibilité environnementale</div>
                {state.currentSensitiveAreas.map(sensitiveArea => (
                  <grw-sensitive-area-detail sensitiveArea={sensitiveArea}></grw-sensitive-area-detail>
                ))}
              </div>
            )}
            {state.currentInformationDesks && state.currentInformationDesks.length > 0 && (
              <div class="information-desks-container">
                <div class="information-desks-title">Lieux de renseignement</div>
                {state.currentInformationDesks.map(informationDesk => (
                  <grw-information-desk-detail informationDesk={informationDesk}></grw-information-desk-detail>
                ))}
              </div>
            )}
            {
              <div class="accessibilities-container">
                <div class="accessibilities-title">Accessibilité</div>
                {this.currentTrek.disabled_infrastructure && <div innerHTML={this.currentTrek.disabled_infrastructure}></div>}
                <div class="accessibilities-content-container">
                  {this.accessibilities.map(accessibility => (
                    <div class="accessibility-content-container">
                      <img src={accessibility.pictogram}></img>
                      <div innerHTML={accessibility.name}></div>
                    </div>
                  ))}
                </div>
                {this.currentTrek.accessibility_level && (
                  <div class="accessibility-level-container">
                    <div class="accessibility-level-title">Niveau d'accessibilité</div>
                    <div innerHTML={this.accessibilityLevel.name}></div>
                  </div>
                )}
                {this.currentTrek.accessibility_slope && (
                  <div class="accessibility-slope-container">
                    <div class="accessibility-slope-title">Pente</div>
                    <div innerHTML={this.currentTrek.accessibility_slope}></div>
                  </div>
                )}
                {this.currentTrek.accessibility_width && (
                  <div class="accessibility-width-container">
                    <div class="accessibility-width-title">Largeur</div>
                    <div innerHTML={this.currentTrek.accessibility_width}></div>
                  </div>
                )}
                {this.currentTrek.accessibility_signage && (
                  <div class="accessibility-signage-container">
                    <div class="accessibility-signage-title">Pente</div>
                    <div innerHTML={this.currentTrek.accessibility_signage}></div>
                  </div>
                )}
                {this.currentTrek.accessibility_covering && (
                  <div class="accessibility-covering-container">
                    <div class="accessibility-covering-title">Revêtement</div>
                    <div innerHTML={this.currentTrek.accessibility_covering}></div>
                  </div>
                )}
                {this.currentTrek.accessibility_exposure && (
                  <div class="accessibility-exposure-container">
                    <div class="accessibility-exposure-title">Exposition</div>
                    <div innerHTML={this.currentTrek.accessibility_exposure}></div>
                  </div>
                )}
                {this.currentTrek.accessibility_advice && (
                  <div class="accessibility-advice-container">
                    <div class="accessibility-advice-title">Conseils</div>
                    <div innerHTML={this.currentTrek.accessibility_advice}></div>
                  </div>
                )}
              </div>
            }
            {state.currentPois && state.currentPois.length > 0 && (
              <div class="pois-container">
                <div class="pois-title">Points d'intérêts</div>
                {state.currentPois.map(poi => (
                  <grw-poi-detail poi={poi}></grw-poi-detail>
                ))}
              </div>
            )}
            {this.currentTrek.source && this.currentTrek.source.length > 0 && (
              <div class="source-container">
                <div class="source-title">Sources</div>
                {this.sources.map(source => (
                  <div class="source-sub-container">
                    {source.pictogram && <img src={source.pictogram} />}
                    <div>
                      <div class="source-name" innerHTML={source.name}></div>
                      <a class="source-advice" innerHTML={source.website}></a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Host>
    );
  }
}
