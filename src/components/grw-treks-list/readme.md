# grw-treks-list

<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute                      | Description | Type      | Default     |
| --------------------------- | ------------------------------ | ----------- | --------- | ----------- |
| `colorOnSecondaryContainer` | `color-on-secondary-container` |             | `string`  | `'#1d192b'` |
| `colorOnSurface`            | `color-on-surface`             |             | `string`  | `'#49454e'` |
| `colorPrimaryApp`           | `color-primary-app`            |             | `string`  | `'#6b0030'` |
| `colorSecondaryContainer`   | `color-secondary-container`    |             | `string`  | `'#e8def8'` |
| `colorSurfaceContainerLow`  | `color-surface-container-low`  |             | `string`  | `'#f7f2fa'` |
| `fontFamily`                | `font-family`                  |             | `string`  | `'Roboto'`  |
| `isLargeView`               | `is-large-view`                |             | `boolean` | `false`     |


## Shadow Parts

| Part                                   | Description |
| -------------------------------------- | ----------- |
| `"current-treks-within-bounds-length"` |             |
| `"list-bottom-space"`                  |             |
| `"treks-list-container"`               |             |


## Dependencies

### Used by

 - [grw-app](../grw-app)

### Depends on

- [grw-trek-card](../grw-trek-card)

### Graph
```mermaid
graph TD;
  grw-treks-list --> grw-trek-card
  grw-app --> grw-treks-list
  style grw-treks-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
