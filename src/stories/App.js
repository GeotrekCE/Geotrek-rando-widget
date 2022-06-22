export const createApp = ({ api, appName, portals }) => {
  const app = document.createElement('grw-app');
  app.setAttribute('api', api);
  app.setAttribute('app-name', appName);
  app.setAttribute('portals', portals);
  return app;
};
