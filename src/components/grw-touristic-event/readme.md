# grw-touristic-event-card

<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                   | Description | Type                                                                                                                                                                                                                                                                                                                 | Default     |
| ------------------------ | --------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `isInsideHorizontalList` | `is-inside-horizontal-list` |             | `boolean`                                                                                                                                                                                                                                                                                                            | `false`     |
| `isLargeView`            | `is-large-view`             |             | `boolean`                                                                                                                                                                                                                                                                                                            | `false`     |
| `touristicEvent`         | --                          |             | `{ id: number; name: string; attachments: Attachments; description?: string; description_teaser?: string; practical_info?: string; type: number; geometry: Point; cities?: string[]; source?: number[]; pdf?: string; contact?: string; email?: string; website?: string; begin_date?: string; end_date?: string; }` | `undefined` |


## Events

| Event                          | Description | Type                  |
| ------------------------------ | ----------- | --------------------- |
| `cardTouristicEventMouseLeave` |             | `CustomEvent<any>`    |
| `cardTouristicEventMouseOver`  |             | `CustomEvent<number>` |
| `touristicEventCardPress`      |             | `CustomEvent<number>` |


## Dependencies

### Used by

 - [grw-touristic-events-list](../grw-touristic-events-list)
 - [grw-trek-detail](../grw-trek-detail)

### Graph
```mermaid
graph TD;
  grw-touristic-events-list --> grw-touristic-event-card
  grw-trek-detail --> grw-touristic-event-card
  style grw-touristic-event-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
