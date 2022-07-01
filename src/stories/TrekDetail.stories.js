import { createTrekDetail } from './TrekDetail';

export default {
  title: 'Geotrek Rando Widget',
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
  colorPrimary: '#6b0030',
  colorPrimaryShade: '4a0021',
  colorPrimaryTint: '#974c6e',
};
TrekDetail.storyName = 'Trek detail';
