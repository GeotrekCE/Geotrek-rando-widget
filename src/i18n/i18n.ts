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
    };
    touristicContents: string;
    touristicContent: string;
    touristicEvents: string;
    touristicEvent: string;
    outdoorSites: string;
    outdoorSite: string;
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
}

interface AvailableTranslations {
  fr: Translation;
  en: Translation;
}

export const translate: AvailableTranslations = {
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
      },
      touristicContents: 'Services',
      touristicContent: 'Service',
      touristicEvents: 'Événements',
      touristicEvent: 'Événement',
      outdoorSites: 'Outdoor',
      outdoorSite: 'Outdoor',
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
    },
    themes: 'Thèmes',
    placeholderThemes: 'Sélectionner un ou plusieurs thèmes',
    placeholderPractices: 'Sélectionner une ou plusieurs pratiques',
    routes: 'Type de parcours',
    elevation: 'Denivelé positif',
    activities: 'Autres',
    districts: 'Secteurs',
    erase: 'EFFACER',
    ok: 'OK',
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
      'Le long de votre itinéraire, vous allez traverser des zones de sensibilité liées à la présence d’une espèce ou d’un milieu particulier. Dans ces zones, un comportement adapté permet de contribuer à leur préservation. Pour plus d’informations détaillées, des fiches spécifiques sont accessibles pour chaque zone.',
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
    ok: 'OK',
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
};
