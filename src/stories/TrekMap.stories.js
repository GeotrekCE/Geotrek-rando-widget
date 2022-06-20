import { createTrekMap } from './TrekMap';

export default {
  title: 'Geotrek Rando Widget',
  argTypes: {},
};

const Template = ({ label, ...args }) => {
  return createTrekMap({ label, ...args });
};

export const TrekMap = Template.bind({});

TrekMap.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  trekId: 242872,
  trekLineColor: '#6b0030',
  departureIconColor: '#006b3b',
  arrivalIconColor: '#85003b',
};
TrekMap.storyName = 'Trek map';
