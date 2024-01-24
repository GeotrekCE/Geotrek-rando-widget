import { LineString, Geometry, Position, MultiPoint, Point } from 'geojson';

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
  descent: number;
  departure: string;
  departure_city: string;
  arrival?: string;
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
  information_desks?: number[];
  children?: number[];
  ratings?: number[];
  ratings_description?: string;
  networks: number[];
  web_links: Weblink[];
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

export type Districts = District[];

export type District = {
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

export type Lengths = Length[];

export type Length = {
  id: number;
  name: string;
  minValue: number;
  maxValue: number;
  selected: boolean;
};

export type Elevations = Elevation[];

export type Elevation = {
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
  latitude: number;
  longitude: number;
};

export type InformationDeskType = {
  id: number;
  label: string;
  pictogram: string;
};

export type TouristicContent = {
  id: number;
  name: string;
  attachments: Attachments;
  description?: string;
  description_teaser?: string;
  practical_info?: string;
  category: number;
  geometry: Point;
  cities?: string[];
  source?: number[];
  pdf?: string;
  contact?: string;
  email?: string;
  website?: string;
};

export type TouristicContents = TouristicContent[];

export type TouristicContentCategory = {
  id: number;
  label: string;
  pictogram: string;
};

export type TouristicContentCategories = TouristicContentCategory[];

export type TouristicEvent = {
  id: number;
  name: string;
  attachments: Attachments;
  description?: string;
  description_teaser?: string;
  practical_info?: string;
  type: number;
  geometry: Point;
  cities?: string[];
  source?: number[];
  pdf?: string;
  contact?: string;
  email?: string;
  website?: string;
  begin_date?: string;
  end_date?: string;
};

export type TouristicEvents = TouristicEvent[];

export type TouristicEventType = {
  id: number;
  type: string;
  pictogram: string;
};

export type TouristicEventTypes = TouristicEventType[];

export type TrekFilters = TrekFilter[];

export type TrekFilter = { property: string; trekProperty: string; trekPropertyIsArray: boolean; type: string; segment: string };

export type TouristicContentsFilters = TouristicContentsFilter[];

export type TouristicContentsFilter = { property: string; touristicContentProperty: string; touristicContentPropertyIsArray: boolean; type: string; segment: string };

export type TouristicEventsFilters = TouristicEventsFilter[];

export type TouristicEventsFilter = { property: string; touristicEventProperty: string; touristicEventPropertyIsArray: boolean; type: string; segment: string };

export type Option = {
  visible: boolean;
  indicator: boolean;
  ref: string;
};

export type Options = {
  presentation: Option;
  steps: Option;
  description: Option;
  pois: Option;
  recommendations: Option;
  sensitiveArea: Option;
  informationPlaces: Option;
  accessibility: Option;
  touristicContents: Option;
  touristicEvents: Option;
};

export type Mode = 'treks' | 'touristicContents' | 'touristicEvents';

export type Ratings = Rating[];

export type Rating = {
  id: number;
  name: string;
  scale: number;
};

export type RatingsScale = RatingScale[];

export type RatingScale = {
  id: number;
  name: string;
};

export type Networks = Network[];

export type Network = {
  id: number;
  label: string;
  pictogram: string;
};

export type Weblink = {
  name: string;
  url: string;
  category: WeblinkCategory;
};

export type WeblinkCategory = {
  id: string;
  label: string;
  pictogram: string;
};
