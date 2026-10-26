module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.RELAX_WEB_BASE_URL ? { baseUrl: process.env.RELAX_WEB_BASE_URL } : {}),
  },
});
