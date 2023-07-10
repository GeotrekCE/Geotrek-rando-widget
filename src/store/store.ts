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
});

export { onChange, reset };

export default state;
