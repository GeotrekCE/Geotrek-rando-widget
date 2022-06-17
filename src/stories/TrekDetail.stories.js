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
  api: "https://randoadmin.parc-haut-jura.fr/api/v2/",
  trekId: 242872
};
TrekDetail.storyName = "Trek detail";
