import { Build, Component, h, Host, Prop } from '@stencil/core';
import state from 'store/store';

@Component({
  tag: 'grw-trek-provider',
  shadow: true,
})
export class GrwTrekProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() trekId: string;
  controller = new AbortController();
  signal = this.controller.signal;
  init: RequestInit = { cache: Build.isDev ? 'force-cache' : 'default', signal: this.signal };

  connectedCallback() {
    if (!state.api) {
      state.api = this.api;
      state.languages = this.languages.split(',');
      state.language = state.languages[0];
    }
    this.handleTrek();
  }

  handleTrek() {
    const requests = [];
    requests.push(!state.difficulties ? fetch(`${state.api}trek_difficulty/?language=${state.language}&fields=id,label,pictogram`, this.init) : new Response('null'));
    requests.push(!state.routes ? fetch(`${state.api}trek_route/?language=${state.language}&fields=id,route,pictogram`, this.init) : new Response('null'));
    requests.push(!state.practices ? fetch(`${state.api}trek_practice/?language=${state.language}&fields=id,name,pictogram`, this.init) : new Response('null'));
    requests.push(!state.themes ? fetch(`${state.api}theme/?language=${state.language}&fields=id,label,pictogram`, this.init) : new Response('null'));
    requests.push(!state.cities ? fetch(`${state.api}city/?language=${state.language}&fields=id,name&published=true&page_size=999`, this.init) : new Response('null'));
    requests.push(!state.accessibilities ? fetch(`${state.api}trek_accessibility/?language=${state.language}&fields=id,name,pictogram`, this.init) : new Response('null'));
    Promise.all([
      ...requests,
      fetch(
        `${this.api}sensitivearea/?language=${state.language}&published=true&trek=${this.trekId}&fields=id,geometry,name,description,contact,info_url,period,practices`,
        this.init,
      )
        .then(response => {
          if (response.ok) {
            return response;
          } else {
            throw new Error('Sentive area error');
          }
        })
        .catch(() => {
          return new Response('null');
        }),
      fetch(`${state.api}label/?language=${state.language}&fields=id,name,advice,pictogram`, this.init),
      fetch(`${state.api}source/?language=${state.language}&fields=id,name,website,pictogram`, this.init),
      fetch(`${state.api}trek_accessibility_level/?language=${state.language}&fields=id,name`, this.init).catch(() => new Response('null')),
      fetch(`${state.api}poi/?language=${state.language}&trek=${this.trekId}&published=true&fields=id,name,description,attachments,type,geometry&page_size=999`, this.init),
      fetch(`${state.api}poi_type/?language=${state.language}&fields=id,pictogram`, this.init),
      fetch(
        `${state.api}informationdesk/?language=${state.language}&fields=id,name,description,type,phone,email,website,municipality,postal_code,street,photo_url,latitude,longitude&page_size=999`,
        this.init,
      ),
      fetch(
        `${state.api}touristiccontent/?language=${state.language}&near_trek=${this.trekId}&published=true&fields=id,name,attachments,category,geometry&page_size=999`,
        this.init,
      ),
      fetch(`${state.api}touristiccontent_category/?language=${state.language}&published=true&fields=id,label,pictogram&page_size=999`, this.init),
      fetch(`${state.api}touristicevent/?language=${state.language}&near_trek=${this.trekId}&published=true&fields=id,name,attachments,type,geometry&page_size=999`, this.init),
      fetch(`${state.api}touristicevent_type/?language=${state.language}&published=true&fields=id,type,pictogram&page_size=999`, this.init),
      fetch(
        `${state.api}trek/${this.trekId}/?language=${state.language}&published=true&fields=id,name,attachments,description,description_teaser,difficulty,duration,ascent,length_2d,practice,themes,route,geometry,gpx,kml,pdf,parking_location,departure,departure_city,arrival,cities,ambiance,access,public_transport,advice,advised_parking,gear,labels,source,points_reference,disabled_infrastructure,accessibility_level,accessibility_slope,accessibility_width,accessibility_signage,accessibility_covering,accessibility_exposure,accessibility_advice,accessibilities,information_desks,children`,
        this.init,
      ),
    ])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(
        async ([
          difficulties,
          routes,
          practices,
          themes,
          cities,
          accessibilities,
          sensitiveAreas,
          labels,
          sources,
          accessibilitiesLevel,
          pois,
          poiTypes,
          informationDesks,
          touristicContent,
          touristicContentCategory,
          touristicEvent,
          touristicEventType,
          trek,
        ]) => {
          state.trekNetworkError = false;

          if (trek.children.length > 0 || state.parentTrekId) {
            const steps: number[] = [];
            if (trek.children.length > 0) {
              state.parentTrekId = trek.id;
              state.parentTrek = trek;
              steps.push(...trek.children);
            } else {
              const parentTrek = await fetch(`${state.api}trek/${state.parentTrekId}/?language=${state.language}&published=true&fields=name,children`).then(response =>
                response.json(),
              );
              state.parentTrek = parentTrek;
              steps.push(...parentTrek.children);
            }
            const stepRequests = [];
            steps.forEach(stepId => {
              stepRequests.push(
                fetch(
                  `${state.api}trek/${stepId}/?language=${state.language}&published=true&fields=id,name,attachments,description_teaser,difficulty,duration,ascent,length_2d,practice,themes,route,departure,departure_city,departure_geom,cities,accessibilities,labels,districts`,
                ),
              );
            });
            state.currentTrekSteps = await Promise.all([...stepRequests]).then(responses => Promise.all(responses.map(response => response.json())));
          }

          if (difficulties) {
            state.difficulties = difficulties.results;
          }
          if (routes) {
            state.routes = routes.results;
          }
          if (practices) {
            state.practices = practices.results.map(practice => ({ ...practice, selected: false }));
          }
          if (themes) {
            state.themes = themes.results;
          }
          if (cities) {
            state.cities = cities.results;
          }

          if (accessibilities) {
            state.accessibilities = accessibilities.results;
          }

          if (sensitiveAreas) {
            state.currentSensitiveAreas = sensitiveAreas.results;
          }
          state.labels = labels.results;
          state.sources = sources.results;
          if (accessibilitiesLevel) {
            state.accessibilitiesLevel = accessibilitiesLevel.results;
          }
          if (touristicContent) {
            state.trekTouristicContents = touristicContent.results;
          }
          if (touristicContentCategory) {
            state.touristicContentCategories = touristicContentCategory.results;
          }
          if (touristicEvent) {
            state.touristicEvents = touristicEvent.results;
          }
          if (touristicEventType) {
            state.touristicEventTypes = touristicEventType.results;
          }
          state.currentPois = pois.results;
          state.poiTypes = poiTypes.results;
          state.currentInformationDesks = informationDesks.results;
          state.currentTrek = trek;
        },
      )
      .catch(() => {
        state.trekNetworkError = true;
      });
  }

  disconnectedCallback() {
    this.controller.abort();
    state.trekNetworkError = false;
  }

  render() {
    return <Host></Host>;
  }
}
