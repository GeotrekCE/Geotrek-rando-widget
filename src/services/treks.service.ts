import { Build } from '@stencil/core';
import state from 'store/store';

export function getTrekGeometry(id: number) {
  return fetch(`${state.api}trek/${id}/?language=${state.language}&published=true&fields=geometry`, { cache: Build.isDev ? 'force-cache' : 'default' }).then(response =>
    response.json(),
  );
}
