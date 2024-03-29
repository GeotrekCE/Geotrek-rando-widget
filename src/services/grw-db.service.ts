import { DBSchema, openDB } from 'idb';
import L from 'leaflet';
import { TileInfo, TileLayerOffline, downloadTile, getBlobByKey, saveTile } from 'leaflet.offline';
import {
  Difficulty,
  Route,
  Practice,
  Trek,
  Theme,
  City,
  Accessibility,
  Rating,
  RatingScale,
  SensitiveArea,
  Label,
  Source,
  AccessibilityLevel,
  TouristicContent,
  TouristicContentCategory,
  TouristicEvent,
  TouristicEventType,
  Network,
  Poi,
  PoiType,
  InformationDesk,
  Treks,
  Difficulties,
  Routes,
  Practices,
  Themes,
  Cities,
  Accessibilities,
  Ratings,
  RatingsScale,
  SensitiveAreas,
  Labels,
  Sources,
  AccessibilitiesLevel,
  TouristicContents,
  TouristicContentCategories,
  TouristicEvents,
  TouristicEventTypes,
  Networks,
  Pois,
  PoiTypes,
  InformationDesks,
  District,
  Districts,
  ImageInStore,
} from 'types/types';
import { blobToArrayBuffer, getFilesToStore } from 'utils/utils';

type ObjectStores = ObjectStore[];

type ObjectStore = { name: ObjectStoresName; keyPath: KeyPath };

type ObjectStoresName =
  | 'districts'
  | 'treks'
  | 'difficulties'
  | 'routes'
  | 'practices'
  | 'themes'
  | 'cities'
  | 'accessibilities'
  | 'ratings'
  | 'ratingsScale'
  | 'sensitiveAreas'
  | 'labels'
  | 'sources'
  | 'accessibilitiesLevel'
  | 'touristicContents'
  | 'touristicContentCategories'
  | 'touristicEvents'
  | 'touristicEventTypes'
  | 'networks'
  | 'pois'
  | 'poiTypes'
  | 'informationDesks'
  | 'images';

type KeyPath = 'id' | 'url';

type ObjectStoresType<T> = T extends 'districts'
  ? District
  : T extends 'treks'
  ? Trek
  : T extends 'difficulties'
  ? Difficulty
  : T extends 'routes'
  ? Route
  : T extends 'practices'
  ? Practice
  : T extends 'themes'
  ? Theme
  : T extends 'cities'
  ? City
  : T extends 'accessibilities'
  ? Accessibility
  : T extends 'ratings'
  ? Rating
  : T extends 'ratingsScale'
  ? RatingScale
  : T extends 'sensitiveAreas'
  ? SensitiveArea
  : T extends 'labels'
  ? Label
  : T extends 'sources'
  ? Source
  : T extends 'accessibilitiesLevel'
  ? AccessibilityLevel
  : T extends 'touristicContents'
  ? TouristicContent
  : T extends 'touristicContentCategories'
  ? TouristicContentCategory
  : T extends 'touristicEvents'
  ? TouristicEvent
  : T extends 'touristicEventTypes'
  ? TouristicEventType
  : T extends 'networks'
  ? Network
  : T extends 'pois'
  ? Poi
  : T extends 'poiTypes'
  ? PoiType
  : T extends 'informationDesks'
  ? InformationDesk
  : T extends 'images'
  ? ImageInStore
  : never;

type ObjectStoresData =
  | Treks
  | Districts
  | Difficulties
  | Routes
  | Practices
  | Themes
  | Cities
  | Accessibilities
  | Ratings
  | RatingsScale
  | SensitiveAreas
  | Labels
  | Sources
  | AccessibilitiesLevel
  | TouristicContents
  | TouristicContentCategories
  | TouristicEvents
  | TouristicEventTypes
  | Networks
  | Pois
  | PoiTypes
  | InformationDesks
  | ImageInStore[];

interface GrwDB extends DBSchema {
  districts: {
    value: Trek;
    key: number;
  };
  treks: {
    value: Trek;
    key: number;
  };
  difficulties: {
    value: Difficulty;
    key: number;
  };
  routes: {
    value: Route;
    key: number;
  };
  practices: {
    value: Practice;
    key: number;
  };
  themes: {
    value: Theme;
    key: number;
  };
  cities: {
    value: City;
    key: number;
  };
  accessibilities: {
    value: Accessibility;
    key: number;
  };
  ratings: {
    value: Rating;
    key: number;
  };
  ratingsScale: {
    value: RatingScale;
    key: number;
  };
  sensitiveAreas: {
    value: SensitiveArea;
    key: number;
  };
  labels: {
    value: Label;
    key: number;
  };
  sources: {
    value: Source;
    key: number;
  };
  accessibilitiesLevel: {
    value: AccessibilityLevel;
    key: number;
  };
  touristicContents: {
    value: TouristicContent;
    key: number;
  };
  touristicContentCategories: {
    value: TouristicContentCategory;
    key: number;
  };
  touristicEvents: {
    value: TouristicEvent;
    key: number;
  };
  touristicEventTypes: {
    value: TouristicEventType;
    key: number;
  };
  networks: {
    value: Network;
    key: number;
  };
  pois: {
    value: Poi;
    key: number;
  };
  poiTypes: {
    value: PoiType;
    key: number;
  };
  informationDesks: {
    value: InformationDesk;
    key: number;
  };
  images: {
    value: ImageInStore;
    key: string;
  };
}

