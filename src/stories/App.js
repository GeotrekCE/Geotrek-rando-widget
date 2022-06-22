export const createApp = ({ api, portals, appName, colorPrimary, colorPrimaryTint }) => {
  const app = document.createElement('grw-app');
  app.setAttribute('api', api);
  app.setAttribute('portals', portals);
  app.setAttribute('app-name', appName);
  app.setAttribute('color-primary', colorPrimary);
  app.setAttribute('color-primary-tint', colorPrimaryTint);
  return app;
};
