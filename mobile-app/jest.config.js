module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native\\\\/polyfills)/)'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect']
};
