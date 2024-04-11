import { Build, Component, h, Host, Prop } from '@stencil/core';
import { getOutdoorCourses } from 'services/outdoor-courses.service';
import { getCities, getDistricts, getThemes } from 'services/treks.service';
import state from 'store/store';

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
    this.handleOutdoorSites();
  }

  handleOutdoorSites() {
    const requests = [];
    requests.push(!state.cities ? getCities(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.districts ? getDistricts(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.themes ? getThemes(state.api, state.language, this.portals, this.init) : new Response('null'));
    requests.push(getOutdoorCourses(state.api, state.language, this.inBbox, this.cities, this.districts, this.structures, this.themes, this.portals, this.init));
    try {
      Promise.all([...requests])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(([cities, districts, themes, outdoorCourses]) => {
          state.networkError = false;

          if (cities) {
            state.cities = cities.results;
          }
          if (districts) {
            state.districts = districts.results;
          }
          if (themes) {
            state.themes = themes.results;
          }

          state.outdoorCourses = outdoorCourses.results;
          state.currentOutdoorCourses = outdoorCourses.results;
        });
    } catch (error) {
      if (!(error.code === DOMException.ABORT_ERR)) {
        state.networkError = true;
      }
    }
  }

  disconnectedCallback() {
    this.controller.abort();
    state.networkError = false;
  }
  render() {
    return <Host></Host>;
  }
}
