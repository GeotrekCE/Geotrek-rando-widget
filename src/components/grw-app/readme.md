# grw-app

<!-- Auto Generated Below -->


## Properties

| Property             | Attribute              | Description | Type     | Default     |
| -------------------- | ---------------------- | ----------- | -------- | ----------- |
| `api`                | `api`                  |             | `string` | `undefined` |
| `attribution`        | `attribution`          |             | `string` | `undefined` |
| `center`             | `center`               |             | `string` | `undefined` |
| `cities`             | `cities`               |             | `string` | `undefined` |
| `colorArrivalIcon`   | `color-arrival-icon`   |             | `string` | `'#85003b'` |
| `colorDepartureIcon` | `color-departure-icon` |             | `string` | `'#006b3b'` |
| `colorPoiIcon`       | `color-poi-icon`       |             | `string` | `'#974c6e'` |
| `colorPrimary`       | `color-primary`        |             | `string` | `'#6b0030'` |
| `colorPrimaryShade`  | `color-primary-shade`  |             | `string` | `'#4a0021'` |
| `colorPrimaryTint`   | `color-primary-tint`   |             | `string` | `'#974c6e'` |
| `colorSensitiveArea` | `color-sensitive-area` |             | `string` | `'#4974a5'` |
| `colorTrekLine`      | `color-trek-line`      |             | `string` | `'#6b0030'` |
| `districts`          | `districts`            |             | `string` | `undefined` |
| `inBbox`             | `in-bbox`              |             | `string` | `undefined` |
| `language`           | `language`             |             | `string` | `'fr'`      |
| `portals`            | `portals`              |             | `string` | `undefined` |
| `practices`          | `practices`            |             | `string` | `undefined` |
| `routes`             | `routes`               |             | `string` | `undefined` |
| `structures`         | `structures`           |             | `string` | `undefined` |
| `themes`             | `themes`               |             | `string` | `undefined` |
| `urlLayer`           | `url-layer`            |             | `string` | `undefined` |
| `zoom`               | `zoom`                 |             | `any`    | `undefined` |


## Dependencies

### Depends on

- [grw-treks-provider](../../store)
- [grw-trek-provider](../../store)
- [grw-filter](../grw-filter)
- [grw-treks-list](../grw-treks-list)
- [grw-trek-detail](../grw-trek-detail)
- [grw-map](../grw-map)

### Graph
```mermaid
graph TD;
  grw-app --> grw-treks-provider
  grw-app --> grw-trek-provider
  grw-app --> grw-filter
  grw-app --> grw-treks-list
  grw-app --> grw-trek-detail
  grw-app --> grw-map
  grw-treks-list --> grw-trek-card
  grw-trek-detail --> grw-sensitive-area-detail
  grw-trek-detail --> grw-information-desk-detail
  grw-trek-detail --> grw-poi-detail
  style grw-app fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
