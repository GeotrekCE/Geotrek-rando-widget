import { createStore } from '@stencil/store';
import { Difficulties, Durations, InformationDesks, Labels, Pois, Practices, Routes, SensitiveAreas, Sources, Themes, Trek, Treks } from 'types/types';

const { state, onChange } = createStore<{
  api: string;
  treks: Treks;
  currentTreks: Treks;
  difficulties: Difficulties;
  routes: Routes;
  practices: Practices;
  themes: Themes;
  durations: Durations;
  currentSensitiveAreas: SensitiveAreas;
  labels: Labels;
  sources: Sources;
  currentPois: Pois;
  currentTrek: Trek;
  currentInformationDesks: InformationDesks;
}>({
  api: '',
  treks: [],
  currentTreks: [],
  difficulties: [],
  routes: [],
  practices: [],
  themes: [],
  durations: [],
  currentSensitiveAreas: null,
  labels: null,
  sources: null,
  currentPois: null,
  currentTrek: null,
  currentInformationDesks: null,
});

export { onChange };

export default state;
