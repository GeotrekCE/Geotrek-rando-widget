export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color:
        /(colorPrimaryApp|colorOnPrimary|colorSurface|colorOnSurface|colorSurfaceVariant|colorOnSurfaceVariant|colorPrimaryContainer|colorOnPrimaryContainer|colorSecondaryContainer|colorOnSecondaryContainer|colorBackground|colorSurfaceContainerHigh|colorSurfaceContainerLow|fabBackgroundColor|fabColor|colorTrekLine|colorDepartureIcon|colorArrivalIcon|colorSensitiveArea|colorPoiIcon)$/i,
    },
  },
};
