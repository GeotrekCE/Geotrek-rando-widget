import { LineString, Geometry, Position, MultiPoint, Point, GeometryCollection } from 'geojson';

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
  children?: number[];
  ratings?: number[];
  ratings_description?: string;
  networks: number[];
  web_links: Weblinks;
  update_datetime: string;
  offline?: boolean;
  information_desks?: number[];
  pois?: number[];
  signages?: number[];
  touristicContents?: number[];
  touristicEvents?: number[];
  sensitiveAreas?: number[];
  parents?: number[];
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

export type AccessibilitiesLevel = AccessibilityLevel[];

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
  species_id: number;
  contact: string;
  info_url: string;
  period: boolean[];
  practices: number[];
  offline?: boolean;
  attachments?: Attachments;
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
  offline?: boolean;
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
  offline?: boolean;
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

export type OutdoorSitesFilters = OutdoorSitesFilter[];

export type OutdoorSitesFilter = { property: string; outdoorSiteProperty: string; outdoorSitePropertyIsArray: boolean; type: string; segment: string };

export type SensitiveAreasFilters = SensitiveAreasFilter[];

export type SensitiveAreasFilter = { property: string; sensitiveAreaProperty: string; sensitiveAreaPropertyIsArray: boolean; type: string; segment: string };


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

export type Mode = 'treks' | 'touristicContents' | 'touristicEvents' | 'outdoor' | 'sensitiveAreas';

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

export type Weblinks = Weblink[];

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

export type ImageInStore = { url: string; data: string | ArrayBuffer; type: string };

export type OutdoorSites = OutdoorSite[];

export type OutdoorSite = {
  id: number;
  name: string;
  geometry: GeometryCollection;
  accessibility: string;
  advice: string;
  ambiance: string;
  attachments: Attachments;
  cities: string[];
  children: number[];
  description: string;
  description_teaser: string;
  districts: number[];
  labels: number[];
  managers: number[];
  orientation: string[];
  pdf: string;
  period: string;
  parent: number;
  portal: number[];
  practice: number;
  provider: string;
  ratings: number[];
  sector: number;
  source: number[];
  structure: number;
  themes: number[];
  view_points: [];
  type: number;
  courses: number[];
  web_links: Weblinks;
  wind: string[];
  offline?: boolean;
  information_desks: number[];
  pois?: number[];
  touristicContents?: number[];
  touristicEvents?: number[];
  parents?: number[];
};

export type OutdoorCourses = OutdoorCourse[];

export type OutdoorCourse = {
  id: number;
  name: string;
  geometry: GeometryCollection;
  accessibility: string;
  advice: string;
  attachments: Attachments;
  children: number[];
  cities: string[];
  description: string;
  districts: number[];
  duration: number | null;
  equipment: string;
  gear: string;
  height: number | null;
  length: number;
  max_elevation: number;
  min_elevation: number;
  parents: number[];
  pdf: string;
  points_reference: MultiPoint | null;
  provider: string;
  ratings: number[];
  ratings_description: string;
  sites: number[];
  structure: number;
  type: number | null;
  offline?: boolean;
  pois?: number[];
  touristicContents?: number[];
  touristicEvents?: number[];
};

export type OutdoorSiteTypes = OutdoorSiteType[];

export type OutdoorSiteType = {
  id: number;
  name: string;
  practice: number;
};

export type OutdoorPractices = OutdoorPractice[];

export type OutdoorPractice = {
  id: number;
  name: string;
  sector: number;
  pictogram: string;
};

export type OutdoorCourseTypes = OutdoorCourseType[];

export type OutdoorCourseType = {
  id: number;
  name: string;
  pictogram: string;
};

export type Signages = Signage[];

export type Signage = {
  id: number;
  geometry: Geometry;
  name: string;
};

export type SensitiveAreaPractices = SensitiveAreaPractice[];

export type SensitiveAreaPractice = {
  id: number;
  name: string;
};

export type SensitiveAreaSpecies = SensitiveAreaSpecie[];

export type SensitiveAreaSpecie = {
  id: number;
  name: string;
  period01: boolean;
  period02: boolean;
  period03: boolean;
  period04: boolean;
  period05: boolean;
  period06: boolean;
  period07: boolean;
  period08: boolean;
  period09: boolean;
  period10: boolean;
  period11: boolean;
  period12: boolean;
  practices: number[];
  radius: number;
  url: string;
};


// export type BBox = [number, number, number, number];

export type SearchParams = {
  language: string;
  no_page?: number;
  period?: string;
  practices?: string;
  structures?: string;
  in_bbox?: string;
  page_size?: string;
  fields?: string;
  published?: boolean;
}
