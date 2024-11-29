interface Translation {
  filter: string;
  practice: string;
  difficulty: string;
  duration: string;
  length: string;
  treks: string;
  trek: string;
  showList: string;
  showMap: string;
  showRoute: string;
  showDetails: string;
  download: string;
  downloads: string;
  description: string;
  departure: string;
  arrival: string;
  elevationProfile: string;
  roadAccessAndParking: string;
  transport: string;
  recommendations: string;
  recommendedParking: string;
  environmentalSensitiveAreas: string;
  informationPlaces: string;
  accessibility: string;
  accessibilityLevel: string;
  accessibilitySlope: string;
  accessibilityWidth: string;
  accessibilitySignage: string;
  accessibilityCovering: string;
  accessibilityExposure: string;
  accessibilityAdvices: string;
  pois: Function;
  touristicContents: Function;
  touristicEvents: Function;
  sources: string;
  city: string;
  crossedCities: string;
  placeholderCrossedCities: string;
  home: {
    segment: {
      treks: string;
      touristicContents: string;
      touristicEvents: string;
      outdoorSites: string;
      sensitiveAreas: string;
    };
    touristicContents: string;
    touristicContent: string;
    touristicEvents: string;
    touristicEvent: string;
    outdoorSites: string;
    outdoorSite: string;
    sensitiveAreas: string;
    sensitiveArea: string;
  };
  options: {
    presentation: string;
    description: string;
    recommendations: string;
    environmentalSensitiveAreas: string;
    informationPlaces: string;
    pois: string;
    steps: string;
    touristicContents: string;
    touristicEvents: string;
    accessibility: string;
  };
  layers: {
    referencePoints: string;
    parking: string;
    sensitiveArea: string;
    informationPlaces: string;
    pois: string;
    steps: string;
    touristicContents: string;
    touristicEvents: string;
    sites: string;
    courses: string;
    signages: string;
  };
  themes: string;
  placeholderThemes: string;
  placeholderPractices: string;
  routes: string;
  elevation: string;
  activities: string;
  districts: string;
  erase: string;
  ok: string;
  location: string;
  steps: string;
  usefulInformation: string;
  contact: string;
  email: string;
  website: string;
  category: string;
  services: string;
  type: string;
  placeholderType: string;
  centerOnMap: string;
  readMore: string;
  readLess: string;
  sensitiveAreasDescription: string;
  emergencyNumber: string;
  learnMore: string;
  date: string;
  startDate: string;
  endDate: string;
  outdoorSites: string;
  outdoorSite: string;
  relatedOutdoorSites: Function;
  relatedOutdoorCourses: Function;
  cardinalPoints: { n: string; ne: string; e: string; se: string; s?: string; sw: string; w: string; nw: string };
  placeholderDifficulties: string;
  placeholderDurations: string;
  placeholderLengths: string;
  placeholderElevations: string;
  placeholderRoutes: string;
  placeholderAccessibilities: string;
  placeholderActivities: string;
  placeholderDistricts: string;
  placeholderCategories: string;
  onlyOfflineTreks: string;
  onlyOfflineOutdoor: string;
  moreDetails: string;
  zoomIn: string;
  zoomOut: string;
  contract: string;
  locate: string;
  showElevation: string;
  hideElevation: string;
}

interface AvailableTranslations {
  fr: Translation;
  en: Translation;
  es: Translation;
}

