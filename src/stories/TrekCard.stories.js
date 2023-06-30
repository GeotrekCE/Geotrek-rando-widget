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
  colorPrimaryApp: '#6b0030',
  colorOnSurface: '#49454e',
  colorSecondaryContainer: '#e8def8',
  colorOnSecondaryContainer: '#1d192b',
  colorSurfaceContainerLow: '#f7f2fa',
};
TrekCard.storyName = 'Trek card';
