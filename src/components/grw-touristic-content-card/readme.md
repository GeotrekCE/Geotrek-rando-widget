# grw-touristic-content-card

<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                   | Description | Type                                                                                                                                                                                                                                                                                                | Default     |
| ------------------------ | --------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `fontFamily`             | `font-family`               |             | `string`                                                                                                                                                                                                                                                                                            | `'Roboto'`  |
| `isInsideHorizontalList` | `is-inside-horizontal-list` |             | `boolean`                                                                                                                                                                                                                                                                                           | `false`     |
| `isLargeView`            | `is-large-view`             |             | `boolean`                                                                                                                                                                                                                                                                                           | `false`     |
| `touristicContent`       | --                          |             | `{ id: number; name: string; attachments: Attachments; description?: string; description_teaser?: string; practical_info?: string; category: number; geometry: Point; cities?: string[]; source?: number[]; pdf?: string; contact?: string; email?: string; website?: string; offline?: boolean; }` | `undefined` |


## Events

| Event                            | Description | Type                  |
| -------------------------------- | ----------- | --------------------- |
| `cardTouristicContentMouseLeave` |             | `CustomEvent<any>`    |
| `cardTouristicContentMouseOver`  |             | `CustomEvent<number>` |
| `touristicContentCardPress`      |             | `CustomEvent<number>` |


## Shadow Parts

| Part                                        | Description |
| ------------------------------------------- | ----------- |
| `"default-touristic-content-img"`           |             |
| `"more-details-button"`                     |             |
| `"swiper-button-next"`                      |             |
| `"swiper-button-prev"`                      |             |
| `"swiper-pagination"`                       |             |
| `"swiper-slide"`                            |             |
| `"swiper-touristic-content"`                |             |
| `"swiper-wrapper"`                          |             |
| `"touristic-content-card"`                  |             |
| `"touristic-content-category-container"`    |             |
| `"touristic-content-category-img"`          |             |
| `"touristic-content-category-name"`         |             |
| `"touristic-content-img"`                   |             |
| `"touristic-content-img-container"`         |             |
| `"touristic-content-more-detail-container"` |             |
| `"touristic-content-name"`                  |             |
| `"touristic-content-sub-container"`         |             |


## Dependencies

### Used by

 - [grw-outdoor-course-detail](../grw-outdoor-course-detail)
 - [grw-outdoor-site-detail](../grw-outdoor-site-detail)
 - [grw-touristic-contents-list](../grw-touristic-contents-list)
 - [grw-trek-detail](../grw-trek-detail)

### Graph
```mermaid
graph TD;
  grw-outdoor-course-detail --> grw-touristic-content-card
  grw-outdoor-site-detail --> grw-touristic-content-card
  grw-touristic-contents-list --> grw-touristic-content-card
  grw-trek-detail --> grw-touristic-content-card
  style grw-touristic-content-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
