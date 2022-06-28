import { Component, Host, h, Element, Prop, State } from '@stencil/core';
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
  @State() mapIsReady = false;
  @Prop() urlLayer: string;
  @Prop() attribution: string;
  @Prop() center: string = '1, 1';
  @Prop() zoom = 10;
  @Prop() colorTrekLine: string = '#6b0030';
  @Prop() colorDepartureIcon: string = '#006b3b';
  @Prop() colorArrivalIcon: string = '#85003b';
  @Prop() colorPrimary: string = '#6b0030';
  @Prop() colorPrimaryTint: string = '#d2b2c0';
  map: L.Map;
  currentBounds: L.LatLngBoundsExpression;
  treksLayer: L.GeoJSON<any>;
  trekLayer: L.GeoJSON<any>;
  departureArrivalLayer: L.GeoJSON<any>;

  componentDidLoad() {
    this.map = L.map(this.element, {
      center: this.center.split(',').map(Number) as L.LatLngExpression,
      zoom: this.zoom,
    });

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
        properties: { practice: state.practices.find(practice => practice.id === trek.practice)?.pictogram },
        geometry: { type: 'Point', coordinates: trek.departure_geom },
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
            html: geoJsonPoint.properties.practice ? `<img src=${geoJsonPoint.properties.practice} />` : '',
          } as any),
          autoPanOnFocus: false,
        } as any),
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
        } as any),
    }).addTo(this.map);

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
