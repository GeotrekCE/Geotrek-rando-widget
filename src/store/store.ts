import { createStore } from '@stencil/store';
import { Treks } from 'types/types';

const { state } = createStore<{ treks: Treks }>({
  treks: [],
});

export default state;
