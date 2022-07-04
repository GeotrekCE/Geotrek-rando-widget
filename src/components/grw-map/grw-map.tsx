import { Component, Host, h, Element, Prop, State, Event, EventEmitter } from '@stencil/core';
import { Feature, FeatureCollection } from 'geojson';
import L from 'leaflet';
import state, { onChange } from 'store/store';
import departureArrivalImage from '../../assets/departure-arrival.svg';

@Component({
  tag: 'grw-map',
  styleUrl: 'grw-map.scss',
})
export class GrwMap {
  @Element() element: HTMLElement;
  @Event() trekCardPress: EventEmitter<number>;
  @State() mapIsReady = false;
  @Prop() urlLayer: string;
  @Prop() attribution: string;
  @Prop() center: string = '1, 1';
  @Prop() zoom = 10;
  @Prop() colorPrimary: string = '#6b0030';
  @Prop() colorPrimaryTint: string = '#974c6e';
  @Prop() colorTrekLine: string = '#6b0030';
  @Prop() colorDepartureIcon: string = '#006b3b';
  @Prop() colorArrivalIcon: string = '#85003b';
  @Prop() colorSensitiveArea: string = '	#4974a5';
  @Prop() colorPoiIcon: string = '#974c6e';
  map: L.Map;
  sensitiveAreasControl;
  currentBounds: L.LatLngBoundsExpression;
  treksLayer: L.GeoJSON<any>;
  currentTrekLayer: L.GeoJSON<any>;
  currentDepartureArrivalLayer: L.GeoJSON<any>;
  currentSensitiveAreasLayer: L.GeoJSON<any>;
  currentPoisLayer: L.GeoJSON<any>;
  currentParkingLayer: L.GeoJSON<any>;
  currentInformationDesksLayer: L.GeoJSON<any>;

  componentDidLoad() {
    this.map = L.map(this.element, {
      center: this.center.split(',').map(Number) as L.LatLngExpression,
      zoom: this.zoom,
    });

    L.control.scale().addTo(this.map);

    L.tileLayer(this.urlLayer, {
      maxZoom: 19,
      attribution: this.attribution,
    }).addTo(this.map);

    if (state.currentTrek) {
      this.addTrek();
    } else if (state.currentTrek) {
      this.addTreks();
    }

    onChange('treks', () => {
      if (state.currentTrek) {
        this.addTrek();
      } else if (state.treks) {
        this.addTreks();
      }
    });

    onChange('currentTrek', () => {
      if (state.currentTrek) {
        this.removeTreks();
        this.addTrek();
      } else {
        this.addTreks();
        this.removeTrek();
      }
    });
  }

