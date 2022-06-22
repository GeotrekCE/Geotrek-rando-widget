import { Component, Host, h, Element, Prop } from '@stencil/core';
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
  @Prop() colorTrekLine: string = '#6b0030';
  @Prop() colorDepartureIcon: string = '#006b3b';
  @Prop() colorArrivalIcon: string = '#85003b';
  map: L.Map;
  treksLayer: L.GeoJSON<any>;
  trekLayer: L.GeoJSON<any>;
  departureArrivalLayer: L.GeoJSON<any>;

  componentDidLoad() {
    this.map = L.map(this.element, {
      center: [1, 1],
      zoom: 10,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.addTreks();

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
        properties: {},
        geometry: { type: 'Point', coordinates: trek.departure_geom },
      });
    }

    const bounds = L.latLngBounds(treksDepartureCoordinates.map(coordinate => [coordinate[1], coordinate[0]]));
    this.map.fitBounds(bounds);

    this.treksLayer = L.geoJSON(treksFeatureCollection, {
      pointToLayer: (_geoJsonPoint, latlng) =>
        L.marker(latlng, {
          icon: L.divIcon({
            className: 'trek-marker',
            iconSize: 48,
            iconAnchor: [0, 48],
          } as any),
          autoPanOnFocus: false,
        } as any),
    }).addTo(this.map);
  }

  removeTreks() {
    this.map.removeLayer(this.treksLayer);
    this.treksLayer = null;
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
    this.map.fitBounds(bounds);

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
  }

  removeTrek() {
    this.map.removeLayer(this.trekLayer);
    this.map.removeLayer(this.departureArrivalLayer);
    this.trekLayer = null;
    this.departureArrivalLayer = null;
  }

  render() {
    return <Host style={{ '--color-departure-icon': this.colorDepartureIcon, '--color-arrival-icon': this.colorArrivalIcon }}></Host>;
  }
}
