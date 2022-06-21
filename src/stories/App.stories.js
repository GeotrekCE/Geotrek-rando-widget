import { createApp } from './App';

export default {
  title: 'Geotrek Rando Widget',
  argTypes: {},
};

const Template = ({ label, ...args }) => {
  return createApp({ label, ...args });
};

export const App = Template.bind({});

App.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  appName: 'Geotrek Rando Widget',
};
App.storyName = 'App';