const grwDbVersion = 1;

export async function getGrwDB() {
  const grwDb = await openDB<GrwDB>('grw', grwDbVersion, {
    upgrade(db) {
      const objectStoresNames: ObjectStores = [
        { name: 'districts', keyPath: 'id' },
        { name: 'treks', keyPath: 'id' },
        { name: 'difficulties', keyPath: 'id' },
        { name: 'routes', keyPath: 'id' },
        { name: 'practices', keyPath: 'id' },
        { name: 'themes', keyPath: 'id' },
        { name: 'cities', keyPath: 'id' },
        { name: 'accessibilities', keyPath: 'id' },
        { name: 'ratings', keyPath: 'id' },
        { name: 'ratingsScale', keyPath: 'id' },
        { name: 'sensitiveAreas', keyPath: 'id' },
        { name: 'labels', keyPath: 'id' },
        { name: 'sources', keyPath: 'id' },
        { name: 'accessibilitiesLevel', keyPath: 'id' },
        { name: 'touristicContents', keyPath: 'id' },
        { name: 'touristicContentCategories', keyPath: 'id' },
        { name: 'touristicEvents', keyPath: 'id' },
        { name: 'touristicEventTypes', keyPath: 'id' },
        { name: 'networks', keyPath: 'id' },
        { name: 'pois', keyPath: 'id' },
        { name: 'poiTypes', keyPath: 'id' },
        { name: 'informationDesks', keyPath: 'id' },
        { name: 'images', keyPath: 'url' },
      ];

      objectStoresNames.forEach(objectStoresName => {
        if (!db.objectStoreNames.contains(objectStoresName.name)) {
          db.createObjectStore(objectStoresName.name, { keyPath: objectStoresName.keyPath });
        }
      });
    },
  });
  return grwDb;
}

export async function getDataInStore<T extends ObjectStoresName>(name: T, dataId: number | string): Promise<ObjectStoresType<T>> {
  const grwDb = await getGrwDB();
  const data = await grwDb.get(name, dataId);
  grwDb.close();
  return data as ObjectStoresType<T>;
}

export async function getAllDataInStore<T extends ObjectStoresName>(name: T): Promise<ObjectStoresType<T>[]> {
  const grwDb = await getGrwDB();
  const data = await grwDb.getAll(name);
  grwDb.close();
  return data as ObjectStoresType<T>[];
}

export async function writeOrUpdateDataInStore(name: ObjectStoresName, data: ObjectStoresData) {
  if (data) {
    const grwDb = await getGrwDB();
    const tx = grwDb.transaction(name, 'readwrite');
    await Promise.all([...data.map(d => tx.store.put(d)), tx.done]);
    grwDb.close();
  }
}

export async function deleteDataInStore(name: ObjectStoresName, dataId: number[]) {
  const grwDb = await getGrwDB();
  const tx = grwDb.transaction(name, 'readwrite');
  await Promise.all([...dataId.map(d => tx.store.delete(d)), tx.done]);
  grwDb.close();
}

export async function writeOrUpdateFilesInStore(value, imagesRegExp, onlyFirstArrayFile = false) {
  const filesToStore = await getFilesToStore(value, imagesRegExp, onlyFirstArrayFile);

  const filesToStoreNotInStore = [];
  for (let i = 0; i < filesToStore.length; i++) {
    if (!(await getDataInStore('images', filesToStore[i]))) filesToStoreNotInStore.push(filesToStore[i]);
  }

  const filesToStorePromises = filesToStoreNotInStore.map(fileToStore => fetch(fileToStore));
  const filesToStoreToBlobPromises = await Promise.all(filesToStorePromises).catch(() => null);
  if (filesToStoreToBlobPromises) {
    const filesToStore = await Promise.all(
      filesToStoreToBlobPromises.map(response => {
        return response.blob();
      }),
    );

    for (let index = 0; index < filesToStore.length; index++) {
      const data = await blobToArrayBuffer(filesToStore[index]);
      await writeOrUpdateDataInStore('images', [{ url: filesToStoreToBlobPromises[index].url, data, type: filesToStore[index].type }]);
    }
  }
}

export async function writeOrUpdateTilesInStore(offlineLayer: TileLayerOffline, bounds, minZoom, MaxZoom) {
  const tilesToStore: TileInfo[] = [];
  for (let index = minZoom; index <= MaxZoom; index++) {
    tilesToStore.push(
      ...offlineLayer.getTileUrls(L.bounds(L.CRS.EPSG3857.latLngToPoint(bounds.getNorthWest(), index), L.CRS.EPSG3857.latLngToPoint(bounds.getSouthEast(), index)), index),
    );
  }

  const tilesToDownload = [];
  for (let index = 0; index < tilesToStore.length; index++) {
    if (!(await getBlobByKey(tilesToStore[index].key))) {
      tilesToDownload.push(downloadTile(tilesToStore[index].url).catch(() => null));
    }
  }

  const tilesBlob = await Promise.all(tilesToDownload.filter(tileToDownload => tileToDownload)).then(blob => blob);
  for (let index = 0; index < tilesBlob.length; index++) {
    await saveTile(tilesToStore[index], tilesBlob[index]);
  }
}
