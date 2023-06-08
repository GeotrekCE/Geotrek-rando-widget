import { LineString, Geometry, Position, MultiPoint } from 'geojson';

export type Treks = Trek[];

export type Trek = {
  id: number;
  name: string;
  attachments: Attachments;
  description?: string;
  description_teaser: string;
  difficulty: number;
  route: number;
  practice: number;
  themes: number[];
  duration: number;
  length_2d: number;
  ascent: number;
  departure: string;
  departure_city: string;
  arrival?: string;
  altimetric_profile?: string;
  geometry?: LineString;
  departure_geom?: Position;
  gpx?: string;
  kml?: string;
  pdf?: string;
  parking_location?: Position;
  ambiance?: string;
  access?: string;
  public_transport?: string;
  advice?: string;
  advised_parking?: string;
  gear?: string;
  labels?: number[];
  points_reference?: MultiPoint;
  source?: number[];
  structure?: number;
  disabled_infrastructure?: string;
  accessibilities?: number[];
  accessibility_level?: number;
  accessibility_slope?: string;
  accessibility_width?: string;
  accessibility_signage?: string;
  accessibility_covering?: string;
  accessibility_exposure?: string;
  accessibility_advice?: string;
  cities?: string[];
};

export type Attachments = Attachment[];

export type Attachment = {
  backend: string;
  type: string;
  author: string;
  thumbnail: string;
  legend: string;
  title: string;
  url: string;
  uuid: string;
};

export type Difficulties = Difficulty[];

export type Difficulty = {
  id: number;
  label: string;
  pictogram: string;
};

export type Routes = Route[];

export type Route = {
  id: number;
  route: string;
  pictogram: string;
};

export type Practices = Practice[];

export type Practice = {
  id: number;
  name: string;
  pictogram: string;
  selected: boolean;
};

export type Themes = Theme[];

export type Theme = {
  id: number;
  label: string;
  pictogram: string;
};

export type Cities = City[];

export type City = {
  id: string;
  name: string;
};

export type Labels = Label[];

export type Label = {
  id: number;
  name: string;
  advice: string;
  pictogram: string;
};

export type Sources = Source[];

export type Source = {
  id: number;
  name: string;
  website: string;
  pictogram: string;
};

export type Accessibilities = Accessibility[];

export type Accessibility = {
  id: number;
  name: string;
  pictogram: string;
};

export type accessibilitiesLevel = AccessibilityLevel[];

export type AccessibilityLevel = {
  id: number;
  name: string;
};

export type Durations = Duration[];

export type Duration = {
  id: number;
  name: string;
  minValue: number;
  maxValue: number;
  selected: boolean;
};

export type SensitiveAreas = SensitiveArea[];

export type SensitiveArea = {
  id: number;
  geometry: Geometry;
  name: string;
  description: string;
  contact: string;
  info_url: string;
  period: boolean[];
  practices: number[];
};

export type Pois = Poi[];

export type Poi = {
  id: number;
  name: string;
  description: string;
  attachments: Attachments;
  type: number;
  geometry: Geometry;
};

export type PoiTypes = PoiType[];

export type PoiType = {
  id: number;
  pictogram: string;
};

export type InformationDesks = InformationDesk[];

export type InformationDesk = {
  id: number;
  name: string;
  description: string;
  type: InformationDeskType;
  phone: string;
  email: string;
  website: string;
  municipality: string;
  postal_code: string;
  street: string;
  photo_url: string;
  latitude: string;
  longitude: string;
};

export type InformationDeskType = {
  id: number;
  label: string;
  pictogram: string;
};

export type Filters = Filter[];

export type Filter = { property: string; trekProperty: string; type: string };
