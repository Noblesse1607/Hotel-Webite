module.exports = {
    testEnvironment: "jest-environment-jsdom",
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleNameMapper: {
      "\\.(css|scss)$": "identity-obj-proxy", // Để mock file CSS
      "react-date-range/dist/styles.css": "identity-obj-proxy",
      "react-date-range/dist/theme/default.css": "identity-obj-proxy"
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
  };