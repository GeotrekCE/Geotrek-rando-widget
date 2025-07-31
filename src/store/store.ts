import { createStore } from '@stencil/store';
import { LatLngBounds } from 'leaflet';
import {
  Accessibilities,
  AccessibilitiesLevel,
  Difficulties,
  Durations,
  InformationDesks,
  Labels,
  Pois,
  PoiTypes,
  Practices,
  Routes,
  SensitiveAreas,
  Sources,
  Themes,
  Cities,
  Trek,
  Treks,
  Lengths,
  Elevations,
  Districts,
  TouristicContents,
  TouristicContentCategories,
  TouristicContent,
  TouristicEvents,
  TouristicEventTypes,
  TouristicEvent,
  Ratings,
  RatingsScale,
  Networks,
  OutdoorSites,
  OutdoorCourses,
  OutdoorSiteTypes,
  OutdoorPractices,
  OutdoorSite,
  OutdoorCourse,
  OutdoorCourseTypes,
  Signages,
} from 'types/types';

const { state, onChange, reset } = createStore<{
  mode: string;
  api: string;
  languages: string[];
  language: string;
  treks: Treks;
  treksWithinBounds: Treks;
  currentMapBounds: LatLngBounds;
  currentTreks: Treks;
  difficulties: Difficulties;
  routes: Routes;
  practices: Practices;
  themes: Themes;
  cities: Cities;
  durations: Durations;
  lengths: Lengths;
  elevations: Elevations;
  labels: Labels;
  districts: Districts;
  sources: Sources;
  ratings: Ratings;
  ratingsScale: RatingsScale;
  outdoorRatings: Ratings;
  outdoorRatingsScale: RatingsScale;
  accessibilities: Accessibilities;
  accessibilitiesLevel: AccessibilitiesLevel;
  poiTypes: PoiTypes;
  currentTrek: Trek;
  currentSensitiveAreas: SensitiveAreas;
  currentPois: Pois;
  currentInformationDesks: InformationDesks;
  networkError: boolean;
  searchValue: string;
  selectedActivitiesFilters: number;
  selectedThemesFilters: number;
  selectedLocationFilters: number;
  selectedTrekId: number;
  parentTrekId: number;
  parentTrek: Trek;
  currentTrekSteps: Treks;
  selectedStepId: number;
  trekTouristicContents: TouristicContents;
  touristicContents: TouristicContents;
  currentTouristicContents: TouristicContents;
  touristicContentsWithinBounds: TouristicContents;
  touristicContentCategories: TouristicContentCategories;
  currentTouristicContent: TouristicContent;
  trekTouristicEvents: TouristicEvents;
  touristicEvents: TouristicEvents;
  currentTouristicEvents: TouristicEvents;
  touristicEventsWithinBounds: TouristicEvents;
  touristicEventTypes: TouristicEventTypes;
  currentTouristicEvent: TouristicEvent;
  selectedTouristicContentId: number;
  selectedTouristicEventId: number;
  networks: Networks;
  portalsFromProviders: string;
  inBboxFromProviders: string;
  citiesFromProviders: string;
  districtsFromProviders: string;
  structuresFromProviders: string;
  themesFromProviders: string;
  routesFromProviders: string;
  practicesFromProviders: string;
  labelsFromProviders: string;
  offlineTreks: boolean;
  currentOutdoorSites: OutdoorSites;
  outdoorSites: OutdoorSites;
  outdoorSitesWithinBounds: OutdoorSites;
  currentOutdoorCourses: OutdoorCourses;
  outdoorCourses: OutdoorCourses;
  outdoorSiteTypes: OutdoorSiteTypes;
  outdoorPractices: OutdoorPractices;
  selectedOutdoorSiteId: number;
  currentOutdoorSite: OutdoorSite;
  currentRelatedOutdoorSites: OutdoorSites;
  currentRelatedOutdoorCourses: OutdoorCourses;
  selectedOutdoorCourseId: number;
  outdoorCourseTypes: OutdoorCourseTypes;
  currentOutdoorCourse: OutdoorCourse;
  offlineOutdoorSites: boolean;
  currentSignages: Signages;
  touristicContentsData: number;
  touristicEventsData: number;
  poisData: number;
}>({
  mode: null,
  api: null,
  languages: null,
  language: null,
  treks: null,
  currentTreks: null,
  treksWithinBounds: null,
  currentMapBounds: null,
  difficulties: null,
  routes: null,
  practices: null,
  themes: null,
  cities: [],
  durations: null,
  lengths: null,
  elevations: null,
  currentSensitiveAreas: null,
  labels: null,
  districts: null,
  sources: null,
  ratings: null,
  ratingsScale: null,
  accessibilities: null,
  accessibilitiesLevel: null,
  poiTypes: null,
  currentTrek: null,
  currentPois: null,
  currentInformationDesks: null,
  networkError: false,
  searchValue: null,
  selectedActivitiesFilters: 0,
  selectedThemesFilters: 0,
  selectedLocationFilters: 0,
  selectedTrekId: null,
  parentTrekId: null,
  parentTrek: null,
  currentTrekSteps: null,
  selectedStepId: null,
  trekTouristicContents: null,
  touristicContents: null,
  currentTouristicContents: null,
  touristicContentsWithinBounds: null,
  touristicContentCategories: null,
  currentTouristicContent: null,
  trekTouristicEvents: null,
  touristicEvents: null,
  currentTouristicEvents: null,
  touristicEventsWithinBounds: null,
  touristicEventTypes: null,
  currentTouristicEvent: null,
  selectedTouristicContentId: null,
  selectedTouristicEventId: null,
  networks: null,
  portalsFromProviders: null,
  inBboxFromProviders: null,
  citiesFromProviders: null,
  districtsFromProviders: null,
  structuresFromProviders: null,
  themesFromProviders: null,
  routesFromProviders: null,
  practicesFromProviders: null,
  labelsFromProviders: null,
  offlineTreks: false,
  currentOutdoorSites: null,
  outdoorSites: null,
  outdoorSitesWithinBounds: null,
  currentOutdoorCourses: null,
  outdoorCourses: null,
  outdoorSiteTypes: null,
  outdoorPractices: null,
  selectedOutdoorSiteId: null,
  currentOutdoorSite: null,
  currentRelatedOutdoorSites: null,
  currentRelatedOutdoorCourses: null,
  selectedOutdoorCourseId: null,
  outdoorCourseTypes: null,
  currentOutdoorCourse: null,
  outdoorRatings: null,
  outdoorRatingsScale: null,
  offlineOutdoorSites: false,
  currentSignages: null,
  touristicContentsData: 0,
  touristicEventsData: 0,
  poisData: 0,
});

export { onChange, reset };

export default state;
