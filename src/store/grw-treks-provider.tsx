import { Build, Component, h, Host, Prop } from '@stencil/core';
import { getAllDataInStore } from 'services/grw-db.service';
import { getDistricts, getTreksList, trekIsAvailableOffline } from 'services/treks.service';
import state from 'store/store';
import { Treks } from 'types/types';
import { durations, elevations, lengths } from 'utils/utils';

@Component({
  tag: 'grw-treks-provider',
  shadow: true,
})
export class GrwTreksProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() inBbox: string;
  @Prop() cities: string;
  @Prop() districts: string;
  @Prop() structures: string;
  @Prop() themes: string;
  @Prop() portals: string;
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

    this.handleTreks();
  }

  disconnectedCallback() {
    this.controller.abort();
    state.networkError = false;
  }

  async handleTreks() {
    this.handleOnlineTreks();
  }

  async handleOfflineTreks(treks: Treks) {
    if (!state.difficulties) {
      state.difficulties = await getAllDataInStore('difficulties');
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
    if (!state.labels) {
      state.labels = await getAllDataInStore('labels');
    }
    if (!state.districts) {
      state.districts = await getAllDataInStore('districts');
    }
    if (!state.durations) {
      state.durations = durations;
    }
    if (!state.lengths) {
      state.lengths = lengths;
    }
    if (!state.elevations) {
      state.elevations = elevations;
    }
    this.sortTreks(treks);
    state.treks = treks;
    state.currentTreks = treks;
  }

  sortTreks(treks) {
    treks.sort((a, b) => {
      return a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });
  }

  handleOnlineTreks() {
    Promise.all([
      fetch(`${state.api}trek_difficulty/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,label,pictogram`, this.init),
      fetch(`${state.api}trek_route/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,route,pictogram`, this.init),
      fetch(`${state.api}trek_practice/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,name,pictogram`, this.init),
      fetch(`${state.api}theme/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,label,pictogram`, this.init),
      fetch(`${state.api}city/?language=${state.language}&fields=id,name&published=true&page_size=999`, this.init),
      fetch(
        `${state.api}trek_accessibility/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,name,pictogram&published=true&page_size=999`,
        this.init,
      ),
      fetch(
        `${state.api}label/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,name,advice,pictogram,filter&published=true&page_size=999`,
        this.init,
      ),
      getDistricts(state.api, state.language, this.init),
      getTreksList(
        this.api,
        state.language,
        this.inBbox,
        this.cities,
        this.districts,
        this.structures,
        this.themes,
        this.portals,
        this.routes,
        this.practices,
        this.labels,
        this.init,
      ),
    ])
      .then(responses => {
        responses.forEach(response => {
          if (response.status !== 200) {
            throw new Error('network error');
          }
        });
        return Promise.all(responses.map(response => response.json()));
      })
      .then(async ([difficulties, routes, practices, themes, cities, accessibility, labels, districts, treks]) => {
        state.networkError = false;
        state.difficulties = difficulties.results;
        state.routes = routes.results;
        state.practices = practices.results.map(practice => ({ ...practice, selected: false }));
        state.themes = themes.results;
        state.cities = cities.results;
        state.accessibilities = accessibility.results;
        state.labels = labels.results;
        state.districts = districts.results;
        state.durations = durations;
        state.lengths = lengths;
        state.elevations = elevations;
        const treksWithOfflineValue = [];
        for (let index = 0; index < treks.results.length; index++) {
          const offline = await trekIsAvailableOffline(treks.results[index].id);
          treksWithOfflineValue.push({ ...treks.results[index], offline });
        }
        state.treks = treksWithOfflineValue;
        state.currentTreks = treksWithOfflineValue;
      })
      .catch(async () => {
        const treksInStore: Treks = await getAllDataInStore('treks');
        if (treksInStore && treksInStore.length > 0) {
          this.handleOfflineTreks(treksInStore);
        } else {
          state.networkError = true;
        }
      });
  }

  render() {
    return <Host></Host>;
  }
}
