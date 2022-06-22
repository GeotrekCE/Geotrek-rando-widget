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
  portals: '',
  appName: 'Geotrek Rando Widget',
  colorPrimary: '#6b0030',
  colorPrimaryTint: '#d2b2c0',
};
App.storyName = 'App';
