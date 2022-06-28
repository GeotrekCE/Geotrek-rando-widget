import { createApp } from './App';

export default {
  title: 'Geotrek Rando Widget',
  argTypes: {
    urlLayer: {
      control: 'select',
      options: ['openstreetmap'],
      mapping: {
        openstreetmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    },
  },
};

const Template = ({ label, ...args }) => {
  return createApp({ label, ...args });
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
  appName: 'Geotrek Rando Widget',
  urlLayer: 'openstreetmap',
  attribution: '© OpenStreetMap',
  colorPrimary: '#6b0030',
  colorPrimaryTint: '#d2b2c0',
  trekLineColor: '#6b0030',
  departureIconColor: '#006b3b',
  arrivalIconColor: '#85003b',
};
App.storyName = 'App';
