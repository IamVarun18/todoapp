import path from 'path';

export default {
  webpack(config) {
    config.resolve.alias['@'] = path.resolve('./src');
    return config;
  },
};
