# grw-app



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type     | Default                  |
| --------- | ---------- | ----------- | -------- | ------------------------ |
| `api`     | `api`      |             | `string` | `undefined`              |
| `appName` | `app-name` |             | `string` | `'Geotrek Rando Widget'` |
| `portals` | `portals`  |             | `string` | `undefined`              |


## Dependencies

### Depends on

- [grw-treks-provider](../../store)
- [grw-treks-list](../grw-treks-list)
- [grw-trek-provider](../../store)
- [grw-trek-detail](../grw-trek-detail)
- [grw-map](../grw-map)

### Graph
```mermaid
graph TD;
  grw-app --> grw-treks-provider
  grw-app --> grw-treks-list
  grw-app --> grw-trek-provider
  grw-app --> grw-trek-detail
  grw-app --> grw-map
  grw-treks-list --> grw-trek-card
  style grw-app fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
