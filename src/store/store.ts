import { createStore } from '@stencil/store';
import { LatLngBounds } from 'leaflet';
import {
  Accessibilities,
  accessibilitiesLevel,
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
} from 'types/types';

const { state, onChange, reset } = createStore<{
  api: string;
  languages: string[];
  language: string;
  treks: Treks;
  treksWithinBounds: Treks;
  currentMapTreksBounds: LatLngBounds;
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
  accessibilities: Accessibilities;
  accessibilitiesLevel: accessibilitiesLevel;
  poiTypes: PoiTypes;
  currentTrek: Trek;
  currentSensitiveAreas: SensitiveAreas;
  currentPois: Pois;
  currentInformationDesks: InformationDesks;
  treksNetworkError: boolean;
  trekNetworkError: boolean;
  searchValue: string;
  selectedActivitiesFilters: number;
  selectedThemesFilters: number;
  selectedLocationFilters: number;
  selectedTrekId: number;
  parentTrekId: number;
  parentTrek: Trek;
  currentTrekSteps: Treks;
  selectedStepId: number;
}>({
  api: null,
  languages: null,
  language: null,
  treks: null,
  currentTreks: null,
  treksWithinBounds: null,
  currentMapTreksBounds: null,
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
  accessibilities: null,
  accessibilitiesLevel: null,
  poiTypes: null,
  currentTrek: null,
  currentPois: null,
  currentInformationDesks: null,
  treksNetworkError: false,
  trekNetworkError: false,
  searchValue: null,
  selectedActivitiesFilters: 0,
  selectedThemesFilters: 0,
  selectedLocationFilters: 0,
  selectedTrekId: null,
  parentTrekId: null,
  parentTrek: null,
  currentTrekSteps: null,
  selectedStepId: null,
});

export { onChange, reset };

export default state;
