import { createStore } from '@stencil/store';
import { Difficulties, Durations, InformationDesks, Pois, Practices, Routes, SensitiveAreas, Trek, Treks } from 'types/types';

const { state, onChange } = createStore<{
  api: string;
  treks: Treks;
  currentTreks: Treks;
  difficulties: Difficulties;
  routes: Routes;
  practices: Practices;
  durations: Durations;
  currentSensitiveAreas: SensitiveAreas;
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
  durations: [],
  currentSensitiveAreas: null,
  currentPois: null,
  currentTrek: null,
  currentInformationDesks: null,
});

export { onChange };

export default state;
