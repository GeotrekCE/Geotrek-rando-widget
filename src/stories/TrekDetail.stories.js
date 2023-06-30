import { createTrekDetail } from './TrekDetail';

export default {
  title: 'Geotrek rando widget',
  argTypes: {},
};

const Template = ({ ...args }) => {
  return createTrekDetail({ ...args });
};

export const TrekDetail = Template.bind({});

TrekDetail.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  language: 'fr',
  trekId: 242872,
  colorPrimaryApp: '#6b0030',
  colorOnSurface: '#49454e',
  colorPrimaryContainer: '#eaddff',
  colorOnPrimaryContainer: '#21005e',
  colorSecondaryContainer: '#e8def8',
  colorOnSecondaryContainer: '#1d192b',
  colorBackground: '#fef7ff',
};
TrekDetail.storyName = 'Trek detail';
