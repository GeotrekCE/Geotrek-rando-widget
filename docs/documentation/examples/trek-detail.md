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

Pour afficher uniquement la **fiche détail d'une randonnée** dans le widget, il faut ajouter la balise `<grw-trek-detail></grw-trek-detail>`.

**Voici un exemple de code complet :**

```html
<div>
<grw-trek-provider api="https://geotrek-admin.portcros-parcnational.fr/api/v2/" languages="fr" trek-id="690"></grw-trek-provider>
<div style="width: 100%; height: auto"><grw-trek-detail></grw-trek-detail></div>
</div>
```

## Exemple de widget avec la fiche détail d'une randonnée

<div>
<grw-trek-provider api="https://geotrek-admin.portcros-parcnational.fr/api/v2/" languages="fr" trek-id="690"></grw-trek-provider>
<div style="width: 100%; height: auto"><grw-trek-detail></grw-trek-detail></div>
</div>



