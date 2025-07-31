import { Build, Component, h, Host, Prop } from '@stencil/core';
import { handleOfflineProperty, getDataInStore } from 'services/grw-db.service';
import { getTouristicContentCategory, getTouristicContentsNearTrek, getTouristicContentsNearTrekCount } from 'services/touristic-contents.service';
import { getTouristicEventsNearTrek, getTouristicEventsNearTrekCount, getTouristicEventType } from 'services/touristic-events.service';
import {
  getCities,
  getInformationsDesks,
  getPoisNearTrek,
  getPoisNearTrekCount,
  getSensitiveAreasNearTrek,
  getSignages,
  getSources,
  getTrek,
  getTrekNetwork,
} from 'services/treks.service';
import state from 'store/store';
import { Trek } from 'types/types';
import { imagesRegExp, setFilesFromStore } from 'utils/utils';

@Component({
  tag: 'grw-trek-provider',
  shadow: true,
})
export class GrwTrekProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() trekId: number;

  @Prop() portals: string;
  @Prop() inBbox: string;
  @Prop() cities: string;
  @Prop() districts: string;
  @Prop() structures: string;
  @Prop() themes: string;
  @Prop() routes: string;
  @Prop() practices: string;
  @Prop() labels: string;

  @Prop() signages = false;

  controller = new AbortController();
  signal = this.controller.signal;
  init: RequestInit = { cache: Build.isDev ? 'force-cache' : 'default', signal: this.signal };

  connectedCallback() {
    state.poisData = 0;
    state.touristicContentsData = 0;
    state.touristicEventsData = 0;
    state.currentPois = null;
    state.trekTouristicContents = null;
    state.trekTouristicEvents = null;

    if (!state.api) {
      state.api = this.api;
      state.languages = this.languages.split(',');
      state.language = state.languages[0];
    }

    state.portalsFromProviders = this.portals;
    state.inBboxFromProviders = this.inBbox;
    state.citiesFromProviders = this.cities;
    state.districtsFromProviders = this.districts;
    state.structuresFromProviders = this.structures;
    state.themesFromProviders = this.themes;
    state.routesFromProviders = this.routes;
    state.practicesFromProviders = this.practices;
    state.labelsFromProviders = this.labels;

    this.handleTrek();
  }

  disconnectedCallback() {
    state.networkError = false;
  }

  async handleTrek() {
    const trekInStore: Trek = await getDataInStore('treks', this.trekId);
    if (trekInStore && trekInStore.offline) {
      this.handleOfflineTrek(trekInStore);
    } else {
      this.handleOnlineTrek();
    }
  }

  async handleOfflineTrek(trek: Trek) {
    if ((trek && trek.children.length > 0) || state.parentTrekId) {
      const steps: number[] = [];
      if (trek.children.length > 0) {
        state.parentTrekId = trek.id;
        state.parentTrek = trek;
        steps.push(...trek.children);
      } else {
        const parentTrek = await getDataInStore('treks', state.parentTrekId);
        state.parentTrek = parentTrek;
        steps.push(...parentTrek.children);
      }
      const stepRequests = [];
      steps.forEach(stepId => {
        stepRequests.push(getDataInStore('treks', stepId));
      });
      state.currentTrekSteps = await Promise.all([...stepRequests]).then(responses => responses);
    }

    state.difficulties = await handleOfflineProperty('difficulties');
    state.routes = await handleOfflineProperty('routes');
    state.practices = await handleOfflineProperty('practices');
    state.themes = await handleOfflineProperty('themes');
    state.cities = await handleOfflineProperty('cities');
    state.accessibilities = await handleOfflineProperty('accessibilities');
    state.ratings = await handleOfflineProperty('ratings');
    state.ratingsScale = await handleOfflineProperty('ratingsScale');
    state.labels = await handleOfflineProperty('labels');
    state.sources = await handleOfflineProperty('sources');
    state.accessibilitiesLevel = await handleOfflineProperty('accessibilitiesLevel');
    state.touristicContentCategories = await handleOfflineProperty('touristicContentCategories');
    state.touristicEventTypes = await handleOfflineProperty('touristicEventTypes');
    state.networks = await handleOfflineProperty('networks');
    state.poiTypes = await handleOfflineProperty('poiTypes');

    const informationDesksInStore = await handleOfflineProperty('informationDesks');
    const informationDesks = informationDesksInStore.filter(informationDeskInStore =>
      trek.information_desks.some(information_desk => information_desk === informationDeskInStore.id),
    );
    state.currentInformationDesks = informationDesks;

    const poisInStore = await handleOfflineProperty('pois', ['url']);
    const pois = poisInStore.filter(poiInStore => trek.pois.some(trekPoi => trekPoi === poiInStore.id));
    state.currentPois = pois;
    state.poisData = pois.length;

    const touristicContentsInStore = await handleOfflineProperty('touristicContents', ['url']);
    const touristicContents = touristicContentsInStore.filter(touristicContentInStore =>
      trek.touristicContents.some(trekTouristicContent => trekTouristicContent === touristicContentInStore.id),
    );
    state.trekTouristicContents = touristicContents;
    state.touristicContentsData = touristicContents.length;

    const touristicEventsInStore = await handleOfflineProperty('touristicEvents', ['url']);
    const touristicEvents = touristicEventsInStore.filter(touristicEventInStore =>
      trek.touristicEvents.some(trekTouristicEvent => trekTouristicEvent === touristicEventInStore.id),
    );
    state.trekTouristicEvents = touristicEvents;
    state.touristicEventsData = touristicEvents.length;

    const sensitiveAreasInStore = await handleOfflineProperty('sensitiveAreas');
    const sensitiveAreas = sensitiveAreasInStore.filter(sensitiveAreaInStore => trek.sensitiveAreas.some(trekSensitiveArea => trekSensitiveArea === sensitiveAreaInStore.id));
    state.currentSensitiveAreas = sensitiveAreas;

    const signagesInStore = await handleOfflineProperty('signages');
    const signages = signagesInStore.filter(signageInStore => trek.signages.some(trekSignage => trekSignage === signageInStore.id));
    state.currentSignages = signages;

    await setFilesFromStore(trek, imagesRegExp, ['url']);
    state.currentTrek = trek;
  }

  handleOnlineTrek() {
    const requests = [];
    requests.push(
      !state.difficulties
        ? fetch(`${state.api}trek_difficulty/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,label,pictogram`, this.init)
        : new Response('null'),
    );
    requests.push(
      !state.routes
        ? fetch(`${state.api}trek_route/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,route,pictogram`, this.init)
        : new Response('null'),
    );
    requests.push(
      !state.practices
        ? fetch(`${state.api}trek_practice/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,name,pictogram`, this.init)
        : new Response('null'),
    );
    requests.push(
      !state.themes
        ? fetch(`${state.api}theme/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,label,pictogram`, this.init)
        : new Response('null'),
    );
    requests.push(
      !state.accessibilities
        ? fetch(`${state.api}trek_accessibility/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,name,pictogram`, this.init)
        : new Response('null'),
    );
    requests.push(
      !state.ratings
        ? fetch(`${state.api}trek_rating/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,name,scale`, this.init)
        : new Response('null'),
    );
    requests.push(!state.ratingsScale ? fetch(`${state.api}trek_ratingscale/?language=${state.language}&fields=id,name`, this.init) : new Response('null'));

    requests.push(this.signages ? getSignages(state.api, state.language, this.trekId, this.init) : new Response('null'));

    try {
      Promise.all([
        ...requests,
        getSensitiveAreasNearTrek(state.api, state.language, this.trekId, this.init)
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
        fetch(`${state.api}label/?language=${state.language}&fields=id,name,advice,pictogram,filter`, this.init),
        getSources(state.api, state.language, this.init),
        fetch(`${state.api}trek_accessibility_level/?language=${state.language}&fields=id,name`, this.init).catch(() => new Response('null')),
        getPoisNearTrekCount(state.api, state.language, this.trekId, this.init),
        getInformationsDesks(state.api, state.language, this.init),
        getTrekNetwork(state.api, state.language, this.init),
        getTrek(state.api, state.language, this.trekId, this.init),
        getTouristicContentsNearTrekCount(state.api, state.language, this.trekId, this.init),
        getTouristicEventsNearTrekCount(state.api, state.language, this.trekId, this.init),
      ])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(
          async ([
            difficulties,
            routes,
            practices,
            themes,
            accessibilities,
            ratings,
            ratingsScale,
            signages,
            sensitiveAreas,
            labels,
            sources,
            accessibilitiesLevel,
            pois,
            informationDesks,
            networks,
            trek,
            touristicContents,
            touristicEvents,
          ]) => {
            state.networkError = false;
            if ((trek && trek.children.length > 0) || state.parentTrekId) {
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
                stepRequests.push(getTrek(state.api, state.language, stepId, this.init));
              });
              state.currentTrekSteps = await Promise.all([...stepRequests]).then(responses => Promise.all(responses.map(response => response.json())));
            }

            let citiesToLoad = [trek.departure_city, ...trek.cities];

            if (state.currentTrekSteps) {
              state.currentTrekSteps.forEach(step => {
                citiesToLoad = [...citiesToLoad, step.departure_city, ...step.cities];
              });
            }

            if (state.cities) {
              const cityIds = state.cities.map(city => city.id);
              citiesToLoad = citiesToLoad.filter(city => city);
              citiesToLoad = citiesToLoad.filter(city => !cityIds.includes(city));
            }

            if (citiesToLoad.length > 0) {
              const cities = (await getCities(state.api, state.language, this.init, citiesToLoad).then(response => response.json())).results;
              if (cities) {
                state.cities = [...state.cities, ...cities];
              }
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

            if (accessibilities) {
              state.accessibilities = accessibilities.results;
            }
            if (ratings) {
              state.ratings = ratings.results;
            }
            if (ratingsScale) {
              state.ratingsScale = ratingsScale.results;
            }
            state.currentSignages = signages ? signages.results : [];
            if (accessibilitiesLevel) {
              state.accessibilitiesLevel = accessibilitiesLevel.results;
            }

            if (sensitiveAreas) {
              state.currentSensitiveAreas = sensitiveAreas.results;
            }

            if (labels) {
              state.labels = labels.results;
            }

            if (sources) {
              state.sources = sources.results;
            }

            if (networks) {
              state.networks = networks.results;
            }

            if (informationDesks) {
              state.currentInformationDesks = informationDesks.results;
            }

            if (pois.count) {
              state.poisData = pois.count;
            }

            if (touristicContents.count) {
              state.touristicContentsData = touristicContents.count;
            }

            if (touristicEvents.count) {
              state.touristicEventsData = touristicEvents.count;
            }
            if (trek) {
              state.currentTrek = trek;
            }
            if (state.poisData > 0) {
              Promise.all([
                getPoisNearTrek(state.api, state.language, this.trekId, this.init),
                fetch(`${state.api}poi_type/?language=${state.language}&fields=id,pictogram`, this.init),
              ])
                .then(responses => Promise.all(responses.map(response => response.json())))
                .then(([trekPois, poiTypes]) => {
                  if (poiTypes) {
                    state.poiTypes = poiTypes.results;
                  }
                  if (trekPois) {
                    state.currentPois = trekPois.results;
                  }
                })
                .catch(() => {
                  state.poisData = 0;
                });
            }

            if (state.touristicContentsData > 0) {
              Promise.all([
                getTouristicContentsNearTrek(state.api, state.language, this.trekId, this.init),
                getTouristicContentCategory(state.api, state.language, null, this.init),
              ])
                .then(responses => Promise.all(responses.map(response => response.json())))
                .then(([trekTouristicContents, touristicContentsCategory]) => {
                  if (touristicContentsCategory) {
                    state.touristicContentCategories = touristicContentsCategory.results;
                  }
                  if (trekTouristicContents) {
                    state.trekTouristicContents = trekTouristicContents.results;
                  }
                })
                .catch(() => {
                  state.touristicContentsData = 0;
                });
            }

            if (state.touristicEventsData > 0) {
              Promise.all([getTouristicEventsNearTrek(state.api, state.language, this.trekId, this.init), getTouristicEventType(state.api, state.language, null, this.init)])
                .then(responses => Promise.all(responses.map(response => response.json())))
                .then(([trekTouristicEvents, touristicEventType]) => {
                  if (touristicEventType) {
                    state.touristicEventTypes = touristicEventType.results;
                  }
                  if (trekTouristicEvents) {
                    state.trekTouristicEvents = trekTouristicEvents.results;
                  }
                })
                .catch(() => {
                  state.touristicEventsData = 0;
                });
            }
          },
        );
    } catch (error) {
      if (!(error.code === DOMException.ABORT_ERR)) {
        state.networkError = true;
      }
    }
  }

  render() {
    return <Host></Host>;
  }
}