const defaultTranslate: AvailableTranslations = {
  fr: {
    filter: 'Filtrer',
    practice: 'Pratique',
    difficulty: 'Difficulté',
    duration: 'Durée',
    length: 'Longueur',
    treks: 'itinéraires',
    trek: 'itinéraire',
    showList: 'Voir la liste',
    showMap: 'Voir la carte',
    showRoute: "Voir l'itinéraire",
    showDetails: 'Voir la fiche',
    download: 'Téléchargement',
    downloads: 'Téléchargements',
    description: 'Description',
    departure: 'Départ',
    arrival: 'Arrivée',
    elevationProfile: 'Profil altimétrique',
    roadAccessAndParking: 'Accès routier et parking',
    transport: 'Transport',
    recommendations: 'Recommandations',
    recommendedParking: 'Stationnement',
    environmentalSensitiveAreas: 'Zones de sensibilité environnementale',
    informationPlaces: 'Lieux de renseignement',
    accessibility: 'Accessibilité',
    accessibilityLevel: "Niveau d'accessibilité",
    accessibilitySlope: 'Pente',
    accessibilityWidth: 'Largeur',
    accessibilitySignage: 'Signalétique',
    accessibilityCovering: 'Revêtement',
    accessibilityExposure: 'Exposition',
    accessibilityAdvices: 'Conseils',
    pois: (poisLength: number) => (poisLength > 1 ? `Les ${poisLength} patrimoines à découvrir` : `${poisLength} patrimoine à découvrir`),
    touristicContents: (touristicContentsLength: number) => `Services à proximité (${touristicContentsLength})`,
    touristicEvents: (touristicEventsLength: number) => `Événements à proximité (${touristicEventsLength})`,
    sources: 'Sources',
    city: 'Commune',
    crossedCities: 'Communes',
    placeholderCrossedCities: 'Sélectionner une ou plusieurs communes',
    home: {
      segment: {
        treks: 'Itinéraires',
        touristicContents: 'Services',
        touristicEvents: 'Événements',
        outdoorSites: 'Outdoor',
        sensitiveAreas: 'Zones sensibles',
      },
      touristicContents: 'Services',
      touristicContent: 'Service',
      touristicEvents: 'Événements',
      touristicEvent: 'Événement',
      outdoorSites: 'Outdoor',
      outdoorSite: 'Outdoor',
      sensitiveArea: 'Zone sensible',
      sensitiveAreas: 'Zones sensibles',
    },
    options: {
      presentation: 'Présentation',
      description: 'Description',
      recommendations: 'Recommandations',
      environmentalSensitiveAreas: 'Zones sensibles',
      informationPlaces: 'Lieux de renseignement',
      pois: 'Patrimoines',
      steps: 'Étapes',
      touristicContents: 'À proximité',
      touristicEvents: 'Événements',
      accessibility: 'Accessibilité',
    },
    layers: {
      referencePoints: 'Points de référence',
      parking: 'Parking conseillé',
      sensitiveArea: 'Zones de sensibilité environnementale',
      informationPlaces: 'Lieux de renseignement',
      pois: 'Patrimoines',
      steps: 'Étapes',
      touristicContents: 'À proximité',
      touristicEvents: 'Événements',
      sites: 'Sites',
      courses: 'Parcours',
      signages: 'Signalétiques',
    },
    themes: 'Thèmes',
    placeholderThemes: 'Sélectionner un ou plusieurs thèmes',
    placeholderPractices: 'Sélectionner une ou plusieurs pratiques',
    routes: 'Type de parcours',
    elevation: 'Denivelé positif',
    activities: 'Autres',
    districts: 'Secteurs',
    erase: 'EFFACER',
    ok: 'VALIDER',
    location: 'Localisation',
    steps: 'étapes',
    usefulInformation: 'Informations pratiques',
    contact: 'Contact',
    email: 'Email',
    website: 'Site web',
    category: 'Catégorie',
    services: 'Services',
    type: 'Types',
    placeholderType: 'Sélectionner un ou plusieurs types',
    centerOnMap: 'Centrer sur la carte',
    readMore: 'Lire plus',
    readLess: 'Lire moins',
    sensitiveAreasDescription:
      "Le long de votre itinéraire, vous allez traverser des zones de sensibilité liées à la présence d'une espèce ou d'un milieu particulier. Dans ces zones, un comportement adapté permet de contribuer à leur préservation. Pour plus d'informations détaillées, des fiches spécifiques sont accessibles pour chaque zone.",
    emergencyNumber: 'Numéro de secours',
    learnMore: 'En savoir plus',
    date: 'Date',
    startDate: 'Date de début',
    endDate: 'Date de fin',
    outdoorSites: 'Sites',
    outdoorSite: 'Site',
    relatedOutdoorSites: (relatedOutdoorSitesLength: number) => `Sites (${relatedOutdoorSitesLength})`,
    relatedOutdoorCourses: (relatedOutdoorCoursesLength: number) => `Parcours (${relatedOutdoorCoursesLength})`,
    cardinalPoints: { n: 'Nord', ne: 'Nord-est', e: 'Est', se: 'Sud-est', s: 'Sud', sw: 'Sud-ouest', w: 'Ouest', nw: 'Nord-ouest' },
    placeholderDifficulties: 'Sélectionner une ou plusieurs difficultés',
    placeholderDurations: 'Sélectionner une ou plusieurs durées',
    placeholderLengths: 'Sélectionner une ou plusieurs longueurs',
    placeholderElevations: 'Sélectionner une ou plusieurs dénivelés',
    placeholderRoutes: 'Sélectionner un ou plusieurs type de parcours',
    placeholderAccessibilities: 'Sélectionner une ou plusieurs accessibilités',
    placeholderActivities: 'Sélectionner une ou plusieurs activités',
    placeholderDistricts: 'Sélectionner un ou plusieurs secteurs',
    placeholderCategories: 'Sélectionner une ou plusieurs catégories',
    onlyOfflineTreks: 'Afficher uniquement les itinéraires hors ligne',
    onlyOfflineOutdoor: 'Afficher uniquement les outdoor hors ligne',
    moreDetails: 'Plus de détails',
    zoomIn: 'Zoomer',
    zoomOut: 'Dézoomer',
    contract: 'Réinitialiser la position de la carte',
    locate: 'Géolocaliser',
    showElevation: 'Voir le dénivelé',
    hideElevation: 'Cacher le dénivelé',
  },
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
        sensitiveAreas: 'Sensitive areas',
      },
      touristicContents: 'Services',
      touristicContent: 'Service',
      touristicEvents: 'Events',
      touristicEvent: 'Event',
      outdoorSites: 'Outdoor',
      outdoorSite: 'Outdoor',
      sensitiveAreas: 'Sensitive areas',
      sensitiveArea: 'Sensitive area',
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
      sites: 'Sites',
      courses: 'Courses',
      signages: 'Signages',
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
    placeholderDifficulties: 'Select one or more difficulties',
    placeholderDurations: 'Select one or more durations',
    placeholderLengths: 'Select one or more lengths',
    placeholderElevations: 'Select one or more elevations',
    placeholderRoutes: 'Select one or more courses',
    placeholderAccessibilities: 'Select one or more accssibilities',
    placeholderActivities: 'Select one or more activities',
    placeholderDistricts: 'Select one or more districts',
    placeholderCategories: 'Select one or more categories',
    onlyOfflineTreks: 'Only display offline treks',
    onlyOfflineOutdoor: 'Only display offline outdoor',
    moreDetails: 'More details',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    contract: 'Reset map position',
    locate: 'Geolocate',
    showElevation: 'Show elevation',
    hideElevation: 'Hide elevation',
  },
  es: {
    filter: 'Filtrar',
    practice: 'Práctica',
    difficulty: 'Dificultad',
    duration: 'Duración',
    length: 'Largo',
    treks: 'itinerarios',
    trek: 'itinerario',
    showList: 'Ver la lista',
    showMap: 'Ver el mapa',
    showRoute: 'Ver el itinerario',
    showDetails: 'Ver más detalles',
    download: 'Descarga',
    downloads: 'Descargas',
    description: 'Descripción',
    departure: 'Inicio',
    arrival: 'Llegada',
    elevationProfile: 'Perfil altimétrico',
    roadAccessAndParking: 'Acceso por carretera y aparcamiento',
    transport: 'Transporte',
    recommendations: 'Recomendaciones',
    recommendedParking: 'Aparcamiento recomendado',
    environmentalSensitiveAreas: 'Zonas de sensibilidad medioambiental',
    informationPlaces: 'Puntos de información',
    accessibility: 'Accesibilidad',
    accessibilityLevel: 'Nivel de accesibilidad',
    accessibilitySlope: 'Inclinación',
    accessibilityWidth: 'Ancho',
    accessibilitySignage: 'Señalética',
    accessibilityCovering: 'Revestimiento',
    accessibilityExposure: 'Exposición',
    accessibilityAdvices: 'Consejos',
    pois: (poisLength: number) => (poisLength > 1 ? `${poisLength} Patrimonio para descubrir` : `${poisLength} Patrimonio para descubrir`),
    touristicContents: (touristicContentsLength: number) => `Servicios cercanos (${touristicContentsLength})`,
    touristicEvents: (touristicEventsLength: number) => `Eventos cercanos (${touristicEventsLength})`,
    sources: 'Fuentes',
    city: 'Municipio',
    crossedCities: 'Municipios',
    placeholderCrossedCities: 'Selecciona uno o varios municipios',
    home: {
      segment: {
        treks: 'Itinerarios',
        touristicContents: 'Servicios',
        touristicEvents: 'Eventos',
        outdoorSites: 'Outdoor',
        sensitiveAreas: 'Zonas sensibles',
      },
      touristicContents: 'Servicios',
      touristicContent: 'Servicio',
      touristicEvents: 'Eventos',
      touristicEvent: 'Evento',
      outdoorSites: 'Outdoor',
      outdoorSite: 'Outdoor',
      sensitiveAreas: 'Zonas sensibles',
      sensitiveArea: 'Zona sensible',
    },
    options: {
      presentation: 'Presentación',
      description: 'Descripción',
      recommendations: 'Recomendaciones',
      environmentalSensitiveAreas: 'Zonas sensibles',
      informationPlaces: 'Lugares de información',
      pois: 'Patrimonio',
      steps: 'Stapas',
      touristicContents: 'En las cercanías',
      touristicEvents: 'Eventos',
      accessibility: 'Accesibilidad',
    },
    layers: {
      referencePoints: 'Punto de referencia',
      parking: 'Estacionamiento recomendado',
      sensitiveArea: 'Zonas ambientalmente sensibles',
      informationPlaces: 'Puntos de información',
      pois: 'Patrtimonios',
      steps: 'Etapas',
      touristicContents: 'En las cercanías',
      touristicEvents: 'Eventos',
      sites: 'Sitios',
      courses: 'Recorrido',
      signages: 'Señalizaciones',
    },
    themes: 'Temas',
    placeholderThemes: 'Seleccione un o varios temas',
    placeholderPractices: 'Seleccione una o varias prácticas',
    routes: 'Tipo de itinerario',
    elevation: 'Descenso vertical positivo',
    activities: 'Otros',
    districts: 'Sectores',
    erase: 'BORRAR',
    ok: 'ACEPTAR',
    location: 'Ubicación',
    steps: 'etapas',
    usefulInformation: 'Información práctica',
    contact: 'Contacto',
    email: 'Correo electrónico',
    website: 'Página web',
    category: 'Categoría',
    services: 'Servicios',
    type: 'Tipo',
    placeholderType: 'Seleccione uno o varios tipos',
    centerOnMap: 'Centrar en el mapa',
    readMore: 'Leer más',
    readLess: 'Leer menos',
    sensitiveAreasDescription:
      'A lo largo de su ruta, pasará por zonas sensibles vinculadas a la presencia de una especie o un entorno determinados.En estas zonas, un comportamiento adecuado puede contribuir a preservarlas.Para obtener informaciónes más detalladas, fichas específicas para cada zona estan disponibles.',
    emergencyNumber: 'Número de emergencia',
    learnMore: 'Más información',
    date: 'Fecha',
    startDate: 'Fecha de inicio',
    endDate: 'Fecha final',
    outdoorSites: 'outdoor',
    outdoorSite: 'outdoor',
    relatedOutdoorSites: (relatedOutdoorSitesLength: number) => `Outdoor (${relatedOutdoorSitesLength})`,
    relatedOutdoorCourses: (relatedOutdoorCoursesLength: number) => `Itinerarios (${relatedOutdoorCoursesLength})`,
    cardinalPoints: { n: 'Norte', ne: 'Noreste', e: 'Este', se: 'Sureste', s: 'Sur', sw: 'Suroeste', w: 'Oeste', nw: 'Noroeste' },
    placeholderDifficulties: 'Seleccione una o varias dificultades',
    placeholderDurations: 'Seleccione una o varias duraciones',
    placeholderLengths: 'Seleccione una o varias longitudes',
    placeholderElevations: 'Seleccione una o varias elevaciones',
    placeholderRoutes: 'Seleccione uno o varios tipos de ruta',
    placeholderAccessibilities: 'Seleccione una o varias accesibilidades',
    placeholderActivities: 'Seleccione una o varias actividades',
    placeholderDistricts: 'Seleccione uno o varios sectores',
    placeholderCategories: 'Seleccione una o varias categorías',
    onlyOfflineTreks: 'Mostrar sólo itinerarios en modo sin conexión',
    onlyOfflineOutdoor: 'Mostrar sólo los outdoor disponible sin conexión',
    moreDetails: 'Más detalles',
    zoomIn: 'Zoom',
    zoomOut: 'Zoom',
    contract: 'Restablecer la posición del mapa',
    locate: 'Geolocalizar',
    showElevation: 'Ver la elevación',
    hideElevation: 'Ocultar la elevación',
  },
};

