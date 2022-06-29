import { createTrekCard } from './TrekCard';

export default {
  title: 'Geotrek Rando Widget',
  argTypes: {},
};

const Template = ({ label, ...args }) => {
  return createTrekCard({ label, ...args });
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
