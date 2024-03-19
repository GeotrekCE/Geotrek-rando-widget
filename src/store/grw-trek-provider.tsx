import { Build, Component, h, Host, Prop } from '@stencil/core';
import { getAllDataInStore, getDataInStore } from 'services/grw-db.service';
import { getTouristicContentsNearTrek } from 'services/touristic-contents.service';
import { getTouristicEventsNearTrek } from 'services/touristic-events.service';
import { getPoisNearTrek, getSensitiveAreasNearTrek, getTrek } from 'services/treks.service';
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

  controller = new AbortController();
  signal = this.controller.signal;
  init: RequestInit = { cache: Build.isDev ? 'force-cache' : 'default', signal: this.signal };

  connectedCallback() {
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
    this.controller.abort();
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

    if (!state.difficulties) {
      const difficulties = await getAllDataInStore('difficulties');
      await setFilesFromStore(difficulties, imagesRegExp);
      state.difficulties = difficulties;
    }
    if (!state.routes) {
      state.routes = await getAllDataInStore('routes');
    }
    if (!state.practices) {
      state.practices = await getAllDataInStore('practices');
    }
    if (!state.themes) {
      state.themes = await getAllDataInStore('themes');
    }
    if (!state.cities) {
      state.cities = await getAllDataInStore('cities');
    }
    if (!state.accessibilities) {
      state.accessibilities = await getAllDataInStore('accessibilities');
    }
    if (!state.ratings) {
      state.ratings = await getAllDataInStore('ratings');
    }
    if (!state.ratingsScale) {
      state.ratingsScale = await getAllDataInStore('ratingsScale');
    }
    if (!state.labels) {
      state.labels = await getAllDataInStore('labels');
    }
    if (!state.sources) {
      state.sources = await getAllDataInStore('sources');
    }
    if (!state.accessibilitiesLevel) {
      state.accessibilitiesLevel = await getAllDataInStore('accessibilitiesLevel');
    }
    if (!state.touristicContentCategories) {
      state.touristicContentCategories = await getAllDataInStore('touristicContentCategories');
    }
    if (!state.touristicEventTypes) {
      state.touristicEventTypes = await getAllDataInStore('touristicEventTypes');
    }
    if (!state.networks) {
      state.networks = await getAllDataInStore('networks');
    }

    if (!state.poiTypes) {
      state.poiTypes = await getAllDataInStore('poiTypes');
    }

    const informationDesksInStore = await getAllDataInStore('informationDesks');
    const informationDesks = informationDesksInStore.filter(informationDeskInStore =>
      trek.information_desks.some(information_desk => information_desk === informationDeskInStore.id),
    );
    await setFilesFromStore(informationDesks, imagesRegExp);
    state.currentInformationDesks = informationDesks;

    const poisInStore = await getAllDataInStore('pois');
    const pois = poisInStore.filter(poiInStore => trek.pois.some(trekPoi => trekPoi === poiInStore.id));
    await setFilesFromStore(pois, imagesRegExp);
    state.currentPois = pois;

    const touristicContentsInStore = await getAllDataInStore('touristicContents');
    const touristicContents = touristicContentsInStore.filter(touristicContentInStore =>
      trek.touristicContents.some(trekTouristicContent => trekTouristicContent === touristicContentInStore.id),
    );
    await setFilesFromStore(touristicContents, imagesRegExp);
    state.trekTouristicContents = touristicContents;

    const touristicEventsInStore = await getAllDataInStore('touristicEvents');
    const touristicEvents = touristicEventsInStore.filter(touristicEventInStore =>
      trek.touristicEvents.some(trekTouristicEvent => trekTouristicEvent === touristicEventInStore.id),
    );
    await setFilesFromStore(touristicEvents, imagesRegExp);
    state.trekTouristicEvents = await getAllDataInStore('touristicEvents');

    const sensitiveAreasInStore = await getAllDataInStore('sensitiveAreas');
    const sensitiveAreas = sensitiveAreasInStore.filter(sensitiveAreaInStore => trek.sensitiveAreas.some(trekSensitiveArea => trekSensitiveArea === sensitiveAreaInStore.id));
    state.currentSensitiveAreas = sensitiveAreas;

    await setFilesFromStore(trek, imagesRegExp);
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
    requests.push(!state.cities ? fetch(`${state.api}city/?language=${state.language}&fields=id,name&published=true&page_size=999`, this.init) : new Response('null'));
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
    requests.push(!state.ratings ? fetch(`${state.api}trek_ratingscale/?language=${state.language}&fields=id,name`, this.init) : new Response('null'));

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
        fetch(`${state.api}label/?language=${state.language}&fields=id,name,advice,pictogram`, this.init),
        fetch(`${state.api}source/?language=${state.language}&fields=id,name,website,pictogram`, this.init),
        fetch(`${state.api}trek_accessibility_level/?language=${state.language}&fields=id,name`, this.init).catch(() => new Response('null')),
        getPoisNearTrek(state.api, state.language, this.trekId, this.init),
        fetch(`${state.api}poi_type/?language=${state.language}&fields=id,pictogram`, this.init),
        fetch(
          `${state.api}informationdesk/?language=${state.language}&fields=id,name,description,type,phone,email,website,municipality,postal_code,street,photo_url,latitude,longitude&page_size=999`,
          this.init,
        ),
        getTouristicContentsNearTrek(state.api, state.language, this.trekId, this.init),
        fetch(`${state.api}touristiccontent_category/?language=${state.language}&published=true&fields=id,label,pictogram&page_size=999`, this.init),
        getTouristicEventsNearTrek(state.api, state.language, this.trekId, this.init),
        fetch(`${state.api}touristicevent_type/?language=${state.language}&published=true&fields=id,type,pictogram&page_size=999`, this.init),
        fetch(`${state.api}trek_network/?language=${state.language}&published=true&fields=id,label,pictogram&page_size=999`, this.init),
        getTrek(state.api, state.language, this.trekId, this.init),
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
            ratings,
            ratingsScale,
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
            networks,
            trek,
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
            if (ratings) {
              state.ratings = ratings.results;
            }
            if (ratingsScale) {
              state.ratingsScale = ratingsScale.results;
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
              state.trekTouristicEvents = touristicEvent.results;
            }
            if (touristicEventType) {
              state.touristicEventTypes = touristicEventType.results;
            }
            if (networks) {
              state.networks = networks.results;
            }
            if (pois) {
              state.currentPois = pois.results;
            }
            if (poiTypes) {
              state.poiTypes = poiTypes.results;
            }
            if (informationDesks) {
              state.currentInformationDesks = informationDesks.results;
            }
            if (trek) {
              state.currentTrek = trek;
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
