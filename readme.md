# Geotrek-rando widget

Web components of [Geotrek](https://geotrek.fr/).\
You can use a complete app or each component independantly.

- To test and configure the widget: https://geotrekce.github.io/Geotrek-rando-widget/
- Examples:
  - https://www.jurabsolu.fr/decouvrez-territoire-jura/randonnees-forets-vignes-jura/
  - https://www.coeurdujura-tourisme.com/activites-nature-jura-outdoor-loisirs/activites-pleine-nature/
  - https://geotrek.ecrins-parcnational.fr/ressources/technique/2022-test-widget.html

## Usage

**The Geotrek-admin API you want to use has to authorize the URL of the website where you want to include the widget.**

Copy-paste this inside `<head></head>` to load static widget files:

```html
<link rel="stylesheet" href="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.css" />
<script type="module" src="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.esm.js"></script>
<script nomodule src="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.js"></script>
```

Then you have to configure the widget to generate the widget code to include in your website.

## Configure

**The API you want to use has to authorize geotrekce.github.io.**

You can explore Geotrek-rando widget and create your own component [here](https://geotrekce.github.io/Geotrek-rando-widget/).\
Once you made your component, you can get the code to copy-paste by clicking on _Docs_ then _Show code_.

[![](https://geotrek.fr/assets/img/logo_autonomens-h120m.png)](https://datatheca.com/)

## Documentation

- [Presentation](https://geotrek-rando-widget.readthedocs.io/latest/documentation/introduction/overview.html)
- [Get started](https://geotrek-rando-widget.readthedocs.io/latest/documentation/introduction/get-started.html)
- [Configuration instructions](https://geotrek-rando-widget.readthedocs.io/latest/documentation/configuration/colors.html)

## Contribution

- [Development guide](https://geotrek-rando-widget.readthedocs.io/latest/documentation/contribution/development.html)
- [Documentation guide](https://geotrek-rando-widget.readthedocs.io/latest/documentation/contribution/documentation.html)
- [Translating guide](https://geotrek-rando-widget.readthedocs.io/latest/documentation/contribution/translation.html)