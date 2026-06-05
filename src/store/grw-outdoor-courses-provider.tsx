import { Build, Component, h, Host, Prop } from '@stencil/core';
import { getAllDataInStore, handleOfflineProperty } from 'services/grw-db.service';
import { getOutdoorCourses } from 'services/outdoor-courses.service';
import { getCities, getDistricts, getThemes } from 'services/treks.service';
import state from 'store/store';
import { OutdoorCourses } from 'types/types';

@Component({
  tag: 'grw-outdoor-courses-provider',
  shadow: true,
})
export class GrwOutdoorCoursesProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() inBbox: string;
  @Prop() cities: string;
  @Prop() districts: string;
  @Prop() structures: string;
  @Prop() themes: string;
  @Prop() portals: string;

  controller = new AbortController();
  signal = this.controller.signal;
  init: RequestInit = { cache: Build.isDev ? 'force-cache' : 'default', signal: this.signal };

  connectedCallback() {
    if (!state.api) {
      state.api = this.api;
      state.languages = this.languages.split(',');
      state.language = state.languages[0];
    }
    this.handleOutdoorCourses();
  }

  handleOutdoorCourses() {
    this.handleOnlineOutdoorCourses();
  }

  async handleOfflineOutdoorCourses(outdoorCourses: OutdoorCourses) {
    state.cities = await handleOfflineProperty('cities');
    state.districts = await handleOfflineProperty('districts');
    state.themes = await handleOfflineProperty('themes');
    outdoorCourses = await handleOfflineProperty('outdoorCourses');

    state.outdoorCourses = outdoorCourses;
    state.currentOutdoorCourses = outdoorCourses;
  }

  handleOnlineOutdoorCourses() {
    const requests = [];
    requests.push(!state.districts ? getDistricts(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.themes ? getThemes(state.api, state.language, this.portals, this.init) : new Response('null'));
    requests.push(getOutdoorCourses(state.api, state.language, this.inBbox, this.cities, this.districts, this.structures, this.themes, this.portals, this.init));
    Promise.all([...requests])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(async ([districts, themes, outdoorCourses]) => {
        state.networkError = false;

        if (districts) {
          state.districts = districts.results;
        }
        if (themes) {
          state.themes = themes.results;
        }

        state.outdoorCourses = outdoorCourses.results;
        state.currentOutdoorCourses = outdoorCourses.results;

        if (!state.cities || state.cities.length === 0) {
          const cityIds = new Set<number>();
          if (outdoorCourses && outdoorCourses.results) {
            outdoorCourses.results.forEach(item => {
              if (item.cities) {
                item.cities.forEach(c => cityIds.add(c));
              }
            });
          }
          if (cityIds.size > 0) {
            try {
              const citiesResponse = await getCities(state.api, state.language, this.init, Array.from(cityIds));
              const citiesData = await citiesResponse.json();
              state.cities = citiesData.results || [];
            } catch (e) {
              console.error('Failed to load cities', e);
            }
          }
        }
      })
      .catch(async () => {
        const outdoorCoursesInStore: OutdoorCourses = await getAllDataInStore('outdoorCourses');
        if (outdoorCoursesInStore && outdoorCoursesInStore.length > 0) {
          this.handleOfflineOutdoorCourses(outdoorCoursesInStore);
        } else {
          state.networkError = true;
        }
      });
  }

  disconnectedCallback() {
    this.controller.abort();
    state.networkError = false;
  }
  render() {
    return <Host></Host>;
  }
}
