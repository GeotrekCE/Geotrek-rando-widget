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

# Traduire le widget

Actuellement le widget n'est traduit qu'en anglais, mais il peut supporter d'autre langues.

Pour cela, il suffit de rajouter un nouvel objet dans le fichier `/src/i18n/i18n.ts`.

Pour faire bénéficer Geotrek-widget des nouvelles traductions, il est possible de faire une proposition de traduction avec une pull request pour ce fichier.

Voici un exemple avec l'anglais :

```js
  en: {
    filter: 'Filter',
    practice: 'Practice',
    difficulty: 'Difficulty',
    duration: 'Duration',
    length: 'Length',
    treks: 'routes',
    trek: 'route',
    showList: 'Show the list',
    showMap: 'Show the map',
    showRoute: 'Show the route',
    showDetails: 'Show the details',
    download: 'Download',
    downloads: 'Downloads',
    description: 'Description',
    departure: 'Departure',
    arrival: 'Arrival',
    elevationProfile: 'Elevation profile',
    roadAccessAndParking: 'Road access and parking',
    transport: 'Transport',
    recommendations: 'Recommendations',
    recommendedParking: 'Parking',
    environmentalSensitiveAreas: 'Areas of environmental sensitivity',
    informationPlaces: 'Information places',
    accessibility: 'Accessibility',
    accessibilityLevel: 'Accessibility level',
    accessibilitySlope: 'Slope',
    accessibilityWidth: 'Width',
    accessibilitySignage: 'Signage',
    accessibilityCovering: 'Covering',
    accessibilityExposure: 'Exposure',
    accessibilityAdvices: 'Advices',
    pois: (poisLength: number) => (poisLength > 1 ? `${poisLength} points of interest` : `${poisLength} point of interest`),
    touristicContents: (touristicContentsLength: number) => `Near services (${touristicContentsLength})`,
    touristicEvents: (touristicEventsLength: number) => `Near events (${touristicEventsLength})`,
    sources: 'Sources',
    city: 'City',
    crossedCities: 'Cities',
    placeholderCrossedCities: 'Select one or more municipalities',
    home: {
      segment: {
        treks: 'Routes',
        touristicContents: 'Services',
        touristicEvents: 'Events',
        outdoorSites: 'Outdoor',
      },
      touristicContents: 'Services',
      touristicContent: 'Service',
      touristicEvents: 'Events',
      touristicEvent: 'Event',
      outdoorSites: 'Outdoor',
      outdoorSite: 'Outdoor',
    },
    options: {
      presentation: 'Presentation',
      description: 'Description',
      recommendations: 'Recommendations',
      environmentalSensitiveAreas: 'Sensitive areas',
      informationPlaces: 'Information places',
      pois: 'Points of interest',
      steps: 'Steps',
      touristicContents: 'Near',
      touristicEvents: 'Events',
      accessibility: 'Accessibility',
    },
    layers: {
      referencePoints: 'Reference points',
      parking: 'Parking',
      sensitiveArea: 'Sensitive areas',
      informationPlaces: 'Information places',
      pois: 'Points of interest',
      steps: 'Steps',
      touristicContents: 'Near',
      touristicEvents: 'Events',
      sites: 'sites',
      courses: 'Courses',
    },
    themes: 'Themes',
    placeholderThemes: 'Select one or more themes',
    placeholderPractices: 'Select one or more practices',
    routes: 'Type of course',
    elevation: 'Positive elevation',
    activities: 'Others',
    districts: 'Districts',
    erase: 'ERASE',
    ok: 'VALIDATE',
    location: 'Location',
    usefulInformation: 'Useful information',
    steps: 'steps',
    contact: 'Contact',
    email: 'Email',
    website: 'Website',
    category: 'Category',
    services: 'Services',
    type: 'Types',
    placeholderType: 'Select one or more types',
    centerOnMap: 'Center on map',
    readMore: 'Read more',
    readLess: 'Read less',
    sensitiveAreasDescription:
      'Along your trek, you will go through sensitive areas related to the presence of a specific species or environment. In these areas, an appropriate behaviour allows to contribute to their preservation. For detailed information, specific forms are accessible for each area.',
    emergencyNumber: 'Emergency number',
    learnMore: 'Learn more',
    date: 'Date',
    startDate: 'Start date',
    endDate: 'End date',
    outdoorSites: 'Sites',
    outdoorSite: 'Site',
    relatedOutdoorSites: (relatedOutdoorSitesLength: number) => `Sites (${relatedOutdoorSitesLength})`,
    relatedOutdoorCourses: (relatedOutdoorCoursesLength: number) => `Courses (${relatedOutdoorCoursesLength})`,
    cardinalPoints: { n: 'North', ne: 'North-east', e: 'East', se: 'South-east', s: 'South', sw: 'South-west', w: 'West', nw: 'North-west' },
  },
```

## Surcharger des traductions

Depuis la version `0.16.0` de Geotrek-widget, il est possible de surcharger les traductions par défaut.

Pour cela, il faut ajouter une balise `<script></script>` sur la page où est intégrée le composant `grw`.

**Exemple de modifications du titre de la section "Recommandation" dans une fiche détail d'itinéraire :**

```js
<script>
  window.grwTranslate = {
    fr: {
      options: {
        recommendations: "Matériel"
        },
      recommendations: "Matériel"
    },
  };
</script>
```

**Voici un exemple de code complet :**
<ClientOnly>
  <script>
  window.grwTranslate = {
    fr: {
      options: {
        recommendations: "Matériel"
        },
      recommendations: "Matériel"
    },
  };
  </script>
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
      treks="true"
      rounded="true"
      color-departure-icon="#006b3b"
      color-arrival-icon="#85003b"
      color-sensitive-area="#4974a5"
      color-trek-line="#003e42"
      color-poi-icon="#974c6e"
      color-primary-app="#008eaa"
      color-on-primary="#ffffff"
      color-surface="#1c1b1f"
      color-on-surface="#49454e"
      color-surface-variant="#fff"
      color-on-surface-variant="#1c1b1f"
      color-primary-container="#94CCD8"
      color-on-primary-container="#005767"
      color-secondary-container="#94CCD8"
      color-on-secondary-container="#1d192b"
      color-background="#fff"
      color-surface-container-high="#fff"
      color-surface-container-low="#fff"
      fab-background-color="#94CCD8"
      fab-color="#003e42"
    ></grw-app>
  </div>
</ClientOnly>
