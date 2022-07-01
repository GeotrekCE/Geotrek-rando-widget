import { createStore } from '@stencil/store';
import { Difficulties, Pois, Practices, Routes, SensitiveAreas, Trek, Treks } from 'types/types';

const { state, onChange } = createStore<{
  api: string;
  treks: Treks;
  difficulties: Difficulties;
  routes: Routes;
  practices: Practices;
  currentSensitiveAreas: SensitiveAreas;
  currentPois: Pois;
  currentTrek: Trek;
}>({
  api: '',
  treks: [],
  difficulties: [],
  routes: [],
  practices: [],
  currentSensitiveAreas: null,
  currentPois: null,
  currentTrek: null,
});

export { onChange };

export default state;