  addTreks() {
    const trekscurrentDepartureCoordinates = [];
    const treksFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    for (const trek of state.treks) {
      trekscurrentDepartureCoordinates.push(trek.departure_geom);
      treksFeatureCollection.features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: trek.departure_geom },
        properties: {
          id: trek.id,
          name: trek.name,
          practice: state.practices.find(practice => practice.id === trek.practice)?.pictogram,
          imgSrc: trek.attachments && trek.attachments.length > 0 && trek.attachments[0].url,
        },
      });
    }

    if (trekscurrentDepartureCoordinates.length > 0) {
      const bounds = L.latLngBounds(trekscurrentDepartureCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      this.currentBounds = bounds;
      this.map.fitBounds(this.currentBounds);
    }

    this.treksLayer = L.geoJSON(treksFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          icon: L.divIcon({
            html: geoJsonPoint.properties.practice && `<img src=${geoJsonPoint.properties.practice} />`,
            className: 'trek-marker',
            iconSize: 48,
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', () => {
          const trekDeparturePopup = L.DomUtil.create('div');
          trekDeparturePopup.className = 'trek-departure-popup';
          trekDeparturePopup.onclick = () => this.trekCardPress.emit(geoJsonPoint.properties.id);
          const trekName = L.DomUtil.create('div');
          trekName.innerHTML = geoJsonPoint.properties.name;
          trekName.className = 'trek-name';
          if (geoJsonPoint.properties.imgSrc) {
            trekName.className += ' trek-name-margin-top';
            const trekImg = L.DomUtil.create('img');
            trekImg.src = geoJsonPoint.properties.imgSrc;
            trekDeparturePopup.appendChild(trekImg);
          }
          trekDeparturePopup.appendChild(trekName);
          layer.bindPopup(trekDeparturePopup, { interactive: true, autoPan: false, closeButton: false } as any).openPopup();
        });
      },
    }).addTo(this.map);

    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);
  }

  removeTreks() {
    if (this.treksLayer) {
      this.map.removeLayer(this.treksLayer);
      this.treksLayer = null;
    }
  }

  addTrek() {
    const currentTrekFeature: Feature = {
      type: 'Feature',
      geometry: state.currentTrek.geometry,
      properties: {},
    };

    this.currentTrekLayer = L.geoJSON(currentTrekFeature, {
      style: () => ({
        color: this.colorTrekLine,
      }),
      interactive: false,
    }).addTo(this.map);

    const bounds = L.latLngBounds(state.currentTrek.geometry.coordinates.map(coordinate => [coordinate[1], coordinate[0]]));
    this.currentBounds = bounds;
    this.map.fitBounds(this.currentBounds);

    const currentDepartureCoordinates = [state.currentTrek.geometry.coordinates.at(0)[0], state.currentTrek.geometry.coordinates.at(0)[1]];
    const currentArrivalCoordinates = [state.currentTrek.geometry.coordinates.at(-1)[0], state.currentTrek.geometry.coordinates.at(-1)[1]];
    const currentDepartureArrivalFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { type: 'departure' },
          geometry: { type: 'Point', coordinates: currentDepartureCoordinates },
        },
      ],
    };

    if (currentDepartureCoordinates[0] !== currentArrivalCoordinates[0] || currentDepartureCoordinates[1] !== currentArrivalCoordinates[1]) {
      currentDepartureArrivalFeatureCollection.features.push({
        type: 'Feature',
        properties: { type: 'arrival' },
        geometry: { type: 'Point', coordinates: currentArrivalCoordinates },
      });
    }

    this.currentDepartureArrivalLayer = L.geoJSON(currentDepartureArrivalFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          icon: L.divIcon({
            html: departureArrivalImage,
            className: geoJsonPoint.properties.type === 'departure' ? 'departure-icon' : 'arrival-icon',
            iconSize: 48,
            iconAnchor: [0, 48],
          } as any),
          autoPanOnFocus: false,
          interactive: false,
        } as any),
    }).addTo(this.map);

    if (state.currentTrek.parking_location) {
      const currentParking: Feature = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: state.currentTrek.parking_location },
      };
      this.currentParkingLayer = L.geoJSON(currentParking, {
        pointToLayer: (_geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: '<div>P</div>',
              className: 'parking-icon',
              iconSize: 48,
              iconAnchor: [0, 48],
            } as any),
            autoPanOnFocus: false,
            interactive: false,
          } as any),
      }).addTo(this.map);
    }

    if (state.currentSensitiveAreas && state.currentSensitiveAreas.length > 0) {
      const currentSensitiveAreasFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const sensitiveArea of state.currentSensitiveAreas) {
        currentSensitiveAreasFeatureCollection.features.push({
          type: 'Feature',
          properties: {},
          geometry: sensitiveArea.geometry,
        });
      }

      this.currentSensitiveAreasLayer = L.geoJSON(currentSensitiveAreasFeatureCollection, { style: () => ({ color: this.colorSensitiveArea }) }).addTo(this.map);

      (L.Control as any).SensitiveAreasCheckboxContainer = L.Control.extend({
        onAdd: () => {
          const sensitiveAreasCheckboxContainer = L.DomUtil.create('div');
          sensitiveAreasCheckboxContainer.className = 'sensitiveAreasCheckboxContainer';
          const sensitiveAreasCheckbox = L.DomUtil.create('input');
          sensitiveAreasCheckbox.setAttribute('id', 'sensitiveAreasCheckbox');
          sensitiveAreasCheckbox.setAttribute('type', 'checkbox');
          sensitiveAreasCheckbox.setAttribute('checked', 'true');
          sensitiveAreasCheckbox.onclick = value =>
            (value.composedPath()[0] as any).checked ? this.map.addLayer(this.currentSensitiveAreasLayer) : this.map.removeLayer(this.currentSensitiveAreasLayer);
          const sensitiveAreasLabel = L.DomUtil.create('label');
          sensitiveAreasLabel.setAttribute('for', 'sensitiveAreasCheckbox');
          sensitiveAreasLabel.innerHTML =
            currentSensitiveAreasFeatureCollection.features.length > 1 || currentSensitiveAreasFeatureCollection.features[0].geometry.type === 'MultiPolygon'
              ? 'Afficher les zones sensibles'
              : 'Afficher la zone sensible';
          sensitiveAreasCheckboxContainer.appendChild(sensitiveAreasCheckbox);
          sensitiveAreasCheckboxContainer.appendChild(sensitiveAreasLabel);

          return sensitiveAreasCheckboxContainer;
        },
      });

      (L.control as any).sensitiveAreasCheckboxContainer = () => {
        return new (L.Control as any).SensitiveAreasCheckboxContainer();
      };

      this.sensitiveAreasControl = (L.control as any).sensitiveAreasCheckboxContainer({ position: 'topright' }).addTo(this.map);
    }

    if (state.currentPois && state.currentPois.length > 0) {
      const currentPoisFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const currentPoi of state.currentPois) {
        currentPoisFeatureCollection.features.push({
          type: 'Feature',
          properties: { name: currentPoi.name, type_pictogram: currentPoi.type_pictogram },
          geometry: currentPoi.geometry,
        });
      }

      this.currentPoisLayer = L.geoJSON(currentPoisFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.type_pictogram && `<img src=${geoJsonPoint.properties.type_pictogram} />`,
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
      }).addTo(this.map);
    }

    if (state.currentInformationDesks && state.currentInformationDesks.length > 0) {
      const currentInformationDesksFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const currentInformationDesk of state.currentInformationDesks) {
        currentInformationDesksFeatureCollection.features.push({
          type: 'Feature',
          properties: { name: currentInformationDesk.name, type_pictogram: currentInformationDesk.type.pictogram },
          geometry: { type: 'Point', coordinates: [Number(currentInformationDesk.longitude), Number(currentInformationDesk.latitude)] },
        });
      }

      this.currentInformationDesksLayer = L.geoJSON(currentInformationDesksFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              html: geoJsonPoint.properties.type_pictogram && `<img src=${geoJsonPoint.properties.type_pictogram} />`,
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
      }).addTo(this.map);
    }

    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);
  }

  removeTrek() {
    if (this.currentTrekLayer) {
      this.map.removeLayer(this.currentTrekLayer);
      this.currentTrekLayer = null;
    }

    if (this.currentDepartureArrivalLayer) {
      this.map.removeLayer(this.currentDepartureArrivalLayer);
      this.currentDepartureArrivalLayer = null;
    }

    if (this.currentParkingLayer) {
      this.map.removeLayer(this.currentParkingLayer);
      this.currentParkingLayer = null;
    }

    if (this.currentSensitiveAreasLayer) {
      this.map.removeLayer(this.currentSensitiveAreasLayer);
      this.currentSensitiveAreasLayer = null;
      this.map.removeControl(this.sensitiveAreasControl);
      this.sensitiveAreasControl = null;
    }

    if (this.currentPoisLayer) {
      this.map.removeLayer(this.currentPoisLayer);
      this.currentPoisLayer = null;
    }

    if (this.currentInformationDesksLayer) {
      this.map.removeLayer(this.currentInformationDesksLayer);
      this.currentInformationDesksLayer = null;
    }
  }

  render() {
    return (
      <Host
        style={{
          '--color-primary': this.colorPrimary,
          '--color-primary-tint': this.colorPrimaryTint,
          '--color-departure-icon': this.colorDepartureIcon,
          '--color-arrival-icon': this.colorArrivalIcon,
          '--color-poi-icon': this.colorPoiIcon,
        }}
      >
        {!this.mapIsReady && (
          <div class="map-loader-container">
            <span class="loader"></span>
          </div>
        )}
      </Host>
    );
  }
}
