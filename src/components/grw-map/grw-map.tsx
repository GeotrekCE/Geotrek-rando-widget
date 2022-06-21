import { Component, Host, h, Element, Prop } from '@stencil/core';
import L from 'leaflet';
import state from 'store/store';
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

  componentDidLoad() {
    const map = L.map(this.element, {
      center: [1, 1],
      zoom: 10,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const trekFeature = {
      type: 'Feature',
      properties: {},
      geometry: state.currentTrek.geometry,
    };

    L.geoJSON(trekFeature, {
      style: () => ({
        color: this.colorTrekLine,
      }),
    }).addTo(map);

    const bounds = L.latLngBounds(state.currentTrek.geometry.coordinates.map(coordinate => [coordinate[1], coordinate[0]]));

    map.fitBounds(bounds);

    const departureCoordinates = [state.currentTrek.geometry.coordinates.at(0)[0], state.currentTrek.geometry.coordinates.at(0)[1]];
    const arrivalCoordinates = [state.currentTrek.geometry.coordinates.at(-1)[0], state.currentTrek.geometry.coordinates.at(-1)[1]];
    const departureArrivalFeatureCollection = {
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

    L.geoJSON(departureArrivalFeatureCollection, {
      pointToLayer: (geoJsonPoint, latlng) =>
        L.marker(latlng, {
          icon: L.divIcon({
            html: departureArrivalImage,
            iconSize: 48,
            className: geoJsonPoint.properties.type === 'departure' ? 'departure-icon' : 'arrival-icon',
            iconAnchor: [0, 48],
          }),
          autoPanOnFocus: false,
        }),
    }).addTo(map);
  }

  render() {
    return <Host style={{ '--color-departure-icon': this.colorDepartureIcon, '--color-arrival-icon': this.colorArrivalIcon }}></Host>;
  }
}
