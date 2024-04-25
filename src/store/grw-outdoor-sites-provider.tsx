import { Build, Component, h, Host, Prop } from '@stencil/core';
import { getAllDataInStore, handleOfflineProperty } from 'services/grw-db.service';
import { getOutdoorPractices, getOutdoorSites, getOutdoorSiteTypes, outdoorSiteIsAvailableOffline } from 'services/outdoor-sites.service';
import { getCities, getDistricts, getThemes } from 'services/treks.service';
import state from 'store/store';
import { OutdoorSites } from 'types/types';

@Component({
  tag: 'grw-outdoor-sites-provider',
  shadow: true,
})
export class GrwOutdoorSitesProvider {
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

    state.portalsFromProviders = this.portals;
    state.inBboxFromProviders = this.inBbox;
    state.citiesFromProviders = this.cities;
    state.districtsFromProviders = this.districts;
    state.structuresFromProviders = this.structures;
    state.themesFromProviders = this.themes;

    this.handleOutdoorSites();
  }

  async handleOutdoorSites() {
    this.handleOnlineOutdoorSites();
  }

  async handleOfflineOutdoorSites(outdoorSites: OutdoorSites) {
    state.cities = await handleOfflineProperty('cities');
    state.districts = await handleOfflineProperty('districts');
    state.themes = await handleOfflineProperty('themes');
    state.outdoorSiteTypes = await handleOfflineProperty('outdoorSiteTypes');
    state.outdoorPractices = await handleOfflineProperty('outdoorPractices');
    outdoorSites = await handleOfflineProperty('outdoorSites');
    state.outdoorSites = outdoorSites;
    state.currentOutdoorSites = outdoorSites;
  }

  handleOnlineOutdoorSites() {
    const requests = [];
    requests.push(!state.cities ? getCities(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.districts ? getDistricts(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.themes ? getThemes(state.api, state.language, this.portals, this.init) : new Response('null'));
    requests.push(!state.outdoorSiteTypes ? getOutdoorSiteTypes(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.outdoorPractices ? getOutdoorPractices(state.api, state.language, this.init) : new Response('null'));
    requests.push(getOutdoorSites(state.api, state.language, this.inBbox, this.cities, this.districts, this.structures, this.themes, this.portals, this.init));
    Promise.all([...requests])
      .then(responses => Promise.all(responses.map(response => response.json())))
      .then(async ([cities, districts, themes, outdoorSiteTypes, outdoorPractices, outdoorSites]) => {
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
        if (outdoorSiteTypes) {
          state.outdoorSiteTypes = outdoorSiteTypes.results;
        }
        if (outdoorPractices) {
          state.outdoorPractices = outdoorPractices.results;
        }

        const outdoorSitesWithOfflineValue = [];
        for (let index = 0; index < outdoorSites.results.length; index++) {
          const offline = await outdoorSiteIsAvailableOffline(outdoorSites.results[index].id);
          outdoorSitesWithOfflineValue.push({ ...outdoorSites.results[index], offline });
        }
        state.outdoorSites = outdoorSitesWithOfflineValue;
        state.currentOutdoorSites = outdoorSitesWithOfflineValue;
      })
      .catch(async () => {
        const outdoorSitesInStore: OutdoorSites = await getAllDataInStore('outdoorSites');
        outdoorSitesInStore.filter(outdoorSite => outdoorSite.parents && outdoorSite.parents.length === 0);
        if (outdoorSitesInStore && outdoorSitesInStore.length > 0) {
          this.handleOfflineOutdoorSites(outdoorSitesInStore);
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
