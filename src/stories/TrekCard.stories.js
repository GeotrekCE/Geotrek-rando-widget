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
  trekId: 242872,
};
TrekCard.storyName = 'Trek card';
