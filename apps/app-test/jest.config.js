const path = require("path")

module.exports = {
  name: 'test-app',
  displayName: {
    name: 'TEST-APP',
    color: 'yellow',
  },

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/"
  ],
  
  testEnvironment: 'node',

}
