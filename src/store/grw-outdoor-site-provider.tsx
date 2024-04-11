import { Build, Component, h, Host, Prop } from '@stencil/core';
import { getOutdoorCourse, getOutdoorCourseTypes } from 'services/outdoor-courses.service';
import { getOutdoorPractices, getOutdoorSite, getOutdoorSiteTypes, getPoisNearSite } from 'services/outdoor-sites.service';
import { getTouristicContentsNearOutdoorSite } from 'services/touristic-contents.service';
import { getTouristicEventsNearOutdoorSite } from 'services/touristic-events.service';
import { getCities, getDistricts, getInformationsDesks, getThemes } from 'services/treks.service';
import state from 'store/store';

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

  handleOutdoorSite() {
    const requests = [];
    requests.push(!state.cities ? getCities(state.api, state.language, this.init) : new Response('null'));
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
    requests.push(fetch(`${state.api}touristiccontent_category/?language=${state.language}&published=true&fields=id,label,pictogram&page_size=999`, this.init));
    requests.push(getTouristicEventsNearOutdoorSite(state.api, state.language, this.outdoorSiteId, this.init));
    requests.push(fetch(`${state.api}touristicevent_type/?language=${state.language}&published=true&fields=id,type,pictogram&page_size=999`, this.init));
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
