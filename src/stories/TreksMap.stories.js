import { createTreksMap } from './TreksMap';

export default {
  title: 'Geotrek rando widget',
  argTypes: {
    urlLayer: {
      control: 'select',
      options: ['planignv2', 'openstreetmap'],
      mapping: {
        planignv2:
          'https://wxs.ign.fr/cartes/geoportail/wmts?&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
        openstreetmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
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
  urlLayer: 'planignv2',
  center: '46.50761080179829, 5.927117067721017',
  zoom: 8,
  attribution: '© IGN',
  colorPrimaryApp: '#6b0030',
  colorOnSurface: '#49454e',
  colorPrimaryContainer: '#eaddff',
  colorOnPrimaryContainer: '#21005e',
  colorBackground: '#fef7ff',
};
TreksMap.storyName = 'Treks map';
