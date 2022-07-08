import { createApp } from './App';

export default {
  title: 'Geotrek Rando Widget',
  argTypes: {
    urlLayer: {
      control: 'select',
      options: ['openstreetmap', 'planignv2'],
      mapping: {
        openstreetmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        planignv2:
          'https://wxs.ign.fr/cartes/geoportail/wmts?&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
      },
    },
  },
};

const Template = ({ ...args }) => {
  return createApp({ ...args });
};

export const App = Template.bind({});

App.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  language: 'fr',
  inBbox: '',
  cities: '',
  districts: '',
  structures: '',
  themes: '',
  portals: '',
  routes: '',
  practices: '',
  urlLayer: 'openstreetmap',
  attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  colorPrimary: '#6b0030',
  colorPrimaryShade: '4a0021',
  colorPrimaryTint: '#974c6e',
  colorTrekLine: '#6b0030',
  colorDepartureIcon: '#006b3b',
  colorArrivalIcon: '#85003b',
  colorSensitiveArea: '#4974a5',
  colorPoiIcon: '#974c6e',
};
App.storyName = 'App';
