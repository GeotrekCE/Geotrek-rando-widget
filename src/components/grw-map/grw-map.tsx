import { Component, Host, h, Prop, State, Event, EventEmitter, getAssetPath, Build, Listen } from '@stencil/core';
import { Feature, FeatureCollection } from 'geojson';
import L, { MarkerClusterGroup, TileLayer } from 'leaflet';
import 'leaflet-rotate';
import 'leaflet.locatecontrol';
import 'leaflet-i18n';
import '@raruto/leaflet-elevation/dist/leaflet-elevation.min.js';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import state, { onChange, reset } from 'store/store';
import { translate } from 'i18n/i18n';
import { getTrekGeometry } from 'services/treks.service';

@Component({
  tag: 'grw-map',
  styleUrl: 'grw-map.scss',
  shadow: true,
})
export class GrwMap {
  mapRef: HTMLElement;
  elevationRef: HTMLElement;
  maxZoom = 19;

  @Event() trekCardPress: EventEmitter<number>;
  @Event() touristicContentCardPress: EventEmitter<number>;
  @Event() touristicEventCardPress: EventEmitter<number>;

  @State() mapIsReady = false;
  @Prop() nameLayer: string;
  @Prop() urlLayer: string;
  @Prop() attributionLayer: string;
  @Prop() center = '1, 1';
  @Prop() zoom = 10;

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorPrimaryContainer = '#eaddff';
  @Prop() colorOnPrimaryContainer = '#21005e';
  @Prop() colorBackground = '#fef7ff';

  @Prop() colorTrekLine = '#6b0030';
  @Prop() colorSensitiveArea = '#4974a5';
  @Prop() colorPoiIcon = '#974c6e';
  @Prop() useGradient = false;

  @Prop() resetStoreOnDisconnected = true;
  @Prop() isLargeView = false;
  map: L.Map;
  resizeObserver: ResizeObserver;
  bounds;
  treksLayer: L.GeoJSON<any>;
  toutisticContentsLayer: L.GeoJSON<any>;
  toutisticEventsLayer: L.GeoJSON<any>;

  treksMarkerClusterGroup: MarkerClusterGroup;
  touristicContentsMarkerClusterGroup: MarkerClusterGroup;
  touristicEventsMarkerClusterGroup: MarkerClusterGroup;
  currentTrekLayer: L.GeoJSON<any>;
  currentStepsLayer: L.GeoJSON<any>;
  selectedCurrentTrekLayer: L.GeoJSON<any>;
  selectedCurrentStepLayer: L.GeoJSON<any>;
  selectedTouristicContentLayer: L.GeoJSON<any>;
  selectedTouristicEventLayer: L.GeoJSON<any>;
  currentReferencePointsLayer: L.GeoJSON<any>;
  currentParkingLayer: L.GeoJSON<any>;
  currentSensitiveAreasLayer: L.GeoJSON<any>;
  currentPoisLayer: L.GeoJSON<any>;
  currentInformationDesksLayer: L.GeoJSON<any>;
  currentToutisticContentsLayer: L.GeoJSON<any>;
  currentToutisticEventsLayer: L.GeoJSON<any>;
  currentToutisticContentLayer: L.GeoJSON<any>;
  currentToutisticEventLayer: L.GeoJSON<any>;
  elevationControl: L.Control.Layers;
  layersControl: L.Control.Layers;
  userLayersState: {
    [key: number]: boolean;
  } = {};
  tileLayer: { key: string; value: TileLayer }[] = [];
  trekPopupIsOpen: boolean;
  stepPopupIsOpen: boolean;
  touristicContentPopupIsOpen: boolean;
  touristicEventPopupIsOpen: boolean;

  handleTreksWithinBoundsBind: (event: any) => void = this.handleTreksWithinBounds.bind(this);
  handleTouristicContentsWithinBoundsBind: (event: any) => void = this.handleTouristicContentsWithinBounds.bind(this);
  handleTouristicEventsWithinBoundsBind: (event: any) => void = this.handleTouristicEventsWithinBounds.bind(this);

  @Listen('centerOnMap', { target: 'window' })
  onCenterOnMap(event: CustomEvent<{ latitude: number; longitude: number }>) {
    this.map.setView(new L.LatLng(event.detail.latitude, event.detail.longitude), 17, { animate: false });
  }

