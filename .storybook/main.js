module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-controls', '@storybook/addon-docs'],
  framework: { name: '@storybook/html', options: {} },
  features: {
    postcss: false,
  },
};