let translate: AvailableTranslations = { ...defaultTranslate };

if ((window as any).grwTranslate) {
  if ((window as any).grwTranslate.fr) {
    translate.fr = { ...defaultTranslate.fr, ...(window as any).grwTranslate.fr };
    translate.fr.home = { ...defaultTranslate.fr.home, ...((window as any).grwTranslate.fr.home ? (window as any).grwTranslate.fr.home : {}) };
    translate.fr.home.segment = {
      ...defaultTranslate.fr.home.segment,
      ...((window as any).grwTranslate.fr.home && (window as any).grwTranslate.fr.home.segment ? (window as any).grwTranslate.fr.home.segment : {}),
    };
    translate.fr.options = { ...defaultTranslate.fr.options, ...((window as any).grwTranslate.fr.options ? (window as any).grwTranslate.fr.options : {}) };
    translate.fr.layers = { ...defaultTranslate.fr.layers, ...((window as any).grwTranslate.fr.layers ? (window as any).grwTranslate.fr.layers : {}) };
  }

  if ((window as any).grwTranslate.en) {
    translate.en = { ...defaultTranslate.en, ...(window as any).grwTranslate.en };
    translate.en.home = { ...defaultTranslate.en.home, ...((window as any).grwTranslate.en.home ? (window as any).grwTranslate.en.home : {}) };
    translate.en.home.segment = {
      ...defaultTranslate.en.home.segment,
      ...((window as any).grwTranslate.en.home && (window as any).grwTranslate.en.home.segment ? (window as any).grwTranslate.en.home.segment : {}),
    };
    translate.en.options = { ...defaultTranslate.en.options, ...((window as any).grwTranslate.en.options ? (window as any).grwTranslate.en.options : {}) };
    translate.en.layers = { ...defaultTranslate.en.layers, ...((window as any).grwTranslate.en.layers ? (window as any).grwTranslate.en.layers : {}) };
  }
}

export { translate };
