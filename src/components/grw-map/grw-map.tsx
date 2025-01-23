import { Component, Host, h, Prop, State, Event, EventEmitter, getAssetPath, Build, Listen, Element, forceUpdate } from '@stencil/core';
import { Feature, FeatureCollection } from 'geojson';
import L, { MarkerClusterGroup, TileLayer } from 'leaflet';
import 'leaflet-i18n';
import '@raruto/leaflet-elevation/dist/leaflet-elevation.min.js';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import '../../utils/leaflet-simple-locate.min.js';
import state, { onChange } from 'store/store';
import { translate } from 'i18n/i18n';
import { getTrekGeometry } from 'services/treks.service';
import { tileLayerOffline } from 'leaflet.offline';
import { getDataInStore } from 'services/grw-db.service';
import { checkFileInStore, getFileInStore } from 'utils/utils';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Trek } from 'components';
import pointOnFeature from '@turf/point-on-feature';
import bbox from '@turf/bbox';

@Component({
  tag: 'grw-map',
  styleUrl: 'grw-map.scss',
  shadow: true,
})
export class GrwMap {
  @Element() mapElement: HTMLElement;
  mapRef: HTMLElement;
  hostElement: HTMLElement;
  @Prop() maxZoom = 19;

  @Event() trekCardPress: EventEmitter<number>;
  @Event() touristicContentCardPress: EventEmitter<number>;
  @Event() touristicEventCardPress: EventEmitter<number>;
  @Event() outdoorSiteCardPress: EventEmitter<number>;
  @Event() outdoorCourseCardPress: EventEmitter<number>;

  @State() mapIsReady = false;
  @Prop() nameLayer: string;
  @Prop() urlLayer: string;
  @Prop() attributionLayer: string;

  @Prop() fontFamily = 'Roboto';
  @Prop() colorPrimaryApp = '#6b0030';
  @Prop() colorOnSurface = '#49454e';
  @Prop() colorPrimaryContainer = '#eaddff';
  @Prop() colorOnPrimaryContainer = '#21005e';
  @Prop() colorBackground = '#fef7ff';

  @Prop() colorTrekLine = '#6b0030';
  @Prop() colorSensitiveArea = '#4974a5';
  @Prop() colorMarkers = null;
  @Prop() colorClusters = null;
  @Prop() colorOutdoorArea = '#ffb700';

  @Prop() tilesMaxZoomOffline = 16;

  @Prop() grwApp = false;

  @Prop() mainMarkerSize = 32;
  @Prop() selectedMainMarkerSize = 48;
  @Prop() mainClusterSize = 48;
  @Prop() commonMarkerSize = 48;
  @Prop() departureArrivalMarkerSize = 14;
  @Prop() pointReferenceMarkerSize = 24;

  @Prop() elevationHeight = 280;
  @Prop() mobileElevationHeight = 280;
  @Prop() largeViewSize = 1024;
  @Prop() elevationDefaultState = 'visible';
  @Prop() isLargeView = false;
  @Prop() fabBackgroundColor = '#eaddff';
  @Prop() fabColor = '#21005d';

  map: L.Map;
  bounds;
  treksLayer: L.GeoJSON<any>;
  toutisticContentsLayer: L.GeoJSON<any>;
  touristicEventsLayer: L.GeoJSON<any>;

  treksMarkerClusterGroup: MarkerClusterGroup;
  touristicContentsMarkerClusterGroup: MarkerClusterGroup;
  touristicEventsMarkerClusterGroup: MarkerClusterGroup;
  outdoorSitesMarkerClusterGroup: MarkerClusterGroup;
  outdoorSitesLayer: L.GeoJSON<any>;
  currentTrekLayer: L.GeoJSON<any>;
  currentStepsLayer: L.GeoJSON<any>;
  selectedCurrentTrekLayer: L.GeoJSON<any>;
  selectedCurrentStepLayer: L.GeoJSON<any>;
  selectedTouristicContentLayer: L.GeoJSON<any>;
  selectedTouristicEventLayer: L.GeoJSON<any>;
  selectedOutdoorSiteLayer: L.GeoJSON<any>;
  selectedOutdoorCourseLayer: L.GeoJSON<any>;
  currentReferencePointsLayer: L.GeoJSON<any>;
  currentParkingLayer: L.GeoJSON<any>;
  currentSensitiveAreasLayer: L.GeoJSON<any>;
  currentPoisLayer: L.GeoJSON<any>;
  currentSignagesLayer: L.GeoJSON<any>;
  currentInformationDesksLayer: L.GeoJSON<any>;
  currentToutisticContentsLayer: L.GeoJSON<any>;
  currentTouristicEventsLayer: L.GeoJSON<any>;
  currentToutisticContentLayer: L.GeoJSON<any>;
  currentToutisticEventLayer: L.GeoJSON<any>;
  currentOutdoorSiteLayer: L.GeoJSON<any>;
  currentOutdoorCourseLayer: L.GeoJSON<any>;
  currentRelatedOutdoorSitesLayer: L.GeoJSON<any>;
  currentRelatedOutdoorCoursesLayer: L.GeoJSON<any>;
  elevationControl: L.Control.Layers;
  departureArrivalLayer: L.GeoJSON<any>;
  layersControl: L.Control.Layers;
  userLayersState: {
    [key: number]: boolean;
  } = {};
  tileLayer: { key: string; value: TileLayer }[] = [];
  trekPopupIsOpen: boolean;
  stepPopupIsOpen: boolean;
  touristicContentPopupIsOpen: boolean;
  touristicEventPopupIsOpen: boolean;
  outdoorSitePopupIsOpen: boolean;
  outdoorCoursePopupIsOpen: boolean;

  handleTreksWithinBoundsBind: (event: any) => void = this.handleTreksWithinBounds.bind(this);
  handleTouristicContentsWithinBoundsBind: (event: any) => void = this.handleTouristicContentsWithinBounds.bind(this);
  handleTouristicEventsWithinBoundsBind: (event: any) => void = this.handleTouristicEventsWithinBounds.bind(this);
  handleOutdoorSitesWithinBoundsBind: (event: any) => void = this.handleOutdoorSitesWithinBounds.bind(this);

  @Listen('centerOnMap', { target: 'window' })
  onCenterOnMap(event: CustomEvent<{ latitude: number; longitude: number }>) {
    this.map.setView(new L.LatLng(event.detail.latitude, event.detail.longitude), 17, { animate: false });
  }

