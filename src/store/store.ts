import { createStore } from '@stencil/store';
import { Difficulties, Practices, Routes, Trek, Treks } from 'types/types';

const { state } = createStore<{ treks: Treks; difficulties: Difficulties; routes: Routes; practices: Practices; currentTrek: Trek }>({
  treks: [],
  difficulties: [],
  routes: [],
  practices: [],
  currentTrek: null,
});

export default state;
