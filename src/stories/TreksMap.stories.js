import { createTreksMap } from './TreksMap';

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
  return createTreksMap({ label, ...args });
};

export const TreksMap = Template.bind({});

TreksMap.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  urlLayer: 'openstreetmap',
  center: '46.50761080179829, 5.927117067721017',
  zoom: 8,
  attribution: '© OpenStreetMap',
  colorPrimary: '#6b0030',
  colorPrimaryTint: '#d2b2c0',
};
TreksMap.storyName = 'Treks map';
