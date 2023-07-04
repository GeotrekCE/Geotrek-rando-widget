import { createApp } from './App';

export default {
  title: 'Geotrek rando widget',
  argTypes: {
    urlLayer: {
      control: 'select',
      options: ['planignv2', 'openstreetmap'],
      mapping: {
        planignv2:
          'https://wxs.ign.fr/cartes/geoportail/wmts?&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
        openstreetmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    },
  },
};

const Template = ({ ...args }) => {
  return createApp({ ...args });
};

export const App = Template.bind({});

App.args = {
  appWidth: '100%',
  appHeight: '100vh',
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
  urlLayer: 'planignv2',
  attribution: '© IGN',
  colorPrimaryApp: '#6b0030',
  colorOnPrimary: '#ffffff',
  colorSurface: '#1c1b1f',
  colorOnSurface: '#49454e',
  colorSurfaceVariant: '#fef7ff',
  colorOnSurfaceVariant: '#1c1b1f',
  colorPrimaryContainer: '#eaddff',
  colorOnPrimaryContainer: '#21005e',
  colorSecondaryContainer: '#e8def8',
  colorOnSecondaryContainer: '#1d192b',
  colorBackground: '#fef7ff',
  colorSurfaceContainerHigh: '#ece6f0',
  colorSurfaceContainerLow: '#f7f2fa',
  fabBackgroundColor: '#eaddff',
  fabColor: '#21005d',
  colorTrekLine: '#6b0030',
  colorDepartureIcon: '#006b3b',
  colorArrivalIcon: '#85003b',
  colorSensitiveArea: '#4974a5',
  colorPoiIcon: '#974c6e',
  linkName: 'GEOTREK',
  linkTarget: 'https://geotrek.fr',
};
App.storyName = 'App';
