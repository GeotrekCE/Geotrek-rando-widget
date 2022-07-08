import { LineString, Geometry, Position } from 'geojson';

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
  geometry?: LineString;
  departure_geom?: Position;
  gpx?: string;
  kml?: string;
  pdf?: string;
  parking_location?: Position;
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
};

export type Pois = Poi[];

export type Poi = {
  id: number;
  name: string;
  description: string;
  attachments: Attachments;
  type: any;
  type_label: any;
  type_pictogram: any;
  url: string;
  published: boolean;
  geometry: Geometry;
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