  @Listen('stepsIsInViewport', { target: 'window' })
  stepsIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentStepsLayer && this.layersControl) {
      this.handleLayerVisibility(event.detail, this.currentStepsLayer);
    }
  }

  @Listen('descriptionIsInViewport', { target: 'window' })
  descriptionIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentReferencePointsLayer && this.layersControl) {
      this.handleLayerVisibility(event.detail, this.currentReferencePointsLayer);
    }
  }

  @Listen('parkingIsInViewport', { target: 'window' })
  parkingIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentParkingLayer && this.layersControl) {
      this.handleLayerVisibility(event.detail, this.currentParkingLayer);
    }
  }

  @Listen('informationPlacesIsInViewport', { target: 'window' })
  onInformationPlacesIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentInformationDesksLayer && this.layersControl) {
      this.handleLayerVisibility(event.detail, this.currentInformationDesksLayer);
    }
  }

  @Listen('sensitiveAreaIsInViewport', { target: 'window' })
  sensitiveAreaIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentSensitiveAreasLayer && this.layersControl) {
      this.handleLayerVisibility(event.detail, this.currentSensitiveAreasLayer);
    }
  }

  @Listen('poiIsInViewport', { target: 'window' })
  poiIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentPoisLayer && this.layersControl) {
      this.handleLayerVisibility(event.detail, this.currentPoisLayer);
    }
  }

  @Listen('touristicContentsIsInViewport', { target: 'window' })
  touristicContentsIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentToutisticContentsLayer && this.layersControl) {
      this.handleLayerVisibility(event.detail, this.currentToutisticContentsLayer);
    }
  }

  @Listen('touristicEventsIsInViewport', { target: 'window' })
  touristicEventsIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentTouristicEventsLayer && this.layersControl) {
      this.handleLayerVisibility(event.detail, this.currentTouristicEventsLayer);
    }
  }

  @Listen('sitesIsInViewport', { target: 'window' })
  sitesIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentRelatedOutdoorSitesLayer && this.layersControl) {
      this.handleLayerVisibility(event.detail, this.currentRelatedOutdoorSitesLayer);
    }
  }

  @Listen('coursesIsInViewport', { target: 'window' })
  coursesIsInViewport(event: CustomEvent<boolean>) {
    if (this.currentRelatedOutdoorCoursesLayer && this.layersControl) {
      this.handleLayerVisibility(event.detail, this.currentRelatedOutdoorCoursesLayer);
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
    } else if (this.selectedCurrentStepLayer) {
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

  @Listen('trekDownloadedSuccessConfirm', { target: 'window' })
  onTrekDownloadedSuccessConfirm() {
    this.map.setMaxZoom(this.tilesMaxZoomOffline);
  }

  @Listen('trekDeleteSuccessConfirm', { target: 'window' })
  onTrekDeleteSuccessConfirm() {
    this.map.setMaxZoom(this.maxZoom);
  }

  @Listen('cardOutdoorSiteMouseOver', { target: 'window' })
  onOutdoorSiteMouseOver(event: CustomEvent<number>) {
    this.outdoorSitePopupIsOpen = false;
    state.selectedOutdoorSiteId = null;
    this.addSelectedOutdoorSite(event.detail);
  }

  @Listen('cardOutdoorSiteMouseLeave', { target: 'window' })
  onOutdoorSiteMouseLeave() {
    state.selectedOutdoorSiteId = null;
    this.removeSelectedOutdoorSite();
  }

  componentDidLoad() {
    this.map = L.map(this.mapRef, { zoom: 4, center: [47, 2], zoomControl: false });

    const nameLayers = this.nameLayer ? this.nameLayer.split(',') : [];

    const urlLayers = this.urlLayer.split(',http').map((url, index) => (index === 0 ? url : 'http' + url));

    const attributionLayers = this.attributionLayer ? this.attributionLayer.split(',') : [];
    urlLayers.forEach((urlLayer, index) => {
      this.tileLayer.push({
        key: `${nameLayers[index]}`,
        value: tileLayerOffline(urlLayer, {
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
    }

    L.control.zoom({ zoomInTitle: translate[state.language].zoomIn, zoomOutTitle: translate[state.language].zoomOut }).addTo(this.map);

    L.control.scale({ metric: true, imperial: false }).addTo(this.map);

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
        contract.title = translate[state.language].contract;

        return contractContainer;
      },
    });

    (L.control as any).contract = opts => {
      return new (L.Control as any).Contract(opts);
    };

    (L.control as any).contract({ position: 'topleft' }).addTo(this.map);

    new (L.Control as any).SimpleLocate({
      position: 'topleft',
      className: 'button-locate',
      title: translate[state.language].locate,
    }).addTo(this.map);

    if (state.currentTrek) {
      this.addTrek();
    } else if (state.currentTreks) {
      this.addTreks();
    } else if (state.currentTouristicContent) {
      this.addTouristicContent();
    } else if (state.currentTouristicEvent) {
      this.addTouristicEvent();
    } else if (state.currentOutdoorSite) {
      this.addOutdoorSite();
    } else if (state.currentOutdoorCourse) {
      this.addOutdoorCourse();
    } else if (state.touristicContents) {
      this.addTouristicContents();
    } else if (state.touristicEvents) {
      this.addTouristicEvents();
    } else if (state.outdoorSites) {
      this.addOutdoorSites();
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
        this.removeOutdoorSites();
        this.removeTrek();
        this.removeTouristicContent();
        this.removeTouristicEvent();
        this.addTreks(true);
      }
    });

    onChange('currentOutdoorSites', () => {
      if (state.currentOutdoorSites) {
        this.removeTreks();
        this.removeTouristicContents();
        this.removeTouristicEvents();
        this.removeOutdoorSites();
        this.addOutdoorSites(true);
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

    onChange('currentOutdoorSite', () => {
      if (state.currentOutdoorSite) {
        this.removeOutdoorCourse();
        this.removeOutdoorSites();
        this.addOutdoorSite();
      } else if (state.currentOutdoorSites) {
        this.removeOutdoorSite();
        this.addOutdoorSites();
      }
    });

    onChange('currentOutdoorSite', () => {
      if (state.currentOutdoorCourse) {
        this.removeOutdoorSite();
        this.addOutdoorCourse();
      }
    });

    onChange('currentTouristicContent', () => {
      if (this.grwApp) {
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
      }
    });

    onChange('currentTouristicEvent', () => {
      if (this.grwApp) {
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
        this.removeOutdoorSites();
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
        this.removeOutdoorSites();
        this.removeTouristicEvent();
        this.addTouristicEvents(true);
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

  async addTreks(resetBounds = false) {
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
            imgSrc:
              trek.attachments && trek.attachments.filter(attachment => attachment.type === 'image').length > 0
                ? trek.attachments[0].thumbnail !== ''
                  ? trek.attachments[0].thumbnail
                  : trek.attachments[0].url
                : null,
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

      const treksIcons = await this.getIcons(treksFeatureCollection, 'practice');

      this.treksLayer = L.geoJSON(treksFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: treksIcons[geoJsonPoint.properties.practice]
                ? `<div part="trek-marker-container" class="trek-marker-container"><img part="trek-marker-icon" src=${treksIcons[geoJsonPoint.properties.practice]} /></div>`
                : `<div part="trek-marker-container" class="trek-marker-container"></div>`,
              className: 'trek-marker',
              iconSize: this.mainMarkerSize,
              iconAnchor: [this.mainMarkerSize / 2, this.mainMarkerSize],
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('click', async () => {
            const dataInStore = await this.getIcon(geoJsonPoint.properties.imgSrc);
            const imgSrc = dataInStore ? dataInStore : geoJsonPoint.properties.imgSrc ? geoJsonPoint.properties.imgSrc : null;
            const trekDeparturePopup = L.DomUtil.create('div');
            /* @ts-ignore */
            trekDeparturePopup.part = 'trek-departure-popup';
            trekDeparturePopup.className = 'trek-departure-popup';
            if (imgSrc) {
              const trekImg = L.DomUtil.create('img');
              /* @ts-ignore */
              trekImg.part = 'trek-image-popup';
              trekImg.src = imgSrc;
              trekDeparturePopup.appendChild(trekImg);
            }
            const trekName = L.DomUtil.create('div');
            trekName.innerHTML = geoJsonPoint.properties.name;
            /* @ts-ignore */
            trekName.part = 'trek-name';
            trekName.className = 'trek-name';
            trekDeparturePopup.appendChild(trekName);

            const trekButton = L.DomUtil.create('button');
            trekButton.innerHTML = 'Afficher le détail';
            /* @ts-ignore */
            trekButton.part = 'trek-button';
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
          return L.divIcon({
            html: '<div part="treks-marker-cluster-group-icon" class="treks-marker-cluster-group-icon">' + cluster.getChildCount() + '</div>',
            className: '',
            iconSize: this.mainClusterSize,
          } as any);
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
    this.bounds && this.bounds._northEast && this.bounds._southWest && this.map.fitBounds(this.bounds);

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

  handleOutdoorSitesWithinBounds() {
    if (
      (state.currentOutdoorSites && !state.currentMapBounds) ||
      (state.currentOutdoorSites && state.currentMapBounds && state.currentMapBounds.toBBoxString() !== this.map.getBounds().toBBoxString())
    ) {
      state.outdoorSitesWithinBounds = state.currentOutdoorSites.filter(outdoorSite => {
        const coordinates = pointOnFeature(outdoorSite.geometry as any).geometry.coordinates;
        return this.map.getBounds().contains(L.latLng(coordinates[1], coordinates[0]));
      });
    }
  }

  async addTrek() {
    const trekInStore: Trek = await getDataInStore('treks', state.currentTrek.id);
    if (trekInStore) {
      this.map.setMaxZoom(this.tilesMaxZoomOffline);
    } else {
      this.map.setMaxZoom(this.maxZoom);
    }
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
              html: `<img part="parking-marker" src=${parkingImageSrc} />`,
              className: '',
              iconSize: this.commonMarkerSize,
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('mouseover', () => {
            const parkingTooltip = L.DomUtil.create('div');
            /* @ts-ignore */
            parkingTooltip.part = 'parking-tooltip';
            parkingTooltip.className = 'parking-tooltip';
            const parkingName = L.DomUtil.create('div');
            parkingName.innerHTML = geoJsonPoint.properties.name;
            /* @ts-ignore */
            parkingTooltip.part = 'parking-name';
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
            /* @ts-ignore */
            sensitiveAreaTooltip.part = 'sensitive-area-tooltip';
            sensitiveAreaTooltip.className = 'sensitive-area-tooltip';
            const sensitiveAreaName = L.DomUtil.create('div');
            sensitiveAreaName.innerHTML = geoJsonPoint.properties.name;
            /* @ts-ignore */
            sensitiveAreaName.part = 'sensitive-area-name';
            sensitiveAreaName.className = 'sensitive-area-name';
            sensitiveAreaTooltip.appendChild(sensitiveAreaName);
            layer.bindTooltip(sensitiveAreaTooltip).openTooltip();
          });
        },
        style: () => ({ color: this.colorSensitiveArea }),
      });
    }

    await this.addCurrentInformationDesks(state.currentTrek);

    await this.addCurrentPois();

    await this.addCurrentSignages();

    await this.addCurrentTouristicContents();

    await this.addCurrentTouristicEvents();

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
              html: `<div part="point-reference-icon" class="point-reference-icon">${index}</div>`,
              className: '',
              iconSize: this.pointReferenceMarkerSize,
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
              imgSrc:
                trek.attachments && trek.attachments.filter(attachment => attachment.type === 'image').length > 0
                  ? trek.attachments[0].thumbnail !== ''
                    ? trek.attachments[0].thumbnail
                    : trek.attachments[0].url
                  : null,
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
              html: `<div part="step-marker" class="step-marker"><div part="step-marker-container" class="step-marker-container"><div part="step-number" class="step-number">${stepIndex}</div></div></div>`,
              className: '',
              iconSize: this.mainMarkerSize,
              iconAnchor: [this.mainMarkerSize / 2, this.mainMarkerSize],
            } as any),
            autoPanOnFocus: false,
          } as any);
        },
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('click', async () => {
            const dataInStore = await this.getIcon(geoJsonPoint.properties.imgSrc);
            const imgSrc = dataInStore ? dataInStore : geoJsonPoint.properties.imgSrc ? geoJsonPoint.properties.imgSrc : null;
            const trekDeparturePopup = L.DomUtil.create('div');
            /* @ts-ignore */
            trekDeparturePopup.part = 'trek-departure-popup';
            trekDeparturePopup.className = 'trek-departure-popup';
            if (imgSrc) {
              const trekImg = L.DomUtil.create('img');
              trekImg.src = imgSrc;
              trekDeparturePopup.appendChild(trekImg);
            }
            const trekName = L.DomUtil.create('div');
            trekName.innerHTML = geoJsonPoint.properties.name;
            /* @ts-ignore */
            trekDeparturePopup.part = 'trek-name';
            trekName.className = 'trek-name';
            trekDeparturePopup.appendChild(trekName);

            const trekButton = L.DomUtil.create('button');
            trekButton.innerHTML = 'Afficher le détail';
            /* @ts-ignore */
            trekDeparturePopup.part = 'trek-button';
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
      'Total Length: ': 'Longueur totale : ',
      'Min Elevation: ': 'Altitude min : ',
      'Max Elevation: ': 'Altitude max : ',
    };

    /* @ts-ignore */
    L.registerLocale('fr', elevationTranslation);
    /* @ts-ignore */
    L.setLocale('fr');

    const elevationOptions = {
      elevationDiv: `#elevation-container`,
      theme: `custom-theme use-theme-color`,
      height: this.mapElement.getBoundingClientRect().width >= this.largeViewSize / 2 ? this.elevationHeight : this.mobileElevationHeight,
      distanceMarkers: { distance: false, direction: true },
      summary: 'inline',
      legend: false,
      downloadLink: false,
      autofitBounds: false,
      ruler: false,
      waypoints: false,
      almostOver: false,
      dragging: false,
    };
    this.elevationControl = (L.control as any).elevation(elevationOptions).addTo(this.map);
    const elevation = JSON.stringify({
      name: `${state.currentTrek.name}`,
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates: state.currentTrek.geometry.coordinates }, properties: null }],
    });
    (this.elevationControl as any).load(elevation);
    (this.elevationControl as any).eleDiv.style.display = this.elevationDefaultState === 'visible' ? 'block' : 'none';
    forceUpdate(this.hostElement);

    const departureArrival: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: state.currentTrek.geometry.coordinates[0] },
          properties: null,
        },
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: state.currentTrek.geometry.coordinates[state.currentTrek.geometry.coordinates.length - 1] },
          properties: null,
        },
      ],
    };

    let index = 0;
    this.departureArrivalLayer = L.geoJSON(departureArrival, {
      pointToLayer: (_geoJsonPoint, latlng) => {
        index += 1;
        return L.marker(latlng, {
          icon: L.divIcon({
            html: `<div part="${index === 1 ? 'departure-marker' : 'arrival-marker'}" class="${index === 1 ? 'departure-marker' : 'arrival-marker'}"></div>`,
            className: '',
            iconSize: this.departureArrivalMarkerSize,
          } as any),
          autoPanOnFocus: false,
        } as any);
      },
    });
    this.map.addLayer(this.departureArrivalLayer);

    this.handleLayersControl();

    this.bounds = L.latLngBounds(state.currentTrek.geometry.coordinates.map(coordinate => [coordinate[1], coordinate[0]]));
    this.map.on('eledata_loaded', () => {
      this.map.invalidateSize();
      this.bounds && this.map.fitBounds(this.bounds);
      !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);
    });
  }

  async getIcons(featuresCollection, property) {
    const icons = {};
    for (let index = 0; index < featuresCollection.features.length; index++) {
      if (featuresCollection.features[index].properties[property]) {
        icons[featuresCollection.features[index].properties[property]] = await this.getIcon(featuresCollection.features[index].properties[property]);
      }
    }
    return icons;
  }

  async getIcon(pictogram) {
    let icon;
    if (!Capacitor.isNativePlatform()) {
      const dataInStore = await checkFileInStore(pictogram);
      icon = dataInStore ? window.URL.createObjectURL((await getFileInStore(pictogram)).data) : pictogram ? pictogram : null;
    } else {
      const image = await Filesystem.getUri({
        path: pictogram,
        directory: Directory.Data,
      });
      if (image) {
        icon = Capacitor.convertFileSrc(image.uri);
      }
    }

    return icon;
  }

  async addSelectedCurrentTrek(id, customCoordinates?) {
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
          imgSrc:
            trek.attachments && trek.attachments.filter(attachment => attachment.type === 'image').length > 0
              ? trek.attachments[0].thumbnail !== ''
                ? trek.attachments[0].thumbnail
                : trek.attachments[0].url
              : null,
        },
      });
    }

    this.removeSelectedCurrentTrek();
    state.selectedTrekId = id;

    const treksIcons = await this.getIcons(treksFeatureCollection, 'practice');
    this.selectedCurrentTrekLayer = L.geoJSON(treksFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          zIndexOffset: 4000000,
          icon: L.divIcon({
            html: treksIcons[geoJsonPoint.properties.practice]
              ? `<div part="selected-trek-marker" class="selected-trek-marker"><div part="trek-marker-container" class="trek-marker-container"><img part="trek-marker" class="trek-marker" src=${
                  treksIcons[geoJsonPoint.properties.practice]
                } /></div></div>`
              : `<div part="selected-trek-marker" class="selected-trek-marker"><div part="trek-marker-container" class="trek-marker-container"></div></div>`,
            className: '',
            iconSize: this.selectedMainMarkerSize,
            iconAnchor: [this.selectedMainMarkerSize / 2, this.selectedMainMarkerSize],
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', async () => {
          const dataInStore = await this.getIcon(geoJsonPoint.properties.imgSrc);
          const imgSrc = dataInStore ? dataInStore : geoJsonPoint.properties.imgSrc ? geoJsonPoint.properties.imgSrc : null;
          const trekDeparturePopup = L.DomUtil.create('div');
          /* @ts-ignore */
          trekDeparturePopup.part = 'trek-departure-popup';
          trekDeparturePopup.className = 'trek-departure-popup';
          if (imgSrc) {
            const trekImg = L.DomUtil.create('img');
            trekImg.src = imgSrc;
            /* @ts-ignore */
            trekImg.part = 'trek-image';
            trekDeparturePopup.appendChild(trekImg);
          }
          const trekName = L.DomUtil.create('div');
          trekName.innerHTML = geoJsonPoint.properties.name;
          /* @ts-ignore */
          trekName.part = 'trek-name';
          trekName.className = 'trek-name';
          trekDeparturePopup.appendChild(trekName);

          const trekButton = L.DomUtil.create('button');
          trekButton.innerHTML = 'Afficher le détail';
          /* @ts-ignore */
          trekButton.part = 'trek-button';
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
            state.currentTrekSteps[stepIndex].attachments && state.currentTrekSteps[stepIndex].attachments.filter(attachment => attachment.type === 'image').length > 0
              ? state.currentTrekSteps[stepIndex].attachments[0].thumbnail !== ''
                ? state.currentTrekSteps[stepIndex].attachments[0].thumbnail
                : state.currentTrekSteps[stepIndex].attachments[0].url
              : null,
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
            html: `<div part="selected-step-marker" class="selected-step-marker" ><div part="step-marker-container" class="step-marker-container"><div  part="step-number" class="step-number">${geoJsonPoint.properties.index}</div></div></div>`,
            className: '',
            iconSize: this.selectedMainMarkerSize,
            iconAnchor: [this.selectedMainMarkerSize / 2, this.selectedMainMarkerSize],
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', async () => {
          const dataInStore = await this.getIcon(geoJsonPoint.properties.imgSrc);
          const imgSrc = dataInStore ? dataInStore : geoJsonPoint.properties.imgSrc ? geoJsonPoint.properties.imgSrc : null;
          const trekDeparturePopup = L.DomUtil.create('div');
          /* @ts-ignore */
          trekDeparturePopup.part = 'trek-departure-popup';
          trekDeparturePopup.className = 'trek-departure-popup';
          if (imgSrc) {
            const trekImg = L.DomUtil.create('img');
            /* @ts-ignore */
            trekImg.part = 'trek-image';
            trekImg.src = imgSrc;
            trekDeparturePopup.appendChild(trekImg);
          }
          const trekName = L.DomUtil.create('div');
          trekName.innerHTML = geoJsonPoint.properties.name;
          /* @ts-ignore */
          trekName.part = 'trek-name';
          trekName.className = 'trek-name';
          trekDeparturePopup.appendChild(trekName);

          const trekButton = L.DomUtil.create('button');
          trekButton.innerHTML = 'Afficher le détail';
          /* @ts-ignore */
          trekButton.part = 'trek-name';
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
    if (this.layersControl) {
      const userLayersState: HTMLInputElement[] = (this.layersControl as any)._layerControlInputs;
      userLayersState.forEach((userLayerState: any) => {
        if ((this.layersControl as any)._layers.find(layer => layer.layer._leaflet_id === userLayerState.layerId).overlay) {
          userLayerState.onchange = event => {
            this.userLayersState[userLayerState.layerId] = (event.target as any).checked;
          };
        }
      });
    }
  }

  removeTrek() {
    this.handleLayersOnRemove();
  }

  async showTrekLine(id) {
    this.removeSelectedCurrentTrek();
    const trekLine = await getTrekGeometry(id);
    const currentTrekFeature: Feature = {
      type: 'Feature',
      geometry: trekLine.geometry,
      properties: {},
    };

    this.currentTrekLayer = L.geoJSON(currentTrekFeature, {
      style: () => ({
        color: this.colorTrekLine,
      }),
      interactive: false,
    }).addTo(this.map);
  }

  hideTrekLine() {
    if (this.currentTrekLayer) {
      this.map.removeLayer(this.currentTrekLayer);
      this.currentTrekLayer = null;
    }
  }

  async addTouristicContent() {
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
      const toutisticContentIcons = await this.getIcons(touristicContentsFeatureCollection, 'practice');
      this.currentToutisticContentLayer = L.geoJSON(touristicContentsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: toutisticContentIcons[geoJsonPoint.properties.practice]
                ? `<div part="touristic-content-marker" class="touristic-content-marker" ><div part="touristic-content-marker-container" class="touristic-content-marker-container"><img part="touristic-content-marker-icon" class="touristic-content-marker-icon" src=${
                    toutisticContentIcons[geoJsonPoint.properties.practice]
                  } /></div></div>`
                : `<div part="touristic-content-marker" class="touristic-content-marker" ><div part="touristic-content-marker-container" class="touristic-content-marker-container"></div></div>`,
              className: '',
              iconSize: this.commonMarkerSize,
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

  async addTouristicContents(resetBounds = false) {
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
            imgSrc:
              currentTouristicContent.attachments && currentTouristicContent.attachments.filter(attachment => attachment.type === 'image').length > 0
                ? currentTouristicContent.attachments[0].thumbnail !== ''
                  ? currentTouristicContent.attachments[0].thumbnail
                  : currentTouristicContent.attachments[0].url
                : null,
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
      const toutisticContentIcons = await this.getIcons(touristicContentsFeatureCollection, 'practice');
      this.toutisticContentsLayer = L.geoJSON(touristicContentsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: toutisticContentIcons[geoJsonPoint.properties.practice]
                ? `<div part="touristic-content-marker" class="touristic-content-marker"><div part="touristic-content-marker-container" class="touristic-content-marker-container"><img part="touristic-content-marker-icon" class="touristic-content-marker-icon" src=${
                    toutisticContentIcons[geoJsonPoint.properties.practice]
                  } /></div></div>`
                : `<div part="touristic-content-marker" class="touristic-content-marker"><div part="touristic-content-marker-container" class="touristic-content-marker-container"></div></div>`,
              className: '',
              iconSize: this.mainMarkerSize,
              iconAnchor: [this.mainMarkerSize / 2, this.mainMarkerSize],
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('click', () => {
            const touristicContentCoordinatesPopup = L.DomUtil.create('div');
            /* @ts-ignore */
            touristicContentCoordinatesPopup.part = 'touristic-content-coordinates-popup';
            touristicContentCoordinatesPopup.className = 'touristic-content-coordinates-popup';
            if (geoJsonPoint.properties.imgSrc) {
              const touristicContentImg = L.DomUtil.create('img');
              /* @ts-ignore */
              touristicContentImg.part = 'touristic-content-coordinates-image';
              touristicContentImg.src = geoJsonPoint.properties.imgSrc;
              touristicContentCoordinatesPopup.appendChild(touristicContentImg);
            }
            const touristicContentName = L.DomUtil.create('div');
            touristicContentName.innerHTML = geoJsonPoint.properties.name;
            /* @ts-ignore */
            touristicContentCoordinatesPopup.part = 'touristic-content-name';
            touristicContentName.className = 'touristic-content-name';
            touristicContentCoordinatesPopup.appendChild(touristicContentName);

            const touristicContentButton = L.DomUtil.create('button');
            touristicContentButton.innerHTML = 'Afficher le détail';
            /* @ts-ignore */
            touristicContentButton.part = 'touristic-content-button';
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
            html: '<div part="touristic-content-marker-cluster-group-icon" class="touristic-content-marker-cluster-group-icon"><div>' + cluster.getChildCount() + '</div></div>',
            className: '',
            iconSize: this.mainClusterSize,
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

    this.map.invalidateSize();
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

  async addTouristicEvent() {
    const touristicEventsFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentTouristicEvent) {
      const touristicEventType = state.touristicEventTypes.find(touristicEventType => touristicEventType.id === state.currentTouristicEvent.type);
      touristicEventsFeatureCollection.features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: state.currentTouristicEvent.geometry.coordinates },
        properties: {
          id: state.currentTouristicEvent.id,
          name: state.currentTouristicEvent.name,
          type: touristicEventType ? touristicEventType.pictogram : null,
        },
      });
    }

    if (!this.currentToutisticEventLayer) {
      const toutisticEventsIcons = await this.getIcons(touristicEventsFeatureCollection, 'type');
      this.currentToutisticEventLayer = L.geoJSON(touristicEventsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: toutisticEventsIcons[geoJsonPoint.properties.type]
                ? `<div part="touristic-event-marker" class="touristic-event-marker"><div part="touristic-event-marker-container" class="touristic-event-marker-container"><img part="touristic-event-marker-icon" src=${
                    toutisticEventsIcons[geoJsonPoint.properties.type]
                  } /></div></div>`
                : `<div part="touristic-event-marker" class="touristic-event-marker"><div part="touristic-event-marker-container" class="touristic-event-marker-container"></div></div>`,
              className: '',
              iconSize: this.commonMarkerSize,
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

  async addSelectedTouristicContent(id, customCoordinates?) {
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
          imgSrc:
            touristicContent.attachments && touristicContent.attachments.filter(attachment => attachment.type === 'image').length > 0
              ? touristicContent.attachments[0].thumbnail !== ''
                ? touristicContent.attachments[0].thumbnail
                : touristicContent.attachments[0].url
              : null,
        },
      });
    }

    this.removeSelectedTouristicContent();
    state.selectedTouristicContentId = id;

    const toutisticContentIcons = await this.getIcons(touristicContentFeatureCollection, 'category');
    this.selectedTouristicContentLayer = L.geoJSON(touristicContentFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          zIndexOffset: 4000000,
          icon: L.divIcon({
            html: toutisticContentIcons[geoJsonPoint.properties.category]
              ? `<div part="selected-touristic-content-marker" class="selected-touristic-content-marker"><div part="touristic-content-marker-container" class="touristic-content-marker-container"><img part="touristic-content-marker-icon" src=${
                  toutisticContentIcons[geoJsonPoint.properties.category]
                } /></div></div>`
              : `<div part="selected-touristic-content-marker" class="selected-touristic-content-marker"><div part="touristic-content-marker-container" class="touristic-content-marker-container"></div></div>`,
            className: '',
            iconSize: this.selectedMainMarkerSize,
            iconAnchor: [this.selectedMainMarkerSize / 2, this.selectedMainMarkerSize],
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', () => {
          const touristicContentDeparturePopup = L.DomUtil.create('div');
          /* @ts-ignore */
          touristicContentDeparturePopup.part = 'touristic-content-coordinates-popup';
          touristicContentDeparturePopup.className = 'touristic-content-coordinates-popup';
          if (geoJsonPoint.properties.imgSrc) {
            const touristicContentImg = L.DomUtil.create('img');
            /* @ts-ignore */
            touristicContentImg.part = 'touristic-content-coordinates-image';
            touristicContentImg.src = geoJsonPoint.properties.imgSrc;
            touristicContentDeparturePopup.appendChild(touristicContentImg);
          }

          const touristicContentName = L.DomUtil.create('div');
          touristicContentName.innerHTML = geoJsonPoint.properties.name;
          /* @ts-ignore */
          touristicContentName.part = 'touristic-content-name';
          touristicContentName.className = 'touristic-content-name';
          touristicContentDeparturePopup.appendChild(touristicContentName);

          const touristicContentButton = L.DomUtil.create('button');
          touristicContentButton.innerHTML = 'Afficher le détail';
          /* @ts-ignore */
          touristicContentButton.part = 'touristic-content-button';
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

  async addTouristicEvents(resetBounds = false) {
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
            imgSrc:
              currentTouristicEvent.attachments && currentTouristicEvent.attachments.filter(attachment => attachment.type === 'image').length > 0
                ? currentTouristicEvent.attachments[0].thumbnail !== ''
                  ? currentTouristicEvent.attachments[0].thumbnail
                  : currentTouristicEvent.attachments[0].url
                : null,
          },
        });
      }
    }

    if (!this.touristicEventsLayer) {
      if ((touristicEventsCurrentCoordinates.length > 0 && !state.currentMapBounds) || resetBounds) {
        this.bounds = L.latLngBounds(touristicEventsCurrentCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      } else {
        if (state.currentMapBounds) {
          this.bounds = state.currentMapBounds;
        }
      }
      const touristicEventsIcons = await this.getIcons(touristicEventsFeatureCollection, 'type');
      this.touristicEventsLayer = L.geoJSON(touristicEventsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: touristicEventsIcons[geoJsonPoint.properties.type]
                ? `<div part="touristic-event-marker" class="touristic-event-marker"><div part="touristic-event-marker-container" class="touristic-event-marker-container"><img part="touristic-event-marker-icon" src=${
                    touristicEventsIcons[geoJsonPoint.properties.type]
                  } /></div></div>`
                : `<div part="touristic-event-marker" class="touristic-event-marker"><div part="touristic-event-marker-container" class="touristic-event-marker-container"></div></div>`,
              className: '',
              iconSize: this.mainMarkerSize,
              iconAnchor: [this.mainMarkerSize / 2, this.mainMarkerSize],
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('click', () => {
            const touristicEventCoordinatesPopup = L.DomUtil.create('div');
            /* @ts-ignore */
            touristicEventCoordinatesPopup.part = 'touristic-event-coordinates-popup';
            touristicEventCoordinatesPopup.className = 'touristic-event-coordinates-popup';
            if (geoJsonPoint.properties.imgSrc) {
              const touristicEventImg = L.DomUtil.create('img');
              /* @ts-ignore */
              touristicEventImg.part = 'touristic-event-coordinates-image';
              touristicEventImg.src = geoJsonPoint.properties.imgSrc;
              touristicEventCoordinatesPopup.appendChild(touristicEventImg);
            }
            const touristicEventName = L.DomUtil.create('div');
            touristicEventName.innerHTML = geoJsonPoint.properties.name;
            /* @ts-ignore */
            touristicEventName.part = 'touristic-event-name';
            touristicEventName.className = 'touristic-event-name';
            touristicEventCoordinatesPopup.appendChild(touristicEventName);

            const touristicEventButton = L.DomUtil.create('button');
            touristicEventButton.innerHTML = 'Afficher le détail';
            /* @ts-ignore */
            touristicEventButton.part = 'touristic-event-button';
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
            html: '<div part="touristic-event-marker-cluster-group-icon" class="touristic-event-marker-cluster-group-icon"><div>' + cluster.getChildCount() + '</div></div>',
            className: '',
            iconSize: this.mainClusterSize,
          } as any);
        },
      });

      this.touristicEventsMarkerClusterGroup.addLayer(this.touristicEventsLayer);
      this.map.addLayer(this.touristicEventsMarkerClusterGroup);
    } else {
      if (touristicEventsCurrentCoordinates.length > 0) {
        this.bounds = L.latLngBounds(touristicEventsCurrentCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      } else {
        this.map.fire('moveend');
      }
      this.touristicEventsLayer.clearLayers();
      this.touristicEventsLayer.addData(touristicEventsFeatureCollection);
      this.touristicEventsMarkerClusterGroup.clearLayers();
      this.touristicEventsMarkerClusterGroup.addLayer(this.touristicEventsLayer);
    }

    this.map.invalidateSize();
    this.bounds && this.map.fitBounds(this.bounds);

    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);

    this.map.on('moveend', this.handleTouristicEventsWithinBoundsBind);
  }

  removeTouristicEvents() {
    if (this.touristicEventsLayer) {
      state.currentMapBounds = this.map.getBounds();
      this.map.removeLayer(this.touristicEventsMarkerClusterGroup);
      this.touristicEventsLayer = null;
      this.touristicEventsMarkerClusterGroup = null;
      this.map.off('moveend', this.handleTouristicEventsWithinBoundsBind);
    }
  }

  async addOutdoorSites(resetBounds = false) {
    state.outdoorSitesWithinBounds = state.currentOutdoorSites;

    const outdoorSitesCurrentCoordinates = [];

    const outdoorSitesFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentOutdoorSites) {
      for (const currentOutdoorSite of state.currentOutdoorSites) {
        outdoorSitesFeatureCollection.features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: pointOnFeature(currentOutdoorSite.geometry as any).geometry.coordinates },
          properties: {
            id: currentOutdoorSite.id,
            name: currentOutdoorSite.name,
            practice: state.outdoorPractices.find(practice => practice.id === currentOutdoorSite.practice)?.pictogram,
            imgSrc:
              currentOutdoorSite.attachments && currentOutdoorSite.attachments.filter(attachment => attachment.type === 'image').length > 0
                ? currentOutdoorSite.attachments[0].thumbnail !== ''
                  ? currentOutdoorSite.attachments[0].thumbnail
                  : currentOutdoorSite.attachments[0].url
                : null,
          },
        });
      }
    }

    if (!this.outdoorSitesLayer) {
      if ((outdoorSitesCurrentCoordinates.length > 0 && !state.currentMapBounds) || resetBounds) {
        const outdoorSitesBbox = bbox(outdoorSitesFeatureCollection);
        this.bounds = L.latLngBounds([outdoorSitesBbox[1], outdoorSitesBbox[0]], [outdoorSitesBbox[3], outdoorSitesBbox[2]]);
      } else {
        if (state.currentMapBounds) {
          this.bounds = state.currentMapBounds;
        }
      }
      const outdoorSitesIcons = await this.getIcons(outdoorSitesFeatureCollection, 'practice');
      this.outdoorSitesLayer = L.geoJSON(outdoorSitesFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: outdoorSitesIcons[geoJsonPoint.properties.practice]
                ? `<div part="outdoor-site-marker" class="outdoor-site-marker"><div part="outdoor-site-marker-container" class="outdoor-site-marker-container"><img part="outdoor-site-marker-icon" src=${
                    outdoorSitesIcons[geoJsonPoint.properties.practice]
                  } /></div></div>`
                : `<div part="outdoor-site-marker" class="outdoor-site-marker"><div part="outdoor-site-marker-container" class="outdoor-site-marker-container"></div></div>`,
              className: '',
              iconSize: this.mainMarkerSize,
              iconAnchor: [this.mainMarkerSize / 2, this.mainMarkerSize],
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('click', () => {
            const outdoorSiteCoordinatesPopup = L.DomUtil.create('div');
            /* @ts-ignore */
            outdoorSiteCoordinatesPopup.part = 'outdoor-site-coordinates-popup';
            outdoorSiteCoordinatesPopup.className = 'outdoor-site-coordinates-popup';
            if (geoJsonPoint.properties.imgSrc) {
              const outdoorSiteImg = L.DomUtil.create('img');
              /* @ts-ignore */
              outdoorSiteImg.part = 'outdoor-site-coordinates-image';
              outdoorSiteImg.src = geoJsonPoint.properties.imgSrc;
              outdoorSiteCoordinatesPopup.appendChild(outdoorSiteImg);
            }
            const outdoorSiteName = L.DomUtil.create('div');
            outdoorSiteName.innerHTML = geoJsonPoint.properties.name;
            /* @ts-ignore */
            outdoorSiteName.part = 'outdoor-site-name';
            outdoorSiteName.className = 'outdoor-site-name';
            outdoorSiteCoordinatesPopup.appendChild(outdoorSiteName);

            const outdoorSiteButton = L.DomUtil.create('button');
            outdoorSiteButton.innerHTML = 'Afficher le détail';
            /* @ts-ignore */
            outdoorSiteButton.part = 'outdoor-site-button';
            outdoorSiteButton.className = 'outdoor-site-button';
            outdoorSiteButton.onclick = () => this.outdoorSiteCardPress.emit(geoJsonPoint.properties.id);
            outdoorSiteCoordinatesPopup.appendChild(outdoorSiteButton);

            layer.bindPopup(outdoorSiteCoordinatesPopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
          });
          layer.on('mouseover', e => {
            this.addSelectedOutdoorSite(geoJsonPoint.properties.id, e.latlng);
          });
        },
      });

      this.outdoorSitesMarkerClusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        removeOutsideVisibleBounds: false,
        iconCreateFunction: cluster => {
          return L.divIcon({
            html: '<div part="outdoor-site-marker-cluster-group-icon" class="outdoor-site-marker-cluster-group-icon"><div>' + cluster.getChildCount() + '</div></div>',
            className: '',
            iconSize: this.mainClusterSize,
          } as any);
        },
      });

      this.outdoorSitesMarkerClusterGroup.addLayer(this.outdoorSitesLayer);
      this.map.addLayer(this.outdoorSitesMarkerClusterGroup);
    } else {
      if (outdoorSitesCurrentCoordinates.length > 0) {
        this.bounds = L.latLngBounds(outdoorSitesCurrentCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      } else {
        this.map.fire('moveend');
      }
      this.outdoorSitesLayer.clearLayers();
      this.outdoorSitesLayer.addData(outdoorSitesFeatureCollection);
      this.outdoorSitesMarkerClusterGroup.clearLayers();
      this.outdoorSitesMarkerClusterGroup.addLayer(this.outdoorSitesLayer);
    }

    this.map.invalidateSize();
    this.bounds && this.map.fitBounds(this.bounds);

    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);

    this.map.on('moveend', this.handleOutdoorSitesWithinBoundsBind);
  }

  removeOutdoorSites() {
    if (this.outdoorSitesLayer) {
      state.currentMapBounds = this.map.getBounds();
      this.map.removeLayer(this.outdoorSitesMarkerClusterGroup);
      this.outdoorSitesLayer = null;
      this.outdoorSitesMarkerClusterGroup = null;
      this.map.off('moveend', this.handleOutdoorSitesWithinBoundsBind);
    }
  }

  async addOutdoorSite() {
    const OutdoorSiteFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentOutdoorSite) {
      const outdoorSitePractice = state.outdoorPractices.find(outdoorPractice => outdoorPractice.id === state.currentOutdoorSite.practice);
      OutdoorSiteFeatureCollection.features.push({
        type: 'Feature',
        geometry: state.currentOutdoorSite.geometry,
        properties: {
          id: state.currentOutdoorSite.id,
          name: state.currentOutdoorSite.name,
          practice: outdoorSitePractice ? outdoorSitePractice.pictogram : null,
        },
      });
    }

    if (!this.currentOutdoorSiteLayer) {
      const outdoorSitesIcons = await this.getIcons(OutdoorSiteFeatureCollection, 'practice');

      this.currentOutdoorSiteLayer = L.geoJSON(OutdoorSiteFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) => {
          return L.marker(latlng, {
            icon: L.divIcon({
              html: outdoorSitesIcons[geoJsonPoint.properties.practice]
                ? `<div part="outdoor-site-marker" class="outdoor-site-marker"><div part="outdoor-site-marker-container" class="outdoor-site-marker-container"><img part="outdoor-site-marker-icon" src=${
                    outdoorSitesIcons[geoJsonPoint.properties.practice]
                  } /></div></div>`
                : `<div part="outdoor-site-marker" class="outdoor-site-marker"><div part="outdoor-site-marker-container" class="outdoor-site-marker-container"></div></div>`,
              className: '',
              iconSize: this.commonMarkerSize,
            } as any),
            autoPanOnFocus: false,
          } as any);
        },
        style: () => ({ color: this.colorOutdoorArea, interactive: false }),
      });

      this.map.addLayer(this.currentOutdoorSiteLayer);
    }

    await this.addCurrentInformationDesks(state.currentOutdoorSite);

    await this.addCurrentPois();

    await this.addCurrentTouristicContents();

    await this.addCurrentTouristicEvents();

    await this.addCurrentRelatedOutdoorSites();

    await this.addCurrentRelatedOutdoorCourses();

    this.handleLayersControl();

    this.map.invalidateSize();
    this.map.fitBounds(this.currentOutdoorSiteLayer.getBounds(), { maxZoom: this.maxZoom });
    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);
  }

  async addCurrentRelatedOutdoorSites() {
    const currentRelatedOutdoorSiteFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentRelatedOutdoorSites) {
      for (const currentRelatedOutdoorSite of state.currentRelatedOutdoorSites) {
        currentRelatedOutdoorSiteFeatureCollection.features.push({
          type: 'Feature',
          geometry: currentRelatedOutdoorSite.geometry,
          properties: {
            id: currentRelatedOutdoorSite.id,
            name: currentRelatedOutdoorSite.name,
            practice: state.outdoorPractices.find(practice => practice.id === currentRelatedOutdoorSite.practice)?.pictogram,
            imgSrc:
              currentRelatedOutdoorSite.attachments && currentRelatedOutdoorSite.attachments.filter(attachment => attachment.type === 'image').length > 0
                ? currentRelatedOutdoorSite.attachments[0].thumbnail !== ''
                  ? currentRelatedOutdoorSite.attachments[0].thumbnail
                  : currentRelatedOutdoorSite.attachments[0].url
                : null,
          },
        });
      }
    }

    if (!this.currentRelatedOutdoorSitesLayer && currentRelatedOutdoorSiteFeatureCollection.features.length > 0) {
      const outdoorSitesIcons = await this.getIcons(currentRelatedOutdoorSiteFeatureCollection, 'practice');

      this.currentRelatedOutdoorSitesLayer = L.geoJSON(currentRelatedOutdoorSiteFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) => {
          return L.marker(latlng, {
            icon: L.divIcon({
              html: outdoorSitesIcons[geoJsonPoint.properties.practice]
                ? `<div part="outdoor-site-marker" class="outdoor-site-marker"><div part="outdoor-site-marker-container" class="outdoor-site-marker-container"><img part="outdoor-site-marker-icon" src=${
                    outdoorSitesIcons[geoJsonPoint.properties.practice]
                  } /></div></div>`
                : `<div part="outdoor-site-marker" class="outdoor-site-marker"><div part="outdoor-site-marker-container" class="outdoor-site-marker-container"></div></div>`,
              className: '',
              iconSize: this.commonMarkerSize,
            } as any),
            autoPanOnFocus: false,
          } as any);
        },
        style: () => ({ color: this.colorOutdoorArea, interactive: false }),
      });
    }
  }

  async addCurrentRelatedOutdoorCourses() {
    const currentRelatedOutdoorCourseFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentRelatedOutdoorCourses) {
      for (const currentRelatedOutdoorCourse of state.currentRelatedOutdoorCourses) {
        currentRelatedOutdoorCourseFeatureCollection.features.push({
          type: 'Feature',
          geometry: currentRelatedOutdoorCourse.geometry,
          properties: {
            id: currentRelatedOutdoorCourse.id,
            name: currentRelatedOutdoorCourse.name,
            type: state.outdoorCourseTypes.find(type => type.id === currentRelatedOutdoorCourse.type)?.pictogram,
            imgSrc:
              currentRelatedOutdoorCourse.attachments && currentRelatedOutdoorCourse.attachments.filter(attachment => attachment.type === 'image').length > 0
                ? currentRelatedOutdoorCourse.attachments[0].thumbnail !== ''
                  ? currentRelatedOutdoorCourse.attachments[0].thumbnail
                  : currentRelatedOutdoorCourse.attachments[0].url
                : null,
          },
        });
      }
    }

    if (!this.currentRelatedOutdoorCoursesLayer && currentRelatedOutdoorCourseFeatureCollection.features.length > 0) {
      const outdoorCoursesIcons = await this.getIcons(currentRelatedOutdoorCourseFeatureCollection, 'type');

      this.currentRelatedOutdoorCoursesLayer = L.geoJSON(currentRelatedOutdoorCourseFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) => {
          return L.marker(latlng, {
            icon: L.divIcon({
              html: outdoorCoursesIcons[geoJsonPoint.properties.practice]
                ? `<div part="outdoor-courses-marker" class="outdoor-courses-marker"><div part="outdoor-courses-marker-container" class="outdoor-courses-marker-container"><img part="outdoor-courses-marker-icon" src=${
                    outdoorCoursesIcons[geoJsonPoint.properties.practice]
                  } /></div></div>`
                : `<div part="outdoor-courses-marker" class="outdoor-courses-marker"><div part="outdoor-courses-marker-container" class="outdoor-courses-marker-container"></div></div>`,
              className: '',
              iconSize: this.commonMarkerSize,
            } as any),
            autoPanOnFocus: false,
          } as any);
        },
        style: () => ({ color: this.colorOutdoorArea, interactive: false }),
      });
    }
  }

  removeOutdoorSite() {
    this.handleLayersOnRemove();
  }

  async addSelectedTouristicEvent(id, customCoordinates?) {
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
          imgSrc:
            touristicEvent.attachments && touristicEvent.attachments.filter(attachment => attachment.type === 'image').length > 0
              ? touristicEvent.attachments[0].thumbnail !== ''
                ? touristicEvent.attachments[0].thumbnail
                : touristicEvent.attachments[0].url
              : null,
        },
      });
    }

    this.removeSelectedTouristicEvent();
    state.selectedTouristicEventId = id;

    const touristicEventsIcons = await this.getIcons(touristicEventFeatureCollection, 'category');
    this.selectedTouristicEventLayer = L.geoJSON(touristicEventFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          zIndexOffset: 4000000,
          icon: L.divIcon({
            html: touristicEventsIcons[geoJsonPoint.properties.category]
              ? `<div part="selected-touristic-event-marker" class="selected-touristic-event-marker"><div part="touristic-event-marker-container" class="touristic-event-marker-container"><img  part="touristic-event-marker-icon" src=${
                  touristicEventsIcons[geoJsonPoint.properties.category]
                } /></div></div>`
              : `<div part="selected-touristic-event-marker" class="selected-touristic-event-marker"><div part="touristic-event-marker-container" class="touristic-event-marker-container"></div></div>`,
            className: '',
            iconSize: this.selectedMainMarkerSize,
            iconAnchor: [this.selectedMainMarkerSize / 2, this.selectedMainMarkerSize],
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', () => {
          const touristicEventDeparturePopup = L.DomUtil.create('div');
          /* @ts-ignore */
          touristicEventDeparturePopup.part = 'touristic-event-coordinates-popup';
          touristicEventDeparturePopup.className = 'touristic-event-coordinates-popup';
          if (geoJsonPoint.properties.imgSrc) {
            const touristicEventImg = L.DomUtil.create('img');
            /* @ts-ignore */
            touristicEventImg.part = 'touristic-event-coordinates-image';
            touristicEventImg.src = geoJsonPoint.properties.imgSrc;
            touristicEventDeparturePopup.appendChild(touristicEventImg);
          }

          const touristicEventName = L.DomUtil.create('div');
          touristicEventName.innerHTML = geoJsonPoint.properties.name;
          /* @ts-ignore */
          touristicEventName.part = 'touristic-event-name';
          touristicEventName.className = 'touristic-event-name';
          touristicEventDeparturePopup.appendChild(touristicEventName);

          const touristicEventButton = L.DomUtil.create('button');
          touristicEventButton.innerHTML = 'Afficher le détail';
          /* @ts-ignore */
          touristicEventButton.part = 'touristic-event-button';
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

  async addOutdoorCourse() {
    const OutdoorCourseFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentOutdoorCourse) {
      const outdoorCourseType = state.outdoorCourseTypes.find(outdoorCourseType => outdoorCourseType.id === state.currentOutdoorCourse.type);
      OutdoorCourseFeatureCollection.features.push({
        type: 'Feature',
        geometry: state.currentOutdoorCourse.geometry,
        properties: {
          id: state.currentOutdoorCourse.id,
          name: state.currentOutdoorCourse.name,
          type: outdoorCourseType ? outdoorCourseType.pictogram : null,
        },
      });
    }

    if (!this.currentOutdoorCourseLayer) {
      const outdoorCoursesIcons = await this.getIcons(OutdoorCourseFeatureCollection, 'type');
      this.currentOutdoorCourseLayer = L.geoJSON(OutdoorCourseFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) => {
          return L.marker(latlng, {
            icon: L.divIcon({
              html: outdoorCoursesIcons[geoJsonPoint.properties.practice]
                ? `<div part="outdoor-course-marker" class="outdoor-course-marker"><div part="outdoor-course-marker-container" class="outdoor-course-marker-container"><img part="outdoor-course-marker-icon" src=${
                    outdoorCoursesIcons[geoJsonPoint.properties.practice]
                  } /></div></div>`
                : `<div part="outdoor-course-marker" class="outdoor-course-marker"><div part="outdoor-course-marker-container" class="outdoor-course-marker-container"></div></div>`,
              className: '',
              iconSize: this.commonMarkerSize,
            } as any),
            autoPanOnFocus: false,
          } as any);
        },
        style: () => ({ color: this.colorOutdoorArea, interactive: false }),
      });

      this.map.addLayer(this.currentOutdoorCourseLayer);
    }

    await this.addCurrentPois();

    await this.addCurrentTouristicContents();

    await this.addCurrentTouristicEvents();

    this.handleLayersControl();

    this.map.fitBounds(this.currentOutdoorCourseLayer.getBounds());
    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);
  }

  removeOutdoorCourse() {
    this.handleLayersOnRemove();
  }

  async addSelectedOutdoorSite(id, _customCoordinates?) {
    const outdoorSiteFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentOutdoorSites) {
      const outdoorSite = state.currentOutdoorSites.find(currentOutdoorSite => currentOutdoorSite.id === id);
      if (outdoorSite && outdoorSite.geometry) {
        outdoorSiteFeatureCollection.features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: pointOnFeature(outdoorSite.geometry as any).geometry.coordinates },
          properties: {
            id: outdoorSite.id,
            name: outdoorSite.name,
            practice: state.outdoorPractices.find(practice => practice.id === outdoorSite.practice)?.pictogram,
            imgSrc:
              outdoorSite.attachments && outdoorSite.attachments.filter(attachment => attachment.type === 'image').length > 0
                ? outdoorSite.attachments[0].thumbnail !== ''
                  ? outdoorSite.attachments[0].thumbnail
                  : outdoorSite.attachments[0].url
                : null,
          },
        });
      }
    }

    this.removeSelectedOutdoorSite();
    state.selectedOutdoorSiteId = id;

    const outdoorSitesIcons = await this.getIcons(outdoorSiteFeatureCollection, 'practice');
    this.selectedOutdoorSiteLayer = L.geoJSON(outdoorSiteFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          zIndexOffset: 4000000,
          icon: L.divIcon({
            html: outdoorSitesIcons[geoJsonPoint.properties.practice]
              ? `<div part="selected-outdoor-site-marker" class="selected-outdoor-site-marker"><div part="outdoor-site-marker-container" class="outdoor-site-marker-container"><img  part="outdoor-site-marker-icon" src=${
                  outdoorSitesIcons[geoJsonPoint.properties.practice]
                } /></div></div>`
              : `<div part="selected-outdoor-site-marker" class="selected-outdoor-site-marker"><div part="outdoor-site-marker-container" class="outdoor-site-marker-container"></div></div>`,
            className: '',
            iconSize: this.selectedMainMarkerSize,
            iconAnchor: [this.selectedMainMarkerSize / 2, this.selectedMainMarkerSize],
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', () => {
          const outdoorSiteDeparturePopup = L.DomUtil.create('div');
          /* @ts-ignore */
          outdoorSiteDeparturePopup.part = 'outdoor-site-coordinates-popup';
          outdoorSiteDeparturePopup.className = 'outdoor-site-coordinates-popup';
          if (geoJsonPoint.properties.imgSrc) {
            const outdoorSiteImg = L.DomUtil.create('img');
            /* @ts-ignore */
            outdoorSiteImg.part = 'outdoor-site-coordinates-image';
            outdoorSiteImg.src = geoJsonPoint.properties.imgSrc;
            outdoorSiteDeparturePopup.appendChild(outdoorSiteImg);
          }

          const outdoorSiteName = L.DomUtil.create('div');
          outdoorSiteName.innerHTML = geoJsonPoint.properties.name;
          /* @ts-ignore */
          outdoorSiteName.part = 'outdoor-site-name';
          outdoorSiteName.className = 'outdoor-site-name';
          outdoorSiteDeparturePopup.appendChild(outdoorSiteName);

          const outdoorSiteButton = L.DomUtil.create('button');
          outdoorSiteButton.innerHTML = 'Afficher le détail';
          /* @ts-ignore */
          outdoorSiteButton.part = 'outdoor-site-button';
          outdoorSiteButton.className = 'outdoor-site-button';
          outdoorSiteButton.onclick = () => this.outdoorSiteCardPress.emit(geoJsonPoint.properties.id);
          outdoorSiteDeparturePopup.appendChild(outdoorSiteButton);

          layer.bindPopup(outdoorSiteDeparturePopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
        });
        layer.on('mouseout', () => {
          if (!this.outdoorSitePopupIsOpen) {
            state.selectedOutdoorSiteId = null;
            this.removeSelectedOutdoorSite();
          }
        });
        layer.on('popupopen', () => {
          this.outdoorSitePopupIsOpen = Boolean(state.selectedOutdoorSiteId);
        });
        layer.on('popupclose', () => {
          if (state.selectedOutdoorSiteId) {
            this.outdoorSitePopupIsOpen = false;
            state.selectedOutdoorSiteId = null;
            this.removeSelectedOutdoorSite();
          }
        });
      },
      style: { color: this.colorOutdoorArea, interactive: false },
    }).addTo(this.map);
  }

  removeSelectedOutdoorSite() {
    state.selectedOutdoorSiteId = null;
    this.selectedOutdoorSiteLayer && this.map.removeLayer(this.selectedOutdoorSiteLayer);
    this.selectedOutdoorSiteLayer = null;
  }

  async addSelectedOutdoorCourse(id, _customCoordinates?) {
    const outdoorCourseFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    if (state.currentOutdoorCourse) {
      const outdoorCourse = state.currentOutdoorCourse;
      outdoorCourseFeatureCollection.features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: pointOnFeature(outdoorCourse.geometry as any).geometry.coordinates },
        properties: {
          id: outdoorCourse.id,
          name: outdoorCourse.name,
          type: state.outdoorCourseTypes.find(type => type.id === outdoorCourse.type)?.pictogram,
          imgSrc:
            outdoorCourse.attachments && outdoorCourse.attachments.filter(attachment => attachment.type === 'image').length > 0
              ? outdoorCourse.attachments[0].thumbnail !== ''
                ? outdoorCourse.attachments[0].thumbnail
                : outdoorCourse.attachments[0].url
              : null,
        },
      });
    }

    this.removeSelectedOutdoorCourse();
    state.selectedOutdoorCourseId = id;

    const outdoorCoursesIcons = await this.getIcons(outdoorCourseFeatureCollection, 'type');
    this.selectedOutdoorCourseLayer = L.geoJSON(outdoorCourseFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          zIndexOffset: 4000000,
          icon: L.divIcon({
            html: outdoorCoursesIcons[geoJsonPoint.properties.type]
              ? `<div part="selected-outdoor-course-marker" class="selected-outdoor-course-marker"><div part="outdoor-course-marker-container" class="outdoor-course-marker-container"><img  part="outdoor-course-marker-icon" src=${
                  outdoorCoursesIcons[geoJsonPoint.properties.type]
                } /></div></div>`
              : `<div part="selected-outdoor-course-marker" class="selected-outdoor-course-marker"><div part="outdoor-course-marker-container" class="outdoor-course-marker-container"></div></div>`,
            className: '',
            iconSize: this.selectedMainMarkerSize,
            iconAnchor: [this.selectedMainMarkerSize / 2, this.selectedMainMarkerSize],
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', () => {
          const outdoorCourseDeparturePopup = L.DomUtil.create('div');
          /* @ts-ignore */
          outdoorCourseDeparturePopup.part = 'outdoor-course-coordinates-popup';
          outdoorCourseDeparturePopup.className = 'outdoor-course-coordinates-popup';
          if (geoJsonPoint.properties.imgSrc) {
            const outdoorCourseImg = L.DomUtil.create('img');
            /* @ts-ignore */
            outdoorCourseImg.part = 'outdoor-course-coordinates-image';
            outdoorCourseImg.src = geoJsonPoint.properties.imgSrc;
            outdoorCourseDeparturePopup.appendChild(outdoorCourseImg);
          }

          const outdoorCourseName = L.DomUtil.create('div');
          outdoorCourseName.innerHTML = geoJsonPoint.properties.name;
          /* @ts-ignore */
          outdoorCourseName.part = 'outdoor-course-name';
          outdoorCourseName.className = 'outdoor-course-name';
          outdoorCourseDeparturePopup.appendChild(outdoorCourseName);

          const outdoorCourseButton = L.DomUtil.create('button');
          outdoorCourseButton.innerHTML = 'Afficher le détail';
          /* @ts-ignore */
          outdoorCourseButton.part = 'outdoor-course-button';
          outdoorCourseButton.className = 'outdoor-course-button';
          outdoorCourseButton.onclick = () => this.outdoorCourseCardPress.emit(geoJsonPoint.properties.id);
          outdoorCourseDeparturePopup.appendChild(outdoorCourseButton);

          layer.bindPopup(outdoorCourseDeparturePopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
        });
        layer.on('mouseout', () => {
          if (!this.outdoorCoursePopupIsOpen) {
            state.selectedOutdoorCourseId = null;
            this.removeSelectedOutdoorCourse();
          }
        });
        layer.on('popupopen', () => {
          this.outdoorCoursePopupIsOpen = Boolean(state.selectedOutdoorCourseId);
        });
        layer.on('popupclose', () => {
          if (state.selectedOutdoorCourseId) {
            this.outdoorCoursePopupIsOpen = false;
            state.selectedOutdoorCourseId = null;
            this.removeSelectedOutdoorCourse();
          }
        });
      },
    }).addTo(this.map);
  }

  removeSelectedOutdoorCourse() {
    state.selectedOutdoorCourseId = null;
    this.selectedOutdoorCourseLayer && this.map.removeLayer(this.selectedOutdoorCourseLayer);
    this.selectedOutdoorCourseLayer = null;
  }

  async addCurrentPois() {
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

      const poiIcons = await this.getIcons(currentPoisFeatureCollection, 'type_pictogram');

      this.currentPoisLayer = L.geoJSON(currentPoisFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: poiIcons[geoJsonPoint.properties.type_pictogram]
                ? `<div part="poi-marker" class="poi-marker"><img  src=${poiIcons[geoJsonPoint.properties.type_pictogram]} /></div>`
                : `<div part="poi-marker" class="poi-marker"><img /></div>`,
              className: '',
              iconSize: this.commonMarkerSize,
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('mouseover', () => {
            const poiTooltip = L.DomUtil.create('div');
            /* @ts-ignore */
            poiTooltip.part = 'poi-tooltip';
            poiTooltip.className = 'poi-tooltip';
            const poiName = L.DomUtil.create('div');
            poiName.innerHTML = geoJsonPoint.properties.name;
            /* @ts-ignore */
            poiName.part = 'poi-name';
            poiName.className = 'poi-name';
            poiTooltip.appendChild(poiName);
            layer.bindTooltip(poiTooltip).openTooltip();
          });
        },
      });
    }
  }

  async addCurrentSignages() {
    if (state.currentSignages && state.currentSignages.length > 0) {
      const signageImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/signage.svg`);
      const currentSignagesFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const currentSignage of state.currentSignages) {
        currentSignagesFeatureCollection.features.push({
          type: 'Feature',
          properties: { name: currentSignage.name },
          geometry: currentSignage.geometry,
        });
      }

      this.currentSignagesLayer = L.geoJSON(currentSignagesFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: `<div part="signage-marker" class="signage-marker"><img  src=${signageImageSrc} /><div part="signage-name" class="signage-name">${geoJsonPoint.properties.name}</div></div>`,
              className: '',
              iconSize: [this.commonMarkerSize * 1.2, this.commonMarkerSize * 0.8],
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.once('mouseover', () => {
            const signageTooltip = L.DomUtil.create('div');
            /* @ts-ignore */
            signageTooltip.part = 'signage-tooltip';
            signageTooltip.className = 'signage-tooltip';
            const signageName = L.DomUtil.create('div');
            signageName.innerHTML = geoJsonPoint.properties.name;
            /* @ts-ignore */
            signageName.part = 'signage-name';
            signageName.className = 'signage-name';
            signageTooltip.appendChild(signageName);
            layer.bindTooltip(signageTooltip).openTooltip();
          });
        },
      });
    }
  }

  async addCurrentTouristicContents() {
    if (state.trekTouristicContents && state.trekTouristicContents.length > 0) {
      const currentTouristicContentsFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const touristicContent of state.trekTouristicContents) {
        currentTouristicContentsFeatureCollection.features.push({
          type: 'Feature',
          properties: {
            id: touristicContent.id,
            name: touristicContent.name,
            category_pictogram: state.touristicContentCategories.find(touristicContentCategory => touristicContentCategory.id === touristicContent.category)?.pictogram,
          },
          geometry: touristicContent.geometry,
        });
      }

      const toutisticContentsIcons = await this.getIcons(currentTouristicContentsFeatureCollection, 'category_pictogram');

      this.currentToutisticContentsLayer = L.geoJSON(currentTouristicContentsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) => {
          return L.marker(latlng, {
            icon: L.divIcon({
              html: toutisticContentsIcons[geoJsonPoint.properties.category_pictogram]
                ? `<div part="touristic-content-marker" class="touristic-content-marker"><img src=${toutisticContentsIcons[geoJsonPoint.properties.category_pictogram]} /></div>`
                : `<div part="touristic-content-marker" class="touristic-content-marker"><img /></div>`,
              className: this.grwApp ? '' : 'cursor-pointer',
              iconSize: this.commonMarkerSize,
            } as any),
            autoPanOnFocus: false,
          } as any);
        },
        onEachFeature: (geoJsonPoint, layer) => {
          layer.on('click', () => {
            if (!this.grwApp) {
              this.touristicContentCardPress.emit(geoJsonPoint.properties.id);
            }
          });
          layer.on('mouseover', () => {
            const touristicContentTooltip = L.DomUtil.create('div');
            /* @ts-ignore */
            touristicContentTooltip.part = 'touristic-content-tooltip';
            touristicContentTooltip.className = 'touristic-content-tooltip';
            const touristicContentName = L.DomUtil.create('div');
            touristicContentName.innerHTML = geoJsonPoint.properties.name;
            /* @ts-ignore */
            touristicContentName.part = 'touristic-content-name';
            touristicContentName.className = 'touristic-content-name';
            touristicContentTooltip.appendChild(touristicContentName);
            layer.bindTooltip(touristicContentTooltip).openTooltip();
          });
        },
      });
    }
  }

  async addCurrentTouristicEvents() {
    if (state.trekTouristicEvents && state.trekTouristicEvents.length > 0) {
      const currentTouristicEventsFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const touristicEvent of state.trekTouristicEvents) {
        currentTouristicEventsFeatureCollection.features.push({
          type: 'Feature',
          properties: {
            id: touristicEvent.id,
            name: touristicEvent.name,
            type_pictogram: state.touristicEventTypes.find(touristicEventType => touristicEventType.id === touristicEvent.type)?.pictogram,
          },
          geometry: touristicEvent.geometry,
        });
      }

      const toutisticEventsIcons = await this.getIcons(currentTouristicEventsFeatureCollection, 'type_pictogram');
      this.currentTouristicEventsLayer = L.geoJSON(currentTouristicEventsFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: toutisticEventsIcons[geoJsonPoint.properties.type_pictogram]
                ? `
                <div part="touristic-event-marker" class="touristic-event-marker"><img src=${toutisticEventsIcons[geoJsonPoint.properties.type_pictogram]} /></div>`
                : `<div part="touristic-event-marker" class="touristic-event-marker"><img /></div>`,
              className: this.grwApp ? '' : 'cursor-pointer',
              iconSize: this.commonMarkerSize,
            } as any),
            autoPanOnFocus: false,
          } as any),
        onEachFeature: (geoJsonPoint, layer) => {
          layer.on('click', () => {
            if (!this.grwApp) {
              this.touristicEventCardPress.emit(geoJsonPoint.properties.id);
            }
          });
          layer.once('mouseover', () => {
            const touristicEventTooltip = L.DomUtil.create('div');
            /* @ts-ignore */
            touristicEventTooltip.part = 'touristic-event-tooltip';
            touristicEventTooltip.className = 'touristic-event-tooltip';
            const touristicEventName = L.DomUtil.create('div');
            /* @ts-ignore */
            touristicEventName.part = 'touristic-event-name';
            touristicEventName.innerHTML = geoJsonPoint.properties.name;
            touristicEventName.className = 'touristic-event-name';
            touristicEventTooltip.appendChild(touristicEventName);
            layer.bindTooltip(touristicEventTooltip).openTooltip();
          });
        },
      });
    }
  }

  async addCurrentInformationDesks(currentData) {
    if (state.currentInformationDesks && state.currentInformationDesks.length > 0) {
      const currentInformationDesksFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const currentInformationDesk of state.currentInformationDesks.filter(currentInformationDesks => currentData.information_desks.includes(currentInformationDesks.id))) {
        if (currentInformationDesk.latitude && currentInformationDesk.longitude) {
          currentInformationDesksFeatureCollection.features.push({
            type: 'Feature',
            properties: { name: currentInformationDesk.name, type_pictogram: currentInformationDesk.type.pictogram },
            geometry: { type: 'Point', coordinates: [Number(currentInformationDesk.longitude), Number(currentInformationDesk.latitude)] },
          });
        }
      }

      if (currentInformationDesksFeatureCollection.features.length > 0) {
        const informationDesksIcons = await this.getIcons(currentInformationDesksFeatureCollection, 'type_pictogram');
        this.currentInformationDesksLayer = L.geoJSON(currentInformationDesksFeatureCollection, {
          pointToLayer: (geoJsonPoint, latlng) =>
            L.marker(latlng, {
              icon: L.divIcon({
                html: informationDesksIcons[geoJsonPoint.properties.type_pictogram]
                  ? `<div part="information-desks-marker" class="information-desks-marker"><img src=${informationDesksIcons[geoJsonPoint.properties.type_pictogram]} /></div>`
                  : `<div part="information-desks-marker" class="information-desks-marker"><img /></div>`,
                className: '',
                iconSize: this.commonMarkerSize,
              } as any),
              autoPanOnFocus: false,
            } as any),
          onEachFeature: (geoJsonPoint, layer) => {
            layer.once('mouseover', () => {
              const informationDesksTooltip = L.DomUtil.create('div');
              /* @ts-ignore */
              informationDesksTooltip.part = 'information-desks-tooltip';
              informationDesksTooltip.className = 'information-desks-tooltip';
              const informationDesksName = L.DomUtil.create('div');
              /* @ts-ignore */
              informationDesksName.part = 'information-desks-name';
              informationDesksName.innerHTML = geoJsonPoint.properties.name;
              informationDesksName.className = 'information-desks-name';
              informationDesksTooltip.appendChild(informationDesksName);
              layer.bindTooltip(informationDesksTooltip).openTooltip();
            });
          },
        });
      }
    }
  }

  handleLayersControl() {
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
    if (this.currentSignagesLayer) {
      overlays[translate[state.language].layers.signages] = this.currentSignagesLayer;
      this.currentSignagesLayer.addTo(this.map);
    }
    if (this.currentToutisticContentsLayer) {
      overlays[translate[state.language].layers.touristicContents] = this.currentToutisticContentsLayer;
    }
    if (this.currentTouristicEventsLayer) {
      overlays[translate[state.language].layers.touristicEvents] = this.currentTouristicEventsLayer;
    }

    if (this.currentRelatedOutdoorSitesLayer) {
      overlays[translate[state.language].layers.sites] = this.currentRelatedOutdoorSitesLayer;
    }

    if (this.currentRelatedOutdoorCoursesLayer) {
      overlays[translate[state.language].layers.courses] = this.currentRelatedOutdoorCoursesLayer;
    }

    if (this.layersControl) {
      Object.keys(overlays).forEach(key => {
        this.layersControl.addOverlay(overlays[key], key);
      });
    } else if (Object.keys(overlays).length > 0) {
      this.layersControl = L.control.layers({}, overlays, { collapsed: true }).addTo(this.map);
    }

    this.handleLayersControlEvent();
  }

  handleLayersOnRemove() {
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

    if (this.departureArrivalLayer) {
      this.map.removeLayer(this.departureArrivalLayer);
      this.departureArrivalLayer = null;
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

    if (this.currentSignagesLayer) {
      this.map.removeLayer(this.currentSignagesLayer);
      this.currentSignagesLayer = null;
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
    if (this.currentTouristicEventsLayer) {
      this.map.removeLayer(this.currentTouristicEventsLayer);
      this.currentTouristicEventsLayer = null;
    }
    if (this.currentOutdoorSiteLayer) {
      this.map.removeLayer(this.currentOutdoorSiteLayer);
      this.currentOutdoorSiteLayer = null;
    }
    if (this.currentOutdoorCourseLayer) {
      this.map.removeLayer(this.currentOutdoorCourseLayer);
      this.currentOutdoorCourseLayer = null;
    }
    if (this.currentRelatedOutdoorSitesLayer) {
      this.map.removeLayer(this.currentRelatedOutdoorSitesLayer);
      this.currentRelatedOutdoorSitesLayer = null;
    }
    if (this.currentRelatedOutdoorCoursesLayer) {
      this.map.removeLayer(this.currentRelatedOutdoorCoursesLayer);
      this.currentRelatedOutdoorCoursesLayer = null;
    }
  }

  @Listen('resize', { target: 'window' })
  onWindowResize() {
    this.handleView();
  }

  handleView() {
    const elevationHeight = this.mapElement.getBoundingClientRect().width >= this.largeViewSize ? this.elevationHeight : this.mobileElevationHeight;
    if (this.elevationControl) {
      (this.elevationControl.options as any).height = elevationHeight;
      (this.elevationControl as any).redraw();
    }
    if (this.map) {
      this.map.invalidateSize();
    }
    forceUpdate(this.hostElement);
  }

  handleElevation() {
    (this.elevationControl as any).eleDiv.style.display = (this.elevationControl as any).eleDiv.style.display === 'block' ? 'none' : 'block';
    (this.elevationControl as any).redraw();
    forceUpdate(this.hostElement);
  }

  render() {
    const layersImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/layers.svg`);
    const contractImageSrc = getAssetPath(`${Build.isDev ? '/' : ''}assets/contract.svg`);

    return (
      <Host
        ref={el => (this.hostElement = el)}
        style={{
          '--font-family': this.fontFamily,
          '--color-primary-app': this.colorPrimaryApp,
          '--color-on-surface': this.colorOnSurface,
          '--color-primary-container': this.colorPrimaryContainer,
          '--color-on-primary-container': this.colorOnPrimaryContainer,
          '--color-background': this.colorBackground,
          '--color-markers': this.colorMarkers ? this.colorMarkers : this.colorPrimaryApp,
          '--color-clusters': this.colorClusters ? this.colorClusters : this.colorPrimaryApp,
          '--color-trek-line': this.colorTrekLine,
          '--layers-image-src': `url(${layersImageSrc})`,
          '--contract-image-src': `url(${contractImageSrc})`,
          '--elevation-height': (this.mapElement.getBoundingClientRect().width >= this.largeViewSize / 2 ? this.elevationHeight : this.mobileElevationHeight)
            .toString()
            .concat('px'),
        }}
      >
        <div
          id="map"
          part="map"
          class={
            (state.currentTouristicContent || state.currentTouristicEvent || state.currentOutdoorSite || state.currentOutdoorCourse) && this.grwApp
              ? 'common-map'
              : state.currentTrek && this.elevationControl && (this.elevationControl as any).eleDiv.style.display === 'block'
              ? 'trek-map-and-elevation'
              : state.currentTrek
              ? 'trek-map'
              : 'treks-map'
          }
          ref={el => (this.mapRef = el)}
        >
          {state.currentTrek && (
            <div class="grw-elevation-visibility-button-container">
              <grw-fab
                exportparts="fab-visibility-button,fab-visibility-button-icon,fab-visibility-button-label"
                font-family={this.fontFamily}
                action={() => this.handleElevation()}
                icon={() => (this.elevationControl && (this.elevationControl as any).eleDiv.style.display === 'block' ? 'show-elevation' : 'hide-elevation')}
                showTitle={translate[state.language].showElevation}
                hideTitle={translate[state.language].hideElevation}
                fab-background-color={this.fabBackgroundColor}
                fab-color={this.fabColor}
              ></grw-fab>
            </div>
          )}
        </div>

        {!this.mapIsReady && (
          <div part="map-loader-container" class="map-loader-container">
            <span part="loader" class="loader"></span>
          </div>
        )}
      </Host>
    );
  }
}
