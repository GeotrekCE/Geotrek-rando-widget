import { Build, Component, h, Host, Prop } from '@stencil/core';
import { OutdoorSite } from 'components';
import { getDataInStore, handleOfflineProperty } from 'services/grw-db.service';
import { getOutdoorCourse, getOutdoorCourseTypes } from 'services/outdoor-courses.service';
import { getOutdoorPractices, getOutdoorSite, getOutdoorSiteTypes, getPoisNearSite } from 'services/outdoor-sites.service';
import { getTouristicContentCategory, getTouristicContentsNearOutdoorSite } from 'services/touristic-contents.service';
import { getTouristicEventsNearOutdoorSite, getTouristicEventType } from 'services/touristic-events.service';
import { getCities, getDistricts, getInformationsDesks, getSources, getThemes } from 'services/treks.service';
import state from 'store/store';
import { imagesRegExp, setFilesFromStore } from 'utils/utils';

@Component({
  tag: 'grw-outdoor-site-provider',
  shadow: true,
})
export class GrwOutdoorSiteProvider {
  @Prop() languages = 'fr';
  @Prop() api: string;
  @Prop() outdoorSiteId: number;
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

    this.handleOutdoorSite();
  }

  async handleOutdoorSite() {
    const outdoorSiteInStore: OutdoorSite = await getDataInStore('outdoorSites', this.outdoorSiteId);
    if (outdoorSiteInStore && outdoorSiteInStore.offline) {
      this.handleOfflineOutdoorSite(outdoorSiteInStore);
    } else {
      this.handleOnlineOutdoorSite();
    }
  }

  async handleOfflineOutdoorSite(outdoorSite: OutdoorSite) {
    state.cities = await handleOfflineProperty('cities');
    state.sources = await handleOfflineProperty('sources');
    state.districts = await handleOfflineProperty('districts');
    state.themes = await handleOfflineProperty('themes');
    state.outdoorSiteTypes = await handleOfflineProperty('outdoorSiteTypes');
    state.outdoorPractices = await handleOfflineProperty('outdoorPractices');
    state.outdoorRatings = await handleOfflineProperty('outdoorRatings');
    state.outdoorRatingsScale = await handleOfflineProperty('outdoorRatingsScale');
    state.touristicContentCategories = await handleOfflineProperty('touristicContentCategories');
    state.touristicEventTypes = await handleOfflineProperty('touristicEventTypes');
    state.poiTypes = await handleOfflineProperty('poiTypes');
    state.outdoorCourseTypes = await handleOfflineProperty('outdoorCourseTypes');

    const informationDesksInStore = await handleOfflineProperty('informationDesks');
    const informationDesks = informationDesksInStore.filter(informationDeskInStore =>
      outdoorSite.information_desks.some(information_desk => information_desk === informationDeskInStore.id),
    );
    state.currentInformationDesks = informationDesks;

    const poisInStore = await handleOfflineProperty('pois', ['url']);
    const pois = poisInStore.filter(poiInStore => outdoorSite.pois.some(outdoorSitePoi => outdoorSitePoi === poiInStore.id));
    state.currentPois = pois;

    const touristicContentsInStore = await handleOfflineProperty('touristicContents', ['url']);
    const touristicContents = touristicContentsInStore.filter(touristicContentInStore =>
      outdoorSite.touristicContents.some(outdoorSiteTouristicContent => outdoorSiteTouristicContent === touristicContentInStore.id),
    );
    state.trekTouristicContents = touristicContents;

    const touristicEventsInStore = await handleOfflineProperty('touristicEvents', ['url']);
    const touristicEvents = touristicEventsInStore.filter(touristicEventInStore =>
      outdoorSite.touristicEvents.some(outdoorSiteTouristicEvent => outdoorSiteTouristicEvent === touristicEventInStore.id),
    );
    state.trekTouristicEvents = touristicEvents;

    const outdoorSitesInStore = await handleOfflineProperty('outdoorSites', ['url']);
    const relatedOutdoorSites = outdoorSitesInStore.filter(relatedOutdoorSiteInStore =>
      outdoorSite.children.some(relatedOutdoorSite => relatedOutdoorSite === relatedOutdoorSiteInStore.id),
    );
    state.currentRelatedOutdoorSites = relatedOutdoorSites;

    const outdoorCoursesInStore = await handleOfflineProperty('outdoorCourses', ['url']);
    const relatedOutdoorCourses = outdoorCoursesInStore.filter(outdoorCourseInStore =>
      outdoorSite.courses.some(relatedOutdoorCourse => relatedOutdoorCourse === outdoorCourseInStore.id),
    );
    state.currentRelatedOutdoorCourses = relatedOutdoorCourses;

    await setFilesFromStore(outdoorSite, imagesRegExp, ['url']);
    state.currentOutdoorSite = outdoorSite;
  }

  handleOnlineOutdoorSite() {
    const requests = [];
    requests.push(!state.cities ? getCities(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.sources ? getSources(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.districts ? getDistricts(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.themes ? getThemes(state.api, state.language, this.portals, this.init) : new Response('null'));
    requests.push(!state.outdoorSiteTypes ? getOutdoorSiteTypes(state.api, state.language, this.init) : new Response('null'));
    requests.push(!state.outdoorPractices ? getOutdoorPractices(state.api, state.language, this.init) : new Response('null'));
    requests.push(
      !state.outdoorRatings
        ? fetch(`${state.api}outdoor_rating/?language=${state.language}${this.portals ? '&portals='.concat(this.portals) : ''}&fields=id,name,scale`, this.init)
        : new Response('null'),
    );
    requests.push(!state.outdoorRatingsScale ? fetch(`${state.api}outdoor_ratingscale/?language=${state.language}&fields=id,name`, this.init) : new Response('null'));
    requests.push(getInformationsDesks(state.api, state.language, this.init));
    requests.push(getTouristicContentsNearOutdoorSite(state.api, state.language, this.outdoorSiteId, this.init));
    requests.push(getTouristicContentCategory(state.api, state.language, null, this.init));
    requests.push(getTouristicEventsNearOutdoorSite(state.api, state.language, this.outdoorSiteId, this.init));
    requests.push(getTouristicEventType(state.api, state.language, null, this.init));
    requests.push(getPoisNearSite(state.api, state.language, this.outdoorSiteId, this.init));
    requests.push(fetch(`${state.api}poi_type/?language=${state.language}&fields=id,pictogram`, this.init));
    requests.push(!state.outdoorCourseTypes ? getOutdoorCourseTypes(state.api, state.language, this.init) : new Response('null'));
    requests.push(getOutdoorSite(state.api, state.language, this.outdoorSiteId, this.init));
    try {
      Promise.all([...requests])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(
          async ([
            cities,
            sources,
            districts,
            themes,
            outdoorSiteTypes,
            outdoorPractices,
            ratings,
            ratingsScale,
            informationDesks,
            touristicContent,
            touristicContentCategory,
            touristicEvent,
            touristicEventType,
            pois,
            poiTypes,
            outdoorCourseTypes,
            outdoorSite,
          ]) => {
            state.networkError = false;

            if (outdoorSite && outdoorSite.children.length > 0) {
              const outdoorSites: number[] = [];
              outdoorSites.push(...outdoorSite.children);
              const outdoorSitesRequests = [];
              outdoorSites.forEach(outdoorSiteId => {
                outdoorSitesRequests.push(getOutdoorSite(state.api, state.language, outdoorSiteId, this.init));
              });
              state.currentRelatedOutdoorSites = await Promise.all([...outdoorSitesRequests]).then(responses => Promise.all(responses.map(response => response.json())));
            }

            if (outdoorSite && outdoorSite.courses.length > 0) {
              const outdoorCourses: number[] = [];
              outdoorCourses.push(...outdoorSite.courses);
              const outdoorCoursesRequests = [];
              outdoorCourses.forEach(outdoorCourseId => {
                outdoorCoursesRequests.push(getOutdoorCourse(state.api, state.language, outdoorCourseId, this.init));
              });
              state.currentRelatedOutdoorCourses = await Promise.all([...outdoorCoursesRequests]).then(responses => Promise.all(responses.map(response => response.json())));
            }
            if (cities) {
              state.cities = cities.results;
            }
            if (sources) {
              state.sources = sources.results;
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
            if (ratings) {
              state.outdoorRatings = ratings.results;
            }
            if (ratingsScale) {
              state.outdoorRatingsScale = ratingsScale.results;
            }
            if (informationDesks) {
              state.currentInformationDesks = informationDesks.results;
            }
            if (touristicContentCategory) {
              state.touristicContentCategories = touristicContentCategory.results;
            }
            if (touristicContent) {
              state.trekTouristicContents = touristicContent.results;
            }
            if (touristicEvent) {
              state.trekTouristicEvents = touristicEvent.results;
            }
            if (touristicEventType) {
              state.touristicEventTypes = touristicEventType.results;
            }
            if (pois) {
              state.currentPois = pois.results;
            }
            if (poiTypes) {
              state.poiTypes = poiTypes.results;
            }
            if (outdoorCourseTypes) {
              state.outdoorCourseTypes = outdoorCourseTypes.results;
            }

            state.currentOutdoorSite = outdoorSite;
          },
        );
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
