interface Translation {
  filter: string;
  practice: string;
  difficulty: string;
  duration: string;
  treks: string;
  trek: string;
  showMap: string;
  downloads: string;
  description: string;
  departure: string;
  arrival: string;
  elevationProfile: string;
  roadAccess: string;
  transport: string;
  recommandations: string;
  recommendedParking: string;
  equipements: string;
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
  sources: string;
  cities: string;
  options: {
    presentation: string;
    description: string;
    environmentalSensitiveAreas: string;
    informationPlaces: string;
    pois: string;
  };
  layers: {
    pointsReference: string;
    parking: string;
    sensitiveArea: string;
    informationPlaces: string;
    pois: string;
  };
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
    treks: 'randonnées',
    trek: 'randonnée',
    showMap: 'Voir la carte',
    downloads: 'Téléchargements',
    description: 'Description',
    departure: 'Départ',
    arrival: 'Arrivée',
    elevationProfile: 'Profil altimétrique',
    roadAccess: 'Accès routier',
    transport: 'Transport',
    recommandations: 'Recommandations',
    recommendedParking: 'Parking conseillé',
    equipements: 'Équipements',
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
    sources: 'Sources',
    cities: 'Communes traversées',
    options: {
      presentation: 'Présentation',
      description: 'Description',
      environmentalSensitiveAreas: 'Zones sensibles',
      informationPlaces: "Lieux d'informations",
      pois: 'Patrimoines',
    },
    layers: {
      pointsReference: 'Points de référence',
      parking: 'Parking conseillé',
      sensitiveArea: 'Zones de sensibilité environnementale',
      informationPlaces: 'Lieux de renseignement',
      pois: 'Patrimoines',
    },
  },
  en: {
    filter: 'Filter',
    practice: 'Practice',
    difficulty: 'Difficulty',
    duration: 'Duration',
    treks: 'Hikes',
    trek: 'Hike',
    showMap: 'Show the map',
    downloads: 'Downloads',
    description: 'Description',
    departure: 'Departure',
    arrival: 'Arrival',
    elevationProfile: 'Elevation profile',
    roadAccess: 'Road acess',
    transport: 'Transport',
    recommandations: 'Recommandations',
    recommendedParking: 'Parking recommended',
    equipements: 'Equipements',
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
    sources: 'Sources',
    cities: 'Cities crossed',
    options: {
      presentation: 'Presentation',
      description: 'Description',
      environmentalSensitiveAreas: 'Sensitive areas',
      informationPlaces: 'Information places',
      pois: 'Points of interest',
    },
    layers: {
      pointsReference: 'Reference points',
      parking: 'Parking',
      sensitiveArea: 'Sensitive areas',
      informationPlaces: 'Information places',
      pois: 'Points of interest',
    },
  },
};