  @Listen('stepsIsInViewport', { target: 'window' })
  stepsIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentStepsLayer) {
      this.handleLayerVisibility(event.detail, this.currentStepsLayer);
    }
  }

  @Listen('descriptionIsInViewport', { target: 'window' })
  descriptionIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentReferencePointsLayer) {
      this.handleLayerVisibility(event.detail, this.currentReferencePointsLayer);
    }
  }

  @Listen('parkingIsInViewport', { target: 'window' })
  parkingIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentParkingLayer) {
      this.handleLayerVisibility(event.detail, this.currentParkingLayer);
    }
  }

  @Listen('informationDeskIsInViewport', { target: 'window' })
  onInformationDesksIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentInformationDesksLayer) {
      this.handleLayerVisibility(event.detail, this.currentInformationDesksLayer);
    }
  }

  @Listen('sensitiveAreaIsInViewport', { target: 'window' })
  sensitiveAreaIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentSensitiveAreasLayer) {
      this.handleLayerVisibility(event.detail, this.currentSensitiveAreasLayer);
    }
  }

  @Listen('poiIsInViewport', { target: 'window' })
  poiIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentPoisLayer) {
      this.handleLayerVisibility(event.detail, this.currentPoisLayer);
    }
  }

  @Listen('touristicContentsIsInViewport', { target: 'window' })
  touristicContentsIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentToutisticContentsLayer) {
      this.handleLayerVisibility(event.detail, this.currentToutisticContentsLayer);
    }
  }

  @Listen('touristicEventsIsInViewport', { target: 'window' })
  touristicEventsIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentToutisticEventsLayer) {
      this.handleLayerVisibility(event.detail, this.currentToutisticEventsLayer);
    }
  }

  @Listen('cardTrekMouseOver', { target: 'window' })
  onCardTrekMouseOver(event: CustomEvent<number>) {
    if (!state.parentTrek && (!state.selectedTrekId || state.selectedTrekId !== event.detail)) {
      state.selectedTrekId = event.detail;
      this.hideTrekLine();
      this.showTrekLine(event.detail);
      this.addSelectedCurrentTrek(event.detail);
    } else if (state.parentTrek) {
      this.stepPopupIsOpen = false;
      state.selectedStepId = null;
      this.addSelectedCurrentStep(event.detail);
    }
  }

  @Listen('cardTrekMouseLeave', { target: 'window' })
  onCardTrekMouseLeave() {
    if (!this.trekPopupIsOpen && state.selectedTrekId) {
      this.trekPopupIsOpen = false;
      state.selectedTrekId = null;
      this.hideTrekLine();
      this.removeSelectedCurrentTrek();
    } else if (this.currentStepsLayer) {
      state.selectedStepId = null;
      this.removeSelectedCurrentStep();
    }
  }

  @Listen('cardTouristicContentMouseOver', { target: 'window' })
  onTouristicContentMouseOver(event: CustomEvent<number>) {
    this.touristicContentPopupIsOpen = false;
    state.selectedTouristicContentId = null;
    this.addSelectedTouristicContent(event.detail);
  }

  @Listen('cardTouristicContentMouseLeave', { target: 'window' })
  onTouristicContentMouseLeave() {
    state.selectedTouristicContentId = null;
    this.removeSelectedTouristicContent();
  }

  @Listen('cardTouristicEventMouseOver', { target: 'window' })
  onTouristicEventMouseOver(event: CustomEvent<number>) {
    this.touristicEventPopupIsOpen = false;
    state.selectedTouristicEventId = null;
    this.addSelectedTouristicEvent(event.detail);
  }

  @Listen('cardTouristicEventMouseLeave', { target: 'window' })
  onTouristicEventMouseLeave() {
    state.selectedTouristicEventId = null;
    this.removeSelectedTouristicEvent();
  }

  componentDidLoad() {
    this.map = L.map(this.mapRef, {
      center: this.center.split(',').map(Number) as L.LatLngExpression,
      zoom: this.zoom,
    });

    L.control.scale({ metric: true, imperial: false }).addTo(this.map);
    (L.control as any).locate({ showPopup: false }).addTo(this.map);

    const nameLayers = this.nameLayer ? this.nameLayer.split(',') : [];

    const urlLayers = this.urlLayer.split(',http').map((url, index) => (index === 0 ? url : 'http' + url));

    const attributionLayers = this.attributionLayer ? this.attributionLayer.split(',') : [];
    urlLayers.forEach((urlLayer, index) => {
      this.tileLayer.push({
        key: `${nameLayers[index]}`,
        value: L.tileLayer(urlLayer, {
          maxZoom: this.maxZoom,
          attribution: `${
            attributionLayers[index] && attributionLayers[index] !== '' ? attributionLayers[index].concat(' | ') : ''
          }Powered by <a target="_blank" href="https://geotrek.fr/">Geotrek</a>`,
          crossOrigin: true,
        }),
      });
    });
    this.tileLayer[0].value.addTo(this.map);

    if (urlLayers.length > 1) {
      this.layersControl = L.control
        .layers(
          this.tileLayer.reduce((tileLayers, tileLayer) => Object.assign(tileLayers, { [tileLayer.key]: tileLayer.value }), {}),
          {},
          { collapsed: true },
        )
        .addTo(this.map);

      (L.Control as any).Contract = L.Control.extend({
        onAdd: () => {
          const contractContainer = L.DomUtil.create('div');
          contractContainer.className = 'leaflet-bar leaflet-control';
          const contract = contractContainer.appendChild(L.DomUtil.create('a'));
          contract.href = '#';
          contract.style.backgroundImage = `var(--contract-image-src)`;
          contractContainer.onclick = e => {
            this.bounds && this.map.fitBounds(this.bounds);
            e.preventDefault();
          };
          return contractContainer;
        },
      });

      (L.control as any).contract = opts => {
        return new (L.Control as any).Contract(opts);
      };

      (L.control as any).contract({ position: 'topleft' }).addTo(this.map);
    }

    if (state.currentTrek) {
      this.addTrek();
    } else if (state.currentTreks) {
      this.addTreks();
    } else if (state.currentTouristicContent) {
      this.addTouristicContent();
    } else if (state.currentTouristicEvent) {
      this.addTouristicEvent();
    } else if (state.touristicContents) {
      this.addTouristicContents();
    } else if (state.touristicEvents) {
      this.addTouristicEvents();
    }

    onChange('currentTreks', () => {
      this.hideTrekLine();
      this.removeSelectedCurrentTrek();
      this.removeSelectedTouristicContent();
      this.removeSelectedTouristicEvent();
      if (state.currentTrek) {
        this.removeTreks();
        this.addTrek();
      } else if (state.currentTreks) {
        this.removeTreks();
        this.removeTouristicContents();
        this.removeTouristicEvents();
        this.removeTrek();
        this.removeTouristicContent();
        this.removeTouristicEvent();
        this.addTreks(true);
      }
    });

    onChange('currentTrek', () => {
      if (state.currentTrek) {
        this.removeTreks();
        this.addTrek();
      } else if (state.currentTreks) {
        this.removeTrek();
        this.removeTouristicContent();
        this.removeTouristicEvent();
        this.addTreks();
      }
    });

    onChange('currentTouristicContent', () => {
      if (state.currentTouristicContent) {
        this.removeTrek();
        this.removeTouristicContents();
        this.addTouristicContent();
      } else if (state.touristicContents) {
        this.removeTouristicContent();
        this.addTouristicContents();
      } else if (state.currentTrek) {
        this.removeTouristicContent();
        this.addTrek();
      } else if (state.currentTreks) {
        this.removeTouristicContent();
        this.addTreks();
      }
    });

    onChange('currentTouristicEvent', () => {
      if (state.currentTouristicEvent) {
        this.removeTrek();
        this.removeTouristicEvents();
        this.addTouristicEvent();
      } else if (state.currentTrek) {
        this.removeTouristicEvent();
        this.addTrek();
      } else if (state.currentTreks) {
        this.removeTouristicEvent();
        this.addTreks();
      }
    });

    onChange('currentTouristicContents', () => {
      this.hideTrekLine();
      this.removeSelectedCurrentTrek();
      this.removeSelectedTouristicContent();
      this.removeSelectedTouristicEvent();
      if (state.currentTouristicContent) {
        this.removeTouristicContents();
        this.addTouristicContent();
      } else if (state.currentTouristicContents) {
        this.removeTreks();
        this.removeTouristicEvents();
        this.removeTouristicContent();
        this.addTouristicContents(true);
      }
    });

    onChange('currentTouristicEvents', () => {
      this.hideTrekLine();
      this.removeSelectedCurrentTrek();
      this.removeSelectedTouristicContent();
      this.removeSelectedTouristicEvent();
      if (state.currentTouristicEvent) {
        this.removeTouristicEvents();
        this.addTouristicEvent();
      } else if (state.currentTouristicEvents) {
        this.removeTreks();
        this.removeTouristicContents();
        this.removeTouristicEvent();
        this.addTouristicEvents(true);
      }
    });

    onChange('mode', () => {
      this.hideTrekLine();
      this.removeSelectedCurrentTrek();
      this.removeSelectedTouristicContent();
      this.removeSelectedTouristicEvent();
      if (state.mode === 'treks') {
        if (state.treks) {
          this.removeTouristicContents();
          this.removeTouristicEvents();
          this.addTreks(true);
        }
      } else if (state.mode === 'touristicContents') {
        if (state.touristicContents) {
          this.removeTreks();
          this.removeTouristicEvents();
          this.addTouristicContents(true);
        }
      } else if (state.mode === 'touristicEvents') {
        if (state.touristicEvents) {
          this.removeTreks();
          this.removeTouristicContents();
          this.addTouristicEvents(true);
        }
      }
    });
  }

  handleLayerVisibility(visible: boolean, layer: L.GeoJSON) {
    if (visible && !this.map.hasLayer(layer)) {
      layer.addTo(this.map);
    } else if (this.map.hasLayer(layer) && !this.userLayersState[(layer as any)._leaflet_id]) {
      this.map.removeLayer(layer);
    }
    this.handleLayersControlEvent();
  }

  addTreks(resetBounds = false) {
    state.treksWithinBounds = state.currentTreks;

    const treksCurrentDepartureCoordinates = [];
    const treksFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentTreks) {
      for (const trek of state.currentTreks) {
        treksCurrentDepartureCoordinates.push(trek.departure_geom);
        treksFeatureCollection.features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: trek.departure_geom },
          properties: {
            id: trek.id,
            name: trek.name,
            practice: state.practices.find(practice => practice.id === trek.practice)?.pictogram,
            imgSrc: trek.attachments && trek.attachments.length > 0 && trek.attachments[0].thumbnail,
          },
        });
      }
    }

    if (!this.treksLayer) {
      if ((treksCurrentDepartureCoordinates.length > 0 && !state.currentMapBounds) || resetBounds) {
        this.bounds = L.latLngBounds(treksCurrentDepartureCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      } else {
        if (state.currentMapBounds) {
          this.bounds = state.currentMapBounds;
        }
      }
      this.treksLayer = L.geoJSON(treksFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.practice
                ? `<div class="trek-marker-container"><img crossorigin="anonymous" src=${geoJsonPoint.properties.practice} /></div>`
                : `<div class="trek-marker-container"></div>`,
              className: 'trek-marker',
              iconSize: 32,
              iconAnchor: [16, 32],
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('click', () => {
            const trekDeparturePopup = L.DomUtil.create('div');
            trekDeparturePopup.className = 'trek-departure-popup';
            if (geoJsonPoint.properties.imgSrc) {
              const trekImg = L.DomUtil.create('img');
              trekImg.src = geoJsonPoint.properties.imgSrc;
              trekImg.crossOrigin = 'anonymous';
              trekDeparturePopup.appendChild(trekImg);
            }
            const trekName = L.DomUtil.create('div');
            trekName.innerHTML = geoJsonPoint.properties.name;
            trekName.className = 'trek-name';
            trekDeparturePopup.appendChild(trekName);

            const trekButton = L.DomUtil.create('button');
            trekButton.innerHTML = 'Afficher le détail';
            trekButton.className = 'trek-button';
            trekButton.onclick = () => this.trekCardPress.emit(geoJsonPoint.properties.id);
            trekDeparturePopup.appendChild(trekButton);

            layer.bindPopup(trekDeparturePopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
          });
          layer.on('mouseover', e => {
            this.hideTrekLine();
            this.showTrekLine(geoJsonPoint.properties.id);
            this.addSelectedCurrentTrek(geoJsonPoint.properties.id, e.latlng);
          });
        },
      });

      this.treksMarkerClusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: false,
        iconCreateFunction: cluster => {
          return L.divIcon({ html: '<div>' + cluster.getChildCount() + '</div>', className: 'treks-marker-cluster-group-icon', iconSize: 48 } as any);
        },
      });

      this.treksMarkerClusterGroup.addLayer(this.treksLayer);
      this.map.addLayer(this.treksMarkerClusterGroup);
    } else {
      if (treksCurrentDepartureCoordinates.length > 0) {
        this.bounds = L.latLngBounds(treksCurrentDepartureCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      } else {
        this.map.fire('moveend');
      }
      this.treksLayer.clearLayers();
      this.treksLayer.addData(treksFeatureCollection);
      this.treksMarkerClusterGroup.clearLayers();
      this.treksMarkerClusterGroup.addLayer(this.treksLayer);
    }

    this.bounds && this.map.fitBounds(this.bounds);

    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);
    this.map.on('moveend', this.handleTreksWithinBoundsBind);
  }

  removeTreks() {
    if (this.treksLayer) {
      state.currentMapBounds = this.map.getBounds();
      this.map.removeLayer(this.treksMarkerClusterGroup);
      this.treksLayer = null;
      this.treksMarkerClusterGroup = null;
      this.map.off('moveend', this.handleTreksWithinBoundsBind);
    }
  }

  handleTreksWithinBounds() {
    if (
      (state.currentTreks && !state.currentMapBounds) ||
      (state.currentTreks && state.currentMapBounds && state.currentMapBounds.toBBoxString() !== this.map.getBounds().toBBoxString())
    ) {
      state.treksWithinBounds = state.currentTreks.filter(trek => this.map.getBounds().contains(L.latLng(trek.departure_geom[1], trek.departure_geom[0])));
    }
  }

  handleTouristicContentsWithinBounds() {
    if (
      (state.currentTouristicContents && !state.currentMapBounds) ||
      (state.currentTouristicContents && state.currentMapBounds && state.currentMapBounds.toBBoxString() !== this.map.getBounds().toBBoxString())
    ) {
      state.touristicContentsWithinBounds = state.currentTouristicContents.filter(touristicContent =>
        this.map.getBounds().contains(L.latLng(touristicContent.geometry.coordinates[1], touristicContent.geometry.coordinates[0])),
      );
    }
  }

  handleTouristicEventsWithinBounds() {
    if (
      (state.currentTouristicEvents && !state.currentMapBounds) ||
      (state.currentTouristicEvents && state.currentMapBounds && state.currentMapBounds.toBBoxString() !== this.map.getBounds().toBBoxString())
    ) {
      state.touristicEventsWithinBounds = state.currentTouristicEvents.filter(touristicEvent =>
        this.map.getBounds().contains(L.latLng(touristicEvent.geometry.coordinates[1], touristicEvent.geometry.coordinates[0])),
      );
    }
  }

  addTrek() {
    this.trekPopupIsOpen = false;
    state.selectedTrekId = null;
    this.hideTrekLine();
    this.removeSelectedCurrentTrek();

    const currentTrekFeature: Feature = {
      type: 'Feature',
      geometry: state.currentTrek.geometry,
      properties: {},
    };

    this.currentTrekLayer = L.geoJSON(currentTrekFeature, {
      style: () => ({
        color: 'transparent',
      }),
      interactive: false,
    }).addTo(this.map);

    if (state.currentTrek.parking_location) {
      const parkingImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/parking.svg`);
      const currentParking: Feature = {
        type: 'Feature',
        properties: { name: state.currentTrek.advised_parking },
        geometry: { type: 'Point', coordinates: state.currentTrek.parking_location },
      };
      this.currentParkingLayer = L.geoJSON(currentParking, {
        pointToLayer: (_geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: `<img crossorigin="anonymous" src=${parkingImageSrc} />`,
              className: 'parking-icon',
              iconSize: 48,
              iconAnchor: [24, 48],
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('mouseover', () => {
            const parkingTooltip = L.DomUtil.create('div');
            parkingTooltip.className = 'parking-tooltip';
            const parkingName = L.DomUtil.create('div');
            parkingName.innerHTML = geoJsonPoint.properties.name;
            parkingName.className = 'parking-name';
            parkingTooltip.appendChild(parkingName);
            layer.bindTooltip(parkingTooltip).openTooltip();
          });
        },
      });
    }

    if (state.currentSensitiveAreas && state.currentSensitiveAreas.length > 0) {
      const currentSensitiveAreasFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const sensitiveArea of state.currentSensitiveAreas) {
        currentSensitiveAreasFeatureCollection.features.push({
          type: 'Feature',
          properties: { name: sensitiveArea.name },
          geometry: sensitiveArea.geometry,
        });
      }

      this.currentSensitiveAreasLayer = L.geoJSON(currentSensitiveAreasFeatureCollection, {
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('mouseover', () => {
            const sensitiveAreaTooltip = L.DomUtil.create('div');
            sensitiveAreaTooltip.className = 'sensitive-area-tooltip';
            const sensitiveAreaName = L.DomUtil.create('div');
            sensitiveAreaName.innerHTML = geoJsonPoint.properties.name;
            sensitiveAreaName.className = 'sensitive-area-name';
            sensitiveAreaTooltip.appendChild(sensitiveAreaName);
            layer.bindTooltip(sensitiveAreaTooltip).openTooltip();
          });
        },
        style: () => ({ color: this.colorSensitiveArea }),
      });
    }

    if (state.currentPois && state.currentPois.length > 0) {
      const currentPoisFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const currentPoi of state.currentPois) {
        currentPoisFeatureCollection.features.push({
          type: 'Feature',
          properties: { name: currentPoi.name, type_pictogram: state.poiTypes.find(poiType => poiType.id === currentPoi.type)?.pictogram },
          geometry: currentPoi.geometry,
        });
      }

      this.currentPoisLayer = L.geoJSON(currentPoisFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.type_pictogram ? `<img crossorigin="anonymous" src=${geoJsonPoint.properties.type_pictogram} />` : `<img />`,
              className: 'poi-icon',
              iconSize: 48,
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('mouseover', () => {
            const poiTooltip = L.DomUtil.create('div');
            poiTooltip.className = 'poi-tooltip';
            const poiName = L.DomUtil.create('div');
            poiName.innerHTML = geoJsonPoint.properties.name;
            poiName.className = 'poi-name';
            poiTooltip.appendChild(poiName);
            layer.bindTooltip(poiTooltip).openTooltip();
          });
        },
      });
    }

    if (state.trekTouristicContents && state.trekTouristicContents.length > 0) {
      const currentTouristicContentsFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const touristicContent of state.trekTouristicContents) {
        currentTouristicContentsFeatureCollection.features.push({
          type: 'Feature',
          properties: {
            name: touristicContent.name,
            category_pictogram: state.touristicContentCategories.find(touristicContentCategory => touristicContentCategory.id === touristicContent.category)?.pictogram,
          },
          geometry: touristicContent.geometry,
        });
      }

      this.currentToutisticContentsLayer = L.geoJSON(currentTouristicContentsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.category_pictogram ? `<img crossorigin="anonymous "src=${geoJsonPoint.properties.category_pictogram} />` : `<img />`,
              className: 'touristic-content-icon',
              iconSize: 48,
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('mouseover', () => {
            const touristicContentTooltip = L.DomUtil.create('div');
            touristicContentTooltip.className = 'touristic-content-tooltip';
            const touristicContentName = L.DomUtil.create('div');
            touristicContentName.innerHTML = geoJsonPoint.properties.name;
            touristicContentName.className = 'touristic-content-name';
            touristicContentTooltip.appendChild(touristicContentName);
            layer.bindTooltip(touristicContentTooltip).openTooltip();
          });
        },
      });
    }

    if (state.touristicEvents && state.touristicEvents.length > 0) {
      const currentTouristicEventsFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const touristicEvent of state.touristicEvents) {
        currentTouristicEventsFeatureCollection.features.push({
          type: 'Feature',
          properties: {
            name: touristicEvent.name,
            type_pictogram: state.touristicEventTypes.find(touristicEventType => touristicEventType.id === touristicEvent.type)?.pictogram,
          },
          geometry: touristicEvent.geometry,
        });
      }

      this.currentToutisticEventsLayer = L.geoJSON(currentTouristicEventsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.type_pictogram
                ? `
            <img crossorigin="anonymous" src=${geoJsonPoint.properties.type_pictogram} />`
                : `<img />`,
              className: 'touristic-event-icon',
              iconSize: 48,
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('mouseover', () => {
            const touristicEventTooltip = L.DomUtil.create('div');
            touristicEventTooltip.className = 'touristic-event-tooltip';
            const touristicEventName = L.DomUtil.create('div');
            touristicEventName.innerHTML = geoJsonPoint.properties.name;
            touristicEventName.className = 'touristic-event-name';
            touristicEventTooltip.appendChild(touristicEventName);
            layer.bindTooltip(touristicEventTooltip).openTooltip();
          });
        },
      });
    }

    if (state.currentInformationDesks && state.currentInformationDesks.length > 0) {
      const currentInformationDesksFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const currentInformationDesk of state.currentInformationDesks.filter(currentInformationDesks =>
        state.currentTrek.information_desks.includes(currentInformationDesks.id),
      )) {
        if (currentInformationDesk.latitude && currentInformationDesk.longitude) {
          currentInformationDesksFeatureCollection.features.push({
            type: 'Feature',
            properties: { name: currentInformationDesk.name, type_pictogram: currentInformationDesk.type.pictogram },
            geometry: { type: 'Point', coordinates: [Number(currentInformationDesk.longitude), Number(currentInformationDesk.latitude)] },
          });
        }
      }

      this.currentInformationDesksLayer = L.geoJSON(currentInformationDesksFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.type_pictogram ? `<img crossorigin="anonymous" src=${geoJsonPoint.properties.type_pictogram} />` : `<img />`,
              className: 'information-desks-icon',
              iconSize: 48,
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('mouseover', () => {
            const informationDesksTooltip = L.DomUtil.create('div');
            informationDesksTooltip.className = 'information-desks-tooltip';
            const informationDesksName = L.DomUtil.create('div');
            informationDesksName.innerHTML = geoJsonPoint.properties.name;
            informationDesksName.className = 'information-desks-name';
            informationDesksTooltip.appendChild(informationDesksName);
            layer.bindTooltip(informationDesksTooltip).openTooltip();
          });
        },
      });
    }

    if (state.currentTrek.points_reference) {
      const currentReferencePointsFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      currentReferencePointsFeatureCollection.features.push({
        type: 'Feature',
        properties: {},
        geometry: state.currentTrek.points_reference,
      });

      let index = 0;
      this.currentReferencePointsLayer = L.geoJSON(currentReferencePointsFeatureCollection, {
        pointToLayer: (_geoJsonPoint, latlng) => {
          index += 1;
          return L.marker(latlng, {
            icon: L.divIcon({
              html: index,
              className: 'point-reference-icon',
              iconSize: 24,
            } as any),
            autoPanOnFocus: false,
            interactive: false,
          } as any);
        },
      });
    }

    if (!this.currentStepsLayer && state.parentTrekId && state.parentTrek && state.currentTrek.id === state.parentTrekId) {
      const stepsFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      if (state.currentTrekSteps) {
        for (const trek of state.currentTrekSteps) {
          stepsFeatureCollection.features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: trek.departure_geom },
            properties: {
              id: trek.id,
              name: trek.name,
              practice: state.practices.find(practice => practice.id === trek.practice)?.pictogram,
              imgSrc: trek.attachments && trek.attachments.length > 0 && trek.attachments[0].thumbnail,
            },
          });
        }
      }

      let stepIndex = 0;
      this.currentStepsLayer = L.geoJSON(stepsFeatureCollection, {
        pointToLayer: (_geoJsonPoint, latlng) => {
          stepIndex += 1;
          return L.marker(latlng, {
            zIndexOffset: 4000000,
            icon: L.divIcon({
              html: `<div class="step-marker-container"><div class="step-number">${stepIndex}</div></div>`,
              className: 'step-marker',
              iconSize: 32,
            } as any),
            autoPanOnFocus: false,
          } as any);
        },
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('click', () => {
            const trekDeparturePopup = L.DomUtil.create('div');
            trekDeparturePopup.className = 'trek-departure-popup';
            if (geoJsonPoint.properties.imgSrc) {
              const trekImg = L.DomUtil.create('img');
              trekImg.src = geoJsonPoint.properties.imgSrc;
              trekImg.crossOrigin = 'anonymous';
              trekDeparturePopup.appendChild(trekImg);
            }
            const trekName = L.DomUtil.create('div');
            trekName.innerHTML = geoJsonPoint.properties.name;
            trekName.className = 'trek-name';
            trekDeparturePopup.appendChild(trekName);

            const trekButton = L.DomUtil.create('button');
            trekButton.innerHTML = 'Afficher le détail';
            trekButton.className = 'trek-button';
            trekButton.onclick = () => this.trekCardPress.emit(geoJsonPoint.properties.id);
            trekDeparturePopup.appendChild(trekButton);

            layer.bindPopup(trekDeparturePopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
          });
          layer.on('mouseover', e => {
            this.addSelectedCurrentStep(geoJsonPoint.properties.id, e.latlng);
          });
        },
      });
    }

    let elevationTranslation = {
      'y: ': '',
      'x: ': '',
    };
    /* @ts-ignore */
    L.registerLocale('fr', elevationTranslation);
    /* @ts-ignore */
    L.setLocale('fr');

    const elevationOptions = {
      srcFolder: 'https://unpkg.com/@raruto/leaflet-elevation/src/',
      elevationDiv: `#elevation`,
      theme: `custom-theme${!this.useGradient ? ' use-theme-color' : ''}`,
      detached: true,
      height: 250,
      wptIcons: true,
      wptLabels: true,
      collapsed: false,
      autohide: false,
      distanceMarkers: { distance: false, direction: true },
      hotline: this.useGradient,
      closeBtn: false,
      summary: false,
      time: false,
      timestamps: false,
      legend: false,
      downloadLink: false,
      autofitBounds: false,
      ruler: false,
      edgeScale: false,
      waypoints: false,
      almostOver: false,
      speed: false,
      slope: false,
      acceleration: false,
      reverseCoords: false,
      imperial: false,
      dragging: false,
      zooming: false,
      handlers: ['Altitude', 'Distance', 'Slope', 'LinearGradient'],
      linearGradient: {
        attr: 'z',
        path: 'altitude',
        range: { 0.0: '#008800', 0.5: '#ffff00', 1.0: '#ff0000' },
        min: 'elevation_min',
        max: 'elevation_max',
      },
    };
    this.elevationControl = (L.control as any).elevation({ ...elevationOptions }).addTo(this.map);
    const elevation = JSON.stringify({
      name: `${state.currentTrek.name}`,
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates: state.currentTrek.geometry.coordinates }, properties: null }],
    });
    (this.elevationControl as any).load(elevation);

    const overlays = {};
    if (this.currentStepsLayer) {
      overlays[translate[state.language].layers.steps] = this.currentStepsLayer;
    }
    if (this.currentReferencePointsLayer) {
      overlays[translate[state.language].layers.referencePoints] = this.currentReferencePointsLayer;
    }
    if (this.currentParkingLayer) {
      overlays[translate[state.language].layers.parking] = this.currentParkingLayer;
    }
    if (this.currentSensitiveAreasLayer) {
      overlays[translate[state.language].layers.sensitiveArea] = this.currentSensitiveAreasLayer;
    }
    if (this.currentInformationDesksLayer) {
      overlays[translate[state.language].layers.informationPlaces] = this.currentInformationDesksLayer;
    }
    if (this.currentPoisLayer) {
      overlays[translate[state.language].layers.pois] = this.currentPoisLayer;
    }
    if (this.currentToutisticContentsLayer) {
      overlays[translate[state.language].layers.touristicContents] = this.currentToutisticContentsLayer;
    }

    if (this.currentToutisticEventsLayer) {
      overlays[translate[state.language].layers.touristicEvents] = this.currentToutisticEventsLayer;
    }

    if (this.layersControl) {
      Object.keys(overlays).forEach(key => {
        this.layersControl.addOverlay(overlays[key], key);
      });
    } else {
      this.layersControl = L.control.layers({}, overlays, { collapsed: true }).addTo(this.map);
    }

    this.handleLayersControlEvent();

    this.bounds = L.latLngBounds(state.currentTrek.geometry.coordinates.map(coordinate => [coordinate[1], coordinate[0]]));
    this.bounds && this.map.fitBounds(this.bounds);

    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);
  }

  addSelectedCurrentTrek(id, customCoordinates?) {
    const treksFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentTreks) {
      const trek = state.currentTreks.find(trek => trek.id === id);
      treksFeatureCollection.features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: customCoordinates ? [customCoordinates.lng, customCoordinates.lat] : trek.departure_geom },
        properties: {
          id: trek.id,
          name: trek.name,
          practice: state.practices.find(practice => practice.id === trek.practice)?.pictogram,
          imgSrc: trek.attachments && trek.attachments.length > 0 && trek.attachments[0].thumbnail,
        },
      });
    }

    this.removeSelectedCurrentTrek();
    state.selectedTrekId = id;

    this.selectedCurrentTrekLayer = L.geoJSON(treksFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          zIndexOffset: 4000000,
          icon: L.divIcon({
            html: geoJsonPoint.properties.practice
              ? `<div class="trek-marker-container"><img crossorigin="anonymous" src=${geoJsonPoint.properties.practice} /></div>`
              : `<div class="trek-marker-container"></div>`,
            className: 'selected-trek-marker',
            iconSize: 64,
            iconAnchor: [32, 64],
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', () => {
          const trekDeparturePopup = L.DomUtil.create('div');
          trekDeparturePopup.className = 'trek-departure-popup';
          if (geoJsonPoint.properties.imgSrc) {
            const trekImg = L.DomUtil.create('img');
            trekImg.src = geoJsonPoint.properties.imgSrc;
            trekImg.crossOrigin = 'anonymous';
            trekDeparturePopup.appendChild(trekImg);
          }
          const trekName = L.DomUtil.create('div');
          trekName.innerHTML = geoJsonPoint.properties.name;
          trekName.className = 'trek-name';
          trekDeparturePopup.appendChild(trekName);

          const trekButton = L.DomUtil.create('button');
          trekButton.innerHTML = 'Afficher le détail';
          trekButton.className = 'trek-button';
          trekButton.onclick = () => this.trekCardPress.emit(geoJsonPoint.properties.id);
          trekDeparturePopup.appendChild(trekButton);

          layer.bindPopup(trekDeparturePopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
        });
        layer.on('mouseout', () => {
          if (!this.trekPopupIsOpen) {
            state.selectedTrekId = null;
            this.hideTrekLine();
            this.removeSelectedCurrentTrek();
          }
        });
        layer.on('popupopen', () => {
          this.trekPopupIsOpen = Boolean(state.selectedTrekId);
        });
        layer.on('popupclose', () => {
          if (state.selectedTrekId) {
            this.trekPopupIsOpen = false;
            state.selectedTrekId = null;
            this.hideTrekLine();
            this.removeSelectedCurrentTrek();
          }
        });
      },
    }).addTo(this.map);
  }

  removeSelectedCurrentTrek() {
    state.selectedTrekId = null;
    this.selectedCurrentTrekLayer && this.map.removeLayer(this.selectedCurrentTrekLayer);
    this.selectedCurrentTrekLayer = null;
  }

  addSelectedCurrentStep(id, customCoordinates?) {
    const stepsFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentTrekSteps) {
      const stepIndex = state.currentTrekSteps.findIndex(trek => trek.id === id);
      stepsFeatureCollection.features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: customCoordinates ? [customCoordinates.lng, customCoordinates.lat] : state.currentTrekSteps[stepIndex].departure_geom },
        properties: {
          id: state.currentTrekSteps[stepIndex].id,
          name: state.currentTrekSteps[stepIndex].name,
          practice: state.practices.find(practice => practice.id === state.currentTrekSteps[stepIndex].practice)?.pictogram,
          imgSrc:
            state.currentTrekSteps[stepIndex].attachments && state.currentTrekSteps[stepIndex].attachments.length > 0 && state.currentTrekSteps[stepIndex].attachments[0].thumbnail,
          index: stepIndex + 1,
        },
      });
    }

    this.removeSelectedCurrentStep();
    state.selectedStepId = id;

    this.selectedCurrentStepLayer = L.geoJSON(stepsFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          zIndexOffset: 4000000,
          icon: L.divIcon({
            html: `<div class="step-marker-container"><div class="step-number">${geoJsonPoint.properties.index}</div></div>`,
            className: 'selected-step-marker',
            iconSize: 64,
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', () => {
          const trekDeparturePopup = L.DomUtil.create('div');
          trekDeparturePopup.className = 'trek-departure-popup';
          if (geoJsonPoint.properties.imgSrc) {
            const trekImg = L.DomUtil.create('img');
            trekImg.src = geoJsonPoint.properties.imgSrc;
            trekImg.crossOrigin = 'anonymous';
            trekDeparturePopup.appendChild(trekImg);
          }
          const trekName = L.DomUtil.create('div');
          trekName.innerHTML = geoJsonPoint.properties.name;
          trekName.className = 'trek-name';
          trekDeparturePopup.appendChild(trekName);

          const trekButton = L.DomUtil.create('button');
          trekButton.innerHTML = 'Afficher le détail';
          trekButton.className = 'trek-button';
          trekButton.onclick = () => this.trekCardPress.emit(geoJsonPoint.properties.id);
          trekDeparturePopup.appendChild(trekButton);

          layer.bindPopup(trekDeparturePopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
        });
        layer.on('mouseout', () => {
          if (!this.stepPopupIsOpen) {
            state.selectedTrekId = null;
            this.removeSelectedCurrentStep();
          }
        });
        layer.on('popupopen', () => {
          this.stepPopupIsOpen = Boolean(state.selectedStepId);
        });
        layer.on('popupclose', () => {
          if (state.selectedStepId) {
            this.stepPopupIsOpen = false;
            state.selectedStepId = null;
            this.removeSelectedCurrentStep();
          }
        });
      },
    }).addTo(this.map);
  }

  removeSelectedCurrentStep() {
    if (state.selectedStepId) {
      state.selectedStepId = null;
      this.selectedCurrentStepLayer && this.map.removeLayer(this.selectedCurrentStepLayer);
      this.selectedCurrentStepLayer = null;
    }
  }

  handleLayersControlEvent() {
    const userLayersState: HTMLInputElement[] = (this.layersControl as any)._layerControlInputs;
    userLayersState.forEach((userLayerState: any) => {
      if ((this.layersControl as any)._layers.find(layer => layer.layer._leaflet_id === userLayerState.layerId).overlay) {
        userLayerState.onchange = event => {
          this.userLayersState[userLayerState.layerId] = (event.target as any).checked;
        };
      }
    });
  }

  removeTrek() {
    if (this.layersControl) {
      if (!(this.layersControl as any)._layers.some(layer => !layer.overlay)) {
        this.map.removeControl(this.layersControl);
        this.layersControl = null;
      } else {
        (this.layersControl as any)._layers
          .filter(layer => layer.overlay)
          .forEach(layer => {
            this.layersControl.removeLayer(layer.layer);
          });
      }
    }

    if (this.elevationControl) {
      (this.elevationControl as any).clear();
      this.map.removeControl(this.elevationControl);
      this.elevationControl = null;
    }

    if (this.currentTrekLayer) {
      this.map.removeLayer(this.currentTrekLayer);
      this.currentTrekLayer = null;
    }

    if (this.currentParkingLayer) {
      this.map.removeLayer(this.currentParkingLayer);
      this.currentParkingLayer = null;
    }

    if (this.currentSensitiveAreasLayer) {
      this.map.removeLayer(this.currentSensitiveAreasLayer);
      this.currentSensitiveAreasLayer = null;
    }

    if (this.currentPoisLayer) {
      this.map.removeLayer(this.currentPoisLayer);
      this.currentPoisLayer = null;
    }

    if (this.currentInformationDesksLayer) {
      this.map.removeLayer(this.currentInformationDesksLayer);
      this.currentInformationDesksLayer = null;
    }

    if (this.currentReferencePointsLayer) {
      this.map.removeLayer(this.currentReferencePointsLayer);
      this.currentReferencePointsLayer = null;
    }

    if (this.currentStepsLayer) {
      this.map.removeLayer(this.currentStepsLayer);
      this.currentStepsLayer = null;
    }

    if (this.currentToutisticContentsLayer) {
      this.map.removeLayer(this.currentToutisticContentsLayer);
      this.currentToutisticContentsLayer = null;
    }
    if (this.currentToutisticEventsLayer) {
      this.map.removeLayer(this.currentToutisticEventsLayer);
      this.currentToutisticEventsLayer = null;
    }
  }

  disconnectedCallback() {
    if (this.resetStoreOnDisconnected) {
      reset();
    }
  }

  showTrekLine(id) {
    getTrekGeometry(id).then(response => {
      const currentTrekFeature: Feature = {
        type: 'Feature',
        geometry: response.geometry,
        properties: {},
      };

      this.currentTrekLayer = L.geoJSON(currentTrekFeature, {
        style: () => ({
          color: this.colorTrekLine,
        }),
        interactive: false,
      }).addTo(this.map);
    });
  }

  hideTrekLine() {
    if (this.currentTrekLayer) {
      this.map.removeLayer(this.currentTrekLayer);
      this.currentTrekLayer = null;
    }
  }

  addTouristicContent() {
    this.touristicContentPopupIsOpen = false;
    state.selectedTouristicContentId = null;
    this.removeSelectedTouristicContent();

    const touristicContentsFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentTouristicContent) {
      touristicContentsFeatureCollection.features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: state.currentTouristicContent.geometry.coordinates },
        properties: {
          id: state.currentTouristicContent.id,
          name: state.currentTouristicContent.name,
          practice: state.touristicContentCategories.find(touristicContentCategory => touristicContentCategory.id === state.currentTouristicContent.category).pictogram,
        },
      });
    }

    if (!this.currentToutisticContentLayer) {
      this.currentToutisticContentLayer = L.geoJSON(touristicContentsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.practice
                ? `<div class="touristic-content-marker-container"><img crossorigin="anonymous "src=${geoJsonPoint.properties.practice} /></div>`
                : `<div class="touristic-content-marker-container"></div>`,
              className: 'touristic-content-marker',
              iconSize: 32,
            } as any),
            autoPanOnFocus: false,
          } as any),
      });
      this.map.addLayer(this.currentToutisticContentLayer);
    }

    this.map.setView([state.currentTouristicContent.geometry.coordinates[1], state.currentTouristicContent.geometry.coordinates[0]], this.maxZoom);
    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);
  }

  removeTouristicContent() {
    if (this.currentToutisticContentLayer) {
      this.map.removeLayer(this.currentToutisticContentLayer);
      this.currentToutisticContentLayer = null;
    }
  }

  addTouristicContents(resetBounds = false) {
    state.touristicContentsWithinBounds = state.currentTouristicContents;

    const touristicContentsCurrentCoordinates = [];

    const touristicContentsFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentTouristicContents) {
      for (const currentTouristicContent of state.currentTouristicContents) {
        touristicContentsCurrentCoordinates.push(currentTouristicContent.geometry.coordinates);

        touristicContentsFeatureCollection.features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: currentTouristicContent.geometry.coordinates },
          properties: {
            id: currentTouristicContent.id,
            name: currentTouristicContent.name,
            practice: state.touristicContentCategories.find(touristicContentCategory => touristicContentCategory.id === currentTouristicContent.category).pictogram,
            imgSrc: currentTouristicContent.attachments && currentTouristicContent.attachments.length > 0 && currentTouristicContent.attachments[0].thumbnail,
          },
        });
      }
    }

    if (!this.toutisticContentsLayer) {
      if ((touristicContentsCurrentCoordinates.length > 0 && !state.currentMapBounds) || resetBounds) {
        this.bounds = L.latLngBounds(touristicContentsCurrentCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      } else {
        if (state.currentMapBounds) {
          this.bounds = state.currentMapBounds;
        }
      }
      this.toutisticContentsLayer = L.geoJSON(touristicContentsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.practice
                ? `<div class="touristic-content-marker-container"><img crossorigin="anonymous" src=${geoJsonPoint.properties.practice} /></div>`
                : `<div class="touristic-content-marker-container"></div>`,
              className: 'touristic-content-marker',
              iconSize: 32,
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('click', () => {
            const touristicContentCoordinatesPopup = L.DomUtil.create('div');
            touristicContentCoordinatesPopup.className = 'touristic-content-coordinates-popup';
            if (geoJsonPoint.properties.imgSrc) {
              const touristicContentImg = L.DomUtil.create('img');
              touristicContentImg.src = geoJsonPoint.properties.imgSrc;
              touristicContentImg.crossOrigin = 'anonymous';
              touristicContentCoordinatesPopup.appendChild(touristicContentImg);
            }
            const touristicContentName = L.DomUtil.create('div');
            touristicContentName.innerHTML = geoJsonPoint.properties.name;
            touristicContentName.className = 'touristic-content-name';
            touristicContentCoordinatesPopup.appendChild(touristicContentName);

            const touristicContentButton = L.DomUtil.create('button');
            touristicContentButton.innerHTML = 'Afficher le détail';
            touristicContentButton.className = 'touristic-content-button';
            touristicContentButton.onclick = () => this.touristicContentCardPress.emit(geoJsonPoint.properties.id);
            touristicContentCoordinatesPopup.appendChild(touristicContentButton);

            layer.bindPopup(touristicContentCoordinatesPopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
          });
          layer.on('mouseover', e => {
            this.addSelectedTouristicContent(geoJsonPoint.properties.id, e.latlng);
          });
        },
      });

      this.touristicContentsMarkerClusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: false,
        iconCreateFunction: cluster => {
          return L.divIcon({
            html: '<div>' + cluster.getChildCount() + '</div>',
            className: 'touristic-content-marker-cluster-group-icon',
            iconSize: 48,
          } as any);
        },
      });

      this.touristicContentsMarkerClusterGroup.addLayer(this.toutisticContentsLayer);
      this.map.addLayer(this.touristicContentsMarkerClusterGroup);
    } else {
      if (touristicContentsCurrentCoordinates.length > 0) {
        this.bounds = L.latLngBounds(touristicContentsCurrentCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      } else {
        this.map.fire('moveend');
      }
      this.toutisticContentsLayer.clearLayers();
      this.toutisticContentsLayer.addData(touristicContentsFeatureCollection);
      this.touristicContentsMarkerClusterGroup.clearLayers();
      this.touristicContentsMarkerClusterGroup.addLayer(this.toutisticContentsLayer);
    }

    this.bounds && this.map.fitBounds(this.bounds);

    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);

    this.map.on('moveend', this.handleTouristicContentsWithinBoundsBind);
  }

  removeTouristicContents() {
    if (this.toutisticContentsLayer) {
      state.currentMapBounds = this.map.getBounds();
      this.map.removeLayer(this.touristicContentsMarkerClusterGroup);
      this.toutisticContentsLayer = null;
      this.touristicContentsMarkerClusterGroup = null;
      this.map.off('moveend', this.handleTouristicContentsWithinBoundsBind);
    }
  }

  addTouristicEvent() {
    const touristicEventsFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentTouristicEvent) {
      touristicEventsFeatureCollection.features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: state.currentTouristicEvent.geometry.coordinates },
        properties: {
          id: state.currentTouristicEvent.id,
          name: state.currentTouristicEvent.name,
          type: state.touristicEventTypes.find(touristicEventType => touristicEventType.id === state.currentTouristicEvent.type).pictogram,
        },
      });
    }

    if (!this.currentToutisticEventLayer) {
      this.currentToutisticEventLayer = L.geoJSON(touristicEventsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.type
                ? `<div class="touristic-event-marker-container"><img crossorigin="anonymous" src=${geoJsonPoint.properties.type} /></div>`
                : `<div class="touristic-event-marker-container"></div>`,
              className: 'touristic-event-marker',
              iconSize: 32,
            } as any),
            autoPanOnFocus: false,
          } as any),
      });
      this.map.addLayer(this.currentToutisticEventLayer);
    }

    this.map.setView([state.currentTouristicEvent.geometry.coordinates[1], state.currentTouristicEvent.geometry.coordinates[0]], this.maxZoom);
    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);
  }

  removeTouristicEvent() {
    if (this.currentToutisticEventLayer) {
      this.map.removeLayer(this.currentToutisticEventLayer);
      this.currentToutisticEventLayer = null;
    }
  }

  addSelectedTouristicContent(id, customCoordinates?) {
    const touristicContentFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.touristicContents) {
      const touristicContent = state.touristicContents.find(touristicContent => touristicContent.id === id);
      touristicContentFeatureCollection.features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: customCoordinates ? [customCoordinates.lng, customCoordinates.lat] : touristicContent.geometry.coordinates },
        properties: {
          id: touristicContent.id,
          name: touristicContent.name,
          category: state.touristicContentCategories.find(practice => practice.id === touristicContent.category)?.pictogram,
          imgSrc: touristicContent.attachments && touristicContent.attachments.length > 0 && touristicContent.attachments[0].thumbnail,
        },
      });
    }

    this.removeSelectedTouristicContent();
    state.selectedTouristicContentId = id;

    this.selectedTouristicContentLayer = L.geoJSON(touristicContentFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          zIndexOffset: 4000000,
          icon: L.divIcon({
            html: geoJsonPoint.properties.category
              ? `<div class="touristic-content-marker-container"><img crossorigin="anonymous" src=${geoJsonPoint.properties.category} /></div>`
              : `<div class="touristic-content-marker-container"></div>`,
            className: 'selected-touristic-content-marker',
            iconSize: 64,
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', () => {
          const touristicContentDeparturePopup = L.DomUtil.create('div');
          touristicContentDeparturePopup.className = 'touristic-content-coordinates-popup';
          if (geoJsonPoint.properties.imgSrc) {
            const touristicContentImg = L.DomUtil.create('img');
            touristicContentImg.src = geoJsonPoint.properties.imgSrc;
            touristicContentImg.crossOrigin = 'anonymous';
            touristicContentDeparturePopup.appendChild(touristicContentImg);
          }

          const touristicContentName = L.DomUtil.create('div');
          touristicContentName.innerHTML = geoJsonPoint.properties.name;
          touristicContentName.className = 'touristic-content-name';
          touristicContentDeparturePopup.appendChild(touristicContentName);

          const touristicContentButton = L.DomUtil.create('button');
          touristicContentButton.innerHTML = 'Afficher le détail';
          touristicContentButton.className = 'touristic-content-button';
          touristicContentButton.onclick = () => this.touristicContentCardPress.emit(geoJsonPoint.properties.id);
          touristicContentDeparturePopup.appendChild(touristicContentButton);

          layer.bindPopup(touristicContentDeparturePopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
        });
        layer.on('mouseout', () => {
          if (!this.touristicContentPopupIsOpen) {
            state.selectedTouristicContentId = null;
            this.removeSelectedTouristicContent();
          }
        });
        layer.on('popupopen', () => {
          this.touristicContentPopupIsOpen = Boolean(state.selectedTouristicContentId);
        });
        layer.on('popupclose', () => {
          if (state.selectedTouristicContentId) {
            this.touristicContentPopupIsOpen = false;
            state.selectedTouristicContentId = null;
            this.removeSelectedTouristicContent();
          }
        });
      },
    }).addTo(this.map);
  }

  removeSelectedTouristicContent() {
    state.selectedTouristicContentId = null;
    this.selectedTouristicContentLayer && this.map.removeLayer(this.selectedTouristicContentLayer);
    this.selectedTouristicContentLayer = null;
  }

  addTouristicEvents(resetBounds = false) {
    state.touristicEventsWithinBounds = state.currentTouristicEvents;

    const touristicEventsCurrentCoordinates = [];

    const touristicEventsFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentTouristicEvents) {
      for (const currentTouristicEvent of state.currentTouristicEvents) {
        touristicEventsCurrentCoordinates.push(currentTouristicEvent.geometry.coordinates);

        touristicEventsFeatureCollection.features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: currentTouristicEvent.geometry.coordinates },
          properties: {
            id: currentTouristicEvent.id,
            name: currentTouristicEvent.name,
            type: state.touristicEventTypes.find(touristicEventType => touristicEventType.id === currentTouristicEvent.type)?.pictogram,
            imgSrc: currentTouristicEvent.attachments && currentTouristicEvent.attachments.length > 0 && currentTouristicEvent.attachments[0].thumbnail,
          },
        });
      }
    }

    if (!this.toutisticEventsLayer) {
      if ((touristicEventsCurrentCoordinates.length > 0 && !state.currentMapBounds) || resetBounds) {
        this.bounds = L.latLngBounds(touristicEventsCurrentCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      } else {
        if (state.currentMapBounds) {
          this.bounds = state.currentMapBounds;
        }
      }
      this.toutisticEventsLayer = L.geoJSON(touristicEventsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.type
                ? `<div class="touristic-event-marker-container"><img crossorigin="anonymous" src=${geoJsonPoint.properties.type} /></div>`
                : `<div class="touristic-event-marker-container"></div>`,
              className: 'touristic-event-marker',
              iconSize: 32,
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('click', () => {
            const touristicEventCoordinatesPopup = L.DomUtil.create('div');
            touristicEventCoordinatesPopup.className = 'touristic-event-coordinates-popup';
            if (geoJsonPoint.properties.imgSrc) {
              const touristicEventImg = L.DomUtil.create('img');
              touristicEventImg.src = geoJsonPoint.properties.imgSrc;
              touristicEventImg.crossOrigin = 'anonymous';
              touristicEventCoordinatesPopup.appendChild(touristicEventImg);
            }
            const touristicEventName = L.DomUtil.create('div');
            touristicEventName.innerHTML = geoJsonPoint.properties.name;
            touristicEventName.className = 'touristic-event-name';
            touristicEventCoordinatesPopup.appendChild(touristicEventName);

            const touristicEventButton = L.DomUtil.create('button');
            touristicEventButton.innerHTML = 'Afficher le détail';
            touristicEventButton.className = 'touristic-event-button';
            touristicEventButton.onclick = () => this.touristicEventCardPress.emit(geoJsonPoint.properties.id);
            touristicEventCoordinatesPopup.appendChild(touristicEventButton);

            layer.bindPopup(touristicEventCoordinatesPopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
          });
          layer.on('mouseover', e => {
            this.addSelectedTouristicEvent(geoJsonPoint.properties.id, e.latlng);
          });
        },
      });

      this.touristicEventsMarkerClusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: false,
        iconCreateFunction: cluster => {
          return L.divIcon({
            html: '<div>' + cluster.getChildCount() + '</div>',
            className: 'touristic-event-marker-cluster-group-icon',
            iconSize: 48,
          } as any);
        },
      });

      this.touristicEventsMarkerClusterGroup.addLayer(this.toutisticEventsLayer);
      this.map.addLayer(this.touristicEventsMarkerClusterGroup);
    } else {
      if (touristicEventsCurrentCoordinates.length > 0) {
        this.bounds = L.latLngBounds(touristicEventsCurrentCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      } else {
        this.map.fire('moveend');
      }
      this.toutisticEventsLayer.clearLayers();
      this.toutisticEventsLayer.addData(touristicEventsFeatureCollection);
      this.touristicEventsMarkerClusterGroup.clearLayers();
      this.touristicEventsMarkerClusterGroup.addLayer(this.toutisticEventsLayer);
    }

    this.bounds && this.map.fitBounds(this.bounds);

    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);

    this.map.on('moveend', this.handleTouristicEventsWithinBoundsBind);
  }

  removeTouristicEvents() {
    if (this.toutisticEventsLayer) {
      state.currentMapBounds = this.map.getBounds();
      this.map.removeLayer(this.touristicEventsMarkerClusterGroup);
      this.toutisticEventsLayer = null;
      this.touristicEventsMarkerClusterGroup = null;
      this.map.off('moveend', this.handleTouristicEventsWithinBoundsBind);
    }
  }

  addSelectedTouristicEvent(id, customCoordinates?) {
    const touristicEventFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.touristicEvents) {
      const touristicEvent = state.touristicEvents.find(touristicEvent => touristicEvent.id === id);
      touristicEventFeatureCollection.features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: customCoordinates ? [customCoordinates.lng, customCoordinates.lat] : touristicEvent.geometry.coordinates },
        properties: {
          id: touristicEvent.id,
          name: touristicEvent.name,
          category: state.touristicEventTypes.find(type => type.id === touristicEvent.type)?.pictogram,
          imgSrc: touristicEvent.attachments && touristicEvent.attachments.length > 0 && touristicEvent.attachments[0].thumbnail,
        },
      });
    }

    this.removeSelectedTouristicEvent();
    state.selectedTouristicEventId = id;

    this.selectedTouristicEventLayer = L.geoJSON(touristicEventFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          zIndexOffset: 4000000,
          icon: L.divIcon({
            html: geoJsonPoint.properties.category
              ? `<div class="touristic-event-marker-container"><img crossorigin="anonymous" src=${geoJsonPoint.properties.category} /></div>`
              : `<div class="touristic-event-marker-container"></div>`,
            className: 'selected-touristic-event-marker',
            iconSize: 64,
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', () => {
          const touristicEventDeparturePopup = L.DomUtil.create('div');
          touristicEventDeparturePopup.className = 'touristic-event-coordinates-popup';
          if (geoJsonPoint.properties.imgSrc) {
            const touristicEventImg = L.DomUtil.create('img');
            touristicEventImg.src = geoJsonPoint.properties.imgSrc;
            touristicEventImg.crossOrigin = 'anonymous';
            touristicEventDeparturePopup.appendChild(touristicEventImg);
          }

          const touristicEventName = L.DomUtil.create('div');
          touristicEventName.innerHTML = geoJsonPoint.properties.name;
          touristicEventName.className = 'touristic-event-name';
          touristicEventDeparturePopup.appendChild(touristicEventName);

          const touristicEventButton = L.DomUtil.create('button');
          touristicEventButton.innerHTML = 'Afficher le détail';
          touristicEventButton.className = 'touristic-event-button';
          touristicEventButton.onclick = () => this.touristicEventCardPress.emit(geoJsonPoint.properties.id);
          touristicEventDeparturePopup.appendChild(touristicEventButton);

          layer.bindPopup(touristicEventDeparturePopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
        });
        layer.on('mouseout', () => {
          if (!this.touristicEventPopupIsOpen) {
            state.selectedTouristicEventId = null;
            this.removeSelectedTouristicEvent();
          }
        });
        layer.on('popupopen', () => {
          this.touristicEventPopupIsOpen = Boolean(state.selectedTouristicEventId);
        });
        layer.on('popupclose', () => {
          if (state.selectedTouristicEventId) {
            this.touristicEventPopupIsOpen = false;
            state.selectedTouristicEventId = null;
            this.removeSelectedTouristicEvent();
          }
        });
      },
    }).addTo(this.map);
  }

  removeSelectedTouristicEvent() {
    state.selectedTouristicEventId = null;
    this.selectedTouristicEventLayer && this.map.removeLayer(this.selectedTouristicEventLayer);
    this.selectedTouristicEventLayer = null;
  }

  render() {
    const layersImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/layers.svg`);
    const contractImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/contract.svg`);
    return (
      <Host
        style={{
          '--font-family': this.fontFamily,
          '--color-primary-app': this.colorPrimaryApp,
          '--color-on-surface': this.colorOnSurface,
          '--color-primary-container': this.colorPrimaryContainer,
          '--color-on-primary-container': this.colorOnPrimaryContainer,
          '--color-background': this.colorBackground,
          '--color-poi-icon': this.colorPoiIcon,
          '--color-trek-line': this.colorTrekLine,
          '--layers-image-src': `url(${layersImageSrc})`,
          '--contract-image-src': `url(${contractImageSrc})`,
          '--map-bottom-space-height': this.isLargeView ? '0px' : '70px',
        }}
      >
        <div id="map" style={{}} class={state.currentTrek ? 'trek-map' : 'treks-map'} ref={el => (this.mapRef = el)}></div>
        {state.currentTrek && (
          <div>
            <div id="elevation" ref={el => (this.elevationRef = el)}></div>
            <div class="map-bottom-space"></div>
          </div>
        )}

        {!this.mapIsReady && (
          <div class="map-loader-container">
            <span class="loader"></span>
          </div>
        )}
      </Host>
    );
  }
}
