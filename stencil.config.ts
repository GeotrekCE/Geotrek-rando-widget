import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  hydratedFlag: {
    selector: 'attribute',
  },
  namespace: 'geotrek-rando-widget',
  buildEs5: 'prod',
  extras: {
    __deprecated__cssVarsShim: true,
    __deprecated__dynamicImportShim: true,
    __deprecated__shadowDomShim: true,
    __deprecated__safari10: true,
    scriptDataOpts: true,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: true,
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        {
          src: '**/*.svg',
          dest: 'assets',
          warn: true,
        },
      ],
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [sass()],
  globalStyle: 'src/global/global.scss',
};
