import { createTreksList } from './TreksList';

export default {
  title: 'Geotrek rando widget',
  argTypes: {},
};

const Template = ({ ...args }) => {
  return createTreksList({ ...args });
};

export const TreksList = Template.bind({});

TreksList.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  languages: 'fr',
  inBbox: '',
  cities: '',
  districts: '',
  structures: '',
  themes: '',
  portals: '',
  routes: '',
  practices: '',
  colorPrimaryApp: '#6b0030',
  colorOnSurface: '#49454e',
  colorSecondaryContainer: '#e8def8',
  colorOnSecondaryContainer: '#1d192b',
  colorSurfaceContainerLow: '#f7f2fa',
};
TreksList.storyName = 'Treks list';
