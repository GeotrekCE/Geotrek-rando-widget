# grw-map



<!-- Auto Generated Below -->


## Properties

| Property                     | Attribute                       | Description | Type      | Default     |
| ---------------------------- | ------------------------------- | ----------- | --------- | ----------- |
| `attributionLayer`           | `attribution-layer`             |             | `string`  | `undefined` |
| `colorBackground`            | `color-background`              |             | `string`  | `'#fef7ff'` |
| `colorClusters`              | `color-clusters`                |             | `any`     | `null`      |
| `colorMarkers`               | `color-markers`                 |             | `any`     | `null`      |
| `colorOnPrimaryContainer`    | `color-on-primary-container`    |             | `string`  | `'#21005e'` |
| `colorOnSurface`             | `color-on-surface`              |             | `string`  | `'#49454e'` |
| `colorOutdoorArea`           | `color-outdoor-area`            |             | `string`  | `'#ffb700'` |
| `colorPrimaryApp`            | `color-primary-app`             |             | `string`  | `'#6b0030'` |
| `colorPrimaryContainer`      | `color-primary-container`       |             | `string`  | `'#eaddff'` |
| `colorSensitiveArea`         | `color-sensitive-area`          |             | `string`  | `'#4974a5'` |
| `colorTrekLine`              | `color-trek-line`               |             | `string`  | `'#6b0030'` |
| `commonMarkerSize`           | `common-marker-size`            |             | `number`  | `48`        |
| `departureArrivalMarkerSize` | `departure-arrival-marker-size` |             | `number`  | `14`        |
| `elevationDefaultState`      | `elevation-default-state`       |             | `string`  | `'visible'` |
| `elevationHeight`            | `elevation-height`              |             | `number`  | `280`       |
| `fabBackgroundColor`         | `fab-background-color`          |             | `string`  | `'#eaddff'` |
| `fabColor`                   | `fab-color`                     |             | `string`  | `'#21005d'` |
| `fontFamily`                 | `font-family`                   |             | `string`  | `'Roboto'`  |
| `grwApp`                     | `grw-app`                       |             | `boolean` | `false`     |
| `isLargeView`                | `is-large-view`                 |             | `boolean` | `false`     |
| `largeViewSize`              | `large-view-size`               |             | `number`  | `1024`      |
| `mainClusterSize`            | `main-cluster-size`             |             | `number`  | `48`        |
| `mainMarkerSize`             | `main-marker-size`              |             | `number`  | `32`        |
| `maxZoom`                    | `max-zoom`                      |             | `number`  | `19`        |
| `mobileElevationHeight`      | `mobile-elevation-height`       |             | `number`  | `280`       |
| `nameLayer`                  | `name-layer`                    |             | `string`  | `undefined` |
| `pointReferenceMarkerSize`   | `point-reference-marker-size`   |             | `number`  | `24`        |
| `selectedMainMarkerSize`     | `selected-main-marker-size`     |             | `number`  | `48`        |
| `tilesMaxZoomOffline`        | `tiles-max-zoom-offline`        |             | `number`  | `16`        |
| `urlLayer`                   | `url-layer`                     |             | `string`  | `undefined` |


## Events

| Event                       | Description | Type                  |
| --------------------------- | ----------- | --------------------- |
| `outdoorCourseCardPress`    |             | `CustomEvent<number>` |
| `outdoorSiteCardPress`      |             | `CustomEvent<number>` |
| `touristicContentCardPress` |             | `CustomEvent<number>` |
| `touristicEventCardPress`   |             | `CustomEvent<number>` |
| `trekCardPress`             |             | `CustomEvent<number>` |


## Shadow Parts

| Part                     | Description |
| ------------------------ | ----------- |
| `"loader"`               |             |
| `"map"`                  |             |
| `"map-loader-container"` |             |


## Dependencies

### Used by

 - [grw-app](../grw-app)

### Depends on

- [grw-fab](../grw-fab)

### Graph
```mermaid
graph TD;
  grw-map --> grw-fab
  grw-app --> grw-map
  style grw-map fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
