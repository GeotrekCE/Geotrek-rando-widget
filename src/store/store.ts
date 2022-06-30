import { createStore } from '@stencil/store';
import { Difficulties, Practices, Routes, SensitiveAreas, Trek, Treks } from 'types/types';

const { state, onChange } = createStore<{
  api: string;
  treks: Treks;
  difficulties: Difficulties;
  routes: Routes;
  practices: Practices;
  sensitiveAreas: SensitiveAreas;
  currentTrek: Trek;
}>({
  api: '',
  treks: [],
  difficulties: [],
  routes: [],
  practices: [],
  sensitiveAreas: [],
  currentTrek: null,
});

export { onChange };

export default state;
