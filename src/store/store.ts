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
  offlineTreks: boolean;
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
  cities: null,
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
  offlineTreks: false,
});

export { onChange, reset };

export default state;
