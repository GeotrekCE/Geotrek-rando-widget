import { createStore } from '@stencil/store';
import { Difficulties, Practices, Routes, Trek, Treks } from 'types/types';

const { state, onChange } = createStore<{ api: string; treks: Treks; difficulties: Difficulties; routes: Routes; practices: Practices; currentTrek: Trek }>({
  api: '',
  treks: [],
  difficulties: [],
  routes: [],
  practices: [],
  currentTrek: null,
});

export { onChange };

export default state;
