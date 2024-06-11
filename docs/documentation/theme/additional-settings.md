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
  - - link
    - href: https://fonts.googleapis.com
      rel: preconnect
  - - link
    - href: https://fonts.gstatic.com
      rel: preconnect
      crossorigin
  - - link
    - href: https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap
      rel: stylesheet
---

# Paramètres supplémentaires

Les paramètres `rounded` et `font-family` sont les deux seuls paramètres associés au thème mais qui ne concernent pas les couleurs.

## Les bordures

### Code

Pour afficher une bordure arrondie dans le widget, il faut que la balise `grw-app` embarque le paramètre suivant à `true` :

```html
<grw-app rounded="true"></grw-app>
```

**Voici un exemple de code complet :**

```html
<div>
  <grw-app
    app-width="100%"
    app-height="100vh"
    api="https://geotrek-admin.portcros-parcnational.fr/api/v2/"
    languages="fr"
    name-layer="IGN,OpenStreetMap"
    url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
    weather="true"
    treks="false"
    rounded="true"
  ></grw-app>
</div>
```


## La police de caractère

Par défaut la police de caractère utilisée est `Roboto`. Il est possible d'en utiliser une autre.

Voici un exemple de configuration de police de caractère avec [Google Font](https://fonts.google.com/).

### Code
Pour paramétrer une nouvelle police, il faut que la balise `grw-app` embarque le paramètre suivant en précisant son nom :

```html
<grw-app font-family="Comic Neue"></grw-app>
```

1. Rechercher le nom de la police souhaitée sur Google Font.
Exemple : https://fonts.google.com/specimen/Comic+Neue?query=comic+neue

2. Cliquer sur le bouton "Get font", puis "Get embed code"

3. Copier les trois lignes de codes générées dans la balise `<head>` du fichier HTML

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">
```

**Voici un exemple de code complet :**

```html
<html dir="ltr" lang="en">
	<head>
		<meta charset="utf-8" />
		<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0"
		/>
		<title>pnrlat</title>
		<link
			rel="stylesheet"
			href="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.css"
			/>
			<script
			type="module"
			src="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.esm.js"
			></script>
			<link rel="preconnect" href="https://fonts.googleapis.com">
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
			<link href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet">
			<script
			nomodule
			src="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.js"
			></script>
			<style>
			body {
			margin: 0;
			}
			</style>
		</head>
		<body>
			<div style="width: 100vw; height: 100vh">
				<grw-app
					app-width="100%"
					app-height="100vh"
					api="https://geotrek-admin.portcros-parcnational.fr/api/v2/"
					languages="fr"
					name-layer="IGN,OpenStreetMap"
					url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
					treks="false"
					rounded="true"
					font-family="Comic Neue"
				></grw-app>
			</div>
		</body>
	</html>
```

### Exemple de widget utilisant la police Comic Neue

<ClientOnly>
  <div>
    <grw-app
      app-width="100%"
      app-height="100vh"
      api="https://geotrek-admin.portcros-parcnational.fr/api/v2/"
      languages="fr"
      name-layer="IGN,OpenStreetMap"
      url-layer="https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution-layer="<a target='_blank' href='https://ign.fr/'>IGN</a>,OpenStreetMap"
      treks="false"
      rounded="true"
      font-family="Comic Neue"
    ></grw-app>
  </div>
</ClientOnly>