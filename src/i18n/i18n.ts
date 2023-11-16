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
  roadAccess: string;
  transport: string;
  recommendations: string;
  recommendedParking: string;
  equipments: string;
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
  };
  themes: string;
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
    treks: 'randonnées',
    trek: 'randonnée',
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
    roadAccess: 'Accès routier',
    transport: 'Transport',
    recommendations: 'Recommandations',
    recommendedParking: 'Parking conseillé',
    equipments: 'Équipements',
    environmentalSensitiveAreas: 'Zones de sensibilité environnementale',
    informationPlaces: 'Lieux de renseignement',
    accessibility: 'Accessibilité',
    accessibilityLevel: "Niveau d'accessibilité",
    accessibilitySlope: 'Pente',
    accessibilityWidth: 'Largeur',
    accessibilitySignage: 'Signalisation',
    accessibilityCovering: 'Revêtement',
    accessibilityExposure: 'Exposition',
    accessibilityAdvices: 'Conseils',
    pois: (poisLength: number) => `Les ${poisLength} patrimoines à découvrir`,
    touristicContents: (touristicContentsLength: number) => `À proximité (${touristicContentsLength})`,
    touristicEvents: (touristicEventsLength: number) => `Événements (${touristicEventsLength})`,
    sources: 'Sources',
    city: 'Commune',
    crossedCities: 'Communes traversées',
    options: {
      presentation: 'Présentation',
      description: 'Description',
      recommendations: 'Recommandations',
      environmentalSensitiveAreas: 'Zones sensibles',
      informationPlaces: "Lieux d'informations",
      pois: 'Patrimoines',
      steps: 'Étapes',
      touristicContents: 'À proximité',
      touristicEvents: 'Événements',
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
    },
    themes: 'Thèmes',
    routes: 'Type de parcours',
    elevation: 'Denivelé positif',
    activities: 'Activités',
    districts: 'Secteurs',
    erase: 'Effacer',
    ok: 'Ok',
    location: 'Localisation',
    steps: 'étapes',
    usefulInformation: 'Informations pratiques',
    contact: 'Contact',
    email: 'Email',
    website: 'Site web',
  },
  en: {
    filter: 'Filter',
    practice: 'Practice',
    difficulty: 'Difficulty',
    duration: 'Duration',
    length: 'Length',
    treks: 'Hikes',
    trek: 'Hike',
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
    roadAccess: 'Road acess',
    transport: 'Transport',
    recommendations: 'Recommendations',
    recommendedParking: 'Parking recommended',
    equipments: 'Equipements',
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
    pois: (poisLength: number) => `${poisLength} points of interest`,
    touristicContents: (touristicContentsLength: number) => `Near (${touristicContentsLength})`,
    touristicEvents: (touristicEventsLength: number) => `Events (${touristicEventsLength})`,
    sources: 'Sources',
    city: 'City',
    crossedCities: 'Cities crossed',
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
    },
    themes: 'Themes',
    routes: 'Type of course',
    elevation: 'Positive elevation',
    activities: 'Activities',
    districts: 'Districts',
    erase: 'Erase',
    ok: 'Ok',
    location: 'Location',
    usefulInformation: 'Useful information',
    steps: 'steps',
    contact: 'Contact',
    email: 'Email',
    website: 'Website',
  },
};
