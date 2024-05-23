---
head:
  - - script
    - defer: true
      nomodule: true
      src: https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.js
  - - script
    - defer: true
      type: module
      src: https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.esm.js
  - - link
    - href: https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.css
      rel: stylesheet
---

## Code

Pour afficher uniquement la **fiche détail d'une randonnée avec la carte** dans le widget, il faut ajouter la balise `<grw-treks-list></grw-treks-list>`.

**Voici un exemple de code complet :**

```html
<div>
  <grw-treks-list></grw-treks-list>
  <grw-treks-provider api="https://geotrek-admin.portcros-parcnational.fr/api/v2/"></grw-treks-provider>
</div>
```

> [!CAUTION]
> A l'heure actuelle, les éléments de la liste ne sont pas cliquables. Il n'est donc pas possible d'afficher le contenu d'une randonnée à partir de ce widget.

## Exemple de widget avec une liste d'itinéraires

<ClientOnly>
  <div>
    <grw-treks-list></grw-treks-list>
    <grw-treks-provider
    api="https://geotrek-admin.portcros-parcnational.fr/api/v2/"></grw-treks-provider>
  </div>
</ClientOnly>
