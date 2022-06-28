# grw-trek-card



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description | Type                                                                                                                                                                                                                                                                    | Default     |
| ------------------ | -------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `colorPrimary`     | `color-primary`      |             | `string`                                                                                                                                                                                                                                                                | `'#6b0030'` |
| `colorPrimaryTint` | `color-primary-tint` |             | `string`                                                                                                                                                                                                                                                                | `'#d2b2c0'` |
| `trek`             | --                   |             | `{ id: number; name: string; attachments: Attachments; description?: string; description_teaser: string; difficulty: number; route: number; practice: number; duration: number; length_2d: number; ascent: number; geometry?: LineString; departure_geom?: Position; }` | `undefined` |


## Events

| Event           | Description | Type                  |
| --------------- | ----------- | --------------------- |
| `trekCardPress` |             | `CustomEvent<number>` |


## Dependencies

### Used by

 - [grw-treks-list](../grw-treks-list)

### Graph
```mermaid
graph TD;
  grw-treks-list --> grw-trek-card
  style grw-trek-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
