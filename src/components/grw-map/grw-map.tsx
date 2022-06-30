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
  @Prop() sensitiveAreasColor: string = '	#4974a5';
  map: L.Map;
  sensitiveAreasControl;
  currentBounds: L.LatLngBoundsExpression;
  treksLayer: L.GeoJSON<any>;
  trekLayer: L.GeoJSON<any>;
  departureArrivalLayer: L.GeoJSON<any>;
  sensitiveAreasLayer: L.GeoJSON<any>;

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
    const treksDepartureCoordinates = [];
    const treksFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    for (const trek of state.treks) {
      treksDepartureCoordinates.push(trek.departure_geom);
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

    if (treksDepartureCoordinates.length > 0) {
      const bounds = L.latLngBounds(treksDepartureCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
      this.currentBounds = bounds;
      this.map.fitBounds(this.currentBounds);
    }

    this.treksLayer = L.geoJSON(treksFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          icon: L.divIcon({
            className: 'trek-marker',
            iconSize: 48,
            html: geoJsonPoint.properties.practice && `<img src=${geoJsonPoint.properties.practice} />`,
          } as any),
          autoPanOnFocus: false,
        } as any),
      onEachFeature: (geoJsonPoint, layer) => {
        layer.once('click', () => {
          const trekDeparturePopup = L.DomUtil.create('div');
          trekDeparturePopup.className = 'trek-departure-popup ';
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
          layer.bindPopup(trekDeparturePopup, { interactive: true } as any).openPopup();
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
    const trekFeature: Feature = {
      type: 'Feature',
      geometry: state.currentTrek.geometry,
      properties: {},
    };

    this.trekLayer = L.geoJSON(trekFeature, {
      style: () => ({
        color: this.colorTrekLine,
      }),
      interactive: false,
    }).addTo(this.map);

    const bounds = L.latLngBounds(state.currentTrek.geometry.coordinates.map(coordinate => [coordinate[1], coordinate[0]]));
    this.currentBounds = bounds;
    this.map.fitBounds(this.currentBounds);

    const departureCoordinates = [state.currentTrek.geometry.coordinates.at(0)[0], state.currentTrek.geometry.coordinates.at(0)[1]];
    const arrivalCoordinates = [state.currentTrek.geometry.coordinates.at(-1)[0], state.currentTrek.geometry.coordinates.at(-1)[1]];
    const departureArrivalFeatureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { type: 'departure' },
          geometry: { type: 'Point', coordinates: departureCoordinates },
        },
      ],
    };

    if (departureCoordinates[0] !== arrivalCoordinates[0] || departureCoordinates[1] !== arrivalCoordinates[1]) {
      departureArrivalFeatureCollection.features.push({
        type: 'Feature',
        properties: { type: 'arrival' },
        geometry: { type: 'Point', coordinates: arrivalCoordinates },
      });
    }

    this.departureArrivalLayer = L.geoJSON(departureArrivalFeatureCollection, {
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

    if (state.sensitiveAreas && state.sensitiveAreas.length > 0) {
      const sensitiveAreasFeatureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };

      for (const sensitiveArea of state.sensitiveAreas) {
        sensitiveAreasFeatureCollection.features.push({
          type: 'Feature',
          properties: {},
          geometry: sensitiveArea.geometry,
        });
      }

      this.sensitiveAreasLayer = L.geoJSON(sensitiveAreasFeatureCollection, { style: () => ({ color: this.sensitiveAreasColor }) }).addTo(this.map);

      (L.Control as any).SensitiveAreasCheckboxContainer = L.Control.extend({
        onAdd: () => {
          const sensitiveAreasCheckboxContainer = L.DomUtil.create('div');
          sensitiveAreasCheckboxContainer.className = 'sensitiveAreasCheckboxContainer';
          const sensitiveAreasCheckbox = L.DomUtil.create('input');
          sensitiveAreasCheckbox.setAttribute('id', 'sensitiveAreasCheckbox');
          sensitiveAreasCheckbox.setAttribute('type', 'checkbox');
          sensitiveAreasCheckbox.setAttribute('checked', 'true');
          sensitiveAreasCheckbox.onclick = value =>
            (value.composedPath()[0] as any).checked ? this.map.addLayer(this.sensitiveAreasLayer) : this.map.removeLayer(this.sensitiveAreasLayer);
          const sensitiveAreasLabel = L.DomUtil.create('label');
          sensitiveAreasLabel.setAttribute('for', 'sensitiveAreasCheckbox');
          sensitiveAreasLabel.innerHTML =
            sensitiveAreasFeatureCollection.features.length > 1 || sensitiveAreasFeatureCollection.features[0].geometry.type === 'MultiPolygon'
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

    !this.mapIsReady && (this.mapIsReady = !this.mapIsReady);
  }

  removeTrek() {
    if (this.trekLayer) {
      this.map.removeLayer(this.trekLayer);
      this.trekLayer = null;
    }

    if (this.departureArrivalLayer) {
      this.map.removeLayer(this.departureArrivalLayer);
      this.departureArrivalLayer = null;
    }

    if (this.sensitiveAreasLayer) {
      this.map.removeLayer(this.sensitiveAreasLayer);
      this.sensitiveAreasLayer = null;
      this.map.removeControl(this.sensitiveAreasControl);
      this.sensitiveAreasControl = null;
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
