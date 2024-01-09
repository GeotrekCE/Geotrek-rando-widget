import { createTrekMap } from './TrekMap';

export default {
  title: 'Geotrek rando widget',
  argTypes: {
    urlLayer: {
      control: 'select',
      options: ['planignv2andopenstreetmap', 'planignv2', 'openstreetmap'],
      mapping: {
        planignv2andopenstreetmap:
          'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x},https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        planignv2:
          'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
        openstreetmap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
    },
  },
};

const Template = ({ ...args }) => {
  return createTrekMap({ ...args });
};

export const TrekMap = Template.bind({});

TrekMap.args = {
  api: 'https://randoadmin.parc-haut-jura.fr/api/v2/',
  trekId: 242872,
  center: '46.50761080179829, 5.927117067721017',
  zoom: 8,
  nameLayer: 'IGN,OpenStreetMap',
  urlLayer: 'planignv2andopenstreetmap',
  attributionLayer: 'IGN, OpenStreetMap',
  colorPrimaryApp: '#6b0030',
  colorOnSurface: '#49454e',
  colorPrimaryContainer: '#eaddff',
  colorOnPrimaryContainer: '#21005e',
  colorBackground: '#fef7ff',
  colorTrekLine: '#6b0030',
  colorSensitiveArea: '#4974a5',
  colorPoiIcon: '#974c6e',
  useGradient: false,
};
TrekMap.storyName = 'Trek map';
