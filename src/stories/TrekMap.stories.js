import { createTrekMap } from './TrekMap';

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
  return createTrekMap({ label, ...args });
};

export const TrekMap = Template.bind({});

TrekMap.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  trekId: 242872,
  urlLayer: 'openstreetmap',
  center: '46.50761080179829, 5.927117067721017',
  zoom: 8,
  attribution: '© OpenStreetMap',
  trekLineColor: '#6b0030',
  departureIconColor: '#006b3b',
  arrivalIconColor: '#85003b',
};
TrekMap.storyName = 'Trek map';
