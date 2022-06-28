import { createTrekDetail } from './TrekDetail';

export default {
  title: 'Geotrek Rando Widget',
  argTypes: {},
};

const Template = ({ label, ...args }) => {
  return createTrekDetail({ label, ...args });
};

export const TrekDetail = Template.bind({});

TrekDetail.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  language: 'fr',
  trekId: 242872,
  colorPrimary: '#6b0030',
  colorPrimaryTint: '#d2b2c0',
};
TrekDetail.storyName = 'Trek detail';
