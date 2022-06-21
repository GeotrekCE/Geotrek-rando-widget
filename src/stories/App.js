export const createApp = ({ api, appName }) => {
  const app = document.createElement('grw-app');
  app.setAttribute('api', api);
  app.setAttribute('app-name', appName);
  return app;
};
