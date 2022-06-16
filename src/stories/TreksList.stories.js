import { createTreksList } from './TreksList';

export default {
  title: 'Geotrek Rando Widget',
  argTypes: {},
};

const Template = ({ label, ...args }) => {
  return createTreksList({ label, ...args });
};

export const TreksList = Template.bind({});

TreksList.args = {
  api: "https://randoadmin.parc-haut-jura.fr/api/v2/",
};
TreksList.storyName = "Treks list";
