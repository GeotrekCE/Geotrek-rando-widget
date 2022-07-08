import { createTreksMap } from './TreksMap';

export default {
  title: 'Geotrek Rando Widget',
  argTypes: {
    urlLayer: {
      control: 'select',
      options: ['openstreetmap', 'planignv2],
      mapping: {
        openstreetmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        planignv2: 'https://wxs.ign.fr/cartes/geoportail/wmts?&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
      },
    },
  },
};

const Template = ({ ...args }) => {
  return createTreksMap({ ...args });
};

export const TreksMap = Template.bind({});

TreksMap.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  urlLayer: 'openstreetmap',
  center: '46.50761080179829, 5.927117067721017',
  zoom: 8,
  attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  colorPrimary: '#6b0030',
  colorPrimaryTint: '#974c6e',
};
TreksMap.storyName = 'Treks map';
