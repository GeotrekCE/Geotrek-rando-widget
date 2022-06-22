import { createTreksMap } from './TreksMap';

export default {
  title: 'Geotrek Rando Widget',
  argTypes: {},
};

const Template = ({ label, ...args }) => {
  return createTreksMap({ label, ...args });
};

export const TreksMap = Template.bind({});

TreksMap.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
};
TreksMap.storyName = 'Treks map';
