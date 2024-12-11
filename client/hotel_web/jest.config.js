module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    moduleNameMapper: {
      "\\.(css|scss)$": "identity-obj-proxy", // Để mock file CSS
    },
  };