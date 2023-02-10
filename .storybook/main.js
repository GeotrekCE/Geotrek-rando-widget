module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-controls', '@storybook/addon-docs'],
  framework: '@storybook/html',
  features: {
    postcss: false,
  },
};
