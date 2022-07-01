import '../dist/geotrek-rando-widget/geotrek-rando-widget.css';
import { defineCustomElements } from '../loader/index';
defineCustomElements();

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(colorPrimary|colorPrimaryShade|colorPrimaryTint|colorTrekLine|colorDepartureIcon|colorArrivalIcon|colorSensitiveArea|colorPoiIcon)$/i,
    },
  },
};
