import { createTreksList } from './TreksList';

export default {
  title: 'Geotrek Rando Widget',
  argTypes: {},
};

const Template = ({ ...args }) => {
  return createTreksList({ ...args });
};

export const TreksList = Template.bind({});

TreksList.args = {
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
  colorPrimary: '#6b0030',
  colorPrimaryTint: '#974c6e',
};
TreksList.storyName = 'Treks list';
