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
} from 'types/types';

const { state, onChange, reset } = createStore<{
  api: string;
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
}>({
  api: '',
  treks: null,
  currentTreks: null,
  treksWithinBounds: null,
  currentMapTreksBounds: null,
  difficulties: [],
  routes: [],
  practices: [],
  themes: [],
  cities: [],
  durations: [],
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
});

export { onChange, reset };

export default state;
