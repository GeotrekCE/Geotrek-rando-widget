# grw-trek-detail

<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute                     | Description | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Default     |
| -------------------------- | ----------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `colorPrimary`             | `color-primary`               |             | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `'#6b0030'` |
| `colorPrimaryShade`        | `color-primary-shade`         |             | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `'#4a0021'` |
| `colorPrimaryTint`         | `color-primary-tint`          |             | `string`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `'#974c6e'` |
| `resetStoreOnDisconnected` | `reset-store-on-disconnected` |             | `boolean`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `true`      |
| `trek`                     | --                            |             | `{ id: number; name: string; attachments: Attachments; description?: string; description_teaser: string; difficulty: number; route: number; practice: number; themes: number[]; duration: number; length_2d: number; ascent: number; departure: string; departure_city: string; arrival?: string; geometry?: LineString; departure_geom?: Position; gpx?: string; kml?: string; pdf?: string; parking_location?: Position; ambiance?: string; access?: string; public_transport?: string; advice?: string; advised_parking?: string; gear?: string; labels?: number[]; points_reference?: MultiPoint; source?: number[]; structure?: number; disabled_infrastructure?: string; accessibilities?: number[]; accessibility_level?: number; accessibility_slope?: string; accessibility_width?: string; accessibility_signage?: string; accessibility_covering?: string; accessibility_exposure?: string; accessibility_advice?: string; cities?: string[]; information_desks?: number[]; }` | `undefined` |


## Events

| Event                          | Description | Type                   |
| ------------------------------ | ----------- | ---------------------- |
| `informationDesksIsInViewport` |             | `CustomEvent<boolean>` |


## Dependencies

### Used by

 - [grw-app](../grw-app)

### Depends on

- [grw-sensitive-area-detail](../grw-sensitive-area-detail)
- [grw-information-desk-detail](../grw-information-desk-detail)
- [grw-poi-detail](../grw-poi-detail)

### Graph
```mermaid
graph TD;
  grw-trek-detail --> grw-sensitive-area-detail
  grw-trek-detail --> grw-information-desk-detail
  grw-trek-detail --> grw-poi-detail
  grw-app --> grw-trek-detail
  style grw-trek-detail fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
