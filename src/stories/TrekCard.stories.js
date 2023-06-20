import { createTrekCard } from './TrekCard';

export default {
  title: 'Geotrek rando widget',
  argTypes: {},
};

const Template = ({ ...args }) => {
  return createTrekCard({ ...args });
};

export const TrekCard = Template.bind({});

TrekCard.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  language: 'fr',
  trekId: 242872,
  colorPrimary: '#6b0030',
  colorPrimaryTint: '#974c6e',
};
TrekCard.storyName = 'Trek card';
